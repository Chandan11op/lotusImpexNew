import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Settings, Save, CheckCircle2, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: 'Lotus Impex',
    productBrand: 'Aeron (Draft Brand)',
    email: 'sales@lotusimpex.com',
    phone: '+91 22 2847 0000',
    whatsapp: '+91 98200 00000',
    address: 'Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India',
    intro:
      'Lotus Impex is a Mumbai-based distributor and supplier of precision stainless-steel sanitary tubes, pipes, fittings, valves, TC clamps, and engineered fluid handling components for sanitary and process applications.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getCompanySettings();
        if (res?.success && res.data?.settings) {
          setFormData({
            companyName: res.data.settings.companyName || 'Lotus Impex',
            productBrand: res.data.settings.productBrand || 'Aeron (Draft Brand)',
            email: res.data.settings.email || 'sales@lotusimpex.com',
            phone: res.data.settings.phone || '+91 22 2847 0000',
            whatsapp: res.data.settings.whatsapp || '+91 98200 00000',
            address:
              res.data.settings.address ||
              'Industrial Complex, Kanjurmarg West, Mumbai 400078, Maharashtra, India',
            intro: res.data.settings.intro || '',
          });
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.updateCompanySettings(formData);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update company settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading company profile configuration..." />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-steel-100 pb-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-steel-900">
              Corporate Identity & Brand Configuration
            </h2>
            <p className="text-xs text-steel-500">
              Manage company profile, contact channels, and provisional product line branding.
            </p>
          </div>
          <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
            <Settings className="h-5 w-5" />
          </div>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 mb-6">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Company profile updated successfully in database.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Legal Company Name"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <div>
              <Input
                label="Product Line Brand (Provisional Draft)"
                required
                value={formData.productBrand}
                onChange={(e) => setFormData({ ...formData, productBrand: e.target.value })}
                helperText="Brand name Aeron remains provisional until formal trademark confirmation."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Primary Sales Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Contact Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="WhatsApp Support Line"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>

          <Input
            label="Central Registered Address (Mumbai Hub)"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Textarea
            label="Company Description / Editorial Introduction"
            rows={4}
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
          />

          <div className="pt-4 border-t border-steel-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              icon={<Save className="h-4 w-4" />}
            >
              Save Company Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
