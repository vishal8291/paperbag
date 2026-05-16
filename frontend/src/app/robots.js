export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/user/", "/checkout", "/cart", "/orders"],
      },
    ],
    sitemap: "https://paperbag.in/sitemap.xml",
  };
}
