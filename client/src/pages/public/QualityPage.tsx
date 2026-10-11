import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { usePublicContext } from '../../layouts/PublicLayout';
import {
  ShieldCheck,
  CheckCircle,
  FileText,
  Search,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const QualityPage: React.FC = () => {
  const { openQuoteModal } = usePublicContext();

  const inspectionSteps = [
    {
      step: '01',
      title: 'Chemical Composition & Grade Verification',
      desc: 'All batches of AISI 304 (1.4301) and AISI 316L (1.4404) are verified against ASTM, DIN, and ISO chemical composition tolerances (Chromium, Nickel, Molybdenum, Carbon content).',
      icon: <Scale className="h-6 w-6 text-brand-blue" />,
    },
    {
      step: '02',
      title: 'Bore Surface Finish & Roughness Checks',
      desc: 'Hygienic fluid lines require documented surface roughness. We measure and verify mechanical polish (Ra ≤ 0.8 µm) and electropolished pharmaceutical finishes (Ra ≤ 0.4 µm) using calibrated surface profilometers.',
      icon: <Sparkles className="h-6 w-6 text-brand-blue" />,
    },
    {
      step: '03',
      title: 'Dimensional & Wall Thickness Inspection',
      desc: 'Precision micrometers and optical gauges verify outside diameter (OD), wall thickness, ferrule flange bevels, and concentricity to guarantee leak-free assembly with Tri-Clamp and SMS unions.',
      icon: <Search className="h-6 w-6 text-brand-blue" />,
    },
    {
      step: '04',
      title: 'Material Test Documentation (MTR)',
      desc: 'Mill Test Reports (MTR) according to EN 10204 3.1 standards are supplied upon customer order request, detailing heat numbers and mechanical tensile test values for full pharmaceutical auditability.',
      icon: <FileText className="h-6 w-6 text-brand-blue" />,
    },
  ];

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Inspection & Sourcing Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-steel-900 tracking-tight">
            Quality Verification & Material Integrity
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Our quality policy is founded on tangible, measurable inspection data rather than
            unverified marketing slogans. We outline below our verified inspection approach for
            every sanitary shipment leaving our Mumbai distribution hub.
          </p>
        </div>

        {/* 4 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inspectionSteps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-steel-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-steel-200 font-mono">{s.step}</span>
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">{s.icon}</div>
                </div>
                <h3 className="text-base font-bold text-steel-900 mb-2">{s.title}</h3>
                <p className="text-xs text-steel-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Compliance Statement */}
        <div className="bg-white p-8 rounded-2xl border border-steel-200/90 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-steel-900 border-b border-steel-100 pb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>Our Transparent Quality Distinction</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-steel-700 leading-relaxed">
            <div className="space-y-2">
              <strong className="text-steel-900 block font-semibold text-sm">
                Verified Current Capabilities:
              </strong>
              <p>
                Lotus Impex conducts incoming physical dimensional inspection, visual bore checks,
                ferrule angle verification, and batch MTR certificate matching. We ensure products
                match stated sizes (e.g. 1" to 4" OD) and sanitary standards before packaging and
                dispatch.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-steel-900 block font-semibold text-sm">
                Custom Testing & Specific Regulated Requirements:
              </strong>
              <p>
                Where buyers require special third-party PMI (Positive Material Identification)
                spectroscopy, hydrostatic pressure testing certificates, or cleanroom double-bagged
                packaging, these requirements must be specified during the RFQ stage so our
                commercial team can arrange appropriate third-party testing documentation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white p-8 sm:p-10 rounded-2xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Request Mill Test Certification for Your Order
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Submit your material requirements and required test documentation (EN 10204 3.1) to
            receive a comprehensive specification quote.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openQuoteModal()}
              className="bg-white text-brand-blue hover:bg-blue-50 font-bold"
            >
              Submit Specification RFQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
