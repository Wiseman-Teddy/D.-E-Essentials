import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS and Logging
app.use(cors());
app.use(morgan("dev"));

// Database Helpers
const DB_PATH = path.join(process.cwd(), "database.json");

function getDb() {
  if (!fs.existsSync(DB_PATH)) return { products: [], campaigns: [], blogPosts: [], orders: [] };
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Set up general API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ GEMINI_API_KEY is not defined or is placeholder. Using fallback matching engine.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// --- CMS CRUD Endpoints ---

// Products
app.get("/api/products", (req, res) => {
  const db = getDb();
  res.json(db.products || []);
});

app.post("/api/products", (req, res) => {
  const db = getDb();
  const newProduct = req.body;
  if (!newProduct.id) {
    newProduct.id = `prod_${Date.now()}`;
  }
  db.products = db.products || [];
  db.products.push(newProduct);
  saveDb(db);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = getDb();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...req.body };
    saveDb(db);
    res.json(db.products[index]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const db = getDb();
  const initialLength = db.products?.length || 0;
  db.products = (db.products || []).filter((p: any) => p.id !== req.params.id);
  if (db.products.length < initialLength) {
    saveDb(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Campaigns
app.get("/api/campaigns", (req, res) => {
  const db = getDb();
  res.json(db.campaigns || []);
});

app.post("/api/campaigns", (req, res) => {
  const db = getDb();
  const newCampaign = req.body;
  if (!newCampaign.id) {
    newCampaign.id = `camp_${Date.now()}`;
  }
  db.campaigns = db.campaigns || [];
  db.campaigns.push(newCampaign);
  saveDb(db);
  res.status(201).json(newCampaign);
});

app.put("/api/campaigns/:id", (req, res) => {
  const db = getDb();
  const index = db.campaigns.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index] = { ...db.campaigns[index], ...req.body };
    saveDb(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: "Campaign not found" });
  }
});

app.delete("/api/campaigns/:id", (req, res) => {
  const db = getDb();
  db.campaigns = (db.campaigns || []).filter((c: any) => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Orders
app.get("/api/orders", (req, res) => {
  const db = getDb();
  res.json(db.orders || []);
});

app.post("/api/orders", (req, res) => {
  const db = getDb();
  const newOrder = req.body;
  if (!newOrder.id) {
    newOrder.id = `ord_${Date.now()}`;
  }
  db.orders = db.orders || [];
  db.orders.push(newOrder);
  saveDb(db);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const db = getDb();
  const index = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (index !== -1) {
    db.orders[index] = { ...db.orders[index], ...req.body };
    saveDb(db);
    res.json(db.orders[index]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Leads and Newsletter Endpoints
app.get("/api/newsletter", (req, res) => {
  const db = getDb();
  res.json(db.newsletterSubs || []);
});

app.post("/api/newsletter", (req, res) => {
  const db = getDb();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  
  db.newsletterSubs = db.newsletterSubs || [];
  if (!db.newsletterSubs.includes(email)) {
    db.newsletterSubs.push(email);
    saveDb(db);
  }
  res.status(201).json({ message: "Subscribed successfully" });
});

app.get("/api/contact", (req, res) => {
  const db = getDb();
  res.json(db.contactLeads || []);
});

app.post("/api/contact", (req, res) => {
  const db = getDb();
  const newLead = req.body;
  if (!newLead.email || !newLead.name) return res.status(400).json({ error: "Name and Email are required" });
  
  newLead.id = `lead_${Date.now()}`;
  newLead.date = new Date().toISOString().split("T")[0];
  
  db.contactLeads = db.contactLeads || [];
  db.contactLeads.push(newLead);
  saveDb(db);
  res.status(201).json(newLead);
});

// --- End CMS Endpoints ---

// M-Pesa STK Push Simulation Endpoint
app.post("/api/mpesa/stkpush", (req, res) => {
  const { phone, amount, orderId } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ error: "Phone number and amount are required." });
  }
  
  const checkoutRequestId = `ws_CO_${Math.floor(Math.random() * 900000 + 100000)}`;
  
  console.log(`[M-Pesa STK Push] Sent simulated push to ${phone} for KES ${amount} (Order ID: ${orderId})`);
  
  res.json({
    MerchantRequestID: `REQ-${Math.floor(Math.random() * 90000 + 10000)}`,
    CheckoutRequestID: checkoutRequestId,
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: "Single-screen STK push prompt displayed on virtual handset.",
  });
});

// M-Pesa Callback Status (polling simulation)
app.post("/api/mpesa/status", (req, res) => {
  const { checkoutRequestId, simulateStatus } = req.body;
  
  const randomStatus = Math.random() > 0.1 ? "Completed" : "Failed";
  const status = simulateStatus || randomStatus;
  
  res.json({
    checkoutRequestId,
    status,
    transactionId: status === "Completed" ? `MPE${Math.random().toString(36).substring(2, 11).toUpperCase()}` : null,
    message: status === "Completed" ? "Payment successfully verified." : "Payment was cancelled or timed out by the customer.",
  });
});

// AI Fragrance Sommelier Endpoint
const geminiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests to the AI consultant, please try again later." }
});

app.post("/api/gemini/recommend", geminiLimiter, async (req, res) => {
  const { answers, chatMessage, chatHistory } = req.body;
  
  const client = getGeminiClient();
  
  if (!client) {
    console.log("[AI Sommelier] Using fallback heuristic engine due to missing Gemini API key.");
    let matchedId = "de-oud-mystique";
    let reason = "The regal complexity of Mystical Oud matches your desire for an evocative, timeless, and warm expression.";
    
    if (answers) {
      const family = (answers.fragranceFamily || "").toLowerCase();
      const gender = (answers.gender || "").toLowerCase();
      
      if (family.includes("fresh") || family.includes("citrus")) {
        matchedId = "de-celeste-fresh";
        reason = "Celestial Fresh perfectly aligns with your search for a light, invigorating ocean-breeze aroma.";
      } else if (family.includes("gourmand") || family.includes("sweet")) {
        matchedId = "de-rouge-seduction";
        reason = "Red Seduction offers an addictive, velvety sweetness featuring praline and dark berries.";
      } else if (family.includes("floral")) {
        matchedId = "de-rose-satin";
        reason = "Rose Satin captures your romantic mood with delicate rose petals, pink peonies, and smooth vanilla.";
      } else if (gender === "men") {
        matchedId = "de-elixir-dor";
        reason = "Golden Elixir brings forward vibrant Calabrian bergamot and vetiver for an outstanding daytime trail.";
      } else if (family.includes("woody")) {
        matchedId = "de-santal-imperial";
        reason = "Imperial Sandalwood, with its creamy Mysore sandalwood and dry cedarwood, fulfills your woody aromatic desires.";
      }
    }
    
    const db = getDb();
    const products = db.products || [];
    const matchedProd = products.find((p: any) => p.id === matchedId) || products[0];
    
    return res.json({
      recommendations: [
        {
          productId: matchedProd.id,
          matchPercentage: 96,
          reason
        }
      ],
      consultantNotes: `Greetings! As your D & E Essentials fragrance sommelier, I have selected the majestic ${matchedProd.name}. Its notes of ${matchedProd.notes.top.join(", ")} blend harmoniously on your skin to create a breathtaking and sophisticated sillage. (Note: Fallback mode active as Gemini key is pending setup).`
    });
  }

  try {
    const db = getDb();
    const products = db.products || [];
    let prompt = `You are a master French Perfume Sommelier and consultant for the luxury fragrance house 'D & E Essentials'.
Our elite fragrance catalog is:
${JSON.stringify(products, null, 2)}
Your goal is to recommend the perfect luxury fragrance(s) from our catalog.`;

    if (answers) {
      prompt += `
The customer has filled out our scent diagnostic questionnaire:
- Preferred Gender Profile: ${answers.gender}
- Fragrance Family Interest: ${answers.fragranceFamily}
- Target Occasion: ${answers.occasion}
- Aroma Vibe & Notes Preferences: ${answers.preferences || "Open"}
- Intended Scent Mood: ${answers.mood || "Luxurious"}
Recommend 1 or 2 products from our catalog that fit best, along with match percentages.`;
    } else if (chatMessage) {
      prompt += `
The customer is chatting with you in real-time. Respond to their message directly and recommend specific products from our catalog when relevant.
Current customer message: "${chatMessage}"`;
      if (chatHistory && chatHistory.length > 0) {
        prompt += `\nHere is the recent conversation history for context:\n${JSON.stringify(chatHistory)}`;
      }
    }

    prompt += `
Respond ONLY in valid, clean JSON format without markdown code blocks. Return a single raw JSON object that conforms to this schema:
{
  "recommendations": [
    {
      "productId": "string (the exact product 'id')",
      "matchPercentage": number (integer, e.g., 95),
      "reason": "Clear explanation of why this product fits their profile, mentioning specific notes"
    }
  ],
  "consultantNotes": "Your elegant, personal advice as a master sommelier written in a poetic, sensory, luxurious, and highly captivating tone. Max 4-5 sentences."
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text || "";
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```json")) cleanText = cleanText.substring(7);
    if (cleanText.endsWith("```")) cleanText = cleanText.substring(0, cleanText.length - 3);
    cleanText = cleanText.trim();

    const recommendationData = JSON.parse(cleanText);
    res.json(recommendationData);
    
  } catch (error: any) {
    console.error("[AI Sommelier Error]:", error);
    res.status(500).json({
      error: "Failed to generate fragrance recommendations.",
      details: error.message,
      recommendations: [
        {
          productId: "de-oud-mystique",
          matchPercentage: 95,
          reason: "Mystical Oud is our flagship royal oud and rose fragrance, universally elegant and mesmerizing."
        }
      ],
      consultantNotes: "Ah, my apologies, a slight flutter in the sensory winds! Nonetheless, I highly recommend our flagship Mystical Oud."
    });
  }
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Global Error]:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
