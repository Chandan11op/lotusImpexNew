import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/public/ProductCard';
import { usePublicContext } from '../../layouts/PublicLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ArrowLeft, ShieldCheck, CheckCircle2, FileSpreadsheet, ArrowRight } from 'lucide-react';

const CATEGORY_SLUG_MAP: Record<string, { name: string; headline: string; description: string; standards: string; finish: string }> = {
  'sanitary-pipes': {
    name: 'Sanitary Pipes and Tubes',
    headline: 'High-Purity Stainless Steel Sanitary Tubes & Process Pipes',
    description: 'Austenitic SS 304 and SS 316L sanitary tubes manufactured to ASTM A270 and DIN 11850 standards with controlled sulfur chemistry for repeatable automated orbital butt-welding.',
    standards: 'ASTM A270, ASME BPE, DIN 11850 Series 2, 3-A 33-02',
    finish: 'Internal Ra < 0.8 µm (MP) / Ra < 0.4 µm (EP)',
  },
  'electro-polished-pipes': {
    name: 'Electro-Polished Pipes',
    headline: 'Ultra-Pure Electro-Polished Stainless Steel Tubing (Ra < 0.4 µm)',
    description: 'High-purity electro-polished tubes engineered for pharmaceutical Water-for-Injection (WFI), high-purity clean steam, and sterile biotechnology bioprocess loops.',
    standards: 'ASTM A270-S2, ASME BPE DT-4-1',
    finish: 'Internal Ra < 0.38 µm (15 µin) Electro-polished',
  },
  'mechanically-polished-pipes': {
    name: 'Mechanically Polished Pipes',
    headline: 'Sanitary Mechanically Polished Tubing (320 Grit Ra < 0.8 µm)',
    description: 'Precision mechanical polished tubes delivering smooth bore cleanability for dairy processing, brewery transfer manifolds, and food handling pipelines.',
    standards: 'ASTM A270, DIN 11850, BS 4825 Part 1',
    finish: 'Internal Ra < 0.8 µm (32 µin)',
  },
  'sanitary-pipe-fittings': {
    name: 'Sanitary Pipe Fittings',
    headline: 'Hygienic Orbital Weld Bends, Tees, and Reducers',
    description: 'Precision forged and hydroformed sanitary fittings designed without crevices or dead zones. Includes 90° bends, equal tees, reducing tees, and eccentric flat-bottom reducers.',
    standards: 'BS 4825 Part 2, ASME BPE, DIN 11852',
    finish: 'Internal Ra < 0.8 µm / Optional Ra < 0.4 µm EP',
  },
  'tri-clamp-fittings': {
    name: 'Tri-Clamp Fittings',
    headline: 'Sanitary Tri-Clamp (TC) Ferrules, Clamps, and Unions',
    description: 'Quick-release sanitary Tri-clamp connections designed for rapid manual disassembly during CIP/SIP protocols with precision gasket containment.',
    standards: 'BS 4825 Part 3, ISO 2852, 3-A 63-04',
    finish: 'CNC Machined Ra < 0.5 µm',
  },
  'clamps-and-ferrules': {
    name: 'Clamps and Ferrules',
    headline: 'Heavy-Duty 13MHH Clamps & Long/Short Weld Ferrules',
    description: 'Robust forged stainless steel clamps paired with CNC-machined SS 316L long and short weld ferrules providing secure, leak-free sanitary pipe joints.',
    standards: 'BS 4825 Part 3, 3-A 63-04',
    finish: 'Machined Ra < 0.5 µm / Exterior Mirror',
  },
  'gaskets': {
    name: 'Sanitary Gaskets',
    headline: 'USP Class VI & FDA Compliant Sanitary Tri-Clamp Gaskets',
    description: 'High performance sanitary gaskets molded from platinum-cured silicone, food-grade EPDM, and virgin PTFE with zero mold flash and superior compression recovery.',
    standards: 'FDA 21 CFR 177.2600, USP Class VI, 3-A 18-03',
    finish: 'Cleanroom Micro-Molded',
  },
  'sanitary-valves': {
    name: 'Manual Sanitary Valves',
    headline: 'Hygienic Butterfly, Diaphragm, and Cavity-Filled Ball Valves',
    description: 'Full-bore sanitary valves offering zero dead leg shut-off and throttling control across dairy, pharmaceutical, and brewery liquid handling lines.',
    standards: '3-A Sanitary, ASME BPE, ISO 5211',
    finish: 'Internal Ra < 0.8 µm / Ra < 0.4 µm EP',
  },
  'pneumatic-valves': {
    name: 'Pneumatic Valves',
    headline: 'Pneumatically Actuated Hygienic Ball and Butterfly Valves',
    description: 'Automated sanitary valves equipped with rack-and-pinion actuators, solenoid pilots, and dual microswitch position feedback for automated batch plants.',
    standards: 'NAMUR VDI/VDE 3845, ISO 5211',
    finish: 'Internal Ra < 0.6 µm',
  },
  'tank-cleaning-accessories': {
    name: 'Spray Balls and Tank Accessories',
    headline: '360° Stationary & Rotary CIP Tank Cleaning Spray Balls',
    description: 'High-efficiency stainless steel spray heads engineered for complete spherical washdown coverage of storage silos, mixing vessels, and bioreactors.',
    standards: '3-A Sanitary 78-00, DIN 11850',
    finish: 'Mirror Polished Ra < 0.4 µm',
  },
};

export function CategoryPage() {
  const { categorySlug, slug } = useParams<{ categorySlug?: string; slug?: string }>();
  const effectiveCatSlug = categorySlug || slug || '';
  const { openQuoteModal } = usePublicContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize category lookup
  const meta = (effectiveCatSlug && CATEGORY_SLUG_MAP[effectiveCatSlug]) || {
    name: effectiveCatSlug ? effectiveCatSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Products',
    headline: 'Sanitary Stainless Steel Solutions',
    description: 'Engineered fluid handling components complying with international hygienic processing standards.',
    standards: 'ASTM A270, ASME BPE, DIN 11850, BS 4825',
    finish: 'Ra < 0.8 µm / Ra < 0.4 µm EP',
  };

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        // Query products matching category name or slug pattern
        const res = await api.getPublicProducts({
          category: meta.name !== 'Products' ? meta.name : undefined,
          search: effectiveCatSlug?.replace(/-/g, ' '),
          limit: 30,
        });

        if (res?.success && res.data?.products) {
          // If category filter returned exact products, use them; otherwise use public list
          if (res.data.products.length > 0) {
            setProducts(res.data.products);
          } else {
            const fallbackRes = await api.getPublicProducts({ limit: 20 });
            setProducts(fallbackRes.data?.products || []);
          }
        }
      } catch (err) {
        console.error('Failed to load category products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [effectiveCatSlug, meta.name]);

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Category Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-steel-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Complete Catalogue
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4 ml-4">
            Category Showcase
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl font-heading">
            {meta.headline}
          </h1>

          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            {meta.description}
          </p>

          {/* Quick Technical Specs Strip */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl pt-6 border-t border-steel-800">
            <div>
              <span className="text-xs font-semibold uppercase text-steel-400">Applicable Standards</span>
              <p className="text-sm font-bold text-white mt-0.5">{meta.standards}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-steel-400">Surface Finish Range</span>
              <p className="text-sm font-bold text-white mt-0.5">{meta.finish}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-steel-400">Available Grades</span>
              <p className="text-sm font-bold text-white mt-0.5">SS 304 / SS 316L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-steel-900 font-heading">
              Available {meta.name}
            </h2>
            <p className="text-sm text-steel-500 mt-1">
              Select any item for technical dimensional ranges, MTC details, or to request a commercial quote.
            </p>
          </div>

          <Link
            to="/request-quote"
            className="hidden sm:inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
          >
            Request Quotation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Loading technical product catalogue..." />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-steel-200 p-12 text-center max-w-md mx-auto">
            <p className="text-steel-600 font-medium">No products currently found in this category.</p>
            <Link
              to="/products"
              className="mt-4 inline-block bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRequestQuote={() => openQuoteModal(product)}
              />
            ))}
          </div>
        )}

        {/* Quality Assurance Banner */}
        <div className="mt-16 bg-white rounded-2xl border border-steel-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-steel-900 font-heading">
                Material Authenticity Guarantee
              </h3>
              <p className="text-steel-600 text-sm mt-1 max-w-2xl leading-relaxed">
                All sanitary components in this category can be supplied with certified EN 10204 Type 3.1 Mill Test Certificates verifying chemical spectrometry, mechanical properties, and hydrostatic/eddy-current testing.
              </p>
            </div>
          </div>
          <Link
            to="/submit-boq"
            className="bg-steel-900 hover:bg-steel-800 text-white text-xs font-semibold px-6 py-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-accent-teal" />
            Submit Category BOQ
          </Link>
        </div>
      </div>
    </div>
  );
}
