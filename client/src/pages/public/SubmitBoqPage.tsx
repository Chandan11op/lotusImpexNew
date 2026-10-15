import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  FileSpreadsheet, 
  Trash2,
  Lock
} from 'lucide-react';
import { api } from '../../services/api';

export function SubmitBoqPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
    projectTitle: '',
    message: '',
  });

  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    base64Data: string;
    originalName: string;
    size: number;
    mimeType: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB maximum allowed limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        file,
        base64Data: reader.result as string,
        originalName: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
      });
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please attach your Bill of Quantities (BOQ) document or drawing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload file securely to private storage
      const uploadRes = await api.uploadBoqFile({
        originalName: selectedFile.originalName,
        mimeType: selectedFile.mimeType,
        base64Data: selectedFile.base64Data,
        category: 'boq',
      });

      if (!uploadRes.success) {
        throw new Error(uploadRes.message || 'File upload failed');
      }

      const fileId = uploadRes.data.fileId;

      // 2. Register enquiry with attached document
      const enquiryRes = await api.submitEnquiry({
        customerName: formData.customerName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        productName: `BOQ Submission: ${formData.projectTitle || selectedFile.originalName}`,
        quantity: 1,
        unit: 'Project Lot',
        message: `${formData.projectTitle ? `[Project: ${formData.projectTitle}] ` : ''}${formData.message} (Attached File: ${selectedFile.originalName})`,
        source: 'boq_portal',
        attachments: [fileId],
      });

      if (enquiryRes.success) {
        setSuccessData({
          enquiryNumber: enquiryRes.data.enquiryNumber,
          filename: selectedFile.originalName,
        });
      } else {
        setError(enquiryRes.message || 'Failed to submit BOQ enquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4">
            Engineering Documentation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl font-heading">
            Submit Bill of Quantities (BOQ)
          </h1>
          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            Upload your project schedule, piping isometric drawing, or equipment schedule. Our technical estimation team will audit the material takeoff and calculate line-by-line pricing.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl border border-steel-200 p-8 sm:p-10 shadow-sm">
          {successData ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-steel-900 font-heading">
                BOQ Successfully Submitted
              </h2>
              <p className="text-steel-600 mt-2 text-sm max-w-md mx-auto">
                Your submission reference is{' '}
                <span className="font-mono font-bold text-primary-600">
                  {successData.enquiryNumber}
                </span>
                . Your document (
                <span className="font-semibold text-steel-800">{successData.filename}</span>
                ) has been safely encrypted and transferred to our estimating desk.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setSelectedFile(null);
                  }}
                  className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Submit Another File
                </button>
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

              {/* File Upload Drop Area */}
              <div>
                <label className="block text-xs font-bold text-steel-900 uppercase tracking-wider mb-2">
                  Attach Project Document (.pdf, .xlsx, .xls, .csv, .dwg, .dxf) *
                </label>
                <div className="mt-1 border-2 border-dashed border-steel-300 hover:border-primary-500 rounded-xl p-8 text-center bg-steel-50/50 transition-colors relative">
                  {selectedFile ? (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-steel-200">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                        <div className="text-left">
                          <p className="text-sm font-bold text-steel-900">{selectedFile.originalName}</p>
                          <p className="text-xs text-steel-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-steel-400 hover:text-rose-600 p-2 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-12 h-12 text-steel-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-steel-800">
                        Click to browse or drag and drop your document here
                      </p>
                      <p className="text-xs text-steel-500 mt-1">
                        Supported: Excel (.xlsx, .xls), PDF, AutoCAD (.dwg, .dxf), CSV up to 25 MB
                      </p>
                      <input
                        type="file"
                        required
                        onChange={handleFileChange}
                        accept=".pdf,.xlsx,.xls,.csv,.dwg,.dxf,.png,.jpg,.jpeg,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Project & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-steel-200">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-steel-700 mb-1">
                    Project / Inquiry Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="e.g. Anand Dairy Phase 3 Piping Expansion / WFI Loop Revamp"
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-steel-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Alok Sengupta"
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
                    placeholder="e.g. Cipla Ltd / EPC Contractor"
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
                    placeholder="e.g. alok@company.com"
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-steel-700 mb-1">
                    Contact Phone *
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-steel-700 mb-1">
                    Project Scope Notes & Commercial Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify project deadlines, packaging requirements, target delivery ports, or specific MTC inspection witness requirements."
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white text-steel-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Security Assurance Notice */}
              <div className="p-4 rounded-lg bg-steel-50 border border-steel-200 flex items-start gap-3 text-xs text-steel-600">
                <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Confidentiality Guarantee:</strong> Customer Bill of Quantities (BOQ) and technical CAD drawings submitted through this portal are stored in private isolated storage and accessed strictly by authorized Lotus Impex estimation engineers.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Securing & Uploading Document...' : 'Submit BOQ for Commercial Estimation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
