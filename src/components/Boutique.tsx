import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Heart, Star, Sparkles, ChevronRight, Eye, RefreshCw, ShoppingCart, Info, CheckCircle2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { Product, CartItem } from "../types";

interface BoutiqueProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

export default function Boutique({ products, cart, addToCart, wishlist, toggleWishlist }: BoutiqueProps) {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedFamily, setSelectedFamily] = useState<string>("All");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Detailed view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("100ml");
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [successAddAlert, setSuccessAddAlert] = useState<string | null>(null);

  // List of unique fragrance families and occasions for filters
  const families = ["All", "Oriental", "Gourmand", "Woody", "Floral", "Citrus", "Fresh"];
  const occasions = ["All", "Evening", "Date Night", "Daily Wear", "Summer", "Office", "Formal Events"];

  // SEO & Social Meta-tags update effect
  useEffect(() => {
    if (selectedProduct) {
      document.title = `${selectedProduct.name} - D & E Essentials`;
      
      const setMeta = (name: string, content: string, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let tag = document.querySelector(`meta[${attr}="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute(attr, name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      setMeta('description', selectedProduct.description);
      setMeta('og:title', `${selectedProduct.name} | D & E Essentials`, true);
      setMeta('og:description', selectedProduct.description, true);
      setMeta('og:image', selectedProduct.images[0], true);
      
    } else {
      document.title = "D & E Essentials | Luxury Boutique";
      const desc = document.querySelector(`meta[name="description"]`);
      if (desc) desc.setAttribute("content", "Discover exclusive luxury fragrances at D & E Essentials.");
    }
  }, [selectedProduct]);

  // Handle image zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "All" || prod.gender === selectedGender;
    const matchesFamily = selectedFamily === "All" || prod.fragranceFamily === selectedFamily;
    const matchesOccasion = selectedOccasion === "All" || prod.occasion.includes(selectedOccasion);
    const matchesPrice = (prod.discountPrice || prod.price) <= priceRange;

    return matchesSearch && matchesGender && matchesFamily && matchesOccasion && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "bestseller") return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Featured default
  });

  // Open detailed product view
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveDetailImage(product.images[0]);
    setSelectedSize(product.size[0] || "100ml");
    setQuantity(1);
  };

  // Related products query
  const getRelatedProducts = (current: Product) => {
    return products.filter(
      (p) => p.id !== current.id && (p.fragranceFamily === current.fragranceFamily || p.gender === current.gender)
    ).slice(0, 3);
  };

  // Bundle cross-sell add to cart helper
  const addFrequentlyBoughtBundle = (current: Product, related: Product) => {
    addToCart(current, "100ml", 1);
    addToCart(related, "100ml", 1);
    setSuccessAddAlert(`Added Luxury Scent Duo (${current.name} & ${related.name}) to your collection!`);
    setTimeout(() => setSuccessAddAlert(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="boutique-root">
      {successAddAlert && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-brand-burgundy text-brand-gold border border-brand-gold/40 px-5 py-4 rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 size={18} className="text-brand-gold" />
          <span className="text-xs font-bold uppercase tracking-wider">{successAddAlert}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative mb-12 rounded-3xl overflow-hidden border border-brand-gold/35 gold-glow" id="boutique-hero-banner">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img
          referrerPolicy="no-referrer"
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200"
          alt="Premium Luxury Cologne"
          className="w-full h-[320px] object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-16 text-white max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-4 w-fit">
            <Sparkles size={12} />
            <span>EXQUISITE STUDIO COUTURE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-brand-cream-dark leading-tight">
            THE ESSENCE OF <span className="font-serif italic font-extrabold text-brand-gold block mt-1">ABSOLUTE LUXURY</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-cream-dark/80 mt-4 leading-relaxed max-w-lg font-light">
            Indulge in our masterfully crafted, pure ingredient formulas designed to radiate your inner confidence. Each sillage narrates an unforgettable olfactory story.
          </p>
        </div>
      </div>

      {/* Main Boutique Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Sophisticated Filtering System */}
        <aside className="lg:col-span-1 space-y-8 bg-white border border-brand-gold/15 p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
            <div className="flex items-center space-x-2 text-brand-burgundy">
              <SlidersHorizontal size={16} className="text-brand-gold" />
              <h2 className="font-serif text-sm font-bold tracking-wider uppercase">Filter Catalog</h2>
            </div>
            {(searchQuery || selectedGender !== "All" || selectedFamily !== "All" || selectedOccasion !== "All" || priceRange !== 15000 || sortBy !== "featured") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGender("All");
                  setSelectedFamily("All");
                  setSelectedOccasion("All");
                  setPriceRange(15000);
                  setSortBy("featured");
                }}
                className="text-[10px] tracking-wider uppercase font-bold text-brand-gold hover:text-brand-burgundy transition"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Search Collection</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs py-3 pl-10 pr-4 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-burgundy transition-all"
              />
              <Search size={14} className="absolute left-3.5 top-3.5 text-brand-burgundy/50" />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Scent Profile</label>
            <div className="flex flex-wrap gap-1.5">
              {["All", "Men", "Women", "Unisex"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    selectedGender === g
                      ? "bg-brand-burgundy text-brand-gold shadow-sm"
                      : "bg-brand-cream border border-brand-gold/15 text-brand-burgundy hover:bg-brand-gold/5"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Fragrance Family Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Fragrance Family</label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full text-xs py-3 px-3 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-burgundy"
            >
              {families.map((fam) => (
                <option key={fam} value={fam}>
                  {fam === "All" ? "All Fragrance Families" : fam}
                </option>
              ))}
            </select>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Desired Occasion</label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full text-xs py-3 px-3 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-burgundy"
            >
              {occasions.map((occ) => (
                <option key={occ} value={occ}>
                  {occ === "All" ? "All Occasions" : occ}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60">
              <span>Price Range</span>
              <span className="text-brand-burgundy font-extrabold text-xs font-mono">Up to Ksh {priceRange}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-brand-gold/30 rounded-lg appearance-none cursor-pointer accent-brand-burgundy"
            />
            <div className="flex justify-between text-[9px] font-bold font-mono text-brand-burgundy/50">
              <span>Ksh 1000</span>
              <span>Ksh 15000</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Product Catalog Grid */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Sorter Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border-b border-brand-gold/15 pb-4">
            <p className="text-xs font-medium text-brand-burgundy/70">
              Displaying <strong className="font-bold text-brand-burgundy">{filteredProducts.length}</strong> elite formulations
            </p>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-burgundy/60">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold py-2 px-3 bg-white border border-brand-gold/20 rounded-lg focus:outline-none focus:border-brand-burgundy"
              >
                <option value="featured">Featured Curations</option>
                <option value="bestseller">Best Sellers First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <SlidersHorizontal size={40} className="text-brand-gold/40" />
              <div>
                <p className="font-serif text-lg font-bold text-brand-burgundy">No Matching Curations Found</p>
                <p className="text-xs text-brand-burgundy/60 mt-1 max-w-sm">We couldn't find fragrances matching your specific filter criteria. Try relaxing your filters or typing different notes.</p>
              </div>
            </div>
          ) : (
            /* Product Card Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const isFavorite = wishlist.some((w) => w.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    className="group relative flex flex-col bg-white border border-brand-gold/10 rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {/* Badge */}
                    {prod.bestSeller && (
                      <span className="absolute top-4 left-4 z-10 bg-brand-burgundy text-brand-gold border border-brand-gold/30 px-2.5 py-1 rounded text-[8px] font-extrabold uppercase tracking-widest">
                        Best Seller
                      </span>
                    )}
                    {prod.newArrival && !prod.bestSeller && (
                      <span className="absolute top-4 left-4 z-10 bg-brand-gold text-brand-burgundy border border-brand-burgundy/10 px-2.5 py-1 rounded text-[8px] font-extrabold uppercase tracking-widest">
                        New Arrival
                      </span>
                    )}

                    {/* Favorite Trigger */}
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md bg-white/70 shadow-sm hover:scale-110 transition`}
                    >
                      <Heart size={15} className={isFavorite ? "fill-red-600 text-red-600" : "text-brand-burgundy"} />
                    </button>

                    {/* Product Image Stage */}
                    <div className="relative aspect-square overflow-hidden bg-brand-cream/30 p-4 flex items-center justify-center border-b border-brand-gold/10">
                      <img
                        referrerPolicy="no-referrer"
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-brand-burgundy/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2.5 transition duration-300">
                        <button
                          onClick={() => openProductDetails(prod)}
                          className="flex items-center space-x-1 py-2.5 px-4 bg-brand-cream text-brand-burgundy rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg hover:bg-brand-gold transition-colors duration-300"
                        >
                          <Eye size={13} />
                          <span>Discover</span>
                        </button>
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-brand-gold-dark font-extrabold uppercase tracking-widest">
                          <span>{prod.brand}</span>
                          <span>{prod.gender}</span>
                        </div>
                        <h3
                          onClick={() => openProductDetails(prod)}
                          className="font-serif text-base font-bold text-brand-burgundy mt-1.5 cursor-pointer hover:text-brand-gold transition line-clamp-1"
                        >
                          {prod.name}
                        </h3>
                        <p className="text-[10px] font-medium text-brand-burgundy/60 mt-0.5 uppercase tracking-wide">
                          {prod.fragranceFamily} Family • {prod.occasion.slice(0, 2).join(", ")}
                        </p>
                        
                        {/* Notes Snippet */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {prod.notes.top.slice(0, 3).map((n) => (
                            <span key={n} className="text-[8px] tracking-wider uppercase font-extrabold text-brand-burgundy px-2 py-0.5 bg-brand-gold/10 rounded">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 border-t border-brand-gold/10 pt-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-extrabold text-brand-burgundy font-mono">Ksh {prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-xs text-brand-burgundy/40 line-through font-mono">Ksh {prod.price}</span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(prod, "100ml", 1)}
                          className="p-2.5 bg-brand-cream border border-brand-gold/30 rounded-full text-brand-burgundy hover:bg-brand-burgundy hover:text-brand-gold hover:border-brand-burgundy transition-all duration-300"
                        >
                          <ShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Product Detailed Overlay Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" id="product-detail-modal">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-brand-cream border border-brand-gold/30 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-zoom-in z-10 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left: Product Images Display */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-gold/15 bg-white overflow-y-auto">
              <div>
                {/* Active Image with Magnifier Zoom */}
                <div
                  className="relative aspect-square rounded-2xl overflow-hidden border border-brand-gold/10 bg-brand-cream/25 cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={activeDetailImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain transition-transform duration-100"
                    style={zoomStyle}
                  />
                </div>

                {/* Secondary Image Carousel */}
                <div className="flex space-x-3 mt-4">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border p-0.5 bg-white ${
                        activeDetailImage === img ? "border-brand-burgundy scale-105" : "border-brand-gold/20"
                      } transition`}
                    >
                      <img referrerPolicy="no-referrer" src={img} alt="" className="w-full h-full object-contain rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Notes Breakdown Graphic */}
              <div className="mt-8 border-t border-brand-gold/15 pt-6">
                <h4 className="font-serif text-xs font-bold text-brand-burgundy tracking-widest uppercase mb-4 flex items-center space-x-1.5">
                  <Sparkles size={12} className="text-brand-gold" />
                  <span>The Olfactory Pyramid</span>
                </h4>
                <div className="space-y-3.5">
                  <div className="flex items-start space-x-4 bg-brand-cream/40 p-2.5 rounded-xl border border-brand-gold/10">
                    <span className="text-[9px] font-extrabold uppercase text-brand-gold-dark tracking-widest w-16 pt-0.5">Top Notes</span>
                    <p className="text-xs font-medium text-brand-burgundy/80 leading-relaxed">
                      {selectedProduct.notes.top.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-start space-x-4 bg-brand-cream/40 p-2.5 rounded-xl border border-brand-gold/10">
                    <span className="text-[9px] font-extrabold uppercase text-brand-gold-dark tracking-widest w-16 pt-0.5">Heart Notes</span>
                    <p className="text-xs font-medium text-brand-burgundy/80 leading-relaxed">
                      {selectedProduct.notes.middle.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-start space-x-4 bg-brand-cream/40 p-2.5 rounded-xl border border-brand-gold/10">
                    <span className="text-[9px] font-extrabold uppercase text-brand-gold-dark tracking-widest w-16 pt-0.5">Base Notes</span>
                    <p className="text-xs font-medium text-brand-burgundy/80 leading-relaxed">
                      {selectedProduct.notes.base.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Product Specs */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center text-[10px] text-brand-gold-dark font-extrabold uppercase tracking-widest">
                  <span>{selectedProduct.brand} • {selectedProduct.gender}</span>
                  <button onClick={() => setSelectedProduct(null)} className="text-brand-burgundy hover:text-brand-gold text-lg font-bold">✕</button>
                </div>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2">{selectedProduct.name}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center text-amber-500 space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(selectedProduct.rating) ? "fill-amber-500" : "text-gray-300"} />
                    ))}
                    <span className="text-xs font-bold text-brand-burgundy ml-1.5">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-brand-burgundy/30">|</span>
                  <span className="text-xs font-medium text-brand-burgundy/60">{selectedProduct.reviewsCount} verified reviews</span>
                </div>

                <div className="flex items-baseline space-x-3.5 mt-5">
                  <span className="text-2xl font-extrabold text-brand-burgundy font-mono">Ksh {selectedProduct.discountPrice || selectedProduct.price}</span>
                  {selectedProduct.discountPrice && (
                    <span className="text-base text-brand-burgundy/40 line-through font-mono">Ksh {selectedProduct.price}</span>
                  )}
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded tracking-wider uppercase border border-green-200">
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} bottles in stock` : "Out of stock"}
                  </span>
                </div>

                <p className="text-xs text-brand-burgundy/85 leading-relaxed mt-4 font-light">
                  {selectedProduct.description}
                </p>

                {/* Size Selection */}
                <div className="space-y-2 mt-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block">Select Size</span>
                  <div className="flex space-x-2">
                    {selectedProduct.size.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                          selectedSize === sz
                            ? "bg-brand-burgundy text-brand-gold border border-brand-burgundy shadow-sm"
                            : "bg-white border border-brand-gold/20 text-brand-burgundy hover:bg-brand-gold/5"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social Sharing */}
                <div className="mt-6 pt-4 border-t border-brand-gold/15">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 block mb-3">Share With Friends</span>
                  <div className="flex space-x-3">
                    <a
                      href={`https://wa.me/?text=Check%20out%20${encodeURIComponent(selectedProduct.name)}%20on%20D%26E%20Essentials!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-burgundy hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(selectedProduct.name)}%20at%20D%26E%20Essentials!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-burgundy hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition"
                      title="Share on X (Twitter)"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-burgundy hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition"
                      title="Share on Facebook"
                    >
                      <Facebook size={16} />
                    </a>
                  </div>
                </div>

                {/* Ingredients Accordeon Panel */}
                <div className="mt-6 bg-brand-cream-dark/50 p-4 rounded-xl border border-brand-gold/15">
                  <h5 className="text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 flex items-center space-x-1 mb-2">
                    <Info size={12} className="text-brand-gold" />
                    <span>Ingredients and Crafting</span>
                  </h5>
                  <p className="text-[10px] text-brand-burgundy/75 leading-relaxed">
                    {selectedProduct.ingredients.join(", ")}
                  </p>
                </div>
              </div>

              {/* Purchase Box */}
              <div className="mt-8 border-t border-brand-gold/15 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-brand-gold/30 rounded-full bg-white text-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 hover:text-brand-gold font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 hover:text-brand-gold font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize, quantity);
                      setSuccessAddAlert(`Added ${quantity}x ${selectedProduct.name} (${selectedSize}) to your collection!`);
                      setTimeout(() => setSuccessAddAlert(null), 3000);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-brand-burgundy text-brand-gold rounded-full font-serif text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition-colors duration-300 shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:border-transparent"
                  >
                    <ShoppingCart size={15} />
                    <span>Acquire Fragrance</span>
                  </button>
                </div>
              </div>

              {/* Related Duo cross-sell recommendation */}
              {getRelatedProducts(selectedProduct).length > 0 && (
                <div className="mt-6 border-t border-brand-gold/15 pt-5">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-brand-burgundy/60 mb-3">
                    <span>Masterpiece Pairings</span>
                    <span className="text-brand-gold text-[9px] font-bold tracking-normal uppercase">Bundle & Save</span>
                  </div>
                  {getRelatedProducts(selectedProduct).slice(0, 1).map((pair) => (
                    <div key={pair.id} className="flex items-center justify-between bg-brand-cream-dark/30 border border-brand-gold/10 p-3 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <img referrerPolicy="no-referrer" src={pair.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-brand-gold/15 bg-white p-0.5" />
                        <div>
                          <p className="text-xs font-bold text-brand-burgundy line-clamp-1">{pair.name}</p>
                          <p className="text-[9px] text-brand-gold-dark font-semibold uppercase mt-0.5">Complimentary Match</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addFrequentlyBoughtBundle(selectedProduct, pair)}
                        className="py-1.5 px-3 bg-brand-burgundy text-brand-gold text-[9px] font-extrabold uppercase tracking-widest rounded-lg hover:bg-brand-burgundy-light transition"
                      >
                        Acquire Duo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
