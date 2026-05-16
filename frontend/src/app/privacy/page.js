"use client";
import React from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "intro",
    title: "1. Introduction",
    content: `Paperbag ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, why we collect it, how it is used, and your rights over your data.

This policy applies to all users of our website (paperbag.in) and related services. By using Paperbag, you consent to the practices described in this policy.`,
  },
  {
    id: "data-collected",
    title: "2. Information We Collect",
    content: `We collect the following categories of personal data:

Account Information
• Name, email address, and password (stored as a bcrypt hash — never in plain text)
• Mobile number (optional, used for order updates)
• Google profile information if you sign in via Google OAuth (name, email, profile picture)

Order Information
• Shipping address, city, PIN code
• Order history and product preferences
• Payment reference IDs (we do not store card or bank details — payments are handled by Razorpay)

Usage Data
• Browser type, IP address, device type
• Pages visited, time spent on site, referral source
• Cookies and session tokens (see Section 7)

Communications
• Messages sent via the Contact form
• Product reviews and testimonials you submit`,
  },
  {
    id: "why",
    title: "3. How We Use Your Information",
    content: `We use the data we collect to:

• Process and fulfil your orders
• Send order confirmation, shipping updates, and invoices via email
• Provide account access and authentication (including OTP verification)
• Personalise your shopping experience and wishlist
• Process subscription billing and manage plan benefits
• Respond to support queries and contact form submissions
• Send promotional emails (only with your explicit consent — you can unsubscribe anytime)
• Improve our website performance and user experience
• Comply with legal obligations and prevent fraudulent activity`,
  },
  {
    id: "sharing",
    title: "4. Data Sharing & Third Parties",
    content: `We do not sell or rent your personal data to any third party.

We share your data with trusted third parties only as necessary to operate our service:

• Razorpay — payment processing (governed by Razorpay's Privacy Policy)
• Google — authentication via Google OAuth (governed by Google's Privacy Policy)
• MongoDB Atlas — secure cloud database storage (governed by MongoDB's Privacy Policy)
• Render / Vercel — hosting and deployment infrastructure
• Gmail SMTP / Nodemailer — transactional email delivery

All third-party partners are required to process your data only as instructed and in compliance with applicable data protection laws.

We may disclose your information if required by law, court order, or government authority.`,
  },
  {
    id: "security",
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your data:

• Passwords are hashed using bcrypt (salt rounds: 12) and never stored in plain text
• OTP codes are hashed before storage and expire automatically after 10 minutes via MongoDB TTL indexes
• Authentication uses signed JWT tokens with expiry
• All data in transit is encrypted using HTTPS/TLS
• Rate limiting is applied to sensitive endpoints (OTP, login) to prevent brute-force attacks
• Failed OTP attempts are tracked and accounts are locked after 5 consecutive failures

While we take every precaution, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services.

Specific retention periods:
• Account data: Retained until you request deletion
• OTP records: Automatically deleted after 10 minutes (MongoDB TTL)
• Order history: Retained for 7 years for tax and legal compliance
• Contact form messages: Retained for 2 years
• Analytics/usage logs: Retained for 12 months

You may request deletion of your account and associated data at any time by contacting us at privacy@paperbag.in.`,
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking",
    content: `We use the following types of cookies and local storage:

Essential Cookies
• Authentication tokens (JWT) stored in localStorage for session management
• Cart data stored in localStorage for a seamless shopping experience

Analytics Cookies
• We may use anonymised analytics to understand site traffic and user behaviour. No personally identifiable information is shared with analytics providers.

You can clear cookies and local storage at any time via your browser settings. Disabling essential cookies may affect functionality such as login and cart persistence.

We do not use third-party advertising cookies or tracking pixels.`,
  },
  {
    id: "rights",
    title: "8. Your Rights",
    content: `Under applicable data protection laws (including India's Digital Personal Data Protection Act, 2023), you have the right to:

• Access — Request a copy of the personal data we hold about you
• Rectification — Correct inaccurate or incomplete data via your profile settings
• Erasure — Request deletion of your account and personal data
• Restriction — Request that we limit processing of your data in certain circumstances
• Data Portability — Request your data in a structured, machine-readable format
• Withdraw Consent — Opt out of marketing emails at any time via the unsubscribe link

To exercise any of these rights, contact us at privacy@paperbag.in. We will respond within 30 days.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: `Paperbag is not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with their personal data, please contact us immediately and we will delete it promptly.`,
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When we make material changes, we will notify you via email or a prominent notice on our website at least 14 days before the changes take effect.

Your continued use of Paperbag after the effective date constitutes acceptance of the updated policy.`,
  },
  {
    id: "contact-privacy",
    title: "11. Contact Us",
    content: `For privacy-related queries, data access requests, or concerns:

Email: privacy@paperbag.in
Phone: +91-8291569470
Address: Borivali West, Mumbai 400092, Maharashtra, India

We aim to respond to all privacy enquiries within 5 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream, #faf7f2)' }}>
      {/* Dark green hero header */}
      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">
          🔒 Legal
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
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

            {/* Security note */}
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
              <div className="text-xl mb-1">🔒</div>
              <p className="text-xs text-green-800 leading-relaxed">
                Your password is <strong>never</strong> stored in plain text. OTPs expire in 10 minutes.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Intro box */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 mb-8 shadow-sm">
              <p className="text-sm text-gray-600 leading-relaxed">
                Your privacy matters to us. This policy is written in plain language so you can clearly understand how we handle your data. If you have any questions,{" "}
                <Link href="/contact" className="font-semibold text-emerald-700 hover:underline">
                  contact us anytime
                </Link>.
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

            {/* Footer links */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/terms"
                className="bg-white border border-green-200 text-green-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition"
              >
                ← Terms & Conditions
              </Link>
              <Link
                href="/contact"
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition"
              >
                Privacy Enquiry →
              </Link>
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
