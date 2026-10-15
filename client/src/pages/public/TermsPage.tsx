import React from 'react';
import { FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      <div className="bg-steel-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-2">
            <FileText className="w-4 h-4" />
            Commercial Terms of Supply
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Terms & Conditions of Commercial Supply
          </h1>
          <p className="mt-2 text-sm text-steel-400">
            Standard B2B Trading Conditions | Lotus Impex, Mumbai, Maharashtra, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl border border-steel-200 p-8 sm:p-10 shadow-sm space-y-6 text-steel-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              1. Quotations and Commercial Validity
            </h2>
            <p>
              All price quotations issued by Lotus Impex are valid for 15 calendar days from the date of issue unless explicitly stated otherwise in the commercial proposal. Raw material nickel surcharges and exchange rate fluctuations may affect expired proposals. All orders are subject to written acceptance by Lotus Impex through a formal Order Confirmation or Proforma Invoice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              2. Entity Identity & Brand Designations
            </h2>
            <p>
              Lotus Impex operates as an established Indian trading, distribution, and industrial sourcing enterprise. Product brand labels (including Aeron) represent internal commercial brand designations. Dispatched products meet verified manufacturing standards (ASTM, ASME BPE, DIN, BS, 3-A) as substantiated by third-party mill test certificates.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              3. Mill Test Certificates & Quality Claims
            </h2>
            <p>
              Material Test Certificates (EN 10204 Type 3.1) are supplied based on manufacturer records corresponding to specific heat lot numbers. Claims regarding dimensional deviation or surface roughness must be lodged in writing within 14 calendar days of physical consignment receipt at the destination site, prior to cutting, welding, or installing goods into active processing equipment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              4. Delivery, Title & Risk of Loss
            </h2>
            <p>
              Unless otherwise agreed in writing, delivery terms correspond to standard Incoterms 2020. Risk of loss passes to the buyer upon handover to the primary freight carrier at our Mumbai logistics warehouse (Ex-Works) or upon crossing the ship's rail at the port of origin (FOB Nhava Sheva).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-steel-900 font-heading mb-2">
              5. Governing Law and Jurisdiction
            </h2>
            <p>
              All commercial agreements and supply contracts shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with commercial transactions shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
