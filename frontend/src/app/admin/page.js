"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser }   from "../../context/UserContext";
import { useToast }  from "../../context/ToastContext";
import { productApi, orderApi, couponApi } from "../../lib/api";

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm" style={{ color: "#6b7280" }}>{label}</p>
          <p className="text-2xl font-black" style={{ color: "var(--green-900)" }}>{value}</p>
          {sub && <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

// ── Status badge ──────────────────────────────────────────────
const STATUS_COLORS = {
  pending:    { bg: "#fef3c7", color: "#92400e" },
  processing: { bg: "#dbeafe", color: "#1e40af" },
  shipped:    { bg: "#ede9fe", color: "#5b21b6" },
  delivered:  { bg: "#d1fae5", color: "#065f46" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b" },
};
function StatusBadge({ status }) {
  const sc = STATUS_COLORS[status?.toLowerCase()] || { bg: "#f3f4f6", color: "#4b5563" };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-black capitalize"
      style={{ background: sc.bg, color: sc.color }}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useUser();
  const toast = useToast();

  const [activeTab,   setActiveTab]   = useState("analytics");
  const [products,    setProducts]    = useState([]);
  const [orders,      setOrders]      = useState([]);
  const [coupons,     setCoupons]     = useState([]);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortOrder,   setSortOrder]   = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isEditing,      setIsEditing]      = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview,   setImagePreview]   = useState(null);
  const [couponForm, setCouponForm] = useState({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
  const [couponAdding, setCouponAdding] = useState(false);

  // ── Auth guard ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/"); return; }
    refreshAll();
  }, [user, loading]);

  const refreshAll = useCallback(() => {
    productApi.getAll().then(setProducts).catch(() => {});
    orderApi.getAll().then(setOrders).catch(() => {});
    couponApi.getAll().then(setCoupons).catch(() => {});
  }, []);

  // ── Analytics calculations ────────────────────────────────
  const revenue      = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const deliveredCnt = orders.filter((o) => o.status === "delivered").length;
  const pendingCnt   = orders.filter((o) => o.status === "pending").length;
  const uniqueEmails = new Set(orders.map((o) => o.customer?.email)).size;

  // Revenue by day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-IN", { weekday: "short" });
  });
  const revenueByDay = last7.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    return orders
      .filter((o) => new Date(o.createdAt).toDateString() === dayStr)
      .reduce((s, o) => s + Number(o.total), 0);
  });
  const maxRev = Math.max(...revenueByDay, 1);

  // ── Product management ─────────────────────────────────────
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    try {
      await productApi.delete(id);
      toast.success("Product deleted");
      refreshAll();
    } catch (err) { toast.error("Error: " + err.message); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImagePreview(product.imageUrl);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await productApi.update(editingProduct._id, formData);
      toast.success("Product updated!");
      setIsEditing(false);
      setEditingProduct(null);
      refreshAll();
    } catch (err) { toast.error("Error: " + err.message); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      refreshAll();
    } catch (err) { toast.error("Error: " + err.message); }
  };

  // ── Coupon management ──────────────────────────────────────
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponAdding(true);
    try {
      await couponApi.create(couponForm);
      toast.success(`Coupon ${couponForm.code} created!`);
      setCouponForm({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
      refreshAll();
    } catch (err) { toast.error(err.message || "Error creating coupon"); }
    finally { setCouponAdding(false); }
  };

  const handleToggleCoupon = async (id, isActive) => {
    try {
      await couponApi.toggle(id);
      toast.success(isActive ? "Coupon deactivated" : "Coupon activated");
      refreshAll();
    } catch (err) { toast.error("Error"); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await couponApi.delete(id);
      toast.success("Coupon deleted");
      refreshAll();
    } catch (err) { toast.error("Error"); }
  };

  // Filters
  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice =
      filterPrice === "under100"  ? p.price < 100 :
      filterPrice === "100to500"  ? p.price >= 100 && p.price <= 500 :
      filterPrice === "over500"   ? p.price > 500 : true;
    return matchName && matchPrice;
  });
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "priceAsc"  ? a.price - b.price :
    sortOrder === "priceDesc" ? b.price - a.price :
    b._id.localeCompare(a._id)
  );
  const totalPages   = Math.ceil(sorted.length / itemsPerPage);
  const currentItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const TABS = [
    { id: "analytics",   label: "📊 Analytics" },
    { id: "orders",      label: `📦 Orders (${orders.length})` },
    { id: "products",    label: `🛍️ Products (${products.length})` },
    { id: "add-product", label: "➕ Add Product" },
    { id: "coupons",     label: `🏷️ Coupons (${coupons.length})` },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="text-center">
        <div className="skeleton w-16 h-16 rounded-full mx-auto mb-4" />
        <p style={{ color: "var(--green-700)" }}>Loading admin panel...</p>
      </div>
    </div>
  );
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: "var(--green-900)" }} className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <div>
            <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Paperbag Management Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>👤 {user.name}</span>
          <Link href="/">
            <button style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", padding: "7px 16px",
              borderRadius: 999, cursor: "pointer", fontWeight: 700, fontSize: 13,
            }}>
              ← Back to Site
            </button>
          </Link>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="px-6 py-3 flex gap-2 flex-wrap" style={{ background: "white", borderBottom: "1px solid var(--cream-dark)" }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: activeTab === id ? "var(--green-600)" : "var(--cream-dark)",
              color: activeTab === id ? "white" : "var(--green-800)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ══ Analytics Tab ══════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <StatCard icon="💰" label="Total Revenue"    value={`₹${revenue.toFixed(0)}`} sub="All orders"          color="#d1fae5" />
              <StatCard icon="📦" label="Total Orders"     value={orders.length}            sub={`${pendingCnt} pending`}  color="#dbeafe" />
              <StatCard icon="✅" label="Delivered"        value={deliveredCnt}             sub={`${Math.round(deliveredCnt / Math.max(orders.length, 1) * 100)}% rate`} color="#d1fae5" />
              <StatCard icon="👥" label="Customers"        value={uniqueEmails}             sub="Unique buyers"        color="#ede9fe" />
            </div>

            {/* Revenue chart (bar) */}
            <div className="card p-6">
              <h2 className="text-lg font-black mb-6" style={{ color: "var(--green-900)" }}>
                📈 Revenue — Last 7 Days
              </h2>
              <div className="flex items-end gap-3 h-40">
                {revenueByDay.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold" style={{ color: "var(--green-700)" }}>
                      {val > 0 ? `₹${val.toFixed(0)}` : ""}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxRev) * 120}px` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="w-full rounded-t-lg"
                      style={{ background: val > 0 ? "var(--green-500)" : "var(--cream-dark)", minHeight: 4 }}
                    />
                    <span className="text-xs" style={{ color: "#9ca3af" }}>{last7[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order status breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-black mb-4" style={{ color: "var(--green-900)" }}>Order Status Breakdown</h3>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => {
                  const cnt = orders.filter((o) => o.status === s).length;
                  const pct = Math.round(cnt / Math.max(orders.length, 1) * 100);
                  const sc  = STATUS_COLORS[s] || { bg: "#f3f4f6", color: "#4b5563" };
                  return (
                    <div key={s} className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold capitalize w-20" style={{ color: sc.color }}>{s}</span>
                      <div className="flex-1 h-2.5 rounded-full" style={{ background: "var(--cream-dark)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-2.5 rounded-full"
                          style={{ background: sc.color }}
                        />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ color: "#9ca3af" }}>{cnt}</span>
                    </div>
                  );
                })}
              </div>

              <div className="card p-6">
                <h3 className="font-black mb-4" style={{ color: "var(--green-900)" }}>Top Products by Orders</h3>
                {Object.entries(
                  orders.flatMap((o) => o.items || []).reduce((acc, item) => {
                    acc[item.name] = (acc[item.name] || 0) + item.quantity;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, qty], i) => (
                    <div key={name} className="flex items-center gap-3 mb-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: "var(--green-600)", flexShrink: 0 }}>{i + 1}</span>
                      <span className="flex-1 text-sm truncate" style={{ color: "#4b5563" }}>{name}</span>
                      <span className="text-xs font-bold" style={{ color: "var(--green-700)" }}>{qty} units</span>
                    </div>
                  ))}
                {orders.length === 0 && <p className="text-sm" style={{ color: "#9ca3af" }}>No orders yet</p>}
              </div>
            </div>

            {/* Recent orders */}
            <div className="card p-6">
              <h3 className="font-black mb-4" style={{ color: "var(--green-900)" }}>Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--cream-dark)" }}>
                      {["Order ID", "Customer", "Total", "Payment", "Status", "Date"].map((h) => (
                        <th key={h} className="text-left pb-3 px-2 font-bold text-xs" style={{ color: "#9ca3af" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id} style={{ borderBottom: "1px solid var(--cream-dark)" }}>
                        <td className="py-3 px-2 font-mono text-xs" style={{ color: "var(--green-700)" }}>
                          #{String(o._id).slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-2" style={{ color: "#4b5563" }}>{o.customer?.name}</td>
                        <td className="py-3 px-2 font-bold" style={{ color: "var(--green-700)" }}>₹{Number(o.total).toFixed(0)}</td>
                        <td className="py-3 px-2 text-xs">{o.paymentMethod === "razorpay" ? "💳 Online" : "🏠 COD"}</td>
                        <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                        <td className="py-3 px-2 text-xs" style={{ color: "#9ca3af" }}>
                          {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#9ca3af" }}>No orders yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ══ Orders Tab ═════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black" style={{ color: "var(--green-900)" }}>Manage Orders</h2>
            {orders.map((order) => (
              <div key={order._id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-black" style={{ color: "var(--green-900)" }}>
                      Order #{String(order._id).slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "var(--green-700)" }}>Customer</p>
                    <p style={{ color: "#4b5563" }}>{order.customer?.name}</p>
                    <p style={{ color: "#9ca3af" }} className="text-xs">{order.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "var(--green-700)" }}>Address</p>
                    <p style={{ color: "#4b5563" }} className="text-sm">
                      {order.customer?.address}, {order.customer?.city} {order.customer?.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "var(--green-700)" }}>Total</p>
                    <p className="font-black text-lg" style={{ color: "var(--green-700)" }}>₹{Number(order.total).toFixed(2)}</p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      {order.paymentMethod === "razorpay" ? "💳 Online" : "🏠 COD"}
                      {order.paymentStatus === "paid" && " · Paid ✓"}
                    </p>
                  </div>
                </div>
                {order.couponCode && (
                  <p className="text-xs mb-3 font-semibold" style={{ color: "#065f46" }}>
                    🏷️ Coupon: {order.couponCode} (−₹{order.discountAmount?.toFixed(2)})
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-xs font-bold" style={{ color: "var(--green-800)" }}>Update Status:</label>
                  <select
                    defaultValue={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: "1.5px solid var(--green-300)", background: "var(--cream)" }}
                  >
                    {["pending", "processing", "shipped", "out for delivery", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-3">📦</p>
                <p style={{ color: "#6b7280" }}>No orders yet</p>
              </div>
            )}
          </div>
        )}

        {/* ══ Products Tab ═══════════════════════════════════ */}
        {activeTab === "products" && (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1.5px solid var(--green-200)", minWidth: 180, background: "white" }}
              />
              <select
                value={filterPrice}
                onChange={(e) => { setFilterPrice(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1.5px solid var(--green-200)", background: "white" }}
              >
                <option value="all">All Prices</option>
                <option value="under100">Under ₹100</option>
                <option value="100to500">₹100 – ₹500</option>
                <option value="over500">Over ₹500</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: "1.5px solid var(--green-200)", background: "white" }}
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price Low → High</option>
                <option value="priceDesc">Price High → Low</option>
              </select>
            </div>

            <p className="mb-4 text-sm" style={{ color: "#6b7280" }}>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentItems.map((product) => (
                <div key={product._id} className="card overflow-hidden">
                  <div className="h-44 overflow-hidden" style={{ background: "var(--green-100)" }}>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-0.5" style={{ color: "var(--green-900)" }}>{product.name}</h3>
                    <p className="font-black text-lg mb-1" style={{ color: "var(--green-700)" }}>₹{product.price}</p>
                    <p className="text-sm line-clamp-2 mb-4" style={{ color: "#6b7280" }}>{product.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold transition"
                        style={{ background: "#dbeafe", color: "#1e40af", border: "none", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#bfdbfe")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#dbeafe")}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold transition"
                        style={{ background: "#fee2e2", color: "#991b1b", border: "none", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className="w-9 h-9 rounded-full font-bold text-sm transition"
                    style={{
                      background: currentPage === n ? "var(--green-600)" : "var(--cream-dark)",
                      color: currentPage === n ? "white" : "var(--green-800)",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ Add Product Tab ════════════════════════════════ */}
        {activeTab === "add-product" && <AddProductForm onSuccess={refreshAll} toast={toast} />}

        {/* ══ Coupons Tab ════════════════════════════════════ */}
        {activeTab === "coupons" && (
          <div className="space-y-8">
            {/* Create coupon form */}
            <div className="card p-6">
              <h2 className="text-lg font-black mb-5" style={{ color: "var(--green-900)" }}>
                🏷️ Create New Coupon
              </h2>
              <form onSubmit={handleCreateCoupon} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Code", name: "code", placeholder: "e.g. SUMMER20", type: "text" },
                  { label: "Discount Value", name: "discountValue", placeholder: "e.g. 20", type: "number" },
                  { label: "Min Order (₹)", name: "minOrderAmount", placeholder: "e.g. 500", type: "number" },
                  { label: "Max Uses", name: "maxUses", placeholder: "Leave blank = unlimited", type: "number" },
                  { label: "Expires", name: "expiresAt", placeholder: "", type: "date" },
                ].map(({ label, name, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--green-800)" }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={couponForm[name]}
                      onChange={(e) => setCouponForm((f) => ({ ...f, [name]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm((f) => ({ ...f, discountType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={couponAdding || !couponForm.code || !couponForm.discountValue}
                    className="btn-primary"
                  >
                    {couponAdding ? "Creating..." : "Create Coupon →"}
                  </button>
                </div>
              </form>
            </div>

            {/* Coupon list */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: "var(--cream-dark)" }}>
                <h3 className="font-black" style={{ color: "var(--green-900)" }}>
                  All Coupons ({coupons.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--cream-dark)" }}>
                      {["Code", "Type", "Value", "Min Order", "Used / Max", "Expires", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: "#6b7280" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => {
                      const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                      return (
                        <tr key={c._id} style={{ borderBottom: "1px solid var(--cream-dark)" }}>
                          <td className="px-4 py-3 font-black" style={{ color: "var(--green-800)", fontFamily: "monospace" }}>{c.code}</td>
                          <td className="px-4 py-3 text-xs capitalize" style={{ color: "#6b7280" }}>{c.discountType}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: "var(--green-700)" }}>
                            {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                            {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                            {c.usedCount} / {c.maxUses ?? "∞"}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: expired ? "#ef4444" : "#6b7280" }}>
                            {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                background: c.isActive && !expired ? "#d1fae5" : "#fee2e2",
                                color:      c.isActive && !expired ? "#065f46" : "#991b1b",
                              }}
                            >
                              {c.isActive && !expired ? "Active" : expired ? "Expired" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleCoupon(c._id, c.isActive)}
                                className="text-xs px-2 py-1 rounded-lg font-bold"
                                style={{
                                  background: c.isActive ? "#fef3c7" : "#d1fae5",
                                  color: c.isActive ? "#92400e" : "#065f46",
                                  border: "none", cursor: "pointer",
                                }}
                              >
                                {c.isActive ? "Disable" : "Enable"}
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(c._id)}
                                className="text-xs px-2 py-1 rounded-lg font-bold"
                                style={{ background: "#fee2e2", color: "#991b1b", border: "none", cursor: "pointer" }}
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {coupons.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: "#9ca3af" }}>No coupons yet. Create your first one above.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Product Modal ────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-black mb-5" style={{ color: "var(--green-900)" }}>Edit Product</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                {[
                  { name: "name",  label: "Name",  type: "text",   defaultValue: editingProduct?.name },
                  { name: "price", label: "Price (₹)", type: "number", defaultValue: editingProduct?.price, step: "0.01" },
                ].map(({ name, label, type, defaultValue, step }) => (
                  <div key={name}>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>{label}</label>
                    <input
                      name={name} type={type} defaultValue={defaultValue} step={step} required
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Description</label>
                  <textarea name="description" rows="3" defaultValue={editingProduct?.description}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Replace Image</label>
                  <input type="file" name="image" accept="image/*"
                    onChange={(e) => { const f = e.target.files[0]; if (f) setImagePreview(URL.createObjectURL(f)); }}
                    className="w-full text-sm"
                  />
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-2xl" />
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-full font-bold text-sm"
                    style={{ background: "var(--cream-dark)", color: "var(--green-800)", border: "none", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-3">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddProductForm({ onSuccess, toast }) {
  const [formData, setFormData] = React.useState({ name: "", price: "", description: "" });
  const [imageFile,    setImageFile]    = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",        formData.name);
      fd.append("price",       formData.price);
      fd.append("description", formData.description);
      if (imageFile) fd.append("image", imageFile);

      const result = await productApi.create(fd);
      if (result._id || result.name) {
        setFormData({ name: "", price: "", description: "" });
        setImageFile(null);
        setImagePreview(null);
        onSuccess();
        toast.success("Product added successfully! 🌿");
      } else {
        toast.error(result.message || "Error adding product");
      }
    } catch (err) { toast.error("Error: " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-8 max-w-2xl">
      <h2 className="text-xl font-black mb-6" style={{ color: "var(--green-900)" }}>Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Product Name</label>
          <input type="text" placeholder="e.g. Kraft Paper Bag - Large" required value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Price (₹)</label>
          <input type="number" step="0.01" placeholder="e.g. 149.00" required value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Description</label>
          <textarea placeholder="Describe your product..." required value={formData.description} rows="4"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
            style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>Product Image</label>
          <input type="file" accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) { setImageFile(f); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(f); }
            }}
            className="w-full text-sm" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl mt-3" />}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? "Adding..." : "Add Product →"}
        </button>
      </form>
    </div>
  );
}
