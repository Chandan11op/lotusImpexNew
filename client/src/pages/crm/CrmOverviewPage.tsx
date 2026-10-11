import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Package,
  Users,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const CrmOverviewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await api.getDashboardOverview();
        if (res?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load CRM overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Calculating live pipeline metrics from database..." />;
  }

  const { kpis, pipelineData, categoryBreakdown, recentEnquiries } = data || {};

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'primary';
      case 'contacted':
        return 'info';
      case 'qualified':
        return 'purple';
      case 'quotation_sent':
        return 'warning';
      case 'negotiation':
        return 'orange';
      case 'won':
        return 'success';
      case 'lost':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div>
          <span className="font-bold block">Live Database Demonstration Environment:</span>
          <span>
            All metrics, pipeline counts, and trends are calculated directly from active MongoDB
            records.
          </span>
        </div>
        <Link
          to="/crm/enquiries"
          className="font-bold text-brand-blue hover:underline shrink-0 flex items-center gap-1"
        >
          <span>Manage Enquiries</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total RFQs</span>
            <Inbox className="h-4 w-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-black text-steel-900">{kpis?.totalEnquiries || 0}</div>
          <span className="text-[10px] text-steel-400 mt-1 block">All registered leads</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">New</span>
            <Clock className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-600">{kpis?.newEnquiries || 0}</div>
          <span className="text-[10px] text-steel-400 mt-1 block">Awaiting first response</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Quotes Sent</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{kpis?.quotationSent || 0}</div>
          <span className="text-[10px] text-steel-400 mt-1 block">Active commercial quotes</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Won Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{kpis?.won || 0}</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {kpis?.conversionRate} conversion
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overdue Tasks</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{kpis?.overdueFollowUps || 0}</div>
          <Link
            to="/crm/follow-ups?filter=overdue"
            className="text-[10px] text-red-600 hover:underline font-semibold mt-1 block"
          >
            View overdue tasks →
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-steel-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalogue Items</span>
            <Package className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{kpis?.totalProducts || 0}</div>
          <span className="text-[10px] text-steel-400 mt-1 block">Published products</span>
        </Card>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Stage Funnel Chart */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider">
                Enquiry Pipeline Stage Distribution
              </h3>
              <p className="text-xs text-steel-500 mt-0.5">
                Current volume of buyer enquiries across sales lifecycle stages
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {pipelineData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#1e40af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Product Category Interest Chart */}
        <Card className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider">
                Demand by Category
              </h3>
              <p className="text-xs text-steel-500 mt-0.5">
                Top enquiry volume across sanitary component categories
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryBreakdown}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Enquiries Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-steel-900 uppercase tracking-wider">
              Recent Inbound Enquiries
            </h3>
            <p className="text-xs text-steel-500 mt-0.5">
              Newly submitted RFQs and direct contact inquiries
            </p>
          </div>
          <Link
            to="/crm/enquiries"
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>View All In Pipeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-steel-200 text-steel-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Enquiry ID</th>
                <th className="py-2.5 px-3">Client / Company</th>
                <th className="py-2.5 px-3">Product of Interest</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {recentEnquiries?.map((enq: any) => (
                <tr key={enq._id} className="hover:bg-steel-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-steel-800">
                    {enq.enquiryNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-steel-900 block">{enq.customerName}</span>
                    <span className="text-[11px] text-steel-500">{enq.company}</span>
                  </td>
                  <td className="py-3 px-3 text-steel-700 font-medium">{enq.productName}</td>
                  <td className="py-3 px-3">
                    <Badge variant={getStatusBadgeVariant(enq.status)} size="sm">
                      {enq.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-steel-500">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/crm/enquiries?id=${enq._id}`}
                      className="text-brand-blue hover:underline font-semibold"
                    >
                      Open Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
