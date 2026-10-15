import React, { useState } from 'react';
import { ChevronDown, HelpCircle, FileCheck, Shield, Truck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      category: 'Technical Specifications & Standards',
      icon: Shield,
      faqs: [
        {
          q: 'What is the difference between SS 304 and SS 316L for sanitary tubing?',
          a: 'SS 304 (1.4301) is standard austenitic stainless steel suitable for general dairy, brewery, and food processing lines where moderate corrosion resistance is required. SS 316L (1.4404 / UNS S31603) contains 2.0–3.0% Molybdenum and low carbon (< 0.03%), providing significantly enhanced pitting corrosion resistance against chlorides and aggressive Clean-In-Place (CIP) sanitization chemicals, making it the mandatory standard for biopharmaceutical Water-for-Injection (WFI) and sterile API synthesis.',
        },
        {
          q: 'What surface roughness (Ra values) can Lotus Impex supply?',
          a: 'We supply tubes and fittings in standard sanitary mechanical polish (internal Ra < 0.8 µm / 32 µin) and ultra-high purity electro-polished finish (internal Ra < 0.4 µm / 15 µin or Ra < 0.38 µm). External surfaces are standard satin polished (Ra < 0.8 µm) or mirror polished on request.',
        },
        {
          q: 'What international standards govern your sanitary tubes and fittings?',
          a: 'Sanitary tubes comply with ASTM A270 (Standard Specification for Seamless and Welded Austenitic and Ferritic/Austenitic Stainless Steel Sanitary Tubing), ASME BPE (Bioprocessing Equipment), DIN 11850 Series 2, and 3-A Sanitary Standards 33-02. Fittings comply with BS 4825 Parts 1, 2, and 3, DIN 11852, and ISO 2852.',
        },
        {
          q: 'Are your tubes suitable for automated orbital welding?',
          a: 'Yes. Our electro-polished and hygienic tubes feature controlled sulfur chemistry (0.005%–0.017% S) and precise dimensional tolerances (circularity, square deburred ends) explicitly optimized for repeatable orbital butt-welding without heat tinting or arc deflection.',
        },
      ],
    },
    {
      category: 'Quality & Mill Test Certificates (MTC)',
      icon: FileCheck,
      faqs: [
        {
          q: 'Do you supply EN 10204 Type 3.1 Mill Test Certificates?',
          a: 'Yes. Dispatched tubes, fittings, and valves are backed by genuine EN 10204 3.1 Mill Test Certificates correlating directly to the heat batch number marked on the product. Chemical spectrometry, tensile yield, elongation, and hydrostatic/eddy-current inspection data are fully documented.',
        },
        {
          q: 'Can client third-party inspection agencies (TPIA) witness tests before dispatch?',
          a: 'Yes. Third-party inspections by agencies such as Bureau Veritas, SGS, TUV, or DNV can be coordinated upon commercial agreement prior to order confirmation.',
        },
      ],
    },
    {
      category: 'Commercial Terms, Ordering & Export',
      icon: DollarSign,
      faqs: [
        {
          q: 'What currencies and payment terms do you support?',
          a: 'For domestic Indian supply, we transact in INR with standard GST invoicing. For international B2B clients, quotations can be settled in USD, EUR, GBP, or AED via Telegraphic Transfer (TT) or confirmed Irrevocable Letters of Credit (LC) at sight.',
        },
        {
          q: 'What delivery terms (Incoterms) are available?',
          a: 'We offer Ex-Works (EXW Mumbai warehouse), FOB Nhava Sheva (JNPT Port), CIF destination seaport, or door-to-door courier air freight (DHL / FedEx) for urgent replacement components.',
        },
        {
          q: 'How are sanitary products packaged for export?',
          a: 'All tube ends are fitted with clean polyethylene push-in caps. Tubes are sleeved in plastic tubing and packed in reinforced, fumigated wooden cases (ISPM-15 certified) to prevent transit scratch damage or environmental contamination.',
        },
      ],
    },
  ];

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4">
            Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl font-heading">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            Essential technical, standard compliance, MTC documentation, and export logistics answers for sanitary piping procurement.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {categories.map((cat, catIdx) => {
          const Icon = cat.icon;
          return (
            <div key={catIdx} className="mb-10">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-steel-200">
                <Icon className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-steel-900 font-heading">
                  {cat.category}
                </h2>
              </div>

              <div className="space-y-4">
                {cat.faqs.map((faq, idx) => {
                  const globalIdx = catIdx * 100 + idx;
                  const isOpen = openIndex === globalIdx;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-steel-200 overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-steel-50 transition-colors"
                      >
                        <span className="text-sm font-bold text-steel-900">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-steel-400 transition-transform ${
                            isOpen ? 'transform rotate-180 text-primary-600' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-sm text-steel-600 border-t border-steel-100 leading-relaxed bg-steel-50/30">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Still Have Questions Box */}
        <div className="mt-16 bg-white rounded-xl border border-steel-200 p-8 text-center shadow-sm">
          <HelpCircle className="w-10 h-10 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-steel-900 font-heading">
            Need a Specific Dimensional Schedule?
          </h3>
          <p className="text-steel-600 text-sm mt-2 max-w-md mx-auto">
            Contact our engineering sales desk for custom dimensions, heavy wall tubing, or special alloy inquiries.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/request-quote"
              className="bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Request a Quotation
            </Link>
            <Link
              to="/contact"
              className="bg-steel-100 hover:bg-steel-200 text-steel-800 text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Contact Us Directly
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
