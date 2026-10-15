import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  Search, 
  PackageCheck, 
  ShieldCheck, 
  Truck, 
  ClipboardCheck, 
  ArrowRight, 
  PhoneCall,
  FileSpreadsheet
} from 'lucide-react';

export function SupplyProcessPage() {
  const steps = [
    {
      step: '01',
      title: 'Enquiry & Technical Specification Review',
      icon: Search,
      desc: 'Clients submit material grade requirements (SS 304 / SS 316L), dimensional schedules, surface roughness (Ra values), and standard specifications (ASTM A270, ASME BPE, DIN 11850). Our engineering sales desk analyzes feasibility, mill stock, or fabrication lead time.',
      deliverable: 'Specification confirmation & commercial quotation within 4-12 hours.',
    },
    {
      step: '02',
      title: 'Commercial Agreement & Proforma Generation',
      icon: FileCheck,
      desc: 'Formal quotation issuing itemized prices, delivery terms (Ex-Works Mumbai or CIF international destination), currency options (INR, USD, EUR, AED), payment milestones, and target dispatch schedules.',
      deliverable: 'Proforma Invoice (PI) & technical specification datasheet sign-off.',
    },
    {
      step: '03',
      title: 'Dimensional & Surface Roughness Inspection',
      icon: ShieldCheck,
      desc: 'Strict incoming and pre-dispatch physical inspection. Verification of outer diameter tolerances, wall thickness uniformity, ovality, and internal bore surface roughness using calibrated contact profilometers.',
      deliverable: 'Internal inspection report & roughness verification record.',
    },
    {
      step: '04',
      title: 'Mill Test Certificate (MTC) Collation',
      icon: ClipboardCheck,
      desc: 'Collation of certified EN 10204 Type 3.1 Mill Test Certificates. Traceability established from steel heat number stamped on tube body or fitting bag to chemical spectrometry and mechanical tensile/elongation test records.',
      deliverable: 'EN 10204 3.1 MTCs with heat batch traceability.',
    },
    {
      step: '05',
      title: 'Hygienic Cleaning & Protective Packaging',
      icon: PackageCheck,
      desc: 'Tubes and pipes undergo ultrasonic/alkaline washdown, degreasing, and nitrogen purging where required. Tube ends are protected with polyethylene push-in caps. Fittings are individually sealed in polyethylene bags before packing in corrugated boxes and reinforced seaworthy wooden cases.',
      deliverable: 'Protective packaging compliant with ISPM-15 export regulations.',
    },
    {
      step: '06',
      title: 'Logistics, Customs & Worldwide Dispatch',
      icon: Truck,
      desc: 'Domestic express road transport across India or international air/sea freight through Nhava Sheva (JNPT) / Mumbai Air Cargo. Complete export paperwork including Bill of Lading, Certificate of Origin, and Packing List.',
      deliverable: 'Lorry Receipt (LR) / Air Waybill (AWB) with live transit tracking.',
    },
  ];

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4">
            Operational Excellence
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl font-heading">
            Supply & Quality Verification Process
          </h1>
          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            From preliminary BOQ specification review to calibrated surface roughness profilometry and EN 10204 3.1 MTC documentation. Our 6-step supply chain workflow guarantees reliable industrial procurement.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all text-sm"
            >
              Request a Quotation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/submit-boq"
              className="inline-flex items-center gap-2 bg-steel-800 hover:bg-steel-700 text-steel-100 font-semibold px-6 py-3 rounded-lg border border-steel-700 transition-all text-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-accent-teal" />
              Submit Bill of Quantities (BOQ)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Process Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white rounded-xl p-8 border border-steel-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-steel-300">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-lg bg-steel-100 border border-steel-200 flex items-center justify-center text-primary-600">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-steel-900 mb-3 font-heading">
                    {step.title}
                  </h3>
                  <p className="text-steel-600 text-sm leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-steel-100 bg-steel-50/50 -mx-8 -mb-8 p-6 rounded-b-xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-steel-500 mb-1">
                    Key Deliverable
                  </div>
                  <div className="text-xs font-medium text-steel-800">
                    {step.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Documentation Disclosure Box */}
        <div className="mt-16 bg-white rounded-2xl border border-steel-200 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                Compliance Disclosure
              </span>
              <h2 className="text-2xl font-bold text-steel-900 mt-2 font-heading">
                Material Authenticity & Certification Policy
              </h2>
              <p className="text-steel-600 mt-2 text-sm max-w-3xl leading-relaxed">
                Lotus Impex provides EN 10204 Type 3.1 Mill Test Certificates directly correlated to the manufacturer heat batch numbers on dispatched goods. Dimensional compliance and chemical composition verification records are available upon request prior to order confirmation.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-steel-900 hover:bg-steel-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 text-accent-teal" />
              Speak with Technical Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
