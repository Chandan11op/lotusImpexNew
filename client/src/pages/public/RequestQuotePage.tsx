import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Globe, 
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';

export function RequestQuotePage() {
  const [formData, setFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    country: 'India',
    productName: 'SS 316L Electro-Polished Sanitary Pipe',
    materialGrade: 'SS 316L',
    sizeRequirement: '1.5" OD x 1.65mm WT',
    quantity: 50,
    unit: 'Lengths',
    deliveryDestination: 'Mumbai / Ex-Works',
    requiredDate: '',
    message: '',
    preferredContactMethod: 'Email',
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitEnquiry({
        ...formData,
        quantity: Number(formData.quantity) || 1,
      });

      if (res.success) {
        setSuccessData(res.data);
      } else {
        setError(res.message || 'Failed to register quotation request.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const priorityProducts = [
    'SS 316L Electro-Polished Sanitary Pipe',
    'SS 304 Electro-Polished Sanitary Pipe',
    'SS 316L Mechanically Polished Sanitary Pipe',
    'SS 304 Mechanically Polished Sanitary Pipe',
    'SS 316L Sanitary Pipe Fittings',
    'SS Sanitary 90° Bend',
    'SS Sanitary Equal Tee',
    'SS Sanitary Reducing Tee',
    'SS Sanitary Concentric Reducer',
    'SS Sanitary Eccentric Reducer',
    'SS Tri-Clamp Ferrule',
    'SS Tri-Clamp Clamp',
    'Silicone Tri-Clamp Gasket',
    'SS SMS Union',
    'SS Sanitary Butterfly Valve',
    'SS 316L Diaphragm Valve',
    'SS 3-Piece Ball Valve with TC End',
    'Pneumatic Sanitary Ball Valve',
    'SS Sanitary Sampling Valve',
    'SS Sanitary Spray Ball',
    'Custom Fabrication / Other Components',
  ];

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4">
            B2B Commercial Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl font-heading">
            Request an Industrial Quotation
          </h1>
          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            Submit your sanitary piping, fitting, or valve specifications. Our technical sales engineering desk provides detailed price schedules, MTC traceability terms, and lead times within 4 to 12 business hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-steel-200 p-8 sm:p-10 shadow-sm">
            {successData ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-steel-900 font-heading">
                  Quotation Request Registered
                </h2>
                <p className="text-steel-600 mt-2 text-sm max-w-md mx-auto">
                  Your reference number is{' '}
                  <span className="font-mono font-bold text-primary-600">
                    {successData.enquiryNumber}
                  </span>
                  . A technical sales engineer has been notified and will verify availability and send your official quotation.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setSuccessData(null)}
                    className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Submit Another Requirement
                  </button>
                  <a
                    href={`https://wa.me/919820000000?text=${encodeURIComponent(
                      `Hello Lotus Impex, regarding my quote request ${successData.enquiryNumber} for ${formData.productName}...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Follow Up on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Contact Details */}
                <div>
                  <h3 className="text-base font-bold text-steel-900 uppercase tracking-wider text-xs border-b border-steel-200 pb-2 mb-4">
                    1. Contact & Organization Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="e.g. Rajesh Mehta"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Sun Pharma / Amul Dairy"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rajesh@company.com"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="For instant quotes over WhatsApp"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Technical Specifications */}
                <div>
                  <h3 className="text-base font-bold text-steel-900 uppercase tracking-wider text-xs border-b border-steel-200 pb-2 mb-4">
                    2. Product & Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Select Priority Product *
                      </label>
                      <select
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      >
                        {priorityProducts.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Material Grade *
                      </label>
                      <select
                        value={formData.materialGrade}
                        onChange={(e) => setFormData({ ...formData, materialGrade: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      >
                        <option value="SS 316L">SS 316L (Primary Sanitary / WFI)</option>
                        <option value="SS 304">SS 304 (Standard Food / Dairy)</option>
                        <option value="SS 316LN / Hastelloy">SS 316LN / Special Alloy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Size / Diameter / Schedule
                      </label>
                      <input
                        type="text"
                        value={formData.sizeRequirement}
                        onChange={(e) => setFormData({ ...formData, sizeRequirement: e.target.value })}
                        placeholder="e.g. 1.5 inch OD x 1.65mm WT"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Estimated Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      >
                        <option value="Lengths">Lengths (6.0m pipes)</option>
                        <option value="Meters">Meters</option>
                        <option value="Pieces">Pieces (Valves / Fittings)</option>
                        <option value="Sets">Sets</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Delivery & Notes */}
                <div>
                  <h3 className="text-base font-bold text-steel-900 uppercase tracking-wider text-xs border-b border-steel-200 pb-2 mb-4">
                    3. Delivery Schedule & Scope
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Delivery Destination / Port
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryDestination}
                        onChange={(e) => setFormData({ ...formData, deliveryDestination: e.target.value })}
                        placeholder="e.g. Pune / Dubai Port / CIF Hamburg"
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Required Delivery Date
                      </label>
                      <input
                        type="date"
                        value={formData.requiredDate}
                        onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Additional Technical Specifications / Scope Notes *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Specify surface roughness requirements (Ra values), standard compliance (ASTM A270, ASME BPE), end connections (Tri-clamp vs weld tangents), and MTC documentation requests."
                        className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    'Registering Quotation Request...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Commercial Quotation Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-steel-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-steel-900 font-heading mb-4">
                Have a Complex Piping Schedule?
              </h3>
              <p className="text-steel-600 text-xs leading-relaxed mb-4">
                If you have an engineering Bill of Quantities (BOQ), CAD drawings, or multi-line Excel spreadsheet, submit your file directly through our dedicated BOQ intake portal.
              </p>
              <a
                href="/submit-boq"
                className="inline-flex items-center gap-2 bg-steel-900 hover:bg-steel-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg w-full justify-center transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-accent-teal" />
                Upload Project BOQ Document
              </a>
            </div>

            <div className="bg-white rounded-xl border border-steel-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-steel-900">Rapid Response Window</h4>
                  <p className="text-steel-500 text-xs mt-0.5">
                    Standard items quoted within 4 to 12 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-steel-900">EN 10204 3.1 Traceability</h4>
                  <p className="text-steel-500 text-xs mt-0.5">
                    Heat batch certified Mill Test Certificates available.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-steel-900">Multi-Currency Invoicing</h4>
                  <p className="text-steel-500 text-xs mt-0.5">
                    Direct settlements in INR, USD, EUR, or AED.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
