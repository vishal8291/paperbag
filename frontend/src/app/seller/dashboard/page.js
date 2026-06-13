"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";
import { storeApi, productApi, orderApi, couponApi } from "../../../lib/api";
import { FaStore, FaBox, FaShoppingBag, FaTicketAlt, FaCog, FaPlus, FaTrash, FaCheck, FaTimes, FaEdit } from "react-icons/fa";

export default function SellerDashboard() {
  const router = useRouter();
  const { user, refreshUser, loading: authLoading } = useUser();

  const [activeTab, setActiveTab] = useState("overview");

  // Store creation states
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [creatingStore, setCreatingStore] = useState(false);
  const [createError, setCreateError] = useState("");

  // Store data states
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modals & form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", price: "", stock: "", category: "general", description: "", ecoFriendly: "true", image: null, imageUrl: ""
  });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "", discountType: "percentage", discountValue: "", minOrderAmount: "0", maxUses: "", expiresAt: ""
  });

  const [settingsForm, setSettingsForm] = useState({
    name: "", slug: "", description: "", logo: "", banner: "", contactEmail: "", contactPhone: "", address: "",
    themeSettings: { primaryColor: "#15803d", secondaryColor: "#166534" },
    paymentSettings: { razorpayKeyId: "", razorpayKeySecret: "" }
  });

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/seller/dashboard");
    }
  }, [user, authLoading, router]);

  // Load all dashboard data
  const loadDashboardData = async () => {
    if (!user || !user.storeId) return;
    try {
      setDataLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // 1. Fetch store settings
      const storeRes = await fetch(`${base}/api/stores/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (storeRes.ok) {
        const storeData = await storeRes.json();
        setStore(storeData);
        setSettingsForm({
          name: storeData.name || "",
          slug: storeData.slug || "",
          description: storeData.description || "",
          logo: storeData.logo || "",
          banner: storeData.banner || "",
          contactEmail: storeData.contactEmail || "",
          contactPhone: storeData.contactPhone || "",
          address: storeData.address || "",
          themeSettings: {
            primaryColor: storeData.themeSettings?.primaryColor || "#15803d",
            secondaryColor: storeData.themeSettings?.secondaryColor || "#166534"
          },
          paymentSettings: {
            razorpayKeyId: storeData.paymentSettings?.razorpayKeyId || "",
            razorpayKeySecret: "" // blank for security
          }
        });
      }

      // 2. Fetch products (we pass x-store-id or since we are logged in, backend returns seller's products)
      const productsData = await productApi.getAll();
      setProducts(productsData);

      // 3. Fetch orders
      const ordersData = await orderApi.getAll();
      setOrders(ordersData);

      // 4. Fetch coupons
      const couponsData = await couponApi.getAll();
      setCoupons(couponsData);

    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.storeId) {
      loadDashboardData();
    }
  }, [user]);

  // ── Create Store Handler ──────────────────────────────────────
  const handleCreateStore = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreatingStore(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: storeName, slug: storeSlug, description: storeDesc })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create store.");
      }
      // Success: refresh user context to get storeId and reload
      await refreshUser();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreatingStore(false);
    }
  };

  // ── Product Creation / Editing ───────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "", price: "", stock: "", category: "general", description: "", ecoFriendly: "true", image: null, imageUrl: ""
    });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category || "general",
      description: p.description,
      ecoFriendly: p.ecoFriendly ? "true" : "false",
      image: null,
      imageUrl: p.imageUrl
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError("");
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);
      formData.append("description", productForm.description);
      formData.append("ecoFriendly", productForm.ecoFriendly);
      if (productForm.image) {
        formData.append("image", productForm.image);
      } else if (productForm.imageUrl) {
        formData.append("imageUrl", productForm.imageUrl);
      }

      let res;
      if (editingProduct) {
        res = await productApi.update(editingProduct._id, formData);
      } else {
        res = await productApi.create(formData);
      }

      if (res.message && res.message.includes("failed")) {
        throw new Error(res.message);
      }

      setShowProductModal(false);
      loadDashboardData();
    } catch (err) {
      setSaveError(err.message || "Error saving product.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productApi.delete(id);
      loadDashboardData();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // ── Coupon Handler ──────────────────────────────────────────
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError("");
    try {
      await couponApi.create({
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount),
        maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : undefined,
        expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt) : undefined
      });
      setShowCouponModal(false);
      setCouponForm({
        code: "", discountType: "percentage", discountValue: "", minOrderAmount: "0", maxUses: "", expiresAt: ""
      });
      loadDashboardData();
    } catch (err) {
      setSaveError(err.message || "Error creating coupon.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await couponApi.toggle(id);
      loadDashboardData();
    } catch (err) {
      alert("Failed to toggle coupon.");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await couponApi.delete(id);
      loadDashboardData();
    } catch (err) {
      alert("Failed to delete coupon.");
    }
  };

  // ── Order Management ──────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // ── Store Settings Handler ────────────────────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess("");
    setSaveError("");
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const body = {
        name: settingsForm.name,
        slug: settingsForm.slug,
        description: settingsForm.description,
        logo: settingsForm.logo,
        banner: settingsForm.banner,
        contactEmail: settingsForm.contactEmail,
        contactPhone: settingsForm.contactPhone,
        address: settingsForm.address,
        themeSettings: settingsForm.themeSettings
      };

      if (settingsForm.paymentSettings.razorpayKeyId) {
        body.paymentSettings = {
          razorpayKeyId: settingsForm.paymentSettings.razorpayKeyId,
          ...(settingsForm.paymentSettings.razorpayKeySecret && {
            razorpayKeySecret: settingsForm.paymentSettings.razorpayKeySecret
          })
        };
      }

      const res = await fetch(`${base}/api/stores/my`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update settings.");

      setSaveSuccess("Settings saved successfully!");
      setStore(data.store);
    } catch (err) {
      setSaveError(err.message || "Error saving settings.");
    } finally {
      setSaveLoading(false);
    }
  };

  // ── UI States ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0e12]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Render Store Creation Screen if user has no store
  if (!user.storeId) {
    return (
      <div className="min-h-screen text-gray-100 flex flex-col justify-center items-center px-4" style={{ background: "#0d0e12" }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full glass p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10 bg-[#0d0e12]/80">
          <div className="text-center mb-6">
            <span className="text-5xl">🏢</span>
            <h1 className="text-2xl font-black mt-4">Setup Your Store</h1>
            <p className="text-gray-400 text-sm mt-1">Start selling your products in minutes.</p>
          </div>

          {createError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
              ⚠️ {createError}
            </div>
          )}

          <form onSubmit={handleCreateStore} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Name</label>
              <input
                type="text" required value={storeName} onChange={(e) => {
                  setStoreName(e.target.value);
                  setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 30));
                }}
                placeholder="My Awesome Shop"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store URL Slug</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-within:border-indigo-500">
                <span className="text-gray-500 select-none">/store/</span>
                <input
                  type="text" required value={storeSlug} onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-awesome-shop"
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white ml-0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={storeDesc} onChange={(e) => setStoreDesc(e.target.value)}
                placeholder="A brief description of what you sell..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit" disabled={creatingStore}
              className="btn-primary w-full py-3.5 mt-4 text-center text-sm font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
              style={{ background: "#4f46e5" }}
            >
              {creatingStore ? "Creating Store..." : "Create Store →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen text-gray-100 flex flex-col md:flex-row bg-[#08090c]">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-[#0d0e12] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold text-sm tracking-tight text-white">{store?.name || "StoreCraft"}</span>
          </div>
          {store?.slug && (
            <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 font-bold hover:bg-indigo-500/20 transition">
              Visit Store
            </a>
          )}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {[
            { id: "overview", label: "Overview", icon: FaStore },
            { id: "products", label: "Products", icon: FaBox },
            { id: "orders", label: "Orders", icon: FaShoppingBag },
            { id: "coupons", label: "Coupons", icon: FaTicketAlt },
            { id: "settings", label: "Settings", icon: FaCog },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id} onClick={() => { setActiveTab(id); setSaveSuccess(""); setSaveError(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              style={activeTab === id ? { background: "#4f46e5" } : {}}
            >
              <Icon className="text-base shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500">
            <div>
              <p className="font-bold text-white leading-none">{user.name}</p>
              <p className="mt-1 leading-none">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem("token"); router.push("/"); window.location.reload(); }}
            className="w-full text-center py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Dashboard Panel ── */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {dataLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-2xl font-black">Dashboard Overview</h1>
                  <p className="text-gray-500 text-sm mt-1">Real-time performance metrics for {store?.name}.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Revenue", val: `₹${totalRevenue.toFixed(2)}`, color: "text-emerald-400" },
                    { label: "Total Orders", val: orders.length, color: "text-white" },
                    { label: "Pending Orders", val: pendingOrders, color: pendingOrders > 0 ? "text-amber-400" : "text-white" },
                    { label: "Out of Stock", val: outOfStock, color: outOfStock > 0 ? "text-red-400" : "text-white" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="card p-6 bg-[#0d0e12] border border-white/5 shadow-xl">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className={`text-2xl font-extrabold mt-3 ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="card bg-[#0d0e12] border border-white/5 shadow-xl p-6">
                  <h3 className="font-bold text-lg mb-4 text-white">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">No orders placed yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o._id} className="text-gray-300">
                              <td className="py-3 font-semibold text-xs font-mono">#{o._id.slice(-6).toUpperCase()}</td>
                              <td className="py-3">{o.customer.name}</td>
                              <td className="py-3 font-bold">₹{o.total.toFixed(2)}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  o.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                  o.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-black">Manage Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Add, update, or remove items in your store.</p>
                  </div>
                  <button onClick={openAddProduct} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2" style={{ background: "#4f46e5" }}>
                    <FaPlus className="text-xs" /> Add Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="card bg-[#0d0e12] border border-white/5 p-12 text-center shadow-xl">
                    <span className="text-5xl">📦</span>
                    <h3 className="font-bold text-lg mt-4 text-white">No products found</h3>
                    <p className="text-gray-500 text-sm mt-1">Get started by creating your first product listings.</p>
                    <button onClick={openAddProduct} className="btn-primary text-sm py-2 px-5 mt-6 mx-auto" style={{ background: "#4f46e5" }}>
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p._id} className="card bg-[#0d0e12] border border-white/5 p-5 shadow-xl flex flex-col justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-950 overflow-hidden shrink-0 border border-white/5 flex items-center justify-center">
                            <img src={p.imageUrl || "/file.svg"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate text-base leading-snug">{p.name}</h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{p.category || "general"}</p>
                            <p className="text-lg font-black text-indigo-400 mt-2">₹{p.price}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-5">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${p.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            {p.stock > 0 ? `${p.stock} In Stock` : "Out of Stock"}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => openEditProduct(p)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition" title="Edit">
                              <FaEdit className="text-xs" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition" title="Delete">
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-black">Orders logs</h1>
                  <p className="text-gray-500 text-sm mt-1">Track and manage customer order shipping status.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="card bg-[#0d0e12] border border-white/5 p-12 text-center shadow-xl">
                    <span className="text-5xl">🛒</span>
                    <h3 className="font-bold text-lg mt-4 text-white">No orders yet</h3>
                    <p className="text-gray-500 text-sm mt-1">When buyers order your products, they will appear here.</p>
                  </div>
                ) : (
                  <div className="card bg-[#0d0e12] border border-white/5 shadow-xl p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer info</th>
                            <th className="pb-3">Items</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Change Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.map((o) => (
                            <tr key={o._id} className="text-gray-300">
                              <td className="py-4 font-semibold text-xs font-mono">#{o._id.slice(-6).toUpperCase()}</td>
                              <td className="py-4">
                                <p className="font-bold text-white text-xs">{o.customer.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{o.customer.email}</p>
                                <p className="text-gray-500 text-[10px] mt-1 leading-snug max-w-xs">{o.customer.address}, {o.customer.city}</p>
                              </td>
                              <td className="py-4">
                                <div className="space-y-1 text-xs">
                                  {o.items.map((i, idx) => (
                                    <p key={idx}>{i.name} <span className="text-gray-500">x{i.quantity}</span></p>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 font-bold">₹{o.total.toFixed(2)}</td>
                              <td className="py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  o.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                  o.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-4">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                >
                                  <option value="pending" className="bg-[#0f1015]">pending</option>
                                  <option value="processing" className="bg-[#0f1015]">processing</option>
                                  <option value="shipped" className="bg-[#0f1015]">shipped</option>
                                  <option value="out for delivery" className="bg-[#0f1015]">out for delivery</option>
                                  <option value="delivered" className="bg-[#0f1015]">delivered</option>
                                  <option value="cancelled" className="bg-[#0f1015]">cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === "coupons" && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-black">Discount Coupons</h1>
                    <p className="text-gray-500 text-sm mt-1">Create codes to incentivize customer checkout.</p>
                  </div>
                  <button onClick={() => setShowCouponModal(true)} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2" style={{ background: "#4f46e5" }}>
                    <FaPlus className="text-xs" /> Create Coupon
                  </button>
                </div>

                {coupons.length === 0 ? (
                  <div className="card bg-[#0d0e12] border border-white/5 p-12 text-center shadow-xl">
                    <span className="text-5xl">🎫</span>
                    <h3 className="font-bold text-lg mt-4 text-white">No coupons active</h3>
                    <p className="text-gray-500 text-sm mt-1">Create promotional coupons for discounts.</p>
                  </div>
                ) : (
                  <div className="card bg-[#0d0e12] border border-white/5 shadow-xl p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="pb-3">Code</th>
                            <th className="pb-3">Discount</th>
                            <th className="pb-3">Min Order</th>
                            <th className="pb-3">Active</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {coupons.map((c) => (
                            <tr key={c._id} className="text-gray-300">
                              <td className="py-3 font-extrabold text-white tracking-wider">{c.code}</td>
                              <td className="py-3 font-semibold">
                                {c.discountType === "percentage" ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                              </td>
                              <td className="py-3">₹{c.minOrderAmount}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => handleToggleCoupon(c._id)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                                    c.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}
                                >
                                  {c.isActive ? "Active" : "Disabled"}
                                </button>
                              </td>
                              <td className="py-3">
                                <button onClick={() => handleDeleteCoupon(c._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                                  <FaTrash className="text-xs" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-black">Store Configuration</h1>
                  <p className="text-gray-500 text-sm mt-1">Configure your branding, layout colors, and payment keys.</p>
                </div>

                {saveSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl">
                    ✅ {saveSuccess}
                  </div>
                )}

                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
                    ⚠️ {saveError}
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* General Config */}
                  <div className="card bg-[#0d0e12] border border-white/5 p-6 flex flex-col gap-5 shadow-xl">
                    <h3 className="font-extrabold text-base border-b border-white/5 pb-3">Branding & details</h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Store Name</label>
                      <input
                        type="text" required value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">URL Slug</label>
                      <input
                        type="text" required value={settingsForm.slug} onChange={(e) => setSettingsForm({ ...settingsForm, slug: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                      <textarea
                        value={settingsForm.description} onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo URL</label>
                      <input
                        type="text" value={settingsForm.logo} onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Banner URL</label>
                      <input
                        type="text" value={settingsForm.banner} onChange={(e) => setSettingsForm({ ...settingsForm, banner: e.target.value })}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>
                  </div>

                  {/* Theme and Payments */}
                  <div className="flex flex-col gap-8">
                    {/* Theme colors */}
                    <div className="card bg-[#0d0e12] border border-white/5 p-6 flex flex-col gap-5 shadow-xl">
                      <h3 className="font-extrabold text-base border-b border-white/5 pb-3">Theme styling</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color" value={settingsForm.themeSettings.primaryColor}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                themeSettings: { ...settingsForm.themeSettings, primaryColor: e.target.value }
                              })}
                              className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent"
                            />
                            <input
                              type="text" value={settingsForm.themeSettings.primaryColor}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                themeSettings: { ...settingsForm.themeSettings, primaryColor: e.target.value }
                              })}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Secondary Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color" value={settingsForm.themeSettings.secondaryColor}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                themeSettings: { ...settingsForm.themeSettings, secondaryColor: e.target.value }
                              })}
                              className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent"
                            />
                            <input
                              type="text" value={settingsForm.themeSettings.secondaryColor}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                themeSettings: { ...settingsForm.themeSettings, secondaryColor: e.target.value }
                              })}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Config */}
                    <div className="card bg-[#0d0e12] border border-white/5 p-6 flex flex-col gap-5 shadow-xl">
                      <h3 className="font-extrabold text-base border-b border-white/5 pb-3">Contact information</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Email</label>
                        <input
                          type="email" value={settingsForm.contactEmail} onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Phone</label>
                        <input
                          type="text" value={settingsForm.contactPhone} onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address</label>
                        <input
                          type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                    </div>

                    {/* Razorpay Gateway */}
                    <div className="card bg-[#0d0e12] border border-white/5 p-6 flex flex-col gap-5 shadow-xl">
                      <h3 className="font-extrabold text-base border-b border-white/5 pb-3">Payment integration (Razorpay)</h3>
                      <p className="text-xs text-gray-500 -mt-2 leading-relaxed">Scope payments directly to your account. Leave blank to process all checks via Cash on Delivery (COD).</p>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Razorpay Key ID</label>
                        <input
                          type="text" value={settingsForm.paymentSettings.razorpayKeyId}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            paymentSettings: { ...settingsForm.paymentSettings, razorpayKeyId: e.target.value }
                          })}
                          placeholder="rzp_test_..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Razorpay Key Secret</label>
                        <input
                          type="password" value={settingsForm.paymentSettings.razorpayKeySecret}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            paymentSettings: { ...settingsForm.paymentSettings, razorpayKeySecret: e.target.value }
                          })}
                          placeholder="••••••••••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 text-right">
                    <button
                      type="submit" disabled={saveLoading}
                      className="btn-primary py-3.5 px-8 font-extrabold text-sm"
                      style={{ background: "#4f46e5" }}
                    >
                      {saveLoading ? "Saving changes..." : "Save Store Configuration"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Product Add/Edit Modal ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1015] border border-white/5 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-lg">✕</button>

            <h3 className="font-extrabold text-xl mb-6 text-white">{editingProduct ? "Edit Product" : "Add Product"}</h3>

            {saveError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                ⚠️ {saveError}
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Product Name</label>
                <input
                  type="text" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Premium Paper Bag"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Price (₹)</label>
                  <input
                    type="number" required min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="49.99"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Stock Quantity</label>
                  <input
                    type="number" required min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Category</label>
                <input
                  type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="gift, shopping, kraft"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Description</label>
                <textarea
                  required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Provide product features, materials, and size..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Product Image (File Upload)</label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })}
                  className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                />
              </div>

              <div className="text-center text-xs text-gray-500 my-1">— OR —</div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Product Image (URL)</label>
                <input
                  type="text" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.png"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox" id="ecoFriendly"
                  checked={productForm.ecoFriendly === "true"}
                  onChange={(e) => setProductForm({ ...productForm, ecoFriendly: e.target.checked ? "true" : "false" })}
                  className="w-4 h-4 text-indigo-600 border-white/10 rounded focus:ring-indigo-500"
                />
                <label htmlFor="ecoFriendly" className="text-xs font-bold text-gray-400">🌿 Eco-Friendly Product</label>
              </div>

              <button
                type="submit" disabled={saveLoading}
                className="btn-primary w-full py-3 mt-4 text-center font-bold text-sm"
                style={{ background: "#4f46e5" }}
              >
                {saveLoading ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Coupon Add Modal ── */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1015] border border-white/5 rounded-3xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowCouponModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-lg">✕</button>

            <h3 className="font-extrabold text-xl mb-6 text-white">Create Coupon</h3>

            {saveError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                ⚠️ {saveError}
              </div>
            )}

            <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Coupon Code (Uppercase)</label>
                <input
                  type="text" required value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="SALE50"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Discount Type</label>
                  <select
                    value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full bg-[#0f1015] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Value</label>
                  <input
                    type="number" required min="0" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    placeholder="10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Min Order (₹)</label>
                  <input
                    type="number" min="0" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Max Usage (Optional)</label>
                  <input
                    type="number" min="1" value={couponForm.maxUses} onChange={(e) => setCouponForm({ ...couponForm, maxUses: e.target.value })}
                    placeholder="unlimited"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Expiry Date (Optional)</label>
                <input
                  type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                />
              </div>

              <button
                type="submit" disabled={saveLoading}
                className="btn-primary w-full py-3 mt-4 text-center font-bold text-sm"
                style={{ background: "#4f46e5" }}
              >
                {saveLoading ? "Creating..." : "Create Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
