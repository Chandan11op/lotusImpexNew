import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FollowUp } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  CalendarCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [counts, setCounts] = useState<{
    overdue: number;
    dueToday: number;
    upcoming: number;
    completed: number;
  }>({
    overdue: 0,
    dueToday: 0,
    upcoming: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  // Complete task modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FollowUp | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const loadFollowUps = async () => {
    setLoading(true);
    try {
      const res = await api.getFollowUps({ filter });
      if (res?.success && res.data) {
        setFollowUps(res.data.followUps);
        if (res.data.counts) setCounts(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to load follow-ups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, [filter]);

  const handleMarkComplete = async () => {
    if (!selectedTask) return;
    try {
      const res = await api.completeFollowUp(selectedTask._id, completionNotes);
      if (res?.success) {
        setCompleteModalOpen(false);
        setSelectedTask(null);
        setCompletionNotes('');
        loadFollowUps();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to complete task');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger" size="sm">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm">High</Badge>;
      default:
        return <Badge variant="default" size="sm">Normal</Badge>;
    }
  };

  const setFilter = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', val);
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-brand-blue text-white shadow-xs'
              : 'bg-white text-steel-700 hover:bg-steel-50 border border-steel-200'
          }`}
        >
          All Tasks
        </button>

        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            filter === 'overdue'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-red-600 hover:bg-red-50 border border-steel-200'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Overdue Tasks ({counts.overdue})</span>
        </button>

        <button
          onClick={() => setFilter('due_today')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            filter === 'due_today'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-600 hover:bg-amber-50 border border-steel-200'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Due Today ({counts.dueToday})</span>
        </button>

        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            filter === 'upcoming'
              ? 'bg-steel-800 text-white shadow-xs'
              : 'bg-white text-steel-700 hover:bg-steel-50 border border-steel-200'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Upcoming ({counts.upcoming})</span>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-steel-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Completed ({counts.completed})</span>
        </button>
      </div>

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading follow-up tasks..." />
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center text-steel-500 text-xs">
            No follow-up tasks in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Related Enquiry</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {followUps.map((task) => {
                  const isPast =
                    new Date(task.dueDate) < new Date() && task.status === 'pending';

                  return (
                    <tr
                      key={task._id}
                      className={`hover:bg-steel-50/80 transition-colors ${
                        isPast ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold block ${
                            isPast ? 'text-red-600 font-bold' : 'text-steel-800'
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-[11px] text-steel-400">
                          {new Date(task.dueDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-steel-900 max-w-sm">
                        {task.taskDescription}
                        {task.completionNotes && (
                          <span className="block text-[11px] text-steel-500 italic mt-0.5">
                            Notes: {task.completionNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/crm/enquiries?id=${task.enquiryRef}`}
                          className="font-mono font-bold text-brand-blue hover:underline flex items-center gap-1"
                        >
                          <span>{task.enquiryNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <span className="text-[11px] text-steel-500 block">
                          {task.company}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                      <td className="py-3.5 px-4">
                        {task.status === 'completed' ? (
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        ) : isPast ? (
                          <Badge variant="danger" size="sm">
                            Overdue
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {task.status === 'pending' ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setCompletionNotes('');
                              setCompleteModalOpen(true);
                            }}
                          >
                            Complete
                          </Button>
                        ) : (
                          <span className="text-[11px] text-steel-400 font-mono">
                            Done {new Date(task.completedAt || '').toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Complete Task Modal */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Mark Task as Completed"
        description={selectedTask?.taskDescription}
      >
        <div className="space-y-4">
          <Textarea
            label="Completion Notes (Optional)"
            placeholder="Record outcome of the follow-up (e.g. called client, quotation received, MTR dispatched)..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button variant="outline" onClick={() => setCompleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleMarkComplete}>
              Confirm Completion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
