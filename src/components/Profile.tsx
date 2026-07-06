import React, { useState } from "react";
import { User, MapPin, Package, Heart, RefreshCw, ShoppingCart, ShieldCheck, ClipboardCheck, Truck } from "lucide-react";
import { Order, Product, CartItem } from "../types";
import { LUXURY_PRODUCTS } from "../data";

interface ProfileProps {
  user: { name: string; email: string } | null;
  orders: Order[];
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  setActiveTab: (tab: string) => void;
}

export default function Profile({ user, orders, wishlist, toggleWishlist, addToCart, setActiveTab }: ProfileProps) {
  const [activeSubView, setActiveSubView] = useState<"orders" | "addresses" | "wishlist">("orders");
  
  // Simulated address state
  const [addresses, setAddresses] = useState([
    {
      id: "a1",
      name: user?.name || "Wiseman Aganya",
      phone: "0712345678",
      street: "12 Riverside Drive",
      city: "Nairobi",
      country: "Kenya",
      isDefault: true
    }
  ]);

  const [editingAddress, setEditingAddress] = useState<any | null>(null);

  // Status mapping to Stepper Steps
  const getStatusStep = (status: string) => {
    switch (status) {
      case "Awaiting Payment": return 0;
      case "Paid": return 1;
      case "Processing": return 2;
      case "Packed": return 3;
      case "Shipped": return 4;
      case "Delivered": return 5;
      default: return 2;
    }
  };

  const stepsList = [
    { label: "Awaiting", icon: ClipboardCheck },
    { label: "Paid", icon: ShieldCheck },
    { label: "Processing", icon: RefreshCw },
    { label: "Packed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircleIcon }
  ];

  function CheckCircleIcon({ size }: { size?: number }) {
    return <Package size={size} />;
  }

  // One-click Reorder
  const handleBuyItAgain = (item: CartItem) => {
    addToCart(item.product, item.selectedSize, 1);
    setActiveTab("boutique"); // Trigger redirect to checkout or cart
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="profile-root">
      
      {/* Account Profile Header Grid */}
      <div className="bg-white border border-brand-gold/15 p-6 sm:p-8 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5">
          <div className="w-16 h-16 rounded-full bg-brand-burgundy border-2 border-brand-gold flex items-center justify-center font-serif text-lg font-bold text-brand-gold shadow-md">
            {user ? user.name.substring(0, 2).toUpperCase() : "DE"}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-brand-burgundy">{user?.name || "Elite Patron Guest"}</h1>
            <p className="text-xs text-brand-burgundy/60 mt-0.5">{user?.email || "anonymous.guest@luxury.com"}</p>
            <div className="inline-flex items-center space-x-1.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-burgundy text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mt-3">
              <ShieldCheck size={11} className="text-brand-gold" />
              <span>Premium Gold Patron</span>
            </div>
          </div>
        </div>

        {/* Dynamic subview controls */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "orders", label: "Order History", icon: Package },
            { id: "addresses", label: "Saved Addresses", icon: MapPin },
            { id: "wishlist", label: "My Wishlist", icon: Heart }
          ].map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setActiveSubView(v.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeSubView === v.id
                    ? "bg-brand-burgundy text-brand-gold shadow"
                    : "bg-brand-cream border border-brand-gold/15 text-brand-burgundy hover:bg-brand-gold/5"
                }`}
              >
                <Icon size={14} />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBVIEW 1: ORDERS LIST (WITH STEPPER!) */}
      {activeSubView === "orders" && (
        <div className="space-y-6" id="profile-orders-view">
          <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy">Your Luxury Deliveries</h2>

          {orders.length === 0 ? (
            <div className="bg-white border border-brand-gold/10 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <Package size={40} className="text-brand-gold/40 mx-auto" />
              <div>
                <p className="font-serif text-base font-semibold text-brand-burgundy">No Purchases Yet</p>
                <p className="text-xs text-brand-burgundy/60 mt-1">Once you complete a secure M-Pesa order, tracking schedules appear here in real-time.</p>
              </div>
              <button
                onClick={() => setActiveTab("boutique")}
                className="px-6 py-2.5 bg-brand-burgundy text-brand-gold text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-burgundy-light transition"
              >
                Entrance to Boutique
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const activeStepIdx = getStatusStep(ord.status);
              return (
                <div key={ord.id} className="bg-white border border-brand-gold/15 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Order Card Title Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-brand-gold/10 pb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-extrabold text-brand-burgundy">{ord.id}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                          ord.status === "Paid" || ord.status === "Delivered"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-burgundy/50 mt-1 font-medium">Purchased on {ord.date} • Settle Method: {ord.paymentMethod}</p>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs text-brand-burgundy/60 uppercase">Settled Total</span>
                      <strong className="block text-sm font-mono font-extrabold text-brand-burgundy">Ksh {ord.total}</strong>
                    </div>
                  </div>

                  {/* VISUAL STEPS STEPPER */}
                  <div className="py-4 overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[500px] px-2">
                      {stepsList.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCompleted = idx <= activeStepIdx;
                        const isCurrent = idx === activeStepIdx;
                        
                        return (
                          <React.Fragment key={idx}>
                            {/* Step bubble */}
                            <div className="flex flex-col items-center space-y-2 relative">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-brand-burgundy border-brand-burgundy text-brand-gold shadow"
                                  : "bg-white border-brand-gold/20 text-brand-burgundy/40"
                              } ${isCurrent ? "ring-4 ring-brand-gold/30" : ""}`}>
                                <StepIcon size={14} />
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                isCompleted ? "text-brand-burgundy" : "text-brand-burgundy/40"
                              }`}>
                                {step.label}
                              </span>
                            </div>

                            {/* Connecting Line */}
                            {idx < stepsList.length - 1 && (
                              <div className="flex-1 h-0.5 mx-2 bg-brand-gold/20 relative min-w-[40px]">
                                <div
                                  className="absolute top-0 left-0 h-full bg-brand-burgundy transition-all duration-500"
                                  style={{ width: idx < activeStepIdx ? "100%" : idx === activeStepIdx ? "50%" : "0%" }}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Purchased Items List with Buy It Again */}
                  <div className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl p-4 space-y-4">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60">Cart Manifest</h3>
                    <div className="space-y-4">
                      {ord.items.map((item) => (
                        <div key={`${item.product.id}-${item.selectedSize}`} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center space-x-3">
                            <img referrerPolicy="no-referrer" src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-brand-gold/15 bg-white p-0.5" />
                            <div>
                              <p className="text-xs font-bold text-brand-burgundy">{item.product.name}</p>
                              <p className="text-[10px] text-brand-burgundy/60 mt-0.5 uppercase tracking-wider">{item.quantity}x {item.selectedSize} • {item.product.brand}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3.5 w-full sm:w-auto justify-end">
                            <span className="text-xs font-mono font-bold text-brand-burgundy">
                              Ksh {(item.product.discountPrice || item.product.price) * item.quantity}
                            </span>
                            <button
                              onClick={() => handleBuyItAgain(item)}
                              className="flex items-center space-x-1 py-1.5 px-3 bg-brand-gold/15 border border-brand-gold/30 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-brand-burgundy hover:bg-brand-burgundy hover:text-brand-gold hover:border-brand-burgundy transition"
                            >
                              <ShoppingCart size={10} />
                              <span>Buy Again</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking link snippet if available */}
                  {ord.trackingCode && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs p-3.5 bg-brand-cream-dark/40 rounded-xl border border-brand-gold/15 gap-2">
                      <p className="font-medium text-brand-burgundy/75">
                        Logistics Carrier: <strong className="font-bold text-brand-burgundy">D & E Express Premium Cargo</strong>
                      </p>
                      <p className="font-mono text-[10px] font-bold text-brand-burgundy/80">
                        TRACKING CODE: <span className="text-brand-burgundy font-extrabold">{ord.trackingCode}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUBVIEW 2: SAVED ADDRESSES */}
      {activeSubView === "addresses" && (
        <div className="space-y-6" id="profile-addresses-view">
          <div className="flex justify-between items-center border-b border-brand-gold/15 pb-4">
            <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy">Delivery Coordinates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white border border-brand-gold/15 p-5 rounded-2xl shadow-sm space-y-3 relative">
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-brand-burgundy text-brand-gold text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border border-brand-gold/30">
                    Default
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-sm font-bold text-brand-burgundy">{addr.name}</h3>
                  <p className="text-xs text-brand-burgundy/70 mt-1 font-light leading-relaxed">
                    {addr.street}<br />
                    {addr.city}, {addr.country}
                  </p>
                  <p className="text-[10px] text-brand-burgundy/60 font-mono mt-2">Tel: {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: WISHLIST CARDS */}
      {activeSubView === "wishlist" && (
        <div className="space-y-6" id="profile-wishlist-view">
          <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-brand-burgundy">Your Hearted Fragrances</h2>

          {wishlist.length === 0 ? (
            <div className="bg-white border border-brand-gold/10 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <Heart size={40} className="text-brand-gold/40 mx-auto" />
              <div>
                <p className="font-serif text-base font-semibold text-brand-burgundy">Your Wishlist is Empty</p>
                <p className="text-xs text-brand-burgundy/60 mt-1">Heart luxury perfume cards in the Boutique to populate your private vault.</p>
              </div>
              <button
                onClick={() => setActiveTab("boutique")}
                className="px-6 py-2.5 bg-brand-burgundy text-brand-gold text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-burgundy-light transition"
              >
                Studio Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((prod) => (
                <div key={prod.id} className="bg-white border border-brand-gold/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-brand-cream/20 p-4">
                    <img referrerPolicy="no-referrer" src={prod.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-red-600 hover:scale-110 transition shadow-sm"
                    >
                      <Heart size={14} className="fill-red-600 text-red-600" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3.5">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-brand-gold-dark block">{prod.brand}</span>
                      <h3 className="font-serif text-sm font-bold text-brand-burgundy leading-snug line-clamp-1">{prod.name}</h3>
                      <p className="text-[10px] text-brand-burgundy/60 mt-0.5 uppercase tracking-wide">{prod.fragranceFamily} Family</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-gold/10 pt-3">
                      <span className="text-xs font-mono font-extrabold text-brand-burgundy">Ksh {prod.discountPrice || prod.price}</span>
                      <button
                        onClick={() => addToCart(prod, "100ml", 1)}
                        className="py-1.5 px-3 bg-brand-burgundy text-brand-gold rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition"
                      >
                        Acquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
