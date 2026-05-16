const BASE_URL = "https://paperbag.in";

export default function sitemap() {
  const staticRoutes = [
    { url: BASE_URL,              priority: 1.0,  changeFrequency: "weekly"  },
    { url: `${BASE_URL}/products`, priority: 0.9,  changeFrequency: "daily"   },
    { url: `${BASE_URL}/pricing`,  priority: 0.8,  changeFrequency: "monthly" },
    { url: `${BASE_URL}/about`,    priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE_URL}/contact`,  priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE_URL}/faq`,      priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE_URL}/testimonials`, priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE_URL}/terms`,    priority: 0.3,  changeFrequency: "yearly"  },
    { url: `${BASE_URL}/privacy`,  priority: 0.3,  changeFrequency: "yearly"  },
  ].map((r) => ({ ...r, lastModified: new Date() }));

  return staticRoutes;
}
