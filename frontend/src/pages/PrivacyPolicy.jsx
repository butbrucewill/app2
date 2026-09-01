import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRIVACY_POLICY_CONTENT = {
  intro: "OneStock Academy (\"we,\" \"us,\" or \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your information when you visit our website, enroll in our courses, or otherwise interact with us.",
  sections: [
    {
      title: "Information We Collect",
      content: "We may collect the following types of information:",
      items: [
        { bold: "Personal Information:", text: "Name, email address, phone number, and billing/payment details when you register for an account, enroll in a course, or contact us." },
        { bold: "Account Information:", text: "Login credentials, course progress, and preferences." },
        { bold: "Payment Information:", text: "Transaction details processed through our third-party payment gateways (we do not store full card/bank details on our servers)." },
        { bold: "Usage Data:", text: "Pages visited, time spent on the site, device/browser type, IP address, and referral source, collected automatically via cookies and analytics tools." },
        { bold: "Communication Data:", text: "Information you provide when contacting our support team, mentors, or filling out forms (e.g., inquiries, feedback, testimonials)." },
      ],
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to:",
      items: [
        { text: "Provide, operate, and maintain our courses and mentorship services" },
        { text: "Process enrollments, payments, and issue invoices/receipts" },
        { text: "Communicate with you about your account, courses, updates, and offers" },
        { text: "Personalize your learning experience and recommend relevant content" },
        { text: "Respond to inquiries and provide customer support" },
        { text: "Improve our website, courses, and services through analytics" },
        { text: "Comply with legal and regulatory obligations" },
        { text: "Detect and prevent fraud or unauthorized access" },
      ],
    },
    {
      title: "Data Sharing & Third Parties",
      content: "We do not sell your personal information. We may share your data with:",
      items: [
        { bold: "Service Providers:", text: "Payment gateways, email/SMS providers, hosting services, and analytics tools that help us operate our platform, bound by confidentiality obligations." },
        { bold: "Mentors/Instructors:", text: "Where necessary to deliver course content, track progress, or provide mentorship." },
        { bold: "Legal Authorities:", text: "When required by law, court order, or to protect our rights, users, or the public." },
        { bold: "Business Transfers:", text: "In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction." },
      ],
      note: "We require all third parties to respect the security of your data and treat it in accordance with applicable law.",
    },
    {
      title: "Data Security",
      content: "We implement reasonable technical and organizational measures to protect your personal information, including:",
      items: [
        { text: "Encrypted data transmission (SSL/TLS)" },
        { text: "Restricted access to personal data on a need-to-know basis" },
        { text: "Secure storage of account and payment information" },
        { text: "Regular review of our security practices" },
      ],
      note: "However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security. Please notify us immediately if you suspect any unauthorized access to your account.",
    },
    {
      title: "Your Rights",
      content: "Depending on your location, you may have the right to:",
      items: [
        { text: "Access the personal information we hold about you" },
        { text: "Request correction of inaccurate or incomplete data" },
        { text: "Request deletion of your personal information, subject to legal/contractual requirements" },
        { text: "Withdraw consent for marketing communications at any time" },
        { text: "Object to or restrict certain processing of your data" },
        { text: "Request a copy of your data in a portable format" },
      ],
      note: "To exercise any of these rights, please contact us using the details below. We will respond within a reasonable timeframe as required by applicable law.",
    },
    {
      title: "Contact Us",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:",
      contact: {
        company: "OneStock Academy", 
        phone: "+91-9599037181",
        address: "Floor-01, H Block, H-189, Sector 63, Noida, Uttar Pradesh 201309, India",
      },
    },
  ],
};

export default function PrivacyPolicy() {
  return (
    <div data-testid="privacy-page" className="bg-[#050505] text-paper min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-10">
          Privacy Policy
        </h1>

        <p className="text-paper/70 text-sm mb-12">
          <em>Last updated: September 1, 2026</em>
        </p>

        <p className="text-paper/80 leading-relaxed mb-12">
          {PRIVACY_POLICY_CONTENT.intro}
        </p>

        {/* ================================================
            CONTENT AREA — Privacy Policy sections
            ================================================ */}
        <div data-testid="privacy-content" className="space-y-10">
          {PRIVACY_POLICY_CONTENT.sections.map((section, i) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-white mb-4">
                {i + 1}. {section.title}
              </h2>
              <div className="border border-dashed border-white/20 rounded-xl p-6 space-y-4">
                <p className="text-paper/80 text-sm leading-relaxed">
                  {section.content}
                </p>

                {section.items && (
                  <ul className="space-y-3 ml-4">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-paper/70 text-sm leading-relaxed list-disc">
                        {item.bold && <span className="text-paper/90 font-semibold">{item.bold}</span>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="text-paper/70 text-sm leading-relaxed italic pt-2">
                    {section.note}
                  </p>
                )}

                {section.contact && (
                  <div className="pt-2 space-y-2 text-paper/80 text-sm">
                    <p className="font-semibold text-paper/90">{section.contact.company}</p>
                    <p>Email: {section.contact.email}</p>
                    <p>Phone: {section.contact.phone}</p>
                    <p>Address: {section.contact.address}</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="text-paper/60 text-xs leading-relaxed mt-12 pt-8 border-t border-white/10">
          <em>This Privacy Policy may be updated periodically. We encourage you to review this page regularly for any changes. Continued use of our website and services after changes are posted constitutes your acceptance of the updated policy.</em>
        </p>
      </main>
      <Footer />
    </div>
  );
}
