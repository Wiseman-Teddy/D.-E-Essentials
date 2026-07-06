import React, { useState } from "react";
import { CreditCard, CheckCircle2, Ticket, ArrowLeft, Loader2, Sparkles, Smartphone, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { CartItem, Product, Order, Address } from "../types";
import { MARKETING_CAMPAIGNS } from "../data";

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  user: { name: string; email: string } | null;
  addOrder: (order: Order) => void;
  setActiveTab: (tab: string) => void;
}

export default function Checkout({ cart, clearCart, user, addOrder, setActiveTab }: CheckoutProps) {
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Forms
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "0712345678", // Default Kenyan number prefix
    street: "12 Riverside Drive",
    city: "Nairobi",
    country: "Kenya"
  });

  const [paymentMethod, setPaymentMethod] = useState<"M-Pesa" | "Card" | "Cash on Delivery">("M-Pesa");

  // Phone Simulator state
  const [isHandsetOpen, setIsHandsetOpen] = useState(false);
  const [phonePin, setPhonePin] = useState("");
  const [mpesaStatus, setMpesaStatus] = useState<"input" | "processing" | "success" | "failed">("input");
  const [mockTransactionId, setMockTransactionId] = useState("");
  const [isCheckingOutLocal, setIsCheckingOutLocal] = useState(false);

  // Calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity, 0);
  const shipping = 0; // Complimentary shipping
  const tax = Math.round(subtotal * 0.16); // 16% VAT

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percentage") {
      discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + tax + shipping - discountAmount);
  // Convert dollars to approximate KES (e.g. 1 USD = 130 KES)
  const convertedTotalKES = grandTotal * 130;

  // Apply Coupon Handler
  const handleApplyCoupon = () => {
    setCouponError(null);
    const campaign = MARKETING_CAMPAIGNS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    
    if (campaign && campaign.status === "active") {
      setAppliedDiscount({
        code: campaign.code,
        value: campaign.discountValue,
        type: campaign.discountType
      });
      setCouponCode("");
    } else {
      setCouponError("Invalid or expired promotional coupon code.");
    }
  };

  // Trigger Purchase Process
  const handleInitiatePurchase = async () => {
    setIsCheckingOutLocal(true);
    
    if (paymentMethod === "M-Pesa") {
      // Open our incredible STK Phone Simulator!
      setTimeout(() => {
        setIsCheckingOutLocal(false);
        setIsHandsetOpen(true);
        setMpesaStatus("input");
        setPhonePin("");
      }, 1000);
    } else {
      // Direct success for other payment methods
      setTimeout(() => {
        const mockAddress: Address = {
          id: `add_${Math.floor(Math.random() * 10000)}`,
          name: shippingDetails.name,
          phone: shippingDetails.phone,
          street: shippingDetails.street,
          city: shippingDetails.city,
          country: shippingDetails.country,
          isDefault: true
        };

        const newOrder: Order = {
          id: `DE-ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
          date: new Date().toISOString().split("T")[0],
          items: [...cart],
          subtotal,
          shipping,
          tax,
          total: grandTotal,
          status: "Processing",
          shippingAddress: mockAddress,
          paymentMethod
        };

        addOrder(newOrder);
        clearCart();
        setIsCheckingOutLocal(false);
        setActiveTab("profile");
      }, 1500);
    }
  };

  // Simulator PIN inputs
  const handlePinTap = (num: string) => {
    if (phonePin.length < 4) {
      setPhonePin(prev => prev + num);
    }
  };

  const handlePinClear = () => {
    setPhonePin("");
  };

  // Submit Simulator Pin
  const handlePinSubmit = async () => {
    if (phonePin.length !== 4) return;
    setMpesaStatus("processing");

    try {
      // 1. Fire the actual server-side endpoint for M-Pesa STK push simulation
      const stkResponse = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: shippingDetails.phone,
          amount: convertedTotalKES,
          orderId: `DE-${Math.floor(Math.random() * 10000)}`
        })
      });
      const stkData = await stkResponse.json();
      
      // 2. Poll/query status from server-side verification
      setTimeout(async () => {
        try {
          const statusRes = await fetch("/api/mpesa/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              checkoutRequestId: stkData.CheckoutRequestID,
              simulateStatus: "Completed" // Force complete in this premium mockup
            })
          });
          const statusData = await statusRes.json();
          
          if (statusData.status === "Completed") {
            setMockTransactionId(statusData.transactionId);
            setMpesaStatus("success");
            
            // Create and save final order
            const mockAddress: Address = {
              id: `add_${Math.floor(Math.random() * 10000)}`,
              name: shippingDetails.name,
              phone: shippingDetails.phone,
              street: shippingDetails.street,
              city: shippingDetails.city,
              country: shippingDetails.country,
              isDefault: true
            };

            const newOrder: Order = {
              id: `DE-ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
              date: new Date().toISOString().split("T")[0],
              items: [...cart],
              subtotal,
              shipping,
              tax,
              total: grandTotal,
              status: "Paid",
              shippingAddress: mockAddress,
              paymentMethod: "M-Pesa",
              mpesaDetails: {
                phone: shippingDetails.phone,
                transactionId: statusData.transactionId,
                checkoutRequestId: stkData.CheckoutRequestID,
                paymentStatus: "Completed"
              },
              trackingCode: `TRK${Math.floor(Math.random() * 90000000 + 10000000)}`
            };

            addOrder(newOrder);
          } else {
            setMpesaStatus("failed");
          }
        } catch (e) {
          setMpesaStatus("failed");
        }
      }, 2500);

    } catch (e) {
      setMpesaStatus("failed");
    }
  };

  const handleCloseHandsetSuccess = () => {
    setIsHandsetOpen(false);
    clearCart();
    setActiveTab("profile"); // Redirect to profile where they can track orders
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold bg-brand-cream-dark mx-auto">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy">Your Cart is Currently Empty</h2>
          <p className="text-xs text-brand-burgundy/60 mt-1 max-w-sm mx-auto">You must select outstanding fragrances from our Boutique before executing checkout.</p>
        </div>
        <button
          onClick={() => setActiveTab("boutique")}
          className="px-6 py-2.5 rounded-full bg-brand-burgundy text-brand-gold text-xs font-semibold uppercase tracking-wider hover:bg-brand-burgundy-light transition inline-block"
        >
          Explore Boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="checkout-root">
      
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-6 cursor-pointer hover:text-brand-burgundy transition" onClick={() => setActiveTab("boutique")}>
        <ArrowLeft size={14} />
        <span>Back to Boutique</span>
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-brand-burgundy mb-10">
        STUDIO SECURE <span className="font-serif italic font-extrabold text-brand-gold">CHECKOUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Shipping Form Card */}
          <div className="bg-white border border-brand-gold/15 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy flex items-center space-x-2">
              <Truck size={16} className="text-brand-gold" />
              <span>Shipping Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Full Name</label>
                <input
                  type="text"
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  placeholder="e.g. Wiseman Aganya"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Email Address</label>
                <input
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  placeholder="e.g. wise@email.com"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">M-Pesa Mobile Number</label>
                <input
                  type="text"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  placeholder="e.g. 0712345678"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Street Address</label>
                <input
                  type="text"
                  value={shippingDetails.street}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, street: e.target.value })}
                  placeholder="e.g. 12 Riverside Drive"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">City</label>
                <input
                  type="text"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                  placeholder="e.g. Nairobi"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Country</label>
                <input
                  type="text"
                  value={shippingDetails.country}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                  placeholder="Kenya"
                  className="w-full text-xs py-3 px-3.5 bg-brand-cream border border-brand-gold/20 rounded-xl focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-brand-gold/15 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy flex items-center space-x-2">
              <CreditCard size={16} className="text-brand-gold" />
              <span>Secure Settlement Gateway</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* M-Pesa Payment Card Option */}
              <div
                onClick={() => setPaymentMethod("M-Pesa")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col justify-between h-24 transition ${
                  paymentMethod === "M-Pesa"
                    ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy"
                    : "border-brand-gold/15 hover:border-brand-gold-hover bg-brand-cream/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-burgundy">M-Pesa STK</span>
                  <Smartphone size={16} className="text-green-600" />
                </div>
                <span className="text-[9px] text-brand-burgundy/60 leading-tight">Instant Safaricom STK Push Verification</span>
              </div>

              {/* Credit Card Option */}
              <div
                onClick={() => setPaymentMethod("Card")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col justify-between h-24 transition ${
                  paymentMethod === "Card"
                    ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy"
                    : "border-brand-gold/15 hover:border-brand-gold-hover bg-brand-cream/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-burgundy">Visa / Mastercard</span>
                  <CreditCard size={16} className="text-brand-gold-dark" />
                </div>
                <span className="text-[9px] text-brand-burgundy/60 leading-tight">Debit/Credit automated checkout</span>
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod("Cash on Delivery")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col justify-between h-24 transition ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-brand-burgundy bg-brand-cream-dark/30 ring-1 ring-brand-burgundy"
                    : "border-brand-gold/15 hover:border-brand-gold-hover bg-brand-cream/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-burgundy">On Delivery</span>
                  <CheckCircle2 size={16} className="text-brand-gold-dark" />
                </div>
                <span className="text-[9px] text-brand-burgundy/60 leading-tight">Settle during courier collection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Checkout Cart Overview & Calculation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-cream-dark/50 border border-brand-gold/25 p-6 rounded-2xl shadow-sm h-fit space-y-6">
            <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy border-b border-brand-gold/15 pb-3">
              Order Compilation
            </h2>

            {/* Cart products breakdown */}
            <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img referrerPolicy="no-referrer" src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-brand-gold/15 bg-white p-0.5" />
                    <div>
                      <p className="font-bold text-brand-burgundy line-clamp-1">{item.product.name}</p>
                      <span className="text-[9px] text-brand-burgundy/60 uppercase">{item.quantity}x {item.selectedSize}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-brand-burgundy">
                    Ksh {(item.product.discountPrice || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Coupon application */}
            <div className="border-t border-brand-gold/15 pt-4 space-y-2">
              <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Promotional Coupon</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 bg-white border border-brand-gold/20 rounded-lg focus:outline-none focus:border-brand-burgundy font-mono uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-brand-burgundy text-brand-gold rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition shadow flex items-center space-x-1"
                >
                  <Ticket size={12} />
                  <span>Apply</span>
                </button>
              </div>
              {couponError && <p className="text-[10px] font-semibold text-red-700">{couponError}</p>}
              {appliedDiscount && (
                <div className="flex items-center justify-between text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 p-2 rounded">
                  <span>Discount Applied: {appliedDiscount.code} (-{appliedDiscount.type === "percentage" ? `${appliedDiscount.value}%` : `Ksh ${appliedDiscount.value}`})</span>
                  <button onClick={() => setAppliedDiscount(null)} className="text-brand-burgundy font-bold">✕</button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-brand-gold/15 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-burgundy/70">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-brand-burgundy">Ksh {subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Special Coupon Savings</span>
                  <span className="font-mono font-bold">-Ksh {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-burgundy/70">
                <span>Value Added Tax (16% VAT)</span>
                <span className="font-mono font-bold text-brand-burgundy">Ksh {tax}</span>
              </div>
              <div className="flex justify-between text-brand-burgundy/70">
                <span>Studio Express Delivery</span>
                <span className="font-mono font-extrabold text-brand-gold-dark">COMPLIMENTARY</span>
              </div>

              <div className="flex justify-between text-sm font-serif font-bold text-brand-burgundy border-t border-brand-gold/15 pt-3">
                <span>TOTAL PAYABLE</span>
                <div className="text-right">
                  <span className="block font-mono font-extrabold text-brand-burgundy">Ksh {grandTotal}</span>
                  {paymentMethod === "M-Pesa" && (
                    <span className="block text-[10px] font-mono text-green-700 font-semibold mt-0.5">~ KES {convertedTotalKES.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleInitiatePurchase}
              disabled={isCheckingOutLocal || !shippingDetails.name || !shippingDetails.email}
              className="w-full py-3 bg-brand-burgundy text-brand-gold rounded-full font-serif text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition shadow-md flex items-center justify-center space-x-1.5"
              id="initiate-purchase-btn"
            >
              {isCheckingOutLocal ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Distilling Request...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Settle {paymentMethod === "M-Pesa" ? "with M-Pesa" : "Order Selection"}</span>
                </>
              )}
            </button>
            
            <p className="text-[10px] text-brand-burgundy/50 text-center leading-relaxed">
              By completing your order, you authorize D & E Essentials to queue express logistics and custom luxury packaging. All transactions are fully encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* Floating M-Pesa Handset STK PIN Pad Simulator Panel */}
      {isHandsetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" id="mpesa-simulator-overlay">
          <div className="relative bg-[#1a1a1a] border-[6px] border-[#333333] w-full max-w-[320px] h-[580px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between font-sans">
            
            {/* Handset notch / speaker */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-gray-800 rounded-full" />
            </div>

            {/* Handset Screen Display */}
            <div className="flex-1 bg-[#121212] flex flex-col justify-between pt-10 pb-6 px-4 text-white">
              
              {/* Phone Status bar */}
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-4 px-2">
                <span>Safaricom 5G</span>
                <span>12:00 PM</span>
              </div>

              {/* VIEW A: PIN INPUT PROMPT */}
              {mpesaStatus === "input" && (
                <div className="flex-1 flex flex-col justify-between animate-zoom-in">
                  
                  {/* STK Popup Modal Dialogue (Perfect replication!) */}
                  <div className="bg-[#f0f0f0] text-black rounded-xl p-4 shadow-2xl border border-gray-300 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
                      <span className="font-extrabold text-xs text-[#0a5c24] tracking-wide">M-PESA</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold leading-relaxed">
                        Do you want to pay <strong className="font-extrabold text-emerald-800">KES {convertedTotalKES.toLocaleString()}</strong> to <strong className="uppercase">D & E Essentials</strong>?
                      </p>
                      <p className="text-[11px] text-gray-600 font-medium">Enter 4-Digit M-Pesa PIN:</p>
                    </div>

                    {/* PIN Display */}
                    <div className="flex justify-center space-x-3.5 py-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${
                            i < phonePin.length ? "bg-emerald-800" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-gray-300">
                      <button
                        onClick={() => setIsHandsetOpen(false)}
                        className="flex-1 py-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePinSubmit}
                        disabled={phonePin.length !== 4}
                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition disabled:opacity-55"
                      >
                        Send PIN
                      </button>
                    </div>
                  </div>

                  {/* Operational Numeric Pin pad */}
                  <div className="space-y-2 pt-6">
                    <div className="grid grid-cols-3 gap-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(n => (
                        <button
                          key={n}
                          onClick={() => handlePinTap(n)}
                          className="py-3 bg-[#262626] rounded-xl text-lg font-bold hover:bg-[#333333] active:bg-[#444] transition"
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={handlePinClear}
                        className="py-3 bg-[#262626] rounded-xl text-xs font-bold text-red-500 hover:bg-[#333333]"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => handlePinTap("0")}
                        className="py-3 bg-[#262626] rounded-xl text-lg font-bold hover:bg-[#333333]"
                      >
                        0
                      </button>
                      <div className="flex items-center justify-center text-xs text-gray-600 font-bold">PIN</div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW B: PROCESSING SPINNER */}
              {mpesaStatus === "processing" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-emerald-800/20 border-t-emerald-600 animate-spin" />
                    <Smartphone size={20} className="absolute inset-0 m-auto text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Verifying Transaction</p>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed mx-auto">Safaricom security layer is validating your M-Pesa balance and authorized PIN...</p>
                  </div>
                </div>
              )}

              {/* VIEW C: SUCCESS PAYMENT */}
              {mpesaStatus === "success" && (
                <div className="flex-1 flex flex-col justify-between items-center py-6 text-center animate-zoom-in">
                  <div className="space-y-4 pt-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-emerald-500">M-PESA SUCCESS</p>
                      <p className="text-xs text-gray-300 mt-1">Transaction Completed</p>
                    </div>
                    <div className="bg-[#1f1f1f] border border-gray-800 p-4 rounded-xl text-left space-y-2 max-w-[240px] mx-auto text-[11px] leading-relaxed">
                      <p className="text-gray-400">Merchant: <strong className="text-white">D&E Essentials</strong></p>
                      <p className="text-gray-400">Settle Amount: <strong className="text-white">KES {convertedTotalKES.toLocaleString()}</strong></p>
                      <p className="text-gray-400">Transaction ID: <strong className="text-emerald-400 font-mono">{mockTransactionId}</strong></p>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseHandsetSuccess}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow"
                  >
                    Close Handset Dialog
                  </button>
                </div>
              )}

              {/* VIEW D: FAILED PAYMENT */}
              {mpesaStatus === "failed" && (
                <div className="flex-1 flex flex-col justify-between items-center py-6 text-center animate-zoom-in">
                  <div className="space-y-4 pt-10">
                    <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-500 shadow-lg mx-auto">
                      ✕
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-red-500">PAYMENT FAILED</p>
                      <p className="text-xs text-gray-300 mt-1">Authorization Rejected</p>
                    </div>
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed">Please ensure you have sufficient funds or contact Safaricom care support.</p>
                  </div>

                  <button
                    onClick={() => setMpesaStatus("input")}
                    className="w-full py-3 bg-[#222] hover:bg-[#333] border border-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition"
                  >
                    Retry Settlement
                  </button>
                </div>
              )}
            </div>
            
            {/* Handset bottom home bar indicators */}
            <div className="w-32 h-1 bg-gray-800 rounded-full mx-auto mb-2" />
          </div>
        </div>
      )}
    </div>
  );
}
