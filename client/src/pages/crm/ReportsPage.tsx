import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Download, Calendar, Filter, BarChart2, Globe, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getReportsAnalytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (res?.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportCSV = () => {
    const url = api.getExportCSVUrl();
    window.open(url, '_blank');
  };

  const COLORS = ['#1e40af', '#0284c7', '#0d9488', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-steel-700">From:</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-1 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-steel-700">To:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-1 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" onClick={loadAnalytics} icon={<Filter className="h-3.5 w-3.5" />}>
              Filter Date
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="h-4 w-4" />}
          >
            Export Structured CSV
          </Button>
        </div>
      </Card>

      {/* Overview Analytics Charts */}
      {loading ? (
        <LoadingSpinner text="Aggregating enquiry analytics from database..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Breakdown Bar */}
          <Card className="lg:col-span-6 p-6">
            <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider mb-1">
              Enquiries by Pipeline Status
            </h3>
            <p className="text-xs text-steel-500 mb-6">
              Volume of buyer enquiries grouped by current stage
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.statusReport || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => val.replace('_', ' ')}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Geographical Origin Chart */}
          <Card className="lg:col-span-6 p-6">
            <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider mb-1">
              Enquiries by Destination Market
            </h3>
            <p className="text-xs text-steel-500 mb-6">
              Lead generation distribution across India and export countries
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analytics?.countryReport || []}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis
                    dataKey="country"
                    type="category"
                    tick={{ fontSize: 11, fill: '#334155' }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Inbound Lead Channel Breakdown */}
          <Card className="lg:col-span-6 p-6">
            <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider mb-1">
              Inbound Source Attribution
            </h3>
            <p className="text-xs text-steel-500 mb-4">Channel origin of registered enquiries</p>
            <div className="divide-y divide-steel-100 text-xs">
              {analytics?.sourceReport?.map((src: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-steel-700 capitalize">
                    {src.source?.replace('_', ' ')}
                  </span>
                  <span className="font-mono font-bold text-steel-900">{src.count} Enquiries</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Export Specifications Explanatory Card */}
          <Card className="lg:col-span-6 p-6 space-y-4">
            <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider">
              RFC 4180 CSV Data Export
            </h3>
            <p className="text-xs text-steel-600 leading-relaxed">
              Authorized CRM users can download the full raw tabular enquiry archive formatted to
              RFC 4180 standards for external accounting, ERP import, or spreadsheet analysis.
            </p>
            <div className="bg-steel-50 p-3 rounded-lg border border-steel-200 text-xs text-steel-600 font-mono">
              Headers: EnquiryNumber, Date, CustomerName, Company, Email, Phone, Country, Product,
              Quantity, Unit, Status, Priority, Source, LossReason, Requirements
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                icon={<Download className="h-4 w-4" />}
              >
                Download Active Dataset (.csv)
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
