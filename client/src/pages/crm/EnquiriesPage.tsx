import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Enquiry, User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Search,
  Filter,
  UserCheck,
  Calendar,
  MessageSquare,
  Clock,
  Send,
  Phone,
  Mail,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const EnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected enquiry for detail drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const queryId = searchParams.get('id');

  // Modals for actions
  const [commModalOpen, setCommModalOpen] = useState(false);
  const [commData, setCommData] = useState({
    type: 'call',
    summary: '',
    notes: '',
  });

  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    taskDescription: '',
    priority: 'medium',
  });

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string>('contacted');
  const [statusNotes, setStatusNotes] = useState('');
  const [lossReason, setLossReason] = useState('');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getEnquiries({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50,
      });
      if (res?.success && res.data?.enquiries) {
        setEnquiries(res.data.enquiries);

        // If query param 'id' is present, auto-open that enquiry
        if (queryId) {
          const match = res.data.enquiries.find((e: Enquiry) => e._id === queryId);
          if (match) setSelectedEnquiry(match);
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [search, statusFilter, queryId]);

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await api.getUsers();
        if (res?.success && res.data?.users) {
          setStaffUsers(res.data.users);
        }
      } catch {
        // Staff endpoint might fail if staff role; ignore
      }
    }
    loadStaff();
  }, []);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await api.getEnquiryById(id);
      if (res?.success && res.data?.enquiry) {
        setSelectedEnquiry(res.data.enquiry);
      }
    } catch (err) {
      console.error('Failed to fetch enquiry detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await api.updateEnquiryStatus(selectedEnquiry._id, {
        status: targetStatus,
        notes: statusNotes,
        lossReason: targetStatus === 'lost' ? lossReason : undefined,
      });
      if (res?.success) {
        setStatusModalOpen(false);
        openDetail(selectedEnquiry._id);
        loadEnquiries();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedEnquiry || !selectedStaffId) return;
    try {
      const res = await api.assignEnquiry(selectedEnquiry._id, {
        assignedUserId: selectedStaffId,
      });
      if (res?.success) {
        setAssignModalOpen(false);
        openDetail(selectedEnquiry._id);
        loadEnquiries();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to assign staff member');
    }
  };

  const handleCreateFollowUp = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await api.createFollowUp(selectedEnquiry._id, {
        dueDate: new Date(followUpData.dueDate).toISOString(),
        taskDescription: followUpData.taskDescription,
        priority: followUpData.priority,
      });
      if (res?.success) {
        setFollowUpModalOpen(false);
        setFollowUpData({
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          taskDescription: '',
          priority: 'medium',
        });
        openDetail(selectedEnquiry._id);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to schedule follow-up');
    }
  };

  const handleLogCommunication = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await api.createCommunicationLog(selectedEnquiry._id, commData);
      if (res?.success) {
        setCommModalOpen(false);
        setCommData({ type: 'call', summary: '', notes: '' });
        openDetail(selectedEnquiry._id);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to log communication');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: 'primary',
      contacted: 'info',
      qualified: 'purple',
      quotation_sent: 'warning',
      negotiation: 'orange',
      won: 'success',
      lost: 'danger',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="sm">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      urgent: 'danger',
      high: 'warning',
      medium: 'default',
      low: 'default',
    };
    return (
      <Badge variant={variants[priority] || 'default'} size="sm">
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search enquiries, customer, or company..."
              value={search}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) params.set('search', e.target.value);
                else params.delete('search');
                setSearchParams(params);
              }}
              className="pl-9"
            />
            <Search className="h-4 w-4 text-steel-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value !== 'all') params.set('status', e.target.value);
                else params.delete('status');
                setSearchParams(params);
              }}
              options={[
                { label: 'All Lifecycle Stages', value: 'all' },
                { label: 'New (Received)', value: 'new' },
                { label: 'Contacted', value: 'contacted' },
                { label: 'Qualified', value: 'qualified' },
                { label: 'Quotation Sent', value: 'quotation_sent' },
                { label: 'In Negotiation', value: 'negotiation' },
                { label: 'Won Orders', value: 'won' },
                { label: 'Lost Enquiries', value: 'lost' },
              ]}
              className="w-full sm:w-56"
            />
          </div>
        </div>
      </Card>

      {/* Main Enquiries Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving enquiries from database..." />
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-steel-500 text-xs">
            No matching enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Customer & Company</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Product / Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {enquiries.map((enq) => (
                  <tr
                    key={enq._id}
                    className={`hover:bg-steel-50/80 cursor-pointer transition-colors ${
                      selectedEnquiry?._id === enq._id ? 'bg-blue-50/60' : ''
                    }`}
                    onClick={() => openDetail(enq._id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-steel-800">
                      {enq.enquiryNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-steel-900 block">{enq.customerName}</span>
                      <span className="text-[11px] text-steel-500">{enq.company}</span>
                    </td>
                    <td className="py-3.5 px-4 text-steel-600">{enq.country}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-steel-800 font-semibold block truncate max-w-[180px]">
                        {enq.productName}
                      </span>
                      <span className="text-[11px] text-steel-500">
                        {enq.quantity} {enq.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(enq.status)}</td>
                    <td className="py-3.5 px-4">{getPriorityBadge(enq.priority)}</td>
                    <td className="py-3.5 px-4 text-steel-600 font-medium">
                      {enq.assignedUserName || (
                        <span className="text-steel-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-steel-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(enq._id);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setSelectedEnquiry(null)}
          />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-steel-200 bg-steel-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-steel-600">
                    {selectedEnquiry.enquiryNumber}
                  </span>
                  {getStatusBadge(selectedEnquiry.status)}
                  {getPriorityBadge(selectedEnquiry.priority)}
                </div>
                <h3 className="text-xl font-bold text-steel-900">
                  {selectedEnquiry.customerName}
                </h3>
                <span className="text-xs text-steel-600 font-medium">
                  {selectedEnquiry.company} • {selectedEnquiry.country}
                </span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-steel-400 hover:text-steel-700 hover:bg-steel-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-steel-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setTargetStatus(selectedEnquiry.status);
                    setStatusModalOpen(true);
                  }}
                >
                  Update Stage / Lifecycle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignModalOpen(true)}
                  icon={<UserCheck className="h-3.5 w-3.5" />}
                >
                  Assign Staff
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFollowUpModalOpen(true)}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                >
                  Schedule Follow-up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommModalOpen(true)}
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                >
                  Log Communication
                </Button>
              </div>

              {/* Contact & RFQ Specification Card */}
              <div className="bg-steel-50 p-4 rounded-xl border border-steel-200 text-xs space-y-3">
                <h4 className="font-bold text-steel-800 uppercase tracking-wider text-[11px]">
                  Enquiry Specification:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-steel-400 block">Product of Interest</span>
                    <span className="font-semibold text-steel-900">
                      {selectedEnquiry.productName}
                    </span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Requested Quantity</span>
                    <span className="font-semibold text-steel-900">
                      {selectedEnquiry.quantity} {selectedEnquiry.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Email Address</span>
                    <span className="font-semibold text-steel-900">{selectedEnquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Phone / WhatsApp</span>
                    <span className="font-semibold text-steel-900">{selectedEnquiry.phone}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Lead Source</span>
                    <span className="font-semibold text-steel-900">{selectedEnquiry.source}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Assigned Staff</span>
                    <span className="font-semibold text-steel-900">
                      {selectedEnquiry.assignedUserName || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-steel-200">
                  <span className="text-steel-400 block mb-1">Buyer Requirements Message:</span>
                  <p className="bg-white p-3 rounded-lg border border-steel-200 text-steel-800 leading-relaxed font-sans">
                    {selectedEnquiry.message}
                  </p>
                </div>

                {selectedEnquiry.lossReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <strong className="block font-bold">Lost Lead Reason:</strong>
                    <span>{selectedEnquiry.lossReason}</span>
                  </div>
                )}
              </div>

              {/* Activity & Communication History Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-steel-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-blue" />
                  <span>Activity History & Communication Timeline</span>
                </h4>

                <div className="space-y-3 border-l-2 border-steel-200 ml-2 pl-4">
                  {selectedEnquiry.activityHistory?.map((act, i) => (
                    <div key={i} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-blue ring-4 ring-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-steel-900">{act.action}</span>
                        <span className="text-[10px] text-steel-400">
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] text-steel-500">By {act.performedBy}</span>
                      {act.notes && (
                        <p className="mt-1 text-steel-700 bg-steel-50 p-2 rounded-md border border-steel-100">
                          {act.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Lifecycle Status */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Enquiry Pipeline Lifecycle"
        description="Progress the lead through commercial stages."
      >
        <div className="space-y-4">
          <Select
            label="Lifecycle Stage"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
            options={[
              { label: 'New (Received)', value: 'new' },
              { label: 'Contacted (Initial Outreach)', value: 'contacted' },
              { label: 'Qualified (Specs Verified)', value: 'qualified' },
              { label: 'Quotation Sent (Commercial Proposal)', value: 'quotation_sent' },
              { label: 'Negotiation (Terms Review)', value: 'negotiation' },
              { label: 'Won (Purchase Order Closed)', value: 'won' },
              { label: 'Lost (Closed Without Deal)', value: 'lost' },
            ]}
          />

          {targetStatus === 'lost' && (
            <Textarea
              label="Loss Reason"
              required
              rows={2}
              placeholder="Specify reason (e.g. competitor price lower, specification mismatch, lead time)..."
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
            />
          )}

          <Textarea
            label="Internal Notes / Progress Summary"
            rows={2}
            placeholder="Document notes regarding this stage transition..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus}>
              Save Status
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Assign Staff */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Staff Owner"
      >
        <div className="space-y-4">
          <Select
            label="Assignee"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            options={[
              { label: 'Select Staff Member...', value: '' },
              ...staffUsers.map((u) => ({
                label: `${u.name} (${u.role === 'super_admin' ? 'Admin' : 'Staff'})`,
                value: u.id || u._id || '',
              })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAssignStaff} disabled={!selectedStaffId}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Schedule Follow-Up */}
      <Modal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        title="Schedule Task & Follow-up Reminder"
      >
        <div className="space-y-4">
          <Input
            label="Task Description"
            required
            placeholder="e.g. Call Rajesh Mehta regarding Anand Plant delivery terms"
            value={followUpData.taskDescription}
            onChange={(e) =>
              setFollowUpData({ ...followUpData, taskDescription: e.target.value })
            }
          />
          <Input
            label="Due Date & Time"
            type="datetime-local"
            required
            value={followUpData.dueDate}
            onChange={(e) => setFollowUpData({ ...followUpData, dueDate: e.target.value })}
          />
          <Select
            label="Priority"
            value={followUpData.priority}
            onChange={(e) => setFollowUpData({ ...followUpData, priority: e.target.value })}
            options={[
              { label: 'Medium Priority', value: 'medium' },
              { label: 'High Priority', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
              { label: 'Low', value: 'low' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button variant="outline" onClick={() => setFollowUpModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateFollowUp}
              disabled={!followUpData.taskDescription}
            >
              Save Follow-up
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Log Communication */}
      <Modal
        isOpen={commModalOpen}
        onClose={() => setCommModalOpen(false)}
        title="Log Customer Communication"
        description="Record outbound or inbound interaction history into the CRM timeline."
      >
        <div className="space-y-4">
          <Select
            label="Communication Type"
            value={commData.type}
            onChange={(e) => setCommData({ ...commData, type: e.target.value })}
            options={[
              { label: 'Telephone Call (Outbound / Inbound)', value: 'call' },
              { label: 'Email Communication', value: 'email' },
              { label: 'WhatsApp Message / Chat', value: 'whatsapp' },
              { label: 'In-person / Virtual Meeting', value: 'meeting' },
              { label: 'Quotation Commercial Submission', value: 'quotation_activity' },
              { label: 'Internal Staff Note', value: 'internal_note' },
            ]}
          />
          <Input
            label="Summary Heading"
            required
            placeholder="e.g. Spoke with Procurement Manager regarding Jebel Ali freight"
            value={commData.summary}
            onChange={(e) => setCommData({ ...commData, summary: e.target.value })}
          />
          <Textarea
            label="Detailed Interaction Notes"
            required
            rows={3}
            placeholder="Record customer response, technical clarifications discussed, or pricing feedback..."
            value={commData.notes}
            onChange={(e) => setCommData({ ...commData, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button variant="outline" onClick={() => setCommModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLogCommunication}
              disabled={!commData.summary || !commData.notes}
            >
              Save Communication Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
