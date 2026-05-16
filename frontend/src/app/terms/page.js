"use client";
import React from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Paperbag website (paperbag.in) and any related services, you confirm that you are at least 18 years of age and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please discontinue use of our website immediately.

These Terms apply to all visitors, users, and customers. Paperbag reserves the right to update these Terms at any time. Continued use of the platform after any change constitutes acceptance of the revised Terms.`,
  },
  {
    id: "services",
    title: "2. Description of Services",
    content: `Paperbag provides an e-commerce platform for the purchase of eco-friendly paper bags. Our services include:

• Browsing and purchasing paper bag products (custom, bulk, and standard orders)
• Subscription plans (Starter, Business, Enterprise) offering order discounts, priority shipping, and support benefits
• Custom branding and print services for eligible plans
• Order tracking, account management, and customer support

Paperbag reserves the right to modify, suspend, or discontinue any service at any time with or without notice.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `To place orders or access subscription features, you must create an account. You are responsible for:

• Maintaining the confidentiality of your login credentials
• All activity that occurs under your account
• Providing accurate and current information during registration

You may register using email/password, Email OTP (one-time password), or Google OAuth. Paperbag employs industry-standard security including bcrypt password hashing and JWT-based authentication.

Accounts found to be fraudulent or in violation of these Terms may be suspended or permanently terminated without notice.`,
  },
  {
    id: "orders",
    title: "4. Orders & Payments",
    content: `All orders placed on Paperbag are subject to availability. Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.

Payment is processed securely through Razorpay. Paperbag does not store your card or banking details on our servers.

We reserve the right to cancel any order for reasons including but not limited to: product unavailability, pricing errors, or suspected fraudulent transactions. In such cases, a full refund will be issued within 5–7 business days.`,
  },
  {
    id: "subscriptions",
    title: "5. Subscription Plans",
    content: `Paperbag offers three subscription tiers: Starter (Free), Business (₹999/month or ₹799/month billed yearly), and Enterprise (₹4,999/month or ₹3,999/month billed yearly).

Subscription terms:
• Business and Enterprise plans include a 14-day free trial. No charge is applied until the trial ends.
• You may cancel at any time. Access continues until the end of the current billing period.
• Refunds for unused subscription periods are not provided except where required by applicable law.
• Upgrading takes effect immediately; downgrading applies at the next billing cycle.
• Paperbag reserves the right to change subscription pricing with 30 days' advance notice.

Subscription discounts apply to bag orders placed during an active subscription period and cannot be retroactively applied.`,
  },
  {
    id: "shipping",
    title: "6. Shipping & Delivery",
    content: `Paperbag ships within India. Delivery timelines vary by plan:

• Starter: 5–7 business days
• Business: 2–3 business days
• Enterprise: Same-day dispatch available in select cities

Delivery timelines are estimates and may be affected by factors beyond our control (public holidays, courier delays, natural events). Paperbag is not liable for delays caused by third-party logistics providers.

Risk of loss passes to the customer upon delivery. For damaged or missing orders, please contact support within 48 hours of the expected delivery date.`,
  },
  {
    id: "returns",
    title: "7. Returns & Refunds",
    content: `We accept returns within 7 days of delivery for:
• Incorrect items delivered
• Items damaged during transit
• Manufacturing defects

Custom-printed or personalised orders cannot be returned unless there is a printing error on our part.

To initiate a return, contact us at hello@paperbag.in with your order ID and photographs of the issue. Refunds are processed within 5–7 business days after return verification.

Shipping costs for returns due to customer error are borne by the customer.`,
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    content: `All content on this website — including but not limited to text, images, SVG illustrations, logos, product photography, and design — is the exclusive property of Paperbag and is protected under applicable intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content without prior written consent from Paperbag.

User-submitted content (reviews, testimonials) remains the property of the submitting user but grants Paperbag a non-exclusive, royalty-free licence to display such content on the platform.`,
  },
  {
    id: "prohibited",
    title: "9. Prohibited Activities",
    content: `You agree not to:

• Use the platform for any unlawful purpose
• Attempt to gain unauthorised access to any part of the service
• Submit false, misleading, or fraudulent orders or reviews
• Use automated tools (bots, scrapers) to access the platform without written permission
• Resell or sublicence your subscription benefits to third parties
• Engage in any activity that disrupts or interferes with the platform's operation

Violation of these terms may result in immediate account termination and, where applicable, legal action.`,
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by law, Paperbag shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or services.

Our total liability to you for any claim arising from use of this platform shall not exceed the amount paid by you to Paperbag in the 3 months preceding the claim.

Paperbag makes no warranty that the service will be uninterrupted, error-free, or free of viruses or harmful components.`,
  },
  {
    id: "governing",
    title: "11. Governing Law",
    content: `These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`,
  },
  {
    id: "contact-terms",
    title: "12. Contact",
    content: `For questions about these Terms, contact us at:

Email: legal@paperbag.in
Phone: +91-8291569470
Address: Borivali West, Mumbai 400092, Maharashtra, India`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream, #faf7f2)' }}>
      {/* Dark green hero header */}
      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">
          📄 Legal
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Terms &amp; Conditions</h1>
        <p className="text-white/50 text-sm">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="flex gap-10 items-start">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
            <div className="card p-5 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contents</p>
              {SECTIONS.map(({ id, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block py-1.5 text-xs text-gray-500 border-b border-gray-100 last:border-0 hover:text-green-800 transition-colors"
                >
                  {title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Intro box */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 mb-8 shadow-sm">
              <p className="text-sm text-gray-600 leading-relaxed">
                Please read these Terms and Conditions carefully before using Paperbag. These terms govern your use of our website, products, and subscription services. By proceeding, you agree to these terms in full.
              </p>
            </div>

            {SECTIONS.map(({ id, title, content }) => (
              <div key={id} id={id} className="mb-9" style={{ scrollMarginTop: '6rem' }}>
                <h2 className="text-lg font-extrabold mb-3 pb-2 border-b border-green-100" style={{ color: 'var(--green-900, #1b4332)' }}>
                  {title}
                </h2>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#4b5563' }}>
                  {content}
                </div>
              </div>
            ))}

            {/* Footer CTA */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 mt-4">
              <p className="text-sm text-green-800 leading-relaxed">
                By using Paperbag, you acknowledge that you have read, understood, and agree to these Terms and Conditions.{" "}
                <Link href="/contact" className="font-semibold text-emerald-700 hover:underline">
                  Contact us
                </Link>{" "}
                with any questions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
