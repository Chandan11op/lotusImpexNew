import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useLocale } from '../../context/LocaleContext';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: { _id: string; name: string };
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, product }) => {
  const { t } = useLocale();
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
      title={successData ? t('msgSuccessTitle') : t('rfqTitle')}
      description={
        successData
          ? t('msgSuccessDesc')
          : t('rfqSubtitle')
      }
      maxWidth="lg"
    >
      {successData ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-steel-900 dark:text-white mb-2">Thank You, {successData.customerName}!</h4>
          <p className="text-sm text-steel-600 dark:text-steel-300 max-w-md mx-auto mb-6">
            Your enquiry has been successfully logged with reference number:
          </p>
          <div className="inline-block bg-steel-100 dark:bg-steel-800 border border-steel-300 dark:border-steel-700 rounded-lg px-4 py-2 text-steel-900 dark:text-cyan-400 font-mono font-bold text-base mb-6">
            {successData.enquiryNumber}
          </div>
          <p className="text-xs text-steel-500 dark:text-steel-400 max-w-sm mx-auto mb-6">
            {t('msgSuccessDesc')}
          </p>
          <Button variant="primary" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {formData.productName && (
            <div className="p-3 bg-blue-50/70 dark:bg-steel-800 border border-blue-200/80 dark:border-steel-700 rounded-lg">
              <span className="text-[11px] font-semibold text-brand-blue dark:text-cyan-400 uppercase tracking-wider block">
                {t('lblProduct')}:
              </span>
              <p className="text-sm font-semibold text-steel-900 dark:text-white mt-0.5">{formData.productName}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('lblCustomerName')}
              required
              placeholder="e.g. Rajesh Mehta"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Input
              label={t('lblCompany')}
              required
              placeholder="e.g. Amul Dairy Cooperative"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('lblEmail')}
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label={t('lblPhone')}
              required
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t('lblCountry')}
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            <Input
              label={t('lblQuantity')}
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
            />
            <Select
              label={t('lblUnit')}
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
            label={t('lblMessage')}
            required
            rows={3}
            placeholder="Specify size (e.g. 1.5 inch OD), grade (SS316L / SS304), standard (ASTM A270, SMS, DIN), surface roughness, or target delivery date..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Select
              label={t('lblPreferredContact')}
              value={formData.preferredContactMethod}
              onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
              options={[
                { label: 'Email', value: 'Email' },
                { label: 'Phone Call', value: 'Phone' },
                { label: 'WhatsApp', value: 'WhatsApp' },
              ]}
            />
            <div className="flex items-center gap-2 pt-5 text-xs text-steel-500 dark:text-steel-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct RFQ logged into CRM. Your contact info is kept strictly confidential.</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100 dark:border-steel-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} icon={<Send className="h-4 w-4" />}>
              {loading ? t('msgSubmitting') : t('btnSubmitRfq')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
