import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-steel-950 text-steel-300 pt-16 pb-12 border-t border-steel-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-steel-800 border border-steel-700 flex items-center justify-center text-cyan-400">
                <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 6L23 13V21L16 26L9 21V13L16 6Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="16" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">LOTUS IMPEX</span>
            </div>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Mumbai-based distributor & supplier of high-purity stainless-steel sanitary tubes,
              pipes, TC clamps, dairy fittings, valves, bends, and electropolished components for
              dairy, pharmaceutical, food processing, and process industries.
            </p>
            <div className="pt-2 text-xs text-steel-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Unit 14, Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>+91 22 2847 0000 / +91 98200 00000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>sales@lotusimpex.com / info@lotusimpex.com</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Sanitary Catalogue
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products/sanitary-pipes" className="hover:text-white transition-colors">
                  Sanitary Pipes & Tubes (ASTM A270)
                </Link>
              </li>
              <li>
                <Link to="/products/electro-polished-pipes" className="hover:text-white transition-colors">
                  Electro-Polished Tubing (Ra &lt; 0.4µm)
                </Link>
              </li>
              <li>
                <Link to="/products/tri-clamp-fittings" className="hover:text-white transition-colors">
                  Tri-Clamp Ferrules & Clamps
                </Link>
              </li>
              <li>
                <Link to="/products/sanitary-valves" className="hover:text-white transition-colors">
                  Butterfly & Diaphragm Valves
                </Link>
              </li>
              <li>
                <Link to="/products/sanitary-pipe-fittings" className="hover:text-white transition-colors">
                  Sanitary 90° Bends & Equal Tees
                </Link>
              </li>
              <li>
                <Link to="/products/gaskets" className="hover:text-white transition-colors">
                  USP Class VI Sanitary Gaskets
                </Link>
              </li>
              <li>
                <Link to="/products/tank-cleaning-accessories" className="hover:text-white transition-colors">
                  CIP Spray Balls & Tank Devices
                </Link>
              </li>
            </ul>
          </div>

          {/* Applications & Operations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Industries & Process
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/industries/pharmaceutical" className="hover:text-white transition-colors">
                  Pharmaceuticals & Bioprocess
                </Link>
              </li>
              <li>
                <Link to="/industries/dairy" className="hover:text-white transition-colors">
                  Dairy & Milk Processing Lines
                </Link>
              </li>
              <li>
                <Link to="/industries/food-beverage" className="hover:text-white transition-colors">
                  Food, Beverage & Breweries
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-white transition-colors">
                  Quality & EN 10204 3.1 MTC
                </Link>
              </li>
              <li>
                <Link to="/supply-process" className="hover:text-white transition-colors">
                  Supply & Enquiry Workflow
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-white transition-colors">
                  Media & Technical Inspection
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Internal Access & Brand Notice */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Enquiries & Portals
            </h4>
            <div className="p-3 bg-steel-900 border border-steel-800 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Protected CRM Portal</span>
              </div>
              <p className="text-[11px] text-steel-400">
                Real-time lead tracking, commercial quotations, task management, and product catalogue administration.
              </p>
              <div className="pt-1 flex flex-col gap-1.5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>Access CRM Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <Link to="/request-quote" className="text-cyan-400 hover:underline">
                    Request Quote
                  </Link>
                  <span className="text-steel-600">•</span>
                  <Link to="/submit-boq" className="text-cyan-400 hover:underline">
                    Submit BOQ
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-steel-500">
              <span className="block font-semibold text-steel-400">Product Branding Note:</span>
              Lotus Impex is the provisional corporate identity. Dedicated product brand (e.g. Aeron) is centrally configurable.
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-steel-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-steel-500">
          <p>© {new Date().getFullYear()} Lotus Impex. All rights reserved. Mumbai, India.</p>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-steel-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-steel-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <LanguageSelector variant="full" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};
