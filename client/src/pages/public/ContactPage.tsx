import React, { useState } from 'react';
import { api } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
    productName: 'General Direct Contact Inquiry',
    quantity: 1,
    unit: 'Pieces',
    message: '',
    preferredContactMethod: 'Email',
    source: 'website_contact',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    enquiryNumber: string;
    customerName: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitEnquiry(formData);
      if (res?.success) {
        setSuccessData(res.data);
      } else {
        setError(res?.message || 'Failed to submit enquiry. Please verify required fields.');
      }
    } catch (err: any) {
      setError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-steel-900 tracking-tight">
            Contact Lotus Impex Sales & Engineering Desk
          </h1>
          <p className="text-sm sm:text-base text-steel-600 leading-relaxed">
            Connect directly with our sales team in Mumbai for product availability, custom sanitary
            spool fabrications, mill test specifications, and export logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-steel-200/90 shadow-xs">
            <h2 className="text-xl font-bold text-steel-900 mb-2">Send Us an Enquiry</h2>
            <p className="text-xs text-steel-500 mb-6">
              Inquiries are logged directly into our central CRM system for immediate sales follow-up.
            </p>

            {successData ? (
              <div className="text-center py-10 bg-emerald-50/50 rounded-xl border border-emerald-200 p-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-steel-900">
                  Message Logged Successfully!
                </h3>
                <p className="text-xs text-steel-600 mt-1 max-w-md mx-auto">
                  Thank you, {successData.customerName}. Your inquiry has been registered under:
                </p>
                <div className="mt-3 inline-block font-mono font-bold text-sm bg-white border border-emerald-300 px-4 py-1.5 rounded-lg text-steel-800">
                  {successData.enquiryNumber}
                </div>
                <p className="text-xs text-steel-500 mt-4">
                  Our sales engineers will review your request and contact you via your preferred
                  method.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSuccessData(null);
                      setFormData({
                        customerName: '',
                        company: '',
                        email: '',
                        phone: '',
                        country: 'India',
                        productName: 'General Direct Contact Inquiry',
                        quantity: 1,
                        unit: 'Pieces',
                        message: '',
                        preferredContactMethod: 'Email',
                        source: 'website_contact',
                      });
                    }}
                  >
                    Submit Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                  <Input
                    label="Company Name"
                    required
                    placeholder="e.g. PureDairy Equipment Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Email"
                    type="email"
                    required
                    placeholder="ramesh@puredairy.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="Phone / Mobile"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Destination Country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                  <Select
                    label="Preferred Contact Channel"
                    value={formData.preferredContactMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredContactMethod: e.target.value })
                    }
                    options={[
                      { label: 'Email', value: 'Email' },
                      { label: 'Telephone Call', value: 'Phone' },
                      { label: 'WhatsApp', value: 'WhatsApp' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Enquiry Details or Required Specifications"
                  required
                  rows={4}
                  placeholder="Share required product types, quantities, sizes (OD in mm or inches), standard (SMS, DIN, 3A), or delivery location..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={loading}
                    icon={<Send className="h-4 w-4" />}
                    className="w-full justify-center"
                  >
                    Submit Direct Enquiry
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Office Location, Details, WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-steel-200/90 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-steel-900 border-b border-steel-100 pb-3">
                Mumbai Supply Hub
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-steel-900 block font-semibold">Registered Office & Supply Depot:</strong>
                    <span className="text-steel-600">
                      Unit 14, Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-steel-900 block font-semibold">Phone Lines:</strong>
                    <span className="text-steel-600 block">+91 22 2847 0000 (Office)</span>
                    <span className="text-steel-600 block">+91 98200 00000 (Sales Desk)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-steel-900 block font-semibold">Commercial Email:</strong>
                    <span className="text-steel-600 block">sales@lotusimpex.com</span>
                    <span className="text-steel-600 block">info@lotusimpex.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-steel-900 block font-semibold">Business Operating Hours:</strong>
                    <span className="text-steel-600 block">Monday to Saturday: 9:30 AM – 6:30 PM IST</span>
                    <span className="text-steel-500 block">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919820000000?text=Hello%20Lotus%20Impex,%20I%20would%20like%20to%20enquire%20about%20sanitary%20stainless%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="success"
                    size="md"
                    className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    icon={<MessageSquare className="h-4 w-4" />}
                  >
                    Quick Chat on WhatsApp (+91 98200 00000)
                  </Button>
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-4 rounded-2xl border border-steel-200/90 shadow-xs overflow-hidden">
              <div className="aspect-16/9 bg-steel-100 rounded-xl flex flex-col items-center justify-center p-6 text-center text-xs text-steel-500 border border-steel-200">
                <MapPin className="h-8 w-8 text-steel-400 mb-2" />
                <span className="font-bold text-steel-700">Mumbai Central Industrial Hub</span>
                <span>Kanjurmarg West, Mumbai 400078, Maharashtra</span>
                <span className="text-[11px] text-steel-400 mt-1">
                  (Proximity to Nhava Sheva JNPT Port for international sea freight)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
