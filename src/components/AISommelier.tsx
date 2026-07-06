import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageCircle, RefreshCw, Send, CheckCircle2, User, HelpCircle, ArrowRight, ShieldCheck, ShoppingCart, ChevronRight } from "lucide-react";
import { Product, CartItem } from "../types";
import { LUXURY_PRODUCTS } from "../data";

interface AISommelierProps {
  addToCart: (product: Product, size: string, quantity?: number) => void;
}

interface Message {
  sender: "user" | "sommelier";
  text: string;
  recommendation?: {
    productId: string;
    matchPercentage: number;
    reason: string;
  };
}

export default function AISommelier({ addToCart }: AISommelierProps) {
  const [activeSubTab, setActiveSubTab] = useState<"quiz" | "chat">("quiz");

  // Quiz Wizard State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState({
    gender: "",
    fragranceFamily: "",
    occasion: "",
    preferences: "",
    mood: ""
  });
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  // Chat Interface State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "sommelier",
      text: "Bonjour, welcome to the D & E Essentials Fragrance Studio. I am Lady Isabella, your devoted perfume sommelier. What essence or memory are you seeking to capture on your skin today?"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Quiz Questions Options
  const genderOptions = [
    { value: "Men", label: "For Men", description: "Vibrant, woody, and intensely sophisticated notes designed for men." },
    { value: "Women", label: "For Women", description: "Elegant, floral, sweet, and powdery notes crafted for women." },
    { value: "Unisex", label: "Unisex / Neutral", description: "Universal scents embracing fluid, balanced aromatic profiles." }
  ];

  const familyOptions = [
    { value: "Oriental", label: "Oriental & Spice", description: "Smoky agarwood, rare saffron, and burning incense." },
    { value: "Gourmand", label: "Decadent Gourmand", description: "Sweet praline, caramelized vanilla, and dark roasted coffee." },
    { value: "Woody", label: "Noble Woody", description: "Creamy Mysore sandalwood, dry cedar, and rugged Tuscan leather." },
    { value: "Floral", label: "Velvet Floral", description: "Turkish rose petals, night orchid, and soft pink peonies." },
    { value: "Fresh", label: "Celestial Fresh", description: "Ocean air, mineral sea salt, and sparkling key lime." }
  ];

  const occasionOptions = [
    { value: "Date Night", label: "Date Night", description: "Warm, intimate, and highly seductive projections." },
    { value: "Evening", label: "Galas & Evening", description: "Powerful, unforgettable, and dramatic sillages." },
    { value: "Daily Wear", label: "Daily Signature", description: "Comforting, elegant, and versatile daytime trails." },
    { value: "Office", label: "Studio & Business", description: "Subtle, professional, and sophisticated clean notes." }
  ];

  const moodOptions = [
    { value: "Mysterious", label: "Mysterious & Sovereign", description: "You wish to command presence with deep, rare resins." },
    { value: "Seductive", label: "Alluring & Addictive", description: "You seek a sweet, delicious, and unforgettable magnetic sillage." },
    { value: "Confident", label: "Crisp & Distinguished", description: "You desire clean lines, premium spices, and fresh elegance." },
    { value: "Comforting", label: "Velvety & Peaceful", description: "You want a soothing, soft, powdery floral cashmere envelope." }
  ];

  // Submit Questionnaire to Backend
  const handleQuizSubmit = async () => {
    setIsQuizLoading(true);
    setQuizResult(null);

    try {
      const response = await fetch("/api/gemini/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers })
      });
      const data = await response.json();
      setQuizResult(data);
    } catch (err) {
      console.error("Failed to query AI recommendation:", err);
      // Fallback
      setQuizResult({
        recommendations: [{ productId: "de-oud-mystique", matchPercentage: 95, reason: "A majestic formulation representing absolute luxury." }],
        consultantNotes: "Ah! My apologies. The sensory winds have fluttered slightly on the server. However, I highly recommend our signature Mystical Oud. It is a brilliant blend of agarwood, saffron, and Damascus rose that promises an unforgettably luxurious aura."
      });
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Submit Message to Chat Backend
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessageText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessageText }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Map history
      const history = chatMessages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await fetch("/api/gemini/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatMessage: userMessageText,
          chatHistory: history.slice(-6) // Send recent turns for performance
        })
      });
      const data = await response.json();
      
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "sommelier",
          text: data.consultantNotes || "I have carefully considered your words.",
          recommendation: data.recommendations?.[0]
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "sommelier",
          text: "Ah, my dear! A brief whisper in the wind has interrupted our connection, yet my spirit remains dedicated to finding your essence. Tell me, do you prefer rich resins or the delicate crispness of sea air?"
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="ai-sommelier-root">
      
      {/* Header section with brand identity */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center space-x-2 text-brand-gold/60 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} className="text-brand-gold animate-pulse" />
          <span>The House of Scent Intelligence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-brand-burgundy leading-tight">
          THE AI <span className="font-serif italic font-extrabold text-brand-gold">SCENT SOMMELIER</span>
        </h1>
        <p className="font-sans text-xs text-brand-burgundy/70 mt-3 leading-relaxed">
          Embark on a customized sensory exploration. Allow our Parisian AI perfume specialist to dissect your tastes, moods, and desires to curate your flawless signature formulation.
        </p>

        {/* Tab Selection */}
        <div className="flex justify-center space-x-2 mt-8 border-b border-brand-gold/15 pb-4">
          <button
            onClick={() => setActiveSubTab("quiz")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeSubTab === "quiz"
                ? "bg-brand-burgundy text-brand-gold shadow-md"
                : "bg-white border border-brand-gold/15 text-brand-burgundy hover:bg-brand-gold/5"
            }`}
          >
            <HelpCircle size={14} />
            <span>Diagnostic Quiz</span>
          </button>
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeSubTab === "chat"
                ? "bg-brand-burgundy text-brand-gold shadow-md"
                : "bg-white border border-brand-gold/15 text-brand-burgundy hover:bg-brand-gold/5"
            }`}
          >
            <MessageCircle size={14} />
            <span>Studio Chat Room</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        
        {/* VIEW 1: SCENT QUIZ */}
        {activeSubTab === "quiz" && (
          <div className="bg-white border border-brand-gold/15 rounded-3xl shadow-sm p-6 sm:p-10" id="sommelier-quiz-container">
            {isQuizLoading ? (
              /* Loading Screen */
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-pulse">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-brand-gold/20 border-t-brand-burgundy animate-spin" />
                  <Sparkles size={20} className="absolute inset-0 m-auto text-brand-gold animate-bounce" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-burgundy">Distilling Pure Essences</h3>
                  <p className="text-xs text-brand-burgundy/60 mt-2 max-w-sm">We are analyzing your flavor palette and consulting lady Isabella’s journals using the server-side Gemini intelligence...</p>
                </div>
              </div>
            ) : quizResult ? (
              /* Quiz Result Display */
              <div className="space-y-8 animate-zoom-in">
                <div className="border-b border-brand-gold/15 pb-6 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-gold-dark">Scent Diagnostic Result</span>
                  <h2 className="font-serif text-2xl font-bold text-brand-burgundy mt-1">Your Fragrance Harmony</h2>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Recommended Product Card */}
                  {quizResult.recommendations?.map((rec: any, idx: number) => {
                    const matchedProd = LUXURY_PRODUCTS.find((p) => p.id === rec.productId) || LUXURY_PRODUCTS[0];
                    return (
                      <div
                        key={idx}
                        className="border border-brand-gold/35 rounded-2xl bg-brand-cream/35 overflow-hidden shadow-md flex flex-col justify-between h-full"
                      >
                        <div className="relative aspect-square overflow-hidden bg-white p-4">
                          <img referrerPolicy="no-referrer" src={matchedProd.images[0]} alt={matchedProd.name} className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute top-4 right-4 bg-brand-burgundy text-brand-gold border border-brand-gold/35 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-lg">
                            {rec.matchPercentage}% MATCH
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-gold-dark block">{matchedProd.brand}</span>
                            <h3 className="font-serif text-lg font-bold text-brand-burgundy mt-1">{matchedProd.name}</h3>
                            <p className="text-[11px] font-medium text-brand-burgundy/60 mt-0.5">{matchedProd.fragranceFamily} Family • {matchedProd.gender}</p>
                            <p className="text-xs text-brand-burgundy/75 leading-relaxed mt-3 italic bg-white p-3 rounded-lg border border-brand-gold/10">
                              &ldquo;{rec.reason}&rdquo;
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-gold/10">
                            <span className="text-base font-extrabold font-mono text-brand-burgundy">Ksh {matchedProd.discountPrice || matchedProd.price}</span>
                            <button
                              onClick={() => addToCart(matchedProd, "100ml", 1)}
                              className="flex items-center space-x-1.5 py-2 px-4 bg-brand-burgundy text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition shadow"
                            >
                              <ShoppingCart size={12} />
                              <span>Acquire</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Sommelier Notes */}
                  <div className="bg-brand-cream-dark/40 border border-brand-gold/25 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 text-brand-burgundy">
                      <Sparkles size={16} className="text-brand-gold" />
                      <h4 className="font-serif text-xs font-bold tracking-widest uppercase">Lady Isabella's Advice</h4>
                    </div>
                    <p className="text-xs text-brand-burgundy/85 leading-relaxed font-light italic">
                      &ldquo;{quizResult.consultantNotes}&rdquo;
                    </p>
                    <div className="border-t border-brand-gold/15 pt-4 flex justify-between text-[10px] font-extrabold tracking-wider uppercase text-brand-burgundy/50">
                      <span>Certified Curation</span>
                      <span>D & E Essentials</span>
                    </div>

                    <button
                      onClick={() => {
                        setQuizResult(null);
                        setQuizStep(1);
                        setQuizAnswers({ gender: "", fragranceFamily: "", occasion: "", preferences: "", mood: "" });
                      }}
                      className="w-full mt-4 flex items-center justify-center space-x-1 py-2.5 border border-brand-gold text-brand-burgundy hover:bg-brand-gold/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition"
                    >
                      <RefreshCw size={12} />
                      <span>Retake Diagnostics</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Questionnaire Steps */
              <div className="space-y-8 animate-slide-in">
                {/* Step Indicators */}
                <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4 text-xs font-serif text-brand-burgundy/50">
                  <span>STEP {quizStep} OF 4</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
                          i + 1 <= quizStep ? "bg-brand-burgundy" : "bg-brand-gold/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* STEP 1: GENDER PROFILE */}
                {quizStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-burgundy">Whom should this masterpiece adorn?</h3>
                      <p className="text-xs text-brand-burgundy/60 mt-1">Select the luxury gender alignment that represents your scent preference.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {genderOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, gender: opt.value });
                            setQuizStep(2);
                          }}
                          className={`group cursor-pointer border rounded-2xl p-4 transition-all hover:border-brand-gold-hover flex justify-between items-center bg-brand-cream/10 hover:bg-brand-cream-dark/20 ${
                            quizAnswers.gender === opt.value ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy" : "border-brand-gold/20"
                          }`}
                        >
                          <div>
                            <p className="font-serif text-sm font-bold text-brand-burgundy">{opt.label}</p>
                            <p className="text-[11px] text-brand-burgundy/60 mt-0.5">{opt.description}</p>
                          </div>
                          <ChevronRight size={16} className="text-brand-gold-dark transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: FRAGRANCE FAMILY */}
                {quizStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-burgundy">Which aromatic landscape speaks to your soul?</h3>
                      <p className="text-xs text-brand-burgundy/60 mt-1">Different notes evoke different textures. Select your preferred core alignment.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {familyOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, fragranceFamily: opt.value });
                            setQuizStep(3);
                          }}
                          className={`group cursor-pointer border rounded-2xl p-4 transition-all hover:border-brand-gold-hover flex justify-between items-center bg-brand-cream/10 hover:bg-brand-cream-dark/20 ${
                            quizAnswers.fragranceFamily === opt.value ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy" : "border-brand-gold/20"
                          }`}
                        >
                          <div>
                            <p className="font-serif text-sm font-bold text-brand-burgundy">{opt.label}</p>
                            <p className="text-[11px] text-brand-burgundy/60 mt-0.5">{opt.description}</p>
                          </div>
                          <ChevronRight size={16} className="text-brand-gold-dark transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: OCCASION */}
                {quizStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-burgundy">Where will this scent make its trail?</h3>
                      <p className="text-xs text-brand-burgundy/60 mt-1">Matching perfumes to your occasion ensures perfect projectability.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {occasionOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, occasion: opt.value });
                            setQuizStep(4);
                          }}
                          className={`group cursor-pointer border rounded-2xl p-4 transition-all hover:border-brand-gold-hover flex justify-between items-center bg-brand-cream/10 hover:bg-brand-cream-dark/20 ${
                            quizAnswers.occasion === opt.value ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy" : "border-brand-gold/20"
                          }`}
                        >
                          <div>
                            <p className="font-serif text-sm font-bold text-brand-burgundy">{opt.label}</p>
                            <p className="text-[11px] text-brand-burgundy/60 mt-0.5">{opt.description}</p>
                          </div>
                          <ChevronRight size={16} className="text-brand-gold-dark transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: MOOD */}
                {quizStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-burgundy">What energy or signature do you wish to project?</h3>
                      <p className="text-xs text-brand-burgundy/60 mt-1">Perfume is invisible styling. Select your desired aura.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {moodOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, mood: opt.value });
                          }}
                          className={`group cursor-pointer border rounded-2xl p-4 transition-all hover:border-brand-gold-hover flex justify-between items-center bg-brand-cream/10 hover:bg-brand-cream-dark/20 ${
                            quizAnswers.mood === opt.value ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy" : "border-brand-gold/20"
                          }`}
                        >
                          <div>
                            <p className="font-serif text-sm font-bold text-brand-burgundy">{opt.label}</p>
                            <p className="text-[11px] text-brand-burgundy/60 mt-0.5">{opt.description}</p>
                          </div>
                          <ChevronRight size={16} className="text-brand-gold-dark transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-brand-gold/10">
                      <button
                        onClick={() => {
                          setQuizStep(3);
                          setQuizAnswers({ ...quizAnswers, mood: "" });
                        }}
                        className="text-xs uppercase tracking-wider font-bold text-brand-gold-dark hover:text-brand-burgundy"
                      >
                        Back
                      </button>

                      <button
                        onClick={handleQuizSubmit}
                        disabled={!quizAnswers.mood}
                        className="flex items-center space-x-1.5 py-3 px-6 bg-brand-burgundy text-brand-gold rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition shadow-md disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        <span>Reveal Scent Curation</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REAL-TIME CHAT */}
        {activeSubTab === "chat" && (
          <div className="bg-white border border-brand-gold/15 rounded-3xl shadow-sm flex flex-col h-[550px]" id="sommelier-chat-container">
            {/* Chat Room Header */}
            <div className="px-6 py-4 border-b border-brand-gold/15 flex items-center justify-between bg-brand-cream-dark/20 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-burgundy border border-brand-gold flex items-center justify-center font-serif text-xs font-bold text-brand-gold shadow">
                  II
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-brand-burgundy leading-snug">Lady Isabella</h3>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-gold-dark block">Master Perfumer</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-700 text-[10px] font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase">
                <span className="w-1.5 h-1.5 bg-green-700 rounded-full animate-ping" />
                <span>Studio Connected</span>
              </div>
            </div>

            {/* Chat Message Lists */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-cream/5">
              {chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-in`}>
                    <div className="max-w-[80%] space-y-3">
                      {/* Message bubble */}
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? "bg-brand-burgundy text-brand-gold rounded-tr-none shadow-sm"
                            : "bg-brand-cream-dark/40 border border-brand-gold/15 text-brand-burgundy rounded-tl-none font-light"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Attached Product Suggestion (Returned from Gemini API) */}
                      {msg.recommendation && (
                        (() => {
                          const matchedProd = LUXURY_PRODUCTS.find(p => p.id === msg.recommendation?.productId) || LUXURY_PRODUCTS[0];
                          return (
                            <div className="border border-brand-gold/30 rounded-xl bg-white p-3 shadow flex items-center justify-between space-x-3 max-w-sm animate-zoom-in">
                              <div className="flex items-center space-x-2.5">
                                <img referrerPolicy="no-referrer" src={matchedProd.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-brand-gold/10 p-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-brand-burgundy line-clamp-1">{matchedProd.name}</p>
                                  <p className="text-[9px] font-mono font-bold text-brand-gold-dark">{msg.recommendation.matchPercentage}% Match</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  addToCart(matchedProd, "100ml", 1);
                                  // Small temporary visual response
                                  setChatMessages(prev => [
                                    ...prev,
                                    { sender: "sommelier", text: `Marvelous choice! I have added ${matchedProd.name} to your checkout tray.` }
                                  ]);
                                }}
                                className="py-1.5 px-3 bg-brand-burgundy text-brand-gold text-[9px] font-extrabold uppercase tracking-widest rounded-lg hover:bg-brand-burgundy-light transition flex items-center space-x-1"
                              >
                                <ShoppingCart size={10} />
                                <span>Acquire</span>
                              </button>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isChatLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="p-4 bg-brand-cream-dark/25 border border-brand-gold/10 rounded-2xl rounded-tl-none text-xs text-brand-burgundy/60 italic">
                    Lady Isabella is composing thoughts...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-brand-gold/15 bg-brand-cream-dark/10 rounded-b-3xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Describe your desired aroma vibe, ingredients, or memory..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  className="w-full text-xs py-3.5 pl-4 pr-14 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-burgundy transition-all shadow-inner disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="absolute right-2 p-2.5 rounded-lg bg-brand-burgundy text-brand-gold hover:bg-brand-burgundy-light transition disabled:bg-gray-200 disabled:text-gray-400"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
