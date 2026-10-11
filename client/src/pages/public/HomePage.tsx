import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicContext } from '../../layouts/PublicLayout';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/public/ProductCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Layers,
  Sparkles,
  Cpu,
  Factory,
  Sliders,
  Send,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { openQuoteModal } = usePublicContext();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getPublicProducts({ limit: 6 });
        if (res?.success && res.data?.products) {
          setFeaturedProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    {
      title: 'Sanitary Tubes & Pipes',
      desc: 'ASTM A270 SS304/316L dairy & pharma grade orbital welded tubes',
      icon: <Layers className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=Sanitary+Tubes+%26+Pipes',
    },
    {
      title: 'Tri-Clamp Clamps & Ferrules',
      desc: 'Heavy duty 13MHH double bolt clamps and CNC weld ferrules',
      icon: <Sliders className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=TC+Clamps+%26+Ferrules',
    },
    {
      title: 'Butterfly & Dairy Valves',
      desc: 'Hygienic multi-position pull handle and pneumatic actuation valves',
      icon: <Cpu className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=Valves+%26+Butterfly+Valves',
    },
    {
      title: 'Sanitary Bends & Elbows',
      desc: '90° and 45° uniform wall thickness sanitary mandrel bends',
      icon: <Factory className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=Bends+%26+Elbows',
    },
    {
      title: 'DIN 11851 & SMS Unions',
      desc: 'European dairy union sets, slotted nuts, liners and food gaskets',
      icon: <Layers className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=Unions+%26+DIN+Unions',
    },
    {
      title: 'Electropolished Biopharma Fittings',
      desc: 'ASME BPE compliant high-purity components with Ra < 0.4µm finish',
      icon: <Sparkles className="h-6 w-6 text-brand-blue" />,
      link: '/products?category=Electropolished+Fittings',
    },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative bg-navy-950 text-white overflow-hidden py-20 lg:py-28 border-b border-steel-800">
        {/* Subtle engineering background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Stainless Steel Sanitary Solutions • Mumbai, India</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Precision Stainless Steel Solutions for Sanitary & Process Industries
              </h1>

              <p className="text-base sm:text-lg text-steel-300 leading-relaxed max-w-2xl">
                Explore high-purity stainless-steel tubes, pipes, valves, Tri-Clamp fittings, and
                hygienic fluid components for dairy, pharmaceutical, food processing, and chemical
                installations. Share your specifications for a rapid tailored quotation.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                    Explore Product Catalogue
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => openQuoteModal()}
                  className="bg-steel-900/60 text-white border-steel-600 hover:bg-steel-800 hover:text-white"
                  icon={<Send className="h-4 w-4 text-cyan-400" />}
                >
                  Request a Quotation
                </Button>
              </div>

              {/* Verified core specs callouts */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-steel-800/80 text-xs text-steel-400">
                <div>
                  <span className="block font-bold text-white text-sm">AISI 304 / 316L</span>
                  <span>Certified Stainless Grades</span>
                </div>
                <div>
                  <span className="block font-bold text-white text-sm">Ra ≤ 0.8 / 0.4 µm</span>
                  <span>Mechanical & EP Finishes</span>
                </div>
                <div>
                  <span className="block font-bold text-white text-sm">3-A / DIN / SMS</span>
                  <span>Hygienic Process Standards</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-steel-900 border border-steel-700/80 p-3 shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Precision Stainless Steel Process Line"
                  className="rounded-xl w-full object-cover aspect-4/3 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="mt-3 px-3 pb-2 flex items-center justify-between text-xs text-steel-400">
                  <span className="font-semibold text-white">Precision Sanitary Bores & Weld Ends</span>
                  <span className="text-cyan-400 font-mono">EN 10204 3.1 Traceable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Taxonomy Categories Showcase */}
      <section className="py-16 bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">
              Product Taxonomy
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-steel-900">
              Engineered Sanitary Components
            </h3>
            <p className="mt-2 text-sm text-steel-600">
              Browse our core stainless steel product categories built for hygienic process
              integrity and seamless Clean-In-Place (CIP) performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group p-6 rounded-xl border border-steel-200 bg-steel-50/50 hover:bg-white hover:border-brand-blue/50 hover:shadow-md transition-all duration-200 flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-white border border-steel-200 shadow-xs group-hover:border-brand-blue group-hover:bg-blue-50/50 transition-colors shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-steel-900 group-hover:text-brand-blue transition-colors flex items-center gap-1.5">
                    <span>{cat.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-blue" />
                  </h4>
                  <p className="mt-1 text-xs text-steel-600 leading-relaxed">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="py-16 bg-steel-50 border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
                Featured Inventory
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-steel-900">
                Popular Sanitary Products
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-steel-600">
                Representative high-specification fittings and valves available for immediate
                quotation.
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                View Complete Catalogue
              </Button>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading verified product inventory..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onRequestQuote={(p) => openQuoteModal({ _id: p._id, name: p.name })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Industries Served */}
      <section className="py-16 bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">
              Hygienic Applications
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-steel-900">
              Trusted Across Critical Processing Industries
            </h3>
            <p className="mt-2 text-sm text-steel-600">
              Engineered to meet the stringent sanitation and corrosion requirements of sanitary
              fluid handling systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-steel-200 bg-steel-50/60 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-steel-900 mb-2">Dairy & Milk Processing</h4>
              <p className="text-xs text-steel-600 leading-relaxed">
                Raw milk reception, pasteurization loops, homogenization manifolds, and automated
                Clean-In-Place (CIP) return lines using SMS and DIN 11851 unions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-steel-200 bg-steel-50/60 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-steel-900 mb-2">Biopharmaceutical & WFI</h4>
              <p className="text-xs text-steel-600 leading-relaxed">
                Water for Injection (WFI), purified water storage, vaccine batching, and sterile
                filtration skid lines using electropolished ASME BPE SF4 fittings.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-steel-200 bg-steel-50/60 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-steel-900 mb-2">Food & Beverage Plants</h4>
              <p className="text-xs text-steel-600 leading-relaxed">
                Syrup dosing, fruit juice pasteurization, aseptic bottling headers, and carbonated
                beverage distribution manifolds with hygienic butterfly valves.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-steel-200 bg-steel-50/60 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-steel-900 mb-2">Process & Chemical Lines</h4>
              <p className="text-xs text-steel-600 leading-relaxed">
                High-corrosion chemical formulations, solvent recovery systems, and brewery
                fermentation cellar piping with ANSI to Tri-Clamp flange adapters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quality & Sourcing Principles */}
      <section className="py-16 bg-navy-900 text-white border-b border-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Transparent Quality Principles</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Quality Verification & Material Traceability
              </h3>
              <p className="mt-4 text-sm text-steel-300 leading-relaxed">
                Lotus Impex prioritizes verifiable dimensional accuracy and documented material
                grades over unsubstantiated marketing claims. Every batch is evaluated against
                hygienic standards before order dispatch.
              </p>

              <div className="mt-6 space-y-3 text-xs text-steel-300">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Chemical & Mechanical Grade Verification:</strong>
                    Mill test documentation confirming AISI 304 or AISI 316L chemical composition.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Surface Finish & Bore Inspection:</strong>
                    Internal surface roughness inspection to ensure Ra ≤ 0.8 µm or Ra ≤ 0.4 µm (EP).
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Accurate Dimensional Checks:</strong>
                    Calibrated micrometers and go/no-go gauges verifying ferrule angles and tube wall consistency.
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/quality">
                  <Button variant="outline" size="sm" className="bg-transparent text-white border-steel-600 hover:bg-steel-800">
                    Read Our Quality Approach
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-steel-800/80 border border-steel-700 rounded-2xl p-6 sm:p-8 space-y-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <span>Our Sourcing Promise to Buyers</span>
              </h4>
              <p className="text-xs text-steel-300 leading-relaxed">
                We clearly separate verified supplier specifications from unconfirmed statements.
                When you request a quotation from Lotus Impex, you receive genuine dimensional
                drawings, material specifications, and clear delivery terms from our Mumbai supply
                desk.
              </p>
              <div className="p-4 bg-steel-900/80 rounded-xl border border-steel-700/80 text-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Product Branding Note:
                </span>
                <p className="text-steel-400">
                  Products are distributed under the company name Lotus Impex. The provisional
                  product line brand "Aeron" is currently under evaluation and remains configurable
                  in our system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Direct Quotation Call to Action */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Discuss Your Sanitary Piping Specifications?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Whether you require standard 13MHH Tri-Clamp couplings, ASTM A270 dairy tubing, or
            custom sanitary manifold configurations, our engineering desk in Mumbai is ready to
            assist.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openQuoteModal()}
              className="bg-white text-brand-blue hover:bg-blue-50 font-bold shadow-lg"
              icon={<Send className="h-4 w-4" />}
            >
              Request a Quotation Now
            </Button>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-300 text-white hover:bg-blue-800"
              >
                Contact Sales Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
