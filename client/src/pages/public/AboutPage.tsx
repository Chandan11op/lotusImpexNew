import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { usePublicContext } from '../../layouts/PublicLayout';
import {
  ShieldCheck,
  Building2,
  Layers,
  MapPin,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openQuoteModal } = usePublicContext();

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-semibold uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            <span>Company Profile • Lotus Impex</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-steel-900 tracking-tight">
            Distributor of Precision Stainless Steel Sanitary & Industrial Solutions
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Headquartered in Mumbai, Maharashtra, Lotus Impex supplies high-purity stainless-steel
            tubes, pipes, Tri-Clamp fittings, dairy unions, valves, and engineered fluid handling
            components to process industries across India and international export markets.
          </p>
        </div>

        {/* Narrative & Business Background */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-steel-200/90 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-steel-900 border-b border-steel-100 pb-3">
              Our Business Focus & Sourcing Approach
            </h2>
            <p className="text-sm text-steel-700 leading-relaxed">
              In modern hygienic processing lines—whether in dairy cooperatives, pharmaceutical
              formulation facilities, beverage bottling plants, or specialty chemical skids—fluid
              purity is directly determined by the quality of tube bores, weld joints, and valve
              seats. A microscopic pocket or poor surface finish can create bacteria harbors that
              jeopardize an entire batch.
            </p>
            <p className="text-sm text-steel-700 leading-relaxed">
              Lotus Impex bridges the gap between precision stainless steel manufacturers and
              process engineering teams. We focus on standard-compliant materials (ASTM A270, SMS
              1145, DIN 11850, 3-A Sanitary, ASME BPE) in both AISI 304 and AISI 316L grades.
            </p>

            <div className="p-4 bg-steel-50 rounded-xl border border-steel-200 text-xs space-y-2">
              <span className="font-bold text-steel-800 uppercase tracking-wider block">
                Corporate Identity & Product Branding Architecture
              </span>
              <p className="text-steel-600 leading-relaxed">
                The business operates under the parent commercial entity <strong>Lotus Impex</strong>.
                A specialized product line brand, provisionally designated as <em>"Aeron"</em>, was
                introduced for sanitary valve and fitting lines and is currently configurable
                within our administration portal while brand finalization is completed.
              </p>
            </div>
          </div>

          {/* Quick Facts Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-steel-200/90 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-steel-900 border-b border-steel-100 pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-blue" />
              <span>Location & Operations</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-steel-400 block font-semibold">Central Office & Logistics:</span>
                <span className="text-steel-800 font-medium">
                  Industrial Area, Kanjurmarg West, Mumbai 400078, Maharashtra, India
                </span>
              </div>

              <div>
                <span className="text-steel-400 block font-semibold">Primary Products:</span>
                <span className="text-steel-800 font-medium">
                  Sanitary tubes, ASTM A270 pipes, TC clamps, weld ferrules, butterfly valves, DIN
                  unions, electropolished fittings
                </span>
              </div>

              <div>
                <span className="text-steel-400 block font-semibold">Serving:</span>
                <span className="text-steel-800 font-medium">
                  Dairy, Biopharma, Food & Beverage, Breweries, Process Engineering & Global Buyers
                </span>
              </div>

              <div>
                <span className="text-steel-400 block font-semibold">Verification Policy:</span>
                <span className="text-steel-800 font-medium">
                  Transparent mill test reports (MTR) and dimensional tolerance checks per batch
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openQuoteModal()}
                className="w-full justify-center"
              >
                Request a Product Quotation
              </Button>
            </div>
          </div>
        </div>

        {/* Pillars / Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-steel-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-steel-900">Documented Material Grades</h3>
            <p className="text-xs text-steel-600 leading-relaxed">
              We insist on verified AISI 304 and 316L chemical compositions to protect against
              chloride pitting, acid cleaning degradation, and intergranular corrosion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-steel-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-steel-900">Surface Finish Integrity</h3>
            <p className="text-xs text-steel-600 leading-relaxed">
              From mechanical mirror polish (Ra ≤ 0.8 µm) to electropolished SF4 sanitary surfaces
              (Ra ≤ 0.4 µm), our products facilitate rapid Clean-In-Place (CIP) sanitization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-steel-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-steel-900">Responsive Technical Quotations</h3>
            <p className="text-xs text-steel-600 leading-relaxed">
              Our Mumbai sales desk reviews drawings, schedule requirements, and port freight
              options to return competitive, structured quotes within 24 hours.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 sm:p-10 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Connect With Our Mumbai Team</h2>
          <p className="text-sm text-steel-300 max-w-xl mx-auto leading-relaxed">
            Need pricing, dimensional drawings, or export logistics guidance? Contact our sales desk
            or browse our complete catalogue online.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products">
              <Button variant="primary" size="md">
                Browse Catalogue
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="md"
                className="bg-steel-800 text-white border-steel-700 hover:bg-steel-700"
              >
                Contact Sales Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
