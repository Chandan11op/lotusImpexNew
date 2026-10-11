import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: { _id: string; name: string };
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
    productName: product?.name || '',
    productRef: product?._id || '',
    quantity: 1,
    unit: 'Pieces',
    message: '',
    preferredContactMethod: 'Email',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    enquiryNumber: string;
    customerName: string;
  } | null>(null);

  // Sync if product prop changes
  React.useEffect(() => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        productName: product.name,
        productRef: product._id,
      }));
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitEnquiry(formData);
      if (res?.success) {
        setSuccessData(res.data);
      } else {
        setError(res?.message || 'Failed to submit enquiry. Please check your inputs.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while submitting your enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={successData ? 'Quotation Request Received' : 'Request a Quotation & Specification'}
      description={
        successData
          ? 'Your RFQ has been logged and assigned to our sales engineering team.'
          : 'Share your requirements for precision sanitary fittings, tubes, valves, and fluid handling components.'
      }
      maxWidth="lg"
    >
      {successData ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-steel-900 mb-2">Thank You, {successData.customerName}!</h4>
          <p className="text-sm text-steel-600 max-w-md mx-auto mb-6">
            Your enquiry has been successfully logged with reference number:
          </p>
          <div className="inline-block bg-steel-100 border border-steel-300 rounded-lg px-4 py-2 text-steel-900 font-mono font-bold text-base mb-6">
            {successData.enquiryNumber}
          </div>
          <p className="text-xs text-steel-500 max-w-sm mx-auto mb-6">
            A confirmation has been recorded in our unified CRM. Our Mumbai sales desk will review
            your specifications and provide a tailored proposal shortly.
          </p>
          <Button variant="primary" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {formData.productName && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg">
              <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block">
                Selected Product:
              </span>
              <p className="text-sm font-semibold text-steel-900 mt-0.5">{formData.productName}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Rajesh Mehta"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Input
              label="Company Name"
              required
              placeholder="e.g. Amul Dairy Cooperative"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Contact Phone / WhatsApp"
              required
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Destination Country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
            />
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={[
                { label: 'Pieces', value: 'Pieces' },
                { label: 'Meters', value: 'Meters' },
                { label: 'Sets', value: 'Sets' },
                { label: 'Kilograms (Kg)', value: 'Kg' },
              ]}
            />
          </div>

          <Textarea
            label="Specifications & Requirements"
            required
            rows={3}
            placeholder="Specify size (e.g. 1.5 inch OD), grade (SS316L / SS304), standard (ASTM A270, SMS, DIN), surface roughness, or target delivery date..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Select
              label="Preferred Contact Method"
              value={formData.preferredContactMethod}
              onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
              options={[
                { label: 'Email', value: 'Email' },
                { label: 'Phone Call', value: 'Phone' },
                { label: 'WhatsApp', value: 'WhatsApp' },
              ]}
            />
            <div className="flex items-center gap-2 pt-5 text-xs text-steel-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct RFQ logged into CRM. Your contact info is kept strictly confidential.</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} icon={<Send className="h-4 w-4" />}>
              Submit Quotation Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
