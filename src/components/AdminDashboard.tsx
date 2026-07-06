import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { 
  TrendingUp, BarChart3, ShoppingBag, Users, Layers, Settings, FileSpreadsheet, 
  RefreshCw, CheckCircle2, ChevronRight, Folder, Image, Trash2, Edit, Plus, Eye, DollarSign
} from "lucide-react";
import { Order, Product, BlogPost, MarketingCampaign } from "../types";
import { LUXURY_PRODUCTS, MARKETING_CAMPAIGNS } from "../data";

interface AdminDashboardProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: string) => void;
  products: Product[];
  updateProductStock: (productId: string, stock: number) => void;
  deleteProduct: (productId: string) => void;
  createProduct: () => void;
  campaigns: MarketingCampaign[];
  addCampaign: (campaign: MarketingCampaign) => void;
  newsletterSubs: string[];
  contactLeads: Array<{ name: string; email: string; message: string; date: string }>;
  whatsappCount: number;
  refreshCMS: () => void;
}

export default function AdminDashboard({
  orders,
  updateOrderStatus,
  products,
  updateProductStock,
  deleteProduct,
  createProduct,
  campaigns,
  addCampaign,
  newsletterSubs,
  contactLeads,
  whatsappCount,
  refreshCMS
}: AdminDashboardProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"overview" | "orders" | "inventory" | "coupons" | "cms" | "crm" | "media">("overview");

  // Coupon Generator State
  const [newCampaignCode, setNewCampaignCode] = useState("");
  const [newCampaignValue, setNewCampaignValue] = useState<number>(20);
  const [newCampaignType, setNewCampaignType] = useState<"percentage" | "fixed">("percentage");
  const [newCampaignDesc, setNewCampaignDesc] = useState("");

  // Media Manager Dummy folder tree state
  const [selectedFolder, setSelectedFolder] = useState("fragrance_assets");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([
    { name: "oud_mystique_hero.png", size: "2.4 MB", date: "2026-07-01", type: "image/png" },
    { name: "rouge_seduction_glow.jpg", size: "1.8 MB", date: "2026-07-02", type: "image/jpeg" },
    { name: "santal_imperial_minimal.png", size: "3.1 MB", date: "2026-07-03", type: "image/png" },
    { name: "d&e_brand_guidelines.pdf", size: "14.2 MB", date: "2026-06-15", type: "pdf" }
  ]);

  // Recharts Chart Mock Dataset
  const SALES_CHARTS_DATA = [
    { date: "Jun 28", revenue: 1450, orders: 9 },
    { date: "Jun 29", revenue: 2100, orders: 14 },
    { date: "Jun 30", revenue: 1800, orders: 11 },
    { date: "Jul 01", revenue: 3400, orders: 20 },
    { date: "Jul 02", revenue: 2900, orders: 18 },
    { date: "Jul 03", revenue: 4100, orders: 24 },
    { date: "Jul 04", revenue: 5400, orders: 31 } // Today
  ];

  // Aggregate stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 12450; // Plus baseline mock historical sales
  const totalOrdersCount = orders.length + 84;
  const avgOrderVal = Math.round(totalRevenue / totalOrdersCount) || 165;
  const totalCustomersCount = newsletterSubs.length + 42;

  // Handler for adding a new promo campaign code
  const handleCreateCoupon = () => {
    if (!newCampaignCode.trim()) return;
    const newCamp: MarketingCampaign = {
      id: `c_${Math.floor(Math.random() * 1000)}`,
      title: newCampaignDesc || `${newCampaignValue}% Promotional discount`,
      description: newCampaignDesc || `Save on luxury perfumes using ${newCampaignCode.toUpperCase()}`,
      code: newCampaignCode.trim().toUpperCase(),
      discountValue: newCampaignValue,
      discountType: newCampaignType,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "active"
    };

    addCampaign(newCamp);
    setNewCampaignCode("");
    setNewCampaignDesc("");
    setNewCampaignValue(20);
  };

  // Drag and drop simulator triggers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFiles(prev => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toISOString().split("T")[0],
          type: file.type
        }
      ]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="admin-dashboard-root">
      
      {/* Admin Title Dashboard header */}
      <div className="border-b border-brand-gold/15 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-gold-dark">Back Office Command Space</span>
          <h1 className="font-serif text-2xl font-bold text-brand-burgundy mt-1">D & E Essentials Studio Controller</h1>
        </div>
        
        {/* Navigation Sidebar Subtabs */}
        <div className="flex flex-wrap gap-1 bg-brand-cream-dark/50 border border-brand-gold/15 p-1 rounded-xl">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "orders", label: "Logistics", icon: ShoppingBag },
            { id: "inventory", label: "Inventory", icon: Layers },
            { id: "coupons", label: "Marketing", icon: TrendingUp },
            { id: "crm", label: "CRM & Leads", icon: Users },
            { id: "media", label: "Media Manager", icon: Folder }
          ].map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setActiveAdminSubTab(v.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                  activeAdminSubTab === v.id
                    ? "bg-brand-burgundy text-brand-gold"
                    : "text-brand-burgundy/80 hover:bg-brand-gold/5"
                }`}
              >
                <Icon size={12} />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW A: OVERVIEW AND CHARTS */}
      {activeAdminSubTab === "overview" && (
        <div className="space-y-8 animate-slide-in" id="admin-overview-panel">
          
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-brand-gold/15 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Total Revenue</span>
                <strong className="block text-lg font-mono font-extrabold text-brand-burgundy mt-1">Ksh {totalRevenue.toLocaleString()}</strong>
              </div>
              <div className="p-3 bg-brand-cream rounded-full border border-brand-gold/10 text-brand-gold-dark"><DollarSign size={18} /></div>
            </div>

            <div className="bg-white border border-brand-gold/15 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Studio Orders</span>
                <strong className="block text-lg font-mono font-extrabold text-brand-burgundy mt-1">{totalOrdersCount}</strong>
              </div>
              <div className="p-3 bg-brand-cream rounded-full border border-brand-gold/10 text-brand-gold-dark"><ShoppingBag size={18} /></div>
            </div>

            <div className="bg-white border border-brand-gold/15 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Average Order</span>
                <strong className="block text-lg font-mono font-extrabold text-brand-burgundy mt-1">Ksh {avgOrderVal}</strong>
              </div>
              <div className="p-3 bg-brand-cream rounded-full border border-brand-gold/10 text-brand-gold-dark"><TrendingUp size={18} /></div>
            </div>

            <div className="bg-white border border-brand-gold/15 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">CRM Audience</span>
                <strong className="block text-lg font-mono font-extrabold text-brand-burgundy mt-1">{totalCustomersCount}</strong>
              </div>
              <div className="p-3 bg-brand-cream rounded-full border border-brand-gold/10 text-brand-gold-dark"><Users size={18} /></div>
            </div>
          </div>

          {/* Recharts Graphical Chart Area */}
          <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy">Settlement Revenue Trend</h2>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase tracking-widest flex items-center">
                <TrendingUp size={11} className="mr-1.5" /> +14.2% Growth
              </span>
            </div>
            
            <div className="h-[280px] w-full" id="admin-revenue-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_CHARTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A880" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C5A880" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE4D4" />
                  <XAxis dataKey="date" stroke="#917551" style={{ fontSize: "9px", fontWeight: "bold" }} />
                  <YAxis stroke="#917551" style={{ fontSize: "9px", fontWeight: "bold" }} />
                  <Tooltip contentStyle={{ background: "#FDF9F3", border: "1px solid #C5A880", borderRadius: "10px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3F0A14" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Overview Summary */}
          <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-brand-gold/10 pb-4">
              <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy">Active Dispatch Queue</h2>
              <button onClick={() => setActiveAdminSubTab("orders")} className="text-[9px] uppercase tracking-widest font-extrabold text-brand-gold flex items-center">
                <span>Dispatch Manager</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="divide-y divide-brand-gold/10">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-gold/15 flex items-center justify-center font-bold text-xs text-brand-burgundy">ORD</div>
                    <div>
                      <p className="text-xs font-extrabold text-brand-burgundy">{ord.id}</p>
                      <p className="text-[10px] text-brand-burgundy/50 font-medium">Recipient: {ord.shippingAddress.name} • Settle: {ord.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-3.5">
                    <div>
                      <p className="text-xs font-mono font-bold text-brand-burgundy">Ksh {ord.total}</p>
                      <span className="text-[9px] font-extrabold uppercase text-amber-700">{ord.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: LOGISTICS AND STATUS UPDATER */}
      {activeAdminSubTab === "orders" && (
        <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-6 animate-slide-in" id="admin-orders-panel">
          <div className="border-b border-brand-gold/10 pb-4 flex justify-between items-center">
            <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy">Dispatch Stepper Logistics</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} className="text-brand-gold/40 mx-auto" />
              <p className="text-xs text-brand-burgundy/60 font-medium mt-2">Active queue currently empty. Place simulated orders on checkout page!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-brand-gold/15">
                <thead>
                  <tr className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60">
                    <th className="py-4 px-3">Order ID</th>
                    <th className="py-4 px-3">Customer Coordinates</th>
                    <th className="py-4 px-3">Items Count</th>
                    <th className="py-4 px-3">Total Payable</th>
                    <th className="py-4 px-3">Active status step</th>
                    <th className="py-4 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10 font-medium text-brand-burgundy">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-cream-dark/20 transition">
                      <td className="py-4 px-3 font-mono font-bold">{ord.id}</td>
                      <td className="py-4 px-3">
                        <p className="font-bold">{ord.shippingAddress.name}</p>
                        <p className="text-[10px] text-brand-burgundy/50">{ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                      </td>
                      <td className="py-4 px-3">{ord.items.length} items</td>
                      <td className="py-4 px-3 font-mono font-bold">Ksh {ord.total}</td>
                      <td className="py-4 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                          ord.status === "Paid" || ord.status === "Delivered"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {/* Selector updating order status on real-time */}
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="py-1.5 px-2 bg-brand-cream border border-brand-gold/30 rounded focus:outline-none text-[10px] font-bold uppercase tracking-wider text-brand-burgundy"
                        >
                          {["Pending", "Awaiting Payment", "Paid", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded"].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW C: PRODUCT INVENTORY ADJUSTER */}
      {activeAdminSubTab === "inventory" && (
        <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-6 animate-slide-in" id="admin-inventory-panel">
          <div className="border-b border-brand-gold/10 pb-4 flex justify-between items-center">
            <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy">Studio Stock Records</h2>
            <div className="flex gap-2">
              <button onClick={refreshCMS} className="text-[9px] uppercase tracking-widest font-extrabold text-brand-gold flex items-center hover:text-brand-burgundy transition">
                <RefreshCw size={12} className="mr-1" /> Refresh
              </button>
              <button onClick={createProduct} className="text-[9px] uppercase tracking-widest font-extrabold text-brand-gold flex items-center hover:text-brand-burgundy transition">
                <Plus size={12} className="mr-1" /> New Product
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-brand-gold/15">
              <thead>
                <tr className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/60">
                  <th className="py-4 px-3">Product Name</th>
                  <th className="py-4 px-3">Fragrance Family</th>
                  <th className="py-4 px-3 font-mono">Retail Price</th>
                  <th className="py-4 px-3 text-center">Remaining Stock</th>
                  <th className="py-4 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/10 font-medium text-brand-burgundy">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-cream-dark/20 transition">
                    <td className="py-4 px-3 flex items-center space-x-3">
                      <img referrerPolicy="no-referrer" src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-brand-gold/10 bg-white p-0.5" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-[10px] text-brand-burgundy/50 font-mono">SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 uppercase tracking-wider text-[10px] font-bold">{p.fragranceFamily}</td>
                    <td className="py-4 px-3 font-mono font-bold">Ksh {p.price}</td>
                    <td className="py-4 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.stock > 10 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        {p.stock} bottles
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="inline-flex items-center space-x-2 justify-end w-full">
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateProductStock(p.id, Number(e.target.value))}
                          className="w-16 text-center text-xs font-bold py-1 bg-brand-cream border border-brand-gold/30 rounded focus:outline-none"
                          title="Update Stock"
                        />
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW D: MARKETING CAMPAIGN & PROMOS */}
      {activeAdminSubTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in" id="admin-marketing-panel">
          
          {/* Left: Create Code */}
          <div className="lg:col-span-1 bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm h-fit space-y-5">
            <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy border-b border-brand-gold/10 pb-3">Mint Promo Campaign</h2>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. VIP20"
                  value={newCampaignCode}
                  onChange={(e) => setNewCampaignCode(e.target.value)}
                  className="w-full py-2.5 px-3 border border-brand-gold/20 bg-brand-cream rounded-xl focus:outline-none focus:border-brand-burgundy font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Discount Value</label>
                  <input
                    type="number"
                    value={newCampaignValue}
                    onChange={(e) => setNewCampaignValue(Number(e.target.value))}
                    className="w-full py-2.5 px-3 border border-brand-gold/20 bg-brand-cream rounded-xl focus:outline-none focus:border-brand-burgundy font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Value Type</label>
                  <select
                    value={newCampaignType}
                    onChange={(e) => setNewCampaignType(e.target.value as any)}
                    className="w-full py-2.5 px-3 border border-brand-gold/20 bg-brand-cream rounded-xl focus:outline-none focus:border-brand-burgundy text-xs font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Campaign Description</label>
                <input
                  type="text"
                  placeholder="e.g. Summer special VIP 20% discount"
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  className="w-full py-2.5 px-3 border border-brand-gold/20 bg-brand-cream rounded-xl focus:outline-none"
                />
              </div>

              <button
                onClick={handleCreateCoupon}
                disabled={!newCampaignCode}
                className="w-full py-2.5 bg-brand-burgundy text-brand-gold font-serif text-xs font-bold uppercase tracking-wider hover:bg-brand-burgundy-light transition rounded-full shadow"
              >
                Mint Coupon
              </button>
            </div>
          </div>

          {/* Right: Listed Campaigns */}
          <div className="lg:col-span-2 bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy border-b border-brand-gold/10 pb-3">Active Promotional Registers</h2>
            
            <div className="divide-y divide-brand-gold/10">
              {campaigns.map((c) => (
                <div key={c.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-brand-burgundy bg-brand-gold/15 px-2.5 py-0.5 rounded tracking-wide uppercase border border-brand-gold/30">
                        {c.code}
                      </span>
                      <span className="text-[9px] font-extrabold text-green-700 uppercase bg-green-50 border border-green-200 px-2 rounded">
                        Active
                      </span>
                    </div>
                    <p className="font-bold text-brand-burgundy mt-2">{c.title}</p>
                    <p className="text-[10px] text-brand-burgundy/60 mt-0.5 leading-relaxed">{c.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-brand-burgundy">
                      {c.discountType === "percentage" ? `${c.discountValue}% Off` : `Ksh ${c.discountValue} Off`}
                    </span>
                    <p className="text-[9px] text-brand-burgundy/40 uppercase mt-1">Exp: {c.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: CRM LEADS & INTEGRATIONS */}
      {activeAdminSubTab === "crm" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in" id="admin-crm-panel">
          
          {/* Left Column: Metrics & Counts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm text-center space-y-4">
              <span className="text-[9px] font-bold tracking-widest uppercase text-brand-burgundy/50 block">Direct WhatsApp Inquiries</span>
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-lg mx-auto shadow font-bold">
                {whatsappCount}
              </div>
              <p className="text-[10px] text-brand-burgundy/60 font-medium leading-relaxed">
                Aggregated counts of users clicking the WhatsApp Business floating chat module for order negotiations.
              </p>
            </div>

            <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
              <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy border-b border-brand-gold/10 pb-3">Newsletter Subscriptions ({newsletterSubs.length})</h2>
              <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                {newsletterSubs.map((email, idx) => (
                  <div key={idx} className="p-2.5 bg-brand-cream/40 rounded-xl border border-brand-gold/10 text-xs font-medium text-brand-burgundy font-mono text-center">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Log */}
          <div className="lg:col-span-2 bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy border-b border-brand-gold/10 pb-3">CRM Qualified Inquiries Log ({contactLeads.length})</h2>
            
            <div className="divide-y divide-brand-gold/10">
              {contactLeads.map((lead, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-brand-burgundy text-[13px]">{lead.name}</span>
                    <span className="text-[9px] font-bold font-mono text-brand-burgundy/40">{lead.date}</span>
                  </div>
                  <p className="text-[10px] font-mono text-brand-gold-dark font-semibold">{lead.email}</p>
                  <p className="text-xs text-brand-burgundy/80 leading-relaxed bg-brand-cream/35 border border-brand-gold/10 p-3 rounded-xl">
                    &ldquo;{lead.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW F: MEDIA MANAGER WITH DRAG AND DROP */}
      {activeAdminSubTab === "media" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-slide-in" id="admin-media-panel">
          
          {/* Folders left */}
          <div className="lg:col-span-1 bg-white border border-brand-gold/15 p-5 rounded-3xl h-fit space-y-4">
            <h3 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy border-b border-brand-gold/10 pb-2">Directories</h3>
            <div className="space-y-1.5 text-xs font-semibold text-brand-burgundy">
              {[
                { name: "fragrance_assets", label: "Fragrance Images" },
                { name: "campaign_banners", label: "Campaign Banners" },
                { name: "editorial_reviews", label: "Editorial Materials" }
              ].map((f) => (
                <div
                  key={f.name}
                  onClick={() => setSelectedFolder(f.name)}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl cursor-pointer ${
                    selectedFolder === f.name ? "bg-brand-burgundy text-brand-gold" : "hover:bg-brand-cream"
                  }`}
                >
                  <Folder size={14} className={selectedFolder === f.name ? "text-brand-gold" : "text-brand-gold-dark"} />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drag and Drop uploads right */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* DRAG AND DROP ZONE */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                dragActive ? "border-brand-burgundy bg-brand-cream" : "border-brand-gold/30 hover:border-brand-gold"
              }`}
            >
              <Image size={32} className="text-brand-gold-dark animate-bounce" />
              <div>
                <p className="font-serif text-xs font-bold text-brand-burgundy uppercase">Drag and drop assets here</p>
                <p className="text-[10px] text-brand-burgundy/60 mt-1">Accepts JPG, PNG, PDF, or video files up to 25MB.</p>
              </div>
              <span className="text-[9px] font-bold text-brand-gold uppercase bg-brand-burgundy border border-brand-gold/30 px-3 py-1.5 rounded-full shadow">
                Browse Files
              </span>
            </div>

            {/* Folder Files Grid */}
            <div className="bg-white border border-brand-gold/15 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-serif text-xs font-bold tracking-widest uppercase text-brand-burgundy">Listed Media Assets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-brand-gold/10 p-3.5 rounded-2xl bg-brand-cream/25">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="p-2.5 bg-brand-cream rounded-lg border border-brand-gold/10 text-brand-gold-dark"><Image size={15} /></div>
                      <div>
                        <p className="font-bold text-brand-burgundy line-clamp-1">{file.name}</p>
                        <p className="text-[9px] text-brand-burgundy/50 font-mono">{file.size} • Uploaded {file.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
