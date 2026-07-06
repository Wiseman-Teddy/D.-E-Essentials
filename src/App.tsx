import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Boutique from "./components/Boutique";
import AISommelier from "./components/AISommelier";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import Editorial from "./components/Editorial";
import AdminDashboard from "./components/AdminDashboard";
import { Product, CartItem, Order, MarketingCampaign } from "./types";
import { LUXURY_PRODUCTS, MARKETING_CAMPAIGNS } from "./data";
import { 
  Sparkles, Mail, MessageSquare, PhoneCall, ShieldCheck, 
  MapPin, Clock, ArrowRight, Heart, Star, CheckCircle2,
  Facebook, Instagram 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("boutique");

  // Global State Arrays
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<string[]>([]);
  const [whatsappCount, setWhatsappCount] = useState<number>(14); // Mock initial telemetry clicks
  const [contactLeads, setContactLeads] = useState<Array<{ name: string; email: string; message: string; date: string }>>([
    { name: "Sonia Gacheru", email: "sonia.g@luxury.ke", message: "Do you offer premium gift boxes for corporate events?", date: "2026-07-03" },
    { name: "David Kiprop", email: "david.kip@gmail.com", message: "Inquiry on bulk orders for wedding fragrances.", date: "2026-07-04" }
  ]);

  const refreshCMS = async () => {
    try {
      const [prodRes, campRes, ordRes, newsRes, contRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/campaigns"),
        fetch("/api/orders"),
        fetch("/api/newsletter"),
        fetch("/api/contact")
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (campRes.ok) setCampaigns(await campRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (newsRes.ok) setNewsletterSubs(await newsRes.json());
      if (contRes.ok) setContactLeads(await contRes.json());
    } catch (e) {
      console.error("Failed to fetch CMS data", e);
    }
  };

  useEffect(() => {
    refreshCMS();
  }, []);

  // Simulated Logged-In User Profile (Defaulted to Wiseman Aganya to represent immediate personalized data!)
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: "Wiseman Aganya",
    email: "aganyawiseman@gmail.com"
  });

  // Hero Carousel Index State
  const [heroIndex, setHeroIndex] = useState(0);

  // Dynamic Hero Slides from CMS
  const dynamicHeroSlides = products
    .filter(p => p.brand === 'ZARA' || p.name.includes('ZARA'))
    .slice(0, 12)
    .map(p => ({
      id: p.id,
      title: p.name.toUpperCase(),
      subtitle: p.brand || "ZARA",
      description: p.description.split("✨")[0] || p.description, // Keep description short for slider
      image: p.images[0],
      tag: p.featured ? "FLAGSHIP SCENT" : "FEATURED SCENT"
    }));

  const fallbackSlides = [
    {
      id: "fallback",
      title: "D & E ESSENTIALS",
      subtitle: "Luxury Boutique",
      description: "Loading our exclusive catalog...",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1600&auto=format&fit=crop",
      tag: "LOADING"
    }
  ];

  const activeSlides = dynamicHeroSlides.length > 0 ? dynamicHeroSlides : fallbackSlides;

  // Auto-rotate Hero Slide
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Form Submissions Local states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterSubbed, setIsNewsletterSubbed] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  // Cart Callbacks
  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id && item.selectedSize === size);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist Callback
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order Logistics Callbacks
  const addOrder = async (order: Order) => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      refreshCMS();
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const ord = orders.find(o => o.id === orderId);
      if (ord) {
        await fetch(`/api/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ord, status })
        });
        refreshCMS();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Products stock levels updater callback
  const updateProductStock = async (productId: string, stock: number) => {
    try {
      const p = products.find(p => p.id === productId);
      if (p) {
        await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...p, stock })
        });
        refreshCMS();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      if(window.confirm("Are you sure you want to delete this product?")) {
        await fetch(`/api/products/${productId}`, { method: "DELETE" });
        refreshCMS();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createProduct = async () => {
    try {
      const newProduct = {
        id: `prod_${Date.now()}`,
        name: "New Fragrance",
        brand: "D & E Essentials",
        description: "A new luxury fragrance.",
        price: 150,
        size: ["100ml"],
        gender: "Unisex",
        rating: 5.0,
        reviewsCount: 0,
        images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600"],
        sku: `DE-NEW-${Date.now()}`,
        barcode: "",
        stock: 10,
        fragranceFamily: "Floral",
        occasion: ["Daily Wear"],
        notes: { top: [], middle: [], base: [] },
        ingredients: [],
        reviews: []
      };
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      refreshCMS();
    } catch (e) {
      console.error(e);
    }
  };

  // Coupons adder callback
  const addCampaign = async (campaign: MarketingCampaign) => {
    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign)
      });
      refreshCMS();
    } catch (e) {
      console.error(e);
    }
  };

  // Newsletter subscription submit pipeline
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() })
      });
      refreshCMS();
      setNewsletterEmail("");
      setIsNewsletterSubbed(true);
      setTimeout(() => setIsNewsletterSubbed(false), 5000);
      
      // Mock Welcome Email Trigger
      console.log(`[Mock System] Welcome email sent to ${newsletterEmail.trim()} with 10% OFF code WELCOME10`);
    } catch (err) {
      console.error(err);
    }
  };

  // Contact CRM submission pipeline
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      refreshCMS();
      setContactForm({ name: "", email: "", message: "" });
      setIsContactSubmitted(true);
      setTimeout(() => setIsContactSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  // Increment WhatsApp Lead Clicks
  const handleWhatsappClick = () => {
    setWhatsappCount((prev) => prev + 1);
    // Deep link or mock trigger: Opens an elegant simulated WhatsApp chat or web target
    window.open(`https://wa.me/254712345678?text=Hello%20D%26E%20Essentials,%20I%20am%20inquiring%20about%20your%20luxury%20perfumes...`, "_blank");
  };

  return (
    <div className="min-h-screen bg-brand-cream/35 flex flex-col justify-between font-sans selection:bg-brand-gold/30 selection:text-brand-burgundy" id="app-viewport">
      
      {/* 1. Global Navigation Header */}
      <Header
        cart={cart}
        wishlist={wishlist}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleWishlist={toggleWishlist}
        user={user}
        onLogout={() => setUser(null)}
        onOpenLogin={() => setUser({ name: "Wiseman Aganya", email: "aganyawiseman@gmail.com" })}
      />

      {/* 2. Main Tab View Router */}
      <main className="flex-grow">
        
        {/* HOMEPAGE BANNER HERO - Shows only on Boutique home screen */}
        {activeTab === "boutique" && (
          <div className="relative w-full h-[450px] sm:h-[550px] overflow-hidden" id="luxury-hero-stage">
            {activeSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Background Cover image - Removed blur-2xl to fix mobile GPU glitch */}
                <div className="absolute inset-0 bg-[#1A0B10]">
                  <img referrerPolicy="no-referrer" src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" loading={idx === 0 ? "eager" : "lazy"} />
                </div>
                
                {/* Foreground Contained Image - Made visible on mobile (removed hidden sm:flex) */}
                <div className="absolute inset-0 flex justify-end items-center pr-4 sm:pr-24 lg:pr-32 z-0 pointer-events-none opacity-40 sm:opacity-100 mt-24 sm:mt-0">
                  <img referrerPolicy="no-referrer" src={slide.image} alt={slide.title} className="h-[50%] sm:h-[80%] max-w-[50%] sm:max-w-[45%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]" loading={idx === 0 ? "eager" : "lazy"} />
                </div>
                
                {/* Interactive slide descriptors overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/80 via-brand-burgundy/30 to-transparent z-10" />
                
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl space-y-6 text-white animate-slide-in">
                      <span className="inline-block bg-brand-gold/15 border border-brand-gold text-brand-gold text-[9px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full">
                        {slide.tag}
                      </span>
                      <div className="space-y-1">
                        <p className="font-serif italic text-xs tracking-wider text-brand-gold font-semibold">{slide.subtitle}</p>
                        <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide leading-tight">
                          {slide.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light font-sans">
                        {slide.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button
                          onClick={() => {
                            // Find target flagship in products list
                            const match = products.find(p => p.id === slide.id);
                            if (match) {
                              addToCart(match, "100ml", 1);
                              setActiveTab("checkout");
                            }
                          }}
                          className="px-6 py-3 bg-brand-gold hover:bg-brand-gold-hover text-brand-burgundy font-serif text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition"
                        >
                          Acquire Masterpiece
                        </button>
                        <button
                          onClick={() => setActiveTab("sommelier")}
                          className="px-6 py-3 border border-white hover:bg-white/10 text-white font-serif text-xs font-bold uppercase tracking-wider rounded-full transition flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles size={14} className="text-brand-gold animate-pulse" />
                          <span>Consult AI Sommelier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Dots indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`w-3.5 h-1.5 rounded-full transition-all ${
                    i === heroIndex ? "bg-brand-gold w-6" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE MODULE CONTAINER */}
        <div className="py-2.5">
          {activeTab === "boutique" && (
            <Boutique
              products={products}
              cart={cart}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
            />
          )}

          {activeTab === "sommelier" && (
            <AISommelier addToCart={addToCart} />
          )}

          {activeTab === "editorial" && (
            <Editorial />
          )}

          {activeTab === "checkout" && (
            <Checkout
              cart={cart}
              clearCart={clearCart}
              user={user}
              addOrder={addOrder}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <Profile
              user={user}
              orders={orders}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboard
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              products={products}
              updateProductStock={updateProductStock}
              deleteProduct={deleteProduct}
              createProduct={createProduct}
              campaigns={campaigns}
              addCampaign={addCampaign}
              newsletterSubs={newsletterSubs}
              contactLeads={contactLeads}
              whatsappCount={whatsappCount}
              refreshCMS={refreshCMS}
            />
          )}
        </div>

        {/* 3. HOME ENRICHMENT SECTIONS (NEWSLETTER & CONTACT CRM) - Visible on Home boutique tab */}
        {activeTab === "boutique" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16" id="home-crm-enrichment">
            
            {/* Split Grid: Newsletter + Contact Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Column: Premium Newsletter Capture (5 Columns) */}
              <div className="lg:col-span-5 bg-brand-burgundy text-brand-gold border border-brand-gold/30 p-8 rounded-3xl flex flex-col justify-between shadow-lg">
                <div className="space-y-6">
                  <div className="p-3 bg-brand-gold/10 border border-brand-gold/35 rounded-2xl w-fit text-brand-gold">
                    <Mail size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-gold block">The Fragrance Brotherhood</span>
                    <h3 className="font-serif text-2xl font-light tracking-wide mt-1">THE FRAGRANCE LEAGUE</h3>
                    <p className="text-xs text-brand-gold/70 mt-3 leading-relaxed font-light">
                      Subscribe to our private circle and unlock priority access to limited reserve perfume releases, exclusive 15% discount vouchers, and direct consultation invites.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3 pt-8">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your elite email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full text-xs py-3.5 pl-4 pr-10 bg-black/25 border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-white placeholder:text-brand-gold/45"
                    />
                    <button type="submit" className="absolute right-3.5 top-3.5 text-brand-gold hover:text-white transition">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  {isNewsletterSubbed && (
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/30">
                      <CheckCircle2 size={13} />
                      <span>Membership Registered! Welcome to D&E Essentials.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column: CRM Contact Form Card (7 Columns) */}
              <div className="lg:col-span-7 bg-white border border-brand-gold/15 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-gold-dark block">Direct Inquiry Studio</span>
                  <h3 className="font-serif text-xl font-bold text-brand-burgundy">PROMPT AN ENQUIRY</h3>
                  <p className="text-xs text-brand-burgundy/60 leading-relaxed font-light">
                    Seeking custom sensory formulations, corporate event fragrance trays, or bulk orders? Supply details below, and an studio assistant will follow up within 3 operating hours.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Wiseman Aganya"
                      className="w-full py-2.5 px-3 bg-brand-cream border border-brand-gold/25 rounded-xl focus:outline-none focus:border-brand-burgundy text-brand-burgundy"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. aganyawiseman@gmail.com"
                      className="w-full py-2.5 px-3 bg-brand-cream border border-brand-gold/25 rounded-xl focus:outline-none focus:border-brand-burgundy text-brand-burgundy"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Message Details</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Outline your bespoke order, product questions, or scheduling wishes..."
                      className="w-full py-2.5 px-3 bg-brand-cream border border-brand-gold/25 rounded-xl focus:outline-none focus:border-brand-burgundy text-brand-burgundy"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex justify-between items-center">
                    {isContactSubmitted ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                        Inquiry Received successfully!
                      </span>
                    ) : (
                      <div />
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-burgundy text-brand-gold rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-brand-burgundy-light transition shadow-sm"
                    >
                      Transmit Inquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Global Site Footer Frame */}
      <footer className="bg-[#121212] border-t border-brand-gold/15 text-white/80 py-12 text-xs font-sans mt-12" id="global-site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Intro column */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold tracking-wider text-brand-gold">D & E Essentials</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Designing sensory masterpieces linking classical Parisian perfume formulation with smart modern aesthetics. Absolute luxury in every drop.
            </p>
            <p className="flex items-start text-[11px] text-white/60 leading-relaxed font-light mt-2">
              <MapPin size={14} className="mr-2 mt-0.5 text-brand-gold shrink-0" />
              <span>Sawa Mall, Moi Ave<br/>Shop C6, 3rd Flr - CBD, Nairobi 🇰🇪</span>
            </p>
            <div className="flex space-x-3 text-white/60 mt-4">
              <a href="https://www.facebook.com/search/top/?q=Dee%20Sssentials" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer hover:text-brand-gold transition" title="Facebook: Dee Sssentials">
                <Facebook size={13} />
              </a>
              <a href="https://www.instagram.com/d.eessentials" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer hover:text-brand-gold transition" title="Instagram: @d.eessentials">
                <Instagram size={13} />
              </a>
              <span className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer hover:text-brand-gold transition" title="Contact Us">
                <MessageSquare size={13} />
              </span>
              <span className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer hover:text-brand-gold transition" title="Call Us">
                <PhoneCall size={13} />
              </span>
            </div>
          </div>

          {/* Boutique Navigation links */}
          <div className="space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-white/10 pb-1.5 w-fit">STUDIO DIRECT</h5>
            <ul className="space-y-2 text-[11px] font-medium text-white/60">
              <li onClick={() => setActiveTab("boutique")} className="hover:text-brand-gold cursor-pointer transition">Exclusive Boutique</li>
              <li onClick={() => setActiveTab("sommelier")} className="hover:text-brand-gold cursor-pointer transition">AI Scent Sommelier</li>
              <li onClick={() => setActiveTab("editorial")} className="hover:text-brand-gold cursor-pointer transition">Olfactory Magazine</li>
              <li onClick={() => setActiveTab("profile")} className="hover:text-brand-gold cursor-pointer transition">Patron Profile & Orders</li>
            </ul>
          </div>

          {/* Back Office controls */}
          <div className="space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-white/10 pb-1.5 w-fit">ADMINISTRATION</h5>
            <ul className="space-y-2 text-[11px] font-medium text-white/60">
              <li onClick={() => setActiveTab("admin")} className="hover:text-brand-gold cursor-pointer transition">Back-Office Studio Controller</li>
              <li onClick={() => setActiveTab("boutique")} className="hover:text-brand-gold cursor-pointer transition">Live Client Storefront</li>
            </ul>
          </div>

          {/* Secure & Logistics assurances */}
          <div className="space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-white/10 pb-1.5 w-fit">TRUST & COMPLIANCE</h5>
            <div className="space-y-2 text-[11px] text-white/50 leading-relaxed font-light">
              <p className="flex items-center text-emerald-500 font-bold"><ShieldCheck size={12} className="mr-1.5 text-emerald-500" /> Fully Encrypted SSL</p>
              <p className="flex items-center"><Clock size={12} className="mr-1.5 text-brand-gold" /> Safaricom STK Payment gateway</p>
              <p className="flex items-center"><MapPin size={12} className="mr-1.5 text-brand-gold" /> Premium Nairobi Courier logistics</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright margin */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row justify-between text-[10px] text-white/40 font-mono tracking-wider">
          <span>© 2026 D & E ESSENTIALS STUDIO. ALL RIGHTS RESERVED.</span>
          <span className="mt-2 sm:mt-0">MADE FOR WISÈMAN AGANYA | AGANYAWISEMAN@GMAIL.COM</span>
        </div>
      </footer>

      {/* 5. FLOATING WHATSAPP CHAT LEAD COUNTER STICKY */}
      <div className="fixed bottom-6 right-6 z-40" id="whatsapp-sticky-module">
        <button
          onClick={handleWhatsappClick}
          className="flex items-center space-x-2.5 bg-emerald-700 text-white hover:bg-emerald-800 transition-all p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 border border-emerald-500"
        >
          <MessageSquare size={18} className="animate-pulse" />
          <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-widest">Studio WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
