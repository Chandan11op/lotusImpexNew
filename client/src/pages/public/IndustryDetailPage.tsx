import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle, FileSpreadsheet, PhoneCall } from 'lucide-react';

const INDUSTRY_DATA: Record<
  string,
  {
    title: string;
    headline: string;
    tagline: string;
    description: string;
    standards: string[];
    recommendedGrades: string;
    typicalComponents: string[];
    challengesSolved: string[];
  }
> = {
  pharmaceutical: {
    title: 'Pharmaceuticals & API Manufacturing',
    headline: 'High-Purity Process Piping for Sterile Pharmaceutical Applications',
    tagline: 'ASME BPE & ASTM A270-S2 Compliant Solutions with Ultra-Low Ra Profilometry',
    description:
      'Pharmaceutical active pharmaceutical ingredient (API) synthesis, parenteral filling, and formulation lines demand uncompromising microbial cleanability, zero dead-legs, and complete drainability. We supply austenitic SS 316L electro-polished tubing and aseptic weir diaphragm valves engineered to prevent bio-burden accumulation.',
    standards: ['ASME BPE', 'ASTM A270-S2', 'EN 10204 Type 3.1', 'USP Class VI', 'FDA 21 CFR 177.2600'],
    recommendedGrades: 'SS 316L (UNS S31603 / 1.4404) with controlled sulfur (0.005%–0.017%)',
    typicalComponents: [
      'SS 316L Electro-Polished Tubing (Ra < 0.4 µm)',
      'Aseptic Weir Diaphragm Valves (ASME BPE)',
      'Flat-Bottom Eccentric Reducers for Gravity Drainage',
      'Orbital Weld Equal and Reducing Branch Tees',
      'Platinum-Cured USP Class VI Silicone TC Gaskets',
    ],
    challengesSolved: [
      'Elimination of rogue dead-legs in distribution loops',
      'Repeatable automatic orbital butt-welding without heat tinting',
      'Resistance against hot Water-for-Injection (WFI) up to 85°C and clean steam up to 134°C',
    ],
  },
  biotechnology: {
    title: 'Biotechnology & Fermentation',
    headline: 'Sterile Bioprocess Piping & Fermentation Fluid Management',
    tagline: 'Engineered for Bioreactors, Tangential Flow Filtration, and Media Prep',
    description:
      'Bioprocessing environments require smooth wetted profiles that eliminate cell shear, prevent protein adherence, and withstand rigorous Clean-in-Place (CIP) and Steam-in-Place (SIP) thermal cycling. Our sanitary piping components provide mirror-smooth bore finishes and validated elastomer seals.',
    standards: ['ASME BPE', 'ASTM A270-S2', 'FDA 21 CFR', '3-A Sanitary Standards'],
    recommendedGrades: 'SS 316L / Electropolished Ra < 0.38 µm',
    typicalComponents: [
      'SS 316L Electro-Polished Sanitary Tubing',
      'Aseptic Microbial Sampling Valves',
      'PTFE Encapsulated Sanitary Ball Valves',
      '360° Rotary Tank Cleaning Spray Balls',
      'Precision Machined Tri-Clamp Ferrules',
    ],
    challengesSolved: [
      'Zero biological cross-contamination between fermenter batches',
      'High resistance against aggressive alkaline/acid CIP washdowns',
      'Integrity under vacuum and thermal shock during live steam sterilization',
    ],
  },
  dairy: {
    title: 'Dairy & Milk Processing',
    headline: 'Hygienic Fluid Handling for Milk Chilling, Pasteurization & Cheese Lines',
    tagline: '3-A Sanitary & DIN 11850 Compliant Components for High-Throughput Processing',
    description:
      'Dairy processing requires sanitary stainless components that resist milk stone formation, support rapid turbulent CIP sanitization, and allow quick disassembly for routine visual inspection. We provide SS 304 and SS 316L sanitary tubes, 13MHH clamps, and multi-position butterfly valves.',
    standards: ['3-A Sanitary Standards', 'DIN 11850 Series 2', 'SMS 1145', 'ISO 2037'],
    recommendedGrades: 'SS 304 / SS 316L Mechanical Polish (Ra < 0.8 µm)',
    typicalComponents: [
      'Sanitary Mechanically Polished Tubes (ASTM A270 / DIN 11850)',
      '13MHH Heavy-Duty Double Bolt TC Clamps',
      'SS 316L 4-Position Sanitary Butterfly Valves',
      'SMS 1145 Complete 4-Piece Unions',
      'Food-Grade EPDM Tri-Clamp Gaskets',
    ],
    challengesSolved: [
      'Prevention of bacterial harborage and sour milk residues in piping joints',
      'Rapid manual disassembly without tools using heavy-duty wing-nut clamps',
      'Cost-effective sanitary balance between SS 304 and SS 316L process lines',
    ],
  },
  'food-beverage': {
    title: 'Food & Beverage Processing',
    headline: 'Sanitary Process Piping for Juice, Edible Oils, Sauces & Liquid Foods',
    tagline: 'FDA Compliant Stainless Steel Tubes, Bends, and Valves',
    description:
      'High viscosity syrups, fruit juices with particulates, and edible oil transfer require sanitary flow equipment with full bore passages, minimal friction drop, and durable elastomeric seals resistant to organic fruit acids.',
    standards: ['FDA 21 CFR', '3-A Sanitary', 'BS 4825', 'DIN 11852'],
    recommendedGrades: 'SS 304 / SS 316L (Ra < 0.8 µm MP)',
    typicalComponents: [
      'Full-Port 3-Piece Cavity Filled Ball Valves',
      'Sanitary 90° & 45° Long Radius Bends (1.5D)',
      'Concentric and Eccentric Reducers',
      'Pneumatically Actuated Diverter Valves',
      'Stationary CIP Spray Heads',
    ],
    challengesSolved: [
      'Laminar flow transitions to reduce shear stress on fruit pulps and emulsions',
      'Cavity-filled valve bodies preventing sugar syrup crystallization around the ball',
      'Long-term durability against hot water sanitization and steam flushes',
    ],
  },
  breweries: {
    title: 'Breweries, Distilleries & Craft Beverage',
    headline: 'Precision Stainless Steel Lines for Wort, Fermentation, and Cellaring',
    tagline: 'Hygienic Tri-Clamp & DIN Unions for Microbreweries & Industrial Plants',
    description:
      'Brewery cellars require versatile, easily reconfigurable piping networks capable of maintaining sterile yeast cultures and resisting beer stone (calcium oxalate) buildup. We supply TC manifolds, sample valves, and butterfly throttling valves.',
    standards: ['DIN 11851', 'BS 4825 Part 3', 'SMS 1145', '3-A Sanitary'],
    recommendedGrades: 'SS 304 & SS 316L',
    typicalComponents: [
      'Heavy-Duty Tri-Clamp Ferrules and Clamps',
      'Sanitary Butterfly Valves with EPDM Seats',
      'Aseptic Spigot Sampling Cocks',
      'Rotary CIP Spray Balls for Bright Beer Tanks',
      'Long Radius Mandrel-Bent Bends',
    ],
    challengesSolved: [
      'Prevention of wild yeast contamination through crevice-free joint sealing',
      'Rapid hop and trub separation manifolds with zero flow obstruction',
      'Modular re-routing of cellar transfer hoses and fixed hard-piped lines',
    ],
  },
  'water-treatment': {
    title: 'Water Treatment & Pure Water Systems',
    headline: 'Corrosion-Resistant Stainless Tubing for RO, EDI, and Ultrafiltration',
    tagline: 'SS 316L Piping Networks for High-Purity Demineralized Water',
    description:
      'Demineralized (DM) water, Reverse Osmosis (RO) permeate, and Electrodeionization (EDI) streams are highly aggressive toward inferior metals. Our SS 316L welded and seamless sanitary pipes ensure zero heavy metal leaching and enduring corrosion resistance.',
    standards: ['ASTM A270', 'ASTM A269', 'ASME BPE', 'EN 10204 3.1'],
    recommendedGrades: 'SS 316L (2.0% - 3.0% Mo)',
    typicalComponents: [
      'SS 316L Welded & Seamless Process Pipes',
      'High Pressure Tri-Clamp Couplings',
      'Instrument Sampling Tees and Nozzles',
      'Orbital Weld Tangent Bends',
      'Clean Steam Rated Isolation Valves',
    ],
    challengesSolved: [
      'Prevention of rouging and pitting corrosion in low-conductivity ultrapure water',
      'High pressure rating for RO booster and membrane header manifolds',
      'Certified EN 10204 3.1 traceability verifying chemical passivation',
    ],
  },
};

export function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const data = (slug && INDUSTRY_DATA[slug]) || {
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Industry Solutions',
    headline: 'Critical Process Fluid Handling Solutions',
    tagline: 'Engineered Stainless Steel Piping for Demanding Industrial Sectors',
    description:
      'Lotus Impex supplies precision engineered SS 304 and SS 316L sanitary tubes, fittings, and valves tailored to international hygienic standards and verified by Mill Test Certificates.',
    standards: ['ASTM A270', 'ASME BPE', 'DIN 11850', 'BS 4825'],
    recommendedGrades: 'SS 304 / SS 316L',
    typicalComponents: [
      'Sanitary Pipes and Tubes',
      'Tri-Clamp Fittings & Clamps',
      'Manual and Pneumatic Valves',
      'CIP Spray Balls and Tank Accessories',
    ],
    challengesSolved: [
      'Full drainability and crevice-free cleanability',
      'MTC EN 10204 3.1 certified metallurgy',
      'Rapid supply lead times across domestic and export markets',
    ],
  };

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/industries"
            className="inline-flex items-center gap-2 text-xs font-semibold text-steel-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Industries
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4 ml-4">
            Sector Application
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl font-heading">
            {data.headline}
          </h1>

          <p className="mt-3 text-lg text-primary-400 font-semibold max-w-3xl">
            {data.tagline}
          </p>

          <p className="mt-4 text-base text-steel-300 max-w-3xl leading-relaxed">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-sm transition-all"
            >
              Request Sector Quotation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/submit-boq"
              className="inline-flex items-center gap-2 bg-steel-800 hover:bg-steel-700 text-steel-100 font-semibold px-6 py-3 rounded-lg border border-steel-700 text-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-accent-teal" />
              Upload Project BOQ
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Standards & Recommended Grade Card */}
            <div className="bg-white rounded-xl border border-steel-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-steel-900 font-heading mb-4">
                Recommended Metallurgy & Compliance Standards
              </h2>
              <div className="bg-steel-50 rounded-lg p-4 border border-steel-200 mb-6">
                <span className="text-xs font-bold uppercase text-steel-500">Recommended Metallurgy</span>
                <p className="text-base font-bold text-steel-900 mt-1">{data.recommendedGrades}</p>
              </div>

              <span className="text-xs font-bold uppercase text-steel-500 block mb-2">Applicable Sector Standards</span>
              <div className="flex flex-wrap gap-2">
                {data.standards.map((std, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200/60"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-primary-600" />
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Typical Components */}
            <div className="bg-white rounded-xl border border-steel-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-steel-900 font-heading mb-4">
                Key Sanitary Components for this Sector
              </h2>
              <div className="space-y-3">
                {data.typicalComponents.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-steel-100 bg-steel-50/50 hover:bg-steel-50 transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-primary-600 bg-white border border-primary-100 px-2 py-0.5 rounded">
                      0{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-steel-800">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges Solved */}
            <div className="bg-white rounded-xl border border-steel-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-steel-900 font-heading mb-4">
                Technical Challenges Addressed
              </h2>
              <ul className="space-y-3">
                {data.challengesSolved.map((chal, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-steel-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{chal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-steel-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-steel-900 font-heading mb-2">
                Need Application Engineering Support?
              </h3>
              <p className="text-steel-600 text-xs leading-relaxed mb-6">
                Our application engineers can evaluate your line pressure, chemical exposure, and temperature requirements to recommend the exact pipe schedules and gasket elastomers.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-steel-900 hover:bg-steel-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg w-full transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-accent-teal" />
                Contact Application Desk
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-steel-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-steel-900 font-heading mb-3">
                Other Target Industries
              </h3>
              <div className="space-y-2">
                {Object.entries(INDUSTRY_DATA)
                  .filter(([key]) => key !== slug)
                  .map(([key, item]) => (
                    <Link
                      key={key}
                      to={`/industries/${key}`}
                      className="block text-xs font-medium text-steel-600 hover:text-primary-600 py-1.5 border-b border-steel-100 last:border-0 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
