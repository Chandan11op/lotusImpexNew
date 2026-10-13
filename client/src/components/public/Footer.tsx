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
                <Link to="/products?category=Sanitary+Tubes+%26+Pipes" className="hover:text-white transition-colors">
                  Sanitary Tubes & Pipes (ASTM A270)
                </Link>
              </li>
              <li>
                <Link to="/products?category=TC+Clamps+%26+Ferrules" className="hover:text-white transition-colors">
                  Tri-Clamp Clamps & Ferrules
                </Link>
              </li>
              <li>
                <Link to="/products?category=Valves+%26+Butterfly+Valves" className="hover:text-white transition-colors">
                  Butterfly & Dairy Valves
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bends+%26+Elbows" className="hover:text-white transition-colors">
                  Sanitary 90° & 45° Bends
                </Link>
              </li>
              <li>
                <Link to="/products?category=Tees+%26+Crosses" className="hover:text-white transition-colors">
                  Equal & Reducing Tees
                </Link>
              </li>
              <li>
                <Link to="/products?category=Unions+%26+DIN+Unions" className="hover:text-white transition-colors">
                  DIN 11851 & SMS Dairy Unions
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electropolished+Fittings" className="hover:text-white transition-colors">
                  Electropolished Fittings (Ra &lt; 0.4µm)
                </Link>
              </li>
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Target Industries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Dairy & Milk Processing Lines
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Biopharmaceutical & WFI Loops
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Food, Beverage & Bottling Plants
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Brewery & Fermentation Systems
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-white transition-colors">
                  Industrial Chemical & Fluid Piping
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-white transition-colors">
                  Quality & Material Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Internal Access & Brand Notice */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Internal Systems
            </h4>
            <div className="p-3 bg-steel-900 border border-steel-800 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Protected CRM Portal</span>
              </div>
              <p className="text-[11px] text-steel-400">
                Real-time lead tracking, enquiry assignment, follow-up management, and product catalogue administration.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-400 transition-colors pt-1"
              >
                <span>Access CRM Dashboard</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="text-[11px] text-steel-500">
              <span className="block font-semibold text-steel-400">Product Branding Note:</span>
              Draft product line branding "Aeron" is configurable in company administration.
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-steel-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-steel-500">
          <p>© {new Date().getFullYear()} Lotus Impex. All rights reserved. Mumbai, India.</p>
          <div className="flex items-center gap-4">
            <LanguageSelector variant="full" />
            <ThemeToggle />
            <span>•</span>
            <Link to="/contact" className="hover:text-steel-300">
              Contact Mumbai Sales Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
