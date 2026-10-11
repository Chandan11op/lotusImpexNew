import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { usePublicContext } from '../../layouts/PublicLayout';
import { Factory, ShieldAlert, Cpu, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const { openQuoteModal } = usePublicContext();

  const industries = [
    {
      title: 'Dairy & Milk Processing Plants',
      description:
        'Sanitary milk processing lines require continuous hygiene, zero stagnant crevices, and reliable thermal resistance against high-temperature short-time (HTST) pasteurization and aggressive caustic/acid CIP cycles.',
      keyProducts: [
        'ASTM A270 SS304/316L Sanitary Tubes',
        'DIN 11851 Milk Pipe Unions and Gaskets',
        'SMS 1145 Complete Couplings',
        'Sanitary Non-Return Spring Check Valves',
      ],
      standards: '3-A Sanitary, DIN 11851, SMS 1145',
    },
    {
      title: 'Pharmaceutical Processing & WFI Loops',
      description:
        'Biopharmaceutical formulation, vaccine preparation, and Water For Injection (WFI) loops demand the highest degree of surface smoothness to prevent biofilm adhesion and corrosion pitting.',
      keyProducts: [
        'Electropolished Tubes & Fittings (Ra < 0.4 µm EP)',
        'ASME BPE SF4 Weld Ferrules & Tri-Clamps',
        'Weir-Type Sanitary Diaphragm Valves',
        'Self-Draining Eccentric Reducers',
      ],
      standards: 'ASME BPE, FDA 21 CFR, EN 10204 3.1',
    },
    {
      title: 'Food, Beverage & Brewery Processing',
      description:
        'From fruit juice concentrate mixing to beer fermentation cellar piping, our sanitary fittings ensure product flavor preservation, rapid Clean-In-Place cycling, and vibration-proof Tri-Clamp connections.',
      keyProducts: [
        'Sanitary Multi-Position Butterfly Valves',
        '13MHH Heavy Duty Tri-Clamp Clamps & Ferrules',
        'Food Grade EPDM & Silicone Gasket Sets',
        'Sanitary 90° & 45° Long Radius Bends',
      ],
      standards: 'BS 4825, ISO 2852, 3-A Standards',
    },
    {
      title: 'Chemical & Industrial Process Piping',
      description:
        'For high-purity chemical skids, solvent recovery headers, and specialized fluid metering where both mechanical pressure integrity and corrosion resistance are mandatory.',
      keyProducts: [
        'SS316L High Pressure TC to ANSI Flange Adapters',
        'Equal & Reducing Sanitary Tees',
        'Heavy Wall Sanitary Spool Assemblies',
      ],
      standards: 'ANSI B16.5, ISO 2037',
    },
  ];

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-semibold uppercase tracking-wider">
            <Factory className="h-3.5 w-3.5" />
            <span>Industries & Engineering Applications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-steel-900 tracking-tight">
            Sanitary Stainless Solutions Tailored for High-Purity Fluid Handling
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Our stainless-steel components are engineered to deliver reliable fluid isolation,
            turbulent-free laminar flow, and dependable sanitization across mission-critical
            hygienic process industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-steel-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider block mb-1">
                  Sector 0{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-steel-900 mb-3">{ind.title}</h3>
                <p className="text-xs sm:text-sm text-steel-600 leading-relaxed mb-6">
                  {ind.description}
                </p>

                <div className="bg-steel-50 rounded-xl p-4 border border-steel-100 text-xs mb-6">
                  <span className="font-bold text-steel-800 uppercase tracking-wider block mb-2">
                    Primary Component Solutions:
                  </span>
                  <ul className="space-y-1.5">
                    {ind.keyProducts.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2 text-steel-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-steel-100 flex items-center justify-between text-xs">
                <span className="text-steel-500 font-semibold">Standards: {ind.standards}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openQuoteModal()}
                  icon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Quote Specs
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guidance Banner */}
        <div className="bg-navy-950 text-white p-8 sm:p-10 rounded-2xl border border-steel-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold">Have Specific Line Size or Temperature Requirements?</h3>
            <p className="text-xs text-steel-300">
              Share your engineering drawings, medium temperature, pressure envelope, and delivery
              timeline with our technical sales engineers in Mumbai.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => openQuoteModal()}
            className="shrink-0"
          >
            Submit Application RFQ
          </Button>
        </div>
      </div>
    </div>
  );
};
