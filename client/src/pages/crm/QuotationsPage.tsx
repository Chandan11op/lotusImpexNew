import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Quotation, QuotationStatus, Product, Customer } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Building2,
  Trash2,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface NewLineItem {
  productRef?: string;
  productName: string;
  sku: string;
  grade: string;
  size: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
}

export const QuotationsPage: React.FC = () => {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Products & Customers for dropdowns
  const [productList, setProductList] = useState<Product[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
    billingAddress: '',
    shippingAddress: '',
  });

  const [currency, setCurrency] = useState('INR');
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [deliveryTerms, setDeliveryTerms] = useState('Ex-Works Mumbai / Freight Extra at actuals');
  const [paymentTerms, setPaymentTerms] = useState('100% advance against Proforma Invoice');
  const [validityDays, setValidityDays] = useState(15);
  const [notes, setNotes] = useState(
    'MTC 3.1 provided along with dispatch. Standard packaging included. Inspection at factory prior to dispatch welcome.'
  );

  const [lineItems, setLineItems] = useState<NewLineItem[]>([
    {
      productName: 'SS 316L Electro-Polished Sanitary Pipe',
      sku: 'LTS-EP-316L',
      grade: 'SS 316L',
      size: '1.5" OD x 1.65mm',
      quantity: 50,
      unit: 'MTR',
      unitPrice: 1250,
      discountPercent: 0,
    },
  ]);

  // View / Print Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);

  // Status Update Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<QuotationStatus>('sent');
  const [statusNotes, setStatusNotes] = useState('');

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const res = await api.getQuotations({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      if (res?.success && res.data) {
        setQuotations(res.data.quotations || []);
      }
    } catch (err) {
      console.error('Failed to load quotations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, [statusFilter, search]);

  useEffect(() => {
    async function loadFormPrerequisites() {
      try {
        const [prodRes, custRes] = await Promise.all([
          api.getPublicProducts({ limit: 50 }),
          api.getCustomers({ limit: 50 }),
        ]);
        if (prodRes?.success && prodRes.data?.products) {
          setProductList(prodRes.data.products);
        }
        if (custRes?.success && custRes.data?.customers) {
          setCustomerList(custRes.data.customers);
        }
      } catch (err) {
        console.error('Failed to load dropdown prerequisites', err);
      }
    }
    loadFormPrerequisites();
  }, []);

  // When existing customer is selected
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const found = customerList.find((c) => c._id === customerId);
    if (found) {
      setCustomerForm({
        customerName: found.contactPerson || found.name,
        company: found.company,
        email: found.email,
        phone: found.phone,
        country: found.country || 'India',
        billingAddress: found.address || '',
        shippingAddress: found.address || '',
      });
    }
  };

  // Line item manipulation
  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        productName: '',
        sku: '',
        grade: 'SS 316L',
        size: '1" OD',
        quantity: 1,
        unit: 'MTR',
        unitPrice: 0,
        discountPercent: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (idx: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLineItemChange = (idx: number, field: keyof NewLineItem, value: any) => {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };

      // If user chose a product from dropdown
      if (field === 'productRef') {
        const prod = productList.find((p) => p._id === value);
        if (prod) {
          updated[idx].productName = prod.name;
          updated[idx].sku = prod.sku || '';
          updated[idx].grade = prod.grade || 'SS 316L';
          updated[idx].size = prod.sizeRange || '1" OD';
        }
      }
      return updated;
    });
  };

  // Mathematical calculations for modal preview
  const subtotal = lineItems.reduce((acc, item) => {
    const discountedRate = item.unitPrice * (1 - (item.discountPercent || 0) / 100);
    return acc + item.quantity * discountedRate;
  }, 0);

  const taxTotal = (subtotal * taxPercent) / 100;
  const grandTotal = subtotal + taxTotal;

  // Handle Form Submission
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.customerName || !customerForm.company || !customerForm.email) {
      alert('Please fill in Customer Name, Company, and Email.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    setSubmitting(true);
    try {
      const validityDate = new Date();
      validityDate.setDate(validityDate.getDate() + validityDays);

      const payload = {
        customerRef: selectedCustomerId || undefined,
        customerName: customerForm.customerName,
        company: customerForm.company,
        email: customerForm.email,
        phone: customerForm.phone,
        billingAddress: customerForm.billingAddress,
        shippingAddress: customerForm.shippingAddress,
        country: customerForm.country,
        currency,
        lineItems: lineItems.map((item) => ({
          productRef: item.productRef || undefined,
          productName: item.productName || 'Sanitary Component',
          sku: item.sku || undefined,
          grade: item.grade,
          size: item.size,
          quantity: Number(item.quantity) || 1,
          unit: item.unit,
          unitPrice: Number(item.unitPrice) || 0,
          discountPercent: Number(item.discountPercent) || 0,
        })),
        taxPercent: Number(taxPercent) || 0,
        deliveryTerms,
        paymentTerms,
        validityDate: validityDate.toISOString(),
        notes,
      };

      const res = await api.createQuotation(payload);
      if (res?.success) {
        setCreateModalOpen(false);
        // Reset form
        setLineItems([
          {
            productName: '',
            sku: '',
            grade: 'SS 316L',
            size: '1" OD',
            quantity: 1,
            unit: 'MTR',
            unitPrice: 0,
            discountPercent: 0,
          },
        ]);
        setSelectedCustomerId('');
        loadQuotations();
      } else {
        alert(res?.error?.message || 'Failed to generate quotation.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Server error while creating quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!activeQuotation) return;
    try {
      const res = await api.updateQuotationStatus(activeQuotation._id, {
        status: targetStatus,
        notes: statusNotes,
      });
      if (res?.success) {
        setStatusModalOpen(false);
        setStatusNotes('');
        loadQuotations();
        if (activeQuotation._id === res.data.quotation._id) {
          setActiveQuotation(res.data.quotation);
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update quotation status.');
    }
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'sent':
        return <Badge variant="primary">Sent</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      case 'revised':
        return <Badge variant="info">Revised</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="default">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-steel-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" />
            <span>Commercial Quotations & Proformas</span>
          </h2>
          <p className="text-xs text-steel-500 dark:text-steel-400 mt-1">
            Generate, revise, and dispatch server-validated industrial B2B quotations with dynamic tax and line items.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Quotation
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-steel-900 p-1.5 rounded-lg border border-steel-200 dark:border-steel-800 shadow-xs">
          {[
            { id: 'all', label: 'All Quotes' },
            { id: 'draft', label: 'Draft' },
            { id: 'sent', label: 'Sent' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-steel-600 dark:text-steel-400 hover:text-steel-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-steel-400" />
          <input
            type="text"
            placeholder="Search quotation #, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-steel-300 dark:border-steel-700 bg-white dark:bg-steel-900 text-steel-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Quotations List Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Retrieving commercial quotations..." />
          </div>
        ) : quotations.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-10 w-10 text-steel-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-steel-800 dark:text-steel-200">No Quotations Found</h3>
            <p className="text-xs text-steel-500 mt-1">
              {search ? 'Try adjusting your search query.' : 'Click "Create Quotation" to author your first commercial quote.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 dark:bg-steel-900/60 border-b border-steel-200 dark:border-steel-800 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Quotation #</th>
                  <th className="py-3 px-4">Customer & Company</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100 dark:divide-steel-800">
                {quotations.map((q) => (
                  <tr
                    key={q._id}
                    className="hover:bg-steel-50/80 dark:hover:bg-steel-900/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-blue dark:text-cyan-400 block">
                        {q.quotationNumber}
                      </span>
                      <span className="text-[10px] text-steel-400 block">
                        Rev {q.revision} • {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-steel-900 dark:text-white block">
                        {q.company}
                      </span>
                      <span className="text-[11px] text-steel-500 dark:text-steel-400 block">
                        Attn: {q.customerName} ({q.country})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-steel-700 dark:text-steel-300">
                        {q.lineItems?.length || 0} line item{q.lineItems?.length === 1 ? '' : 's'}
                      </span>
                      <span className="text-[10px] text-steel-400 block truncate max-w-xs">
                        {q.lineItems?.[0]?.productName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-steel-900 dark:text-white block">
                        {q.currency} {q.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-steel-400">
                        incl. {q.taxPercent}% tax
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-steel-700 dark:text-steel-300 block">
                        {new Date(q.validityDate).toLocaleDateString()}
                      </span>
                      {new Date(q.validityDate) < new Date() && q.status !== 'accepted' && (
                        <span className="text-[10px] text-red-500 font-bold block">Expired</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(q.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveQuotation(q);
                            setViewModalOpen(true);
                          }}
                          icon={<Eye className="h-3.5 w-3.5" />}
                        >
                          View / Print
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveQuotation(q);
                            setTargetStatus(q.status);
                            setStatusModalOpen(true);
                          }}
                        >
                          Status
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE QUOTATION MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Author Commercial B2B Quotation"
        description="Calculate dynamic line items, multi-currency conversions, and tax rates."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateQuotation} className="space-y-6">
          {/* Customer Selection or Entry */}
          <div className="p-4 bg-steel-50 dark:bg-steel-900/60 rounded-xl border border-steel-200 dark:border-steel-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                Customer & B2B Client Details
              </h4>
              {customerList.length > 0 && (
                <div className="w-64">
                  <Select
                    label=""
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    options={[
                      { value: '', label: '-- Select Existing Customer --' },
                      ...customerList.map((c) => ({
                        value: c._id,
                        label: `${c.company} (${c.name})`,
                      })),
                    ]}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Customer Contact Name *"
                value={customerForm.customerName}
                onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
                required
              />
              <Input
                label="Company / Enterprise Name *"
                value={customerForm.company}
                onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                required
              />
              <Input
                label="Work Email *"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Phone / Mobile"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              />
              <Input
                label="Country"
                value={customerForm.country}
                onChange={(e) => setCustomerForm({ ...customerForm, country: e.target.value })}
              />
              <Input
                label="Billing / Shipping Address"
                value={customerForm.billingAddress}
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    billingAddress: e.target.value,
                    shippingAddress: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Quotation Commercial Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Select
              label="Quotation Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
                { value: 'EUR', label: 'EUR (€) - Euro' },
                { value: 'GBP', label: 'GBP (£) - British Pound' },
                { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
                { value: 'SGD', label: 'SGD ($) - Singapore Dollar' },
              ]}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))}
            />
            <Input
              label="Validity (Days)"
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
            />
            <Input
              label="Delivery Terms"
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
            />
          </div>

          {/* Dynamic Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                Itemized Line Items ({lineItems.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLineItem}
                icon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Item
              </Button>
            </div>

            <div className="border border-steel-200 dark:border-steel-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-steel-50 dark:bg-steel-900 border-b border-steel-200 dark:border-steel-800 text-steel-500 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3 min-w-[200px]">Product / Component</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Grade</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Size</th>
                    <th className="py-2.5 px-3 w-20">Qty</th>
                    <th className="py-2.5 px-3 w-20">Unit</th>
                    <th className="py-2.5 px-3 w-28">Unit Price</th>
                    <th className="py-2.5 px-3 w-20">Disc %</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                    <th className="py-2.5 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-100 dark:divide-steel-800">
                  {lineItems.map((item, idx) => {
                    const rowTotal =
                      item.quantity * item.unitPrice * (1 - (item.discountPercent || 0) / 100);

                    return (
                      <tr key={idx} className="bg-white dark:bg-steel-950">
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Component Name..."
                            value={item.productName}
                            onChange={(e) => handleLineItemChange(idx, 'productName', e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Grade (e.g. 316L)"
                            value={item.grade}
                            onChange={(e) => handleLineItemChange(idx, 'grade', e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Size"
                            value={item.size}
                            onChange={(e) => handleLineItemChange(idx, 'size', e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleLineItemChange(idx, 'quantity', Number(e.target.value))
                            }
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.unit}
                            onChange={(e) => handleLineItemChange(idx, 'unit', e.target.value)}
                            className="w-full px-1 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white"
                          >
                            <option value="MTR">MTR</option>
                            <option value="PCS">PCS</option>
                            <option value="SET">SET</option>
                            <option value="NOS">NOS</option>
                            <option value="KG">KG</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleLineItemChange(idx, 'unitPrice', Number(e.target.value))
                            }
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white text-right"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discountPercent}
                            onChange={(e) =>
                              handleLineItemChange(idx, 'discountPercent', Number(e.target.value))
                            }
                            className="w-full px-2 py-1 text-xs border rounded border-steel-300 dark:border-steel-700 bg-transparent text-steel-900 dark:text-white text-right"
                          />
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-steel-900 dark:text-white">
                          {currency} {rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-2 text-center">
                          {lineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 bg-steel-100 dark:bg-steel-900 rounded-xl">
            <div className="w-full sm:w-1/2 space-y-2">
              <Input
                label="Payment Terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
              <Textarea
                label="Special Commercial Notes / Exceptions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-steel-200 dark:border-steel-800">
                <span className="text-steel-600 dark:text-steel-400">Subtotal:</span>
                <span className="font-mono font-bold text-steel-900 dark:text-white">
                  {currency} {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-steel-200 dark:border-steel-800">
                <span className="text-steel-600 dark:text-steel-400">Tax / GST ({taxPercent}%):</span>
                <span className="font-mono font-bold text-steel-900 dark:text-white">
                  {currency} {taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-steel-400 dark:border-steel-700 text-sm">
                <span className="font-bold text-steel-900 dark:text-white">Grand Total:</span>
                <span className="font-mono font-extrabold text-brand-blue dark:text-cyan-400">
                  {currency} {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-steel-200 dark:border-steel-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Generate Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW & PRINT FORMAL QUOTATION MODAL */}
      {activeQuotation && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Commercial Quotation — ${activeQuotation.quotationNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Printable Document Box */}
            <div id="quotation-print-area" className="p-6 bg-white text-steel-900 rounded-lg border border-steel-300 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-steel-200 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-steel-950">
                    LOTUS IMPEX
                  </h1>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-600">
                    Stainless Steel Sanitary Products & Flow Equipment
                  </p>
                  <p className="text-[11px] text-steel-600 mt-1 max-w-sm">
                    Unit 14, Industrial Complex, Kanjurmarg West, Mumbai 400078, India
                    <br />
                    Phone: +91 22 2847 0000 | Email: sales@lotusimpex.com
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-steel-100 rounded text-xs font-mono font-extrabold text-steel-900 mb-1">
                    {activeQuotation.quotationNumber}
                  </div>
                  <p className="text-[10px] text-steel-500">
                    Date: {new Date(activeQuotation.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-steel-500">
                    Valid Until: {new Date(activeQuotation.validityDate).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] font-bold text-steel-700">
                    Revision: {activeQuotation.revision}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-steel-50 rounded border border-steel-200">
                  <span className="font-bold text-steel-600 text-[10px] uppercase block mb-1">
                    Billed To:
                  </span>
                  <p className="font-bold text-steel-950">{activeQuotation.company}</p>
                  <p className="text-steel-700">Attn: {activeQuotation.customerName}</p>
                  <p className="text-steel-600">{activeQuotation.email}</p>
                  <p className="text-steel-600">{activeQuotation.phone}</p>
                  <p className="text-steel-600">{activeQuotation.billingAddress || activeQuotation.country}</p>
                </div>
                <div className="p-3 bg-steel-50 rounded border border-steel-200">
                  <span className="font-bold text-steel-600 text-[10px] uppercase block mb-1">
                    Commercial Terms:
                  </span>
                  <p className="text-steel-800">
                    <strong>Payment:</strong> {activeQuotation.paymentTerms}
                  </p>
                  <p className="text-steel-800">
                    <strong>Delivery:</strong> {activeQuotation.deliveryTerms}
                  </p>
                  <p className="text-steel-800">
                    <strong>Currency:</strong> {activeQuotation.currency}
                  </p>
                  <p className="text-steel-800">
                    <strong>Status:</strong>{' '}
                    <span className="uppercase font-bold text-cyan-700">{activeQuotation.status}</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-steel-200">
                <thead className="bg-steel-100 text-steel-700 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Grade</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Rate</th>
                    <th className="py-2 px-3 text-right">Disc %</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-200">
                  {activeQuotation.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 text-steel-500 font-mono">{i + 1}</td>
                      <td className="py-2 px-3 font-semibold text-steel-950">
                        {item.productName}
                        {item.sku && <span className="block text-[10px] font-mono text-steel-500">SKU: {item.sku}</span>}
                      </td>
                      <td className="py-2 px-3 text-steel-700">{item.grade || '—'}</td>
                      <td className="py-2 px-3 text-steel-700">{item.size || '—'}</td>
                      <td className="py-2 px-3 text-right font-medium">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        {item.discountPercent ? `${item.discountPercent}%` : '0%'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-steel-950">
                        {item.lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations Box */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-steel-200">
                    <span className="text-steel-600">Subtotal:</span>
                    <span className="font-mono font-semibold">
                      {activeQuotation.currency} {activeQuotation.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-steel-200">
                    <span className="text-steel-600">Tax ({activeQuotation.taxPercent}%):</span>
                    <span className="font-mono font-semibold">
                      {activeQuotation.currency} {activeQuotation.taxTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-steel-800 text-sm font-bold">
                    <span>Grand Total:</span>
                    <span className="font-mono font-extrabold text-steel-950">
                      {activeQuotation.currency} {activeQuotation.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes & Signatory */}
              <div className="pt-4 border-t border-steel-200 grid grid-cols-2 gap-4 text-[11px] text-steel-600">
                <div>
                  <p className="font-bold text-steel-800 mb-1">Standard Terms & Conditions:</p>
                  <p>{activeQuotation.notes || 'All supplies subject to standard commercial warranty and EN 10204 3.1 MTC.'}</p>
                </div>
                <div className="text-right pt-6">
                  <div className="inline-block border-t border-steel-400 pt-1 text-center min-w-[160px]">
                    <span className="font-bold text-steel-900 block">Authorized Signatory</span>
                    <span className="text-[10px] text-steel-500 block">For Lotus Impex</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                onClick={() => window.print()}
                icon={<Printer className="h-4 w-4" />}
              >
                Print / Save PDF
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setViewModalOpen(false);
                    setTargetStatus(activeQuotation.status);
                    setStatusModalOpen(true);
                  }}
                >
                  Change Status
                </Button>
                <Button variant="primary" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CHANGE STATUS MODAL */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Quotation Lifecycle Status"
        description={`Quotation: ${activeQuotation?.quotationNumber} (${activeQuotation?.company})`}
      >
        <div className="space-y-4">
          <Select
            label="New Status"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value as QuotationStatus)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent to Client' },
              { value: 'revised', label: 'Under Revision' },
              { value: 'accepted', label: 'Accepted / Won' },
              { value: 'rejected', label: 'Rejected / Lost' },
              { value: 'expired', label: 'Expired' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />

          <Textarea
            label="Lifecycle Notes"
            placeholder="Record reason for change (e.g., client accepted via email, price negotiated, revised specifications)..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-200 dark:border-steel-800">
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus}>
              Save Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
