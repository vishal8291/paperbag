// Central API helper — all requests go through here.
// Reads base URL from env, attaches JWT automatically.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getStoreSlug() {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  const match = path.match(/^\/store\/([^/]+)/);
  return match ? match[1] : null;
}

async function request(path, options = {}) {
  const token = getToken();
  const storeSlug = getStoreSlug();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(storeSlug && { "x-store-slug": storeSlug }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register:       (body) => request("/api/users/register",        { method: "POST", body: JSON.stringify(body) }),
  login:          (body) => request("/api/users/login",           { method: "POST", body: JSON.stringify(body) }),
  google:         (body) => request("/api/users/google",          { method: "POST", body: JSON.stringify(body) }),
  me:             ()     => request("/api/users/me"),
  updateProfile:  (body) => request("/api/users/profile",         { method: "PUT",  body: JSON.stringify(body) }),
  logout:         ()     => request("/api/users/logout",           { method: "POST" }),
  sendOtp:        (body) => request("/api/users/send-otp",        { method: "POST", body: JSON.stringify(body) }),
  verifyOtp:      (body) => request("/api/users/verify-otp",      { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/api/users/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  resetPassword:  (body) => request("/api/users/reset-password",  { method: "POST", body: JSON.stringify(body) }),
};

// ── Products ──────────────────────────────────────────────────
export const productApi = {
  // Returns paginated envelope: { products, page, totalPages, total }
  getPaginated: (params = "") => request(`/api/products${params ? `?${params}` : ""}`),
  // Legacy helper — returns just the products array (useful for admin, selects, etc.)
  getAll:    async (params = "") => {
    const data = await request(`/api/products${params ? `?${params}` : ""}&limit=500`);
    // Handle both old array response and new paginated envelope
    return Array.isArray(data) ? data : (data.products || []);
  },
  getById:   (id)          => request(`/api/products/${id}`),
  create:    (formData)    => {
    const token = getToken();
    const storeSlug = getStoreSlug();
    return fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(storeSlug && { "x-store-slug": storeSlug }),
      },
    }).then(r => r.json());
  },
  update:    (id, formData) => {
    const token = getToken();
    const storeSlug = getStoreSlug();
    return fetch(`${BASE_URL}/api/products/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(storeSlug && { "x-store-slug": storeSlug }),
      },
    }).then(r => r.json());
  },
  delete:    (id) => request(`/api/products/${id}`, { method: "DELETE" }),
};

// ── Orders ────────────────────────────────────────────────────
export const orderApi = {
  create:    (body)  => request("/api/orders",     { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: ()    => request("/api/orders/my"),
  getAll:    ()      => request("/api/orders"),
  getById:   (id)    => request(`/api/orders/${id}`),
  updateStatus: (id, status) => request(`/api/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// ── Payment ───────────────────────────────────────────────────
export const paymentApi = {
  createOrder: (body) => request("/api/payment/create-order", { method: "POST", body: JSON.stringify(body) }),
  verify:      (body) => request("/api/payment/verify",       { method: "POST", body: JSON.stringify(body) }),
};

// ── Wishlist ──────────────────────────────────────────────────
export const wishlistApi = {
  get:    ()         => request("/api/users/wishlist"),
  toggle: (productId) => request(`/api/users/wishlist/${productId}`, { method: "POST" }),
};

// ── Newsletter ────────────────────────────────────────────────
export const newsletterApi = {
  subscribe:   (body) => request("/api/newsletter",             { method: "POST", body: JSON.stringify(body) }),
  unsubscribe: (body) => request("/api/newsletter/unsubscribe", { method: "POST", body: JSON.stringify(body) }),
};

// ── Contact / Testimonials ────────────────────────────────────
export const contactApi = {
  send:       (body) => request("/api/contact",                  { method: "POST", body: JSON.stringify(body) }),
  getInTouch: (body) => request("/api/getintouch",               { method: "POST", body: JSON.stringify(body) }),
  submitTestimonial: (body) => request("/api/testimonials",      { method: "POST", body: JSON.stringify(body) }),
  getTestimonials:   ()     => request("/api/testimonials"),
};

// ── Coupons ───────────────────────────────────────────────────
export const couponApi = {
  validate: (body)     => request("/api/coupons/validate",    { method: "POST", body: JSON.stringify(body) }),
  getAll:   ()         => request("/api/coupons"),
  create:   (body)     => request("/api/coupons",             { method: "POST", body: JSON.stringify(body) }),
  toggle:   (id)       => request(`/api/coupons/${id}/toggle`, { method: "PATCH" }),
  delete:   (id)       => request(`/api/coupons/${id}`,        { method: "DELETE" }),
};

// ── Reviews ───────────────────────────────────────────────────
export const reviewApi = {
  get:    (productId)         => request(`/api/reviews/${productId}`),
  submit: (productId, body)   => request(`/api/reviews/${productId}`, { method: "POST", body: JSON.stringify(body) }),
};

// ── Referral ──────────────────────────────────────────────────
export const referralApi = {
  getMy:  ()     => request("/api/referral/my"),
  apply:  (body) => request("/api/referral/apply", { method: "POST", body: JSON.stringify(body) }),
};
