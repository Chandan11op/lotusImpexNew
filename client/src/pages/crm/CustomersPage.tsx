import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Customer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Search, Building, Mail, Phone, Globe, FileText, Edit2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail / edit modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers({ search: search || undefined });
      if (res?.success && res.data?.customers) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const openCustomerProfile = async (id: string) => {
    try {
      const res = await api.getCustomerById(id);
      if (res?.success && res.data?.customer) {
        setSelectedCustomer(res.data.customer);
        setEditNotes(res.data.customer.notes || '');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to get customer profile', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await api.updateCustomer(selectedCustomer._id, {
        notes: editNotes,
      });
      if (res?.success) {
        setSelectedCustomer({ ...selectedCustomer, notes: editNotes });
        setIsEditing(false);
        loadCustomers();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update customer notes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search customers by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            <Search className="h-4 w-4 text-steel-400 absolute left-3 top-2.5" />
          </div>
          <div className="text-xs text-steel-500">
            Showing <strong>{customers.length}</strong> registered business accounts
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading customer directory..." />
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-steel-500 text-xs">
            No customer accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">RFQs Logged</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {customers.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-steel-50/80 cursor-pointer transition-colors"
                    onClick={() => openCustomerProfile(c._id)}
                  >
                    <td className="py-3.5 px-4 font-bold text-steel-900">{c.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-steel-800">{c.company}</td>
                    <td className="py-3.5 px-4 text-steel-600 font-mono">{c.email}</td>
                    <td className="py-3.5 px-4 text-steel-600">{c.phone}</td>
                    <td className="py-3.5 px-4 text-steel-700">{c.country}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-blue">
                      {c.linkedEnquiries?.length || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerProfile(c._id);
                        }}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Client Profile: ${selectedCustomer.company}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-steel-50 p-4 rounded-xl border border-steel-200">
              <div>
                <span className="text-steel-400 block">Primary Contact</span>
                <strong className="text-steel-900 text-sm block">{selectedCustomer.name}</strong>
              </div>
              <div>
                <span className="text-steel-400 block">Company Name</span>
                <strong className="text-steel-900 text-sm block">{selectedCustomer.company}</strong>
              </div>
              <div>
                <span className="text-steel-400 block">Email Address</span>
                <span className="font-mono text-steel-800">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-steel-400 block">Phone</span>
                <span className="text-steel-800">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-steel-400 block">Country</span>
                <span className="text-steel-800">{selectedCustomer.country}</span>
              </div>
              <div>
                <span className="text-steel-400 block">Registered On</span>
                <span className="text-steel-800">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-steel-800 uppercase tracking-wider text-[11px]">
                  Internal Client Notes:
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-brand-blue hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Notes</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="bg-steel-50 p-3 rounded-lg border border-steel-200 text-steel-700 leading-relaxed italic">
                  {selectedCustomer.notes || 'No notes recorded for this client yet.'}
                </p>
              )}
            </div>

            {/* Linked Enquiries History */}
            <div className="space-y-2">
              <span className="font-bold text-steel-800 uppercase tracking-wider text-[11px] block">
                Linked Quotations & Enquiries History:
              </span>
              {selectedCustomer.linkedEnquiries && selectedCustomer.linkedEnquiries.length > 0 ? (
                <div className="border border-steel-200 rounded-lg overflow-hidden divide-y divide-steel-100">
                  {selectedCustomer.linkedEnquiries.map((item: any) => (
                    <div key={item._id || item} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-steel-900 block">
                          {item.enquiryNumber || 'Enquiry Record'}
                        </span>
                        <span className="text-steel-600">{item.productName || 'Sanitary Product'}</span>
                      </div>
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-steel-100 text-steel-700">
                        {item.status || 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-steel-500">No linked enquiries found.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-steel-100">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
