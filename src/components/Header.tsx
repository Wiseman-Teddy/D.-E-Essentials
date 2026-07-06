import React, { useState } from "react";
import { ShoppingBag, User, Heart, Sparkles, BookOpen, Settings, Menu, X, Trash2, ArrowRight } from "lucide-react";
import { CartItem, Product } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, qty: number) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cart,
  removeFromCart,
  updateCartQuantity,
  wishlist,
  toggleWishlist,
  user,
  onLogout,
  onOpenLogin,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity, 0);

  const navItems = [
    { id: "boutique", label: "The Boutique", icon: ShoppingBag },
    { id: "sommelier", label: "AI Sommelier", icon: Sparkles, highlight: true },
    { id: "editorial", label: "Editorial", icon: BookOpen },
    { id: "profile", label: "My Account", icon: User },
    { id: "admin", label: "Admin Space", icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-gold/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-brand-burgundy p-2 rounded-md hover:bg-brand-cream-dark transition"
              id="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo Monogram */}
            <div 
              onClick={() => { setActiveTab("boutique"); }}
              className="flex items-center space-x-3 cursor-pointer group"
              id="header-logo-container"
            >
              <div className="w-12 h-12 rounded-full border border-brand-gold bg-brand-burgundy flex items-center justify-center text-brand-gold font-serif text-lg font-bold shadow-md transform transition group-hover:scale-105">
                D&E
              </div>
              <div className="hidden sm:block">
                <span className="font-serif block text-lg font-extrabold tracking-wider text-brand-burgundy leading-tight group-hover:text-brand-burgundy-light transition">
                  D & E ESSENTIALS
                </span>
                <span className="font-mono text-[9px] block tracking-[0.3em] uppercase text-brand-gold font-medium">
                  Haute Parfumerie
                </span>
              </div>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-1 lg:space-x-4 items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-full font-serif text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                      isActive
                        ? "bg-brand-burgundy text-brand-gold shadow-md"
                        : item.highlight
                        ? "bg-brand-gold/10 text-brand-burgundy border border-brand-gold/30 hover:bg-brand-gold/20"
                        : "text-brand-burgundy/80 hover:text-brand-burgundy hover:bg-brand-gold/5"
                    }`}
                    id={`nav-tab-${item.id}`}
                  >
                    <Icon size={14} className={isActive ? "text-brand-gold" : "text-brand-gold-dark"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Buttons: User, Wishlist, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Account / Login Button */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-xs font-medium text-brand-burgundy">
                    Bonjour, <strong className="font-semibold">{user.name.split(" ")[0]}</strong>
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-[10px] uppercase tracking-wider font-bold text-brand-gold-dark hover:text-brand-burgundy transition"
                    id="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="hidden sm:flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-brand-burgundy hover:text-brand-gold transition"
                  id="login-btn"
                >
                  <User size={16} className="text-brand-gold" />
                  <span className="hidden md:inline">Sign In</span>
                </button>
              )}

              {/* Wishlist Trigger */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-brand-burgundy hover:text-brand-gold transition rounded-full hover:bg-brand-cream-dark"
                id="wishlist-trigger-btn"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-burgundy text-[9px] font-bold text-brand-gold border border-brand-cream animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-brand-burgundy text-brand-gold hover:bg-brand-burgundy-light transition shadow-md hover:scale-105 transform duration-300"
                id="cart-trigger-btn"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-burgundy border border-brand-burgundy animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Drawer) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-cream border-t border-brand-gold/15 px-4 pt-3 pb-6 space-y-2 shadow-inner" id="mobile-menu-drawer">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-serif text-sm font-semibold tracking-wider uppercase transition ${
                    isActive
                      ? "bg-brand-burgundy text-brand-gold"
                      : "text-brand-burgundy/80 hover:bg-brand-gold/5"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-brand-gold" : "text-brand-gold-dark"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 border-t border-brand-gold/10 flex flex-col space-y-3">
              {user ? (
                <div className="flex justify-between items-center px-4">
                  <span className="text-sm font-medium text-brand-burgundy">
                    Bonjour, {user.name}
                  </span>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs uppercase tracking-wider font-bold text-brand-gold-dark hover:text-brand-burgundy"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl font-serif text-xs font-bold uppercase tracking-wider text-brand-burgundy"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Slider Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-slider-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-brand-cream border-l border-brand-gold/20 shadow-2xl flex flex-col animate-slide-in">
              <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="text-brand-gold" />
                  <h2 className="text-lg font-serif font-bold text-brand-burgundy tracking-wide">YOUR LUXURY SELECTION</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-brand-burgundy hover:text-brand-gold p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold bg-brand-cream-dark">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-serif text-base font-semibold text-brand-burgundy">Your chest is empty.</p>
                      <p className="text-xs text-brand-burgundy/60 mt-1 max-w-xs">Explore our exquisite perfume catalog and curate your personal collection.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setActiveTab("boutique");
                      }}
                      className="px-6 py-2.5 rounded-full bg-brand-burgundy text-brand-gold text-xs font-semibold uppercase tracking-wider hover:bg-brand-burgundy-light transition"
                    >
                      Boutique Entrance
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex space-x-4 border-b border-brand-gold/10 pb-4 last:border-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-brand-gold/10 bg-white p-1 flex-shrink-0">
                        <img referrerPolicy="no-referrer" src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-md" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-sm font-bold text-brand-burgundy line-clamp-1">{item.product.name}</h3>
                            <span className="text-xs font-bold text-brand-burgundy">
                              Ksh {(item.product.discountPrice || item.product.price) * item.quantity}
                            </span>
                          </div>
                          <p className="text-[10px] text-brand-gold-dark uppercase tracking-wider font-semibold mt-0.5">{item.product.brand}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-brand-gold/15 rounded text-[10px] font-semibold text-brand-burgundy">
                            Size: {item.selectedSize}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-gold/30 rounded-full bg-white text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="px-2.5 py-1 hover:text-brand-gold font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="px-2.5 py-1 hover:text-brand-gold font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-red-700 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-gold/15 bg-brand-cream-dark/50">
                  <div className="flex justify-between items-center text-sm font-serif font-bold text-brand-burgundy mb-2">
                    <span>ESTIMATED SUBTOTAL</span>
                    <span>Ksh {cartSubtotal}</span>
                  </div>
                  <p className="text-[10px] text-brand-burgundy/60 italic mb-4">Complimentary express shipping and custom velvet packaging included on all orders.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab("checkout");
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-burgundy text-brand-gold rounded-full font-serif text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition shadow-md group"
                    id="checkout-btn-side"
                  >
                    <span>Secure Checkout</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Panel */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-panel-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsWishlistOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-brand-cream border-l border-brand-gold/20 shadow-2xl flex flex-col animate-slide-in">
              <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="text-brand-gold fill-brand-gold" />
                  <h2 className="text-lg font-serif font-bold text-brand-burgundy tracking-wide">SAVED FRAGRANCES</h2>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} className="text-brand-burgundy hover:text-brand-gold p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Wishlist List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Heart size={40} className="text-brand-gold/40" />
                    <div>
                      <p className="font-serif text-base font-semibold text-brand-burgundy">Your wishlist is empty.</p>
                      <p className="text-xs text-brand-burgundy/60 mt-1 max-w-xs">Love what you see? Save your favorite fragrances here during exploration.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setActiveTab("boutique");
                      }}
                      className="px-6 py-2.5 rounded-full bg-brand-burgundy text-brand-gold text-xs font-semibold uppercase tracking-wider hover:bg-brand-burgundy-light transition"
                    >
                      Boutique Entrance
                    </button>
                  </div>
                ) : (
                  wishlist.map((prod) => (
                    <div key={prod.id} className="flex space-x-4 border-b border-brand-gold/10 pb-4 last:border-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-brand-gold/10 bg-white p-1 flex-shrink-0">
                        <img referrerPolicy="no-referrer" src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover rounded-md" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-sm font-bold text-brand-burgundy line-clamp-1">{prod.name}</h3>
                            <button
                              onClick={() => toggleWishlist(prod)}
                              className="text-brand-gold hover:text-brand-burgundy"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-brand-gold-dark uppercase tracking-wider font-semibold mt-0.5">{prod.brand}</p>
                          <p className="text-xs font-bold text-brand-burgundy mt-1">
                            Ksh {prod.discountPrice || prod.price}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setActiveTab("boutique");
                            // Triggers opening detailed view (we'll implement this on App)
                          }}
                          className="w-full mt-2 py-1.5 bg-brand-gold/15 text-brand-burgundy rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-brand-gold/30 text-center transition"
                        >
                          View Fragrance Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
