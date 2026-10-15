import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      <div className="bg-steel-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-2">
            <Shield className="w-4 h-4" />
            Legal & Data Protection
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-steel-400">
            Last Updated: October 2026 | Lotus Impex, Mumbai, Maharashtra, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl border border-steel-200 p-8 sm:p-10 shadow-sm space-y-6 text-steel-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              1. Information We Collect
            </h2>
            <p>
              Lotus Impex collects corporate and technical procurement information submitted by B2B clients through our Request for Quotation (RFQ), Bill of Quantities (BOQ) upload, contact forms, and WhatsApp inquiry channels. This includes corporate name, business email address, direct phone contact, delivery destination, and project specification schedules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              2. Use of Business Information
            </h2>
            <p>
              Information gathered is utilized exclusively to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-steel-600">
              <li>Formulate and deliver engineering price schedules and technical datasheets.</li>
              <li>Provide Mill Test Certificates (EN 10204 3.1) and heat batch traceability documentation.</li>
              <li>Coordinate freight forwarding, port customs clearance, and logistics dispatch.</li>
              <li>Fulfill statutory tax compliance (GST / Export declarations).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              3. Protection of Customer Engineering Drawings & BOQs
            </h2>
            <p>
              Proprietary engineering schedules, CAD drawings (.dwg, .dxf), and project Bills of Quantities uploaded to our servers are stored in restricted private directories. Lotus Impex will never disclose, resell, or distribute client process designs or intellectual property to any third parties without explicit authorization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              4. Cookies and Session Tokens
            </h2>
            <p>
              Our internal CRM utilizes secure, HTTP-only session cookies for authorized employee access. Public web pages do not employ invasive third-party cross-site advertising trackers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              5. Contacting the Compliance Officer
            </h2>
            <p>
              For data access, rectification, or non-disclosure agreements (NDAs) prior to submitting proprietary drawings, contact our corporate office at:
              <br />
              <strong>Lotus Impex</strong>
              <br />
              Unit 14, Industrial Area, Kanjurmarg West, Mumbai 400078, Maharashtra, India
              <br />
              Email: privacy@lotusimpex.com | Phone: +91 22 2847 0000
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
