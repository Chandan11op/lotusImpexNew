import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Task, TaskPriority, TaskStatus, User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  CalendarCheck,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  Filter,
  Check,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Users for assignment
  const [users, setUsers] = useState<User[]>([]);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({
    taskTitle: '',
    description: '',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium' as TaskPriority,
    assignedUser: '',
  });

  // Complete Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      });
      if (res?.success && res.data) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.getUsers();
        if (res?.success && res.data?.users) {
          setUsers(res.data.users);
          if (res.data.users.length > 0) {
            const firstId = res.data.users[0]._id || res.data.users[0].id || '';
            setTaskForm((prev) => ({ ...prev, assignedUser: firstId }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    }
    loadUsers();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.taskTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createTask({
        taskTitle: taskForm.taskTitle,
        description: taskForm.description,
        dueDate: new Date(taskForm.dueDate).toISOString(),
        priority: taskForm.priority,
        assignedUser: taskForm.assignedUser || undefined,
      });

      if (res?.success) {
        setCreateModalOpen(false);
        setTaskForm({
          taskTitle: '',
          description: '',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          priority: 'medium',
          assignedUser: users[0]?._id || users[0]?.id || '',
        });
        loadTasks();
      } else {
        alert(res?.error?.message || 'Failed to create task');
      }
    } catch (err: any) {
      alert(err?.message || 'Server error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    try {
      const res = await api.updateTask(selectedTask._id, {
        status: 'completed',
        completionNotes,
      });
      if (res?.success) {
        setCompleteModalOpen(false);
        setSelectedTask(null);
        setCompletionNotes('');
        loadTasks();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to complete task');
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-steel-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-cyan-500" />
            <span>Operational Tasks & Commercial Follow-ups</span>
          </h2>
          <p className="text-xs text-steel-500 dark:text-steel-400 mt-1">
            Track daily customer check-ins, quote expirations, MTR dispatch reminders, and technical reviews.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-steel-900 p-1.5 rounded-lg border border-steel-200 dark:border-steel-800 shadow-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-steel-500 font-semibold">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-steel-300 dark:border-steel-700 rounded-lg bg-white dark:bg-steel-900 text-steel-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Retrieving operational tasks..." />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarCheck className="h-10 w-10 text-steel-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-steel-800 dark:text-steel-200">No Tasks in Queue</h3>
            <p className="text-xs text-steel-500 mt-1">
              All commercial actions and follow-ups are up to date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 dark:bg-steel-900/60 border-b border-steel-200 dark:border-steel-800 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Task Details</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100 dark:divide-steel-800">
                {tasks.map((task) => {
                  const isPast =
                    new Date(task.dueDate) < new Date() && task.status !== 'completed';
                  const assigneeName =
                    typeof task.assignedUser === 'object' && task.assignedUser !== null
                      ? task.assignedUser.name
                      : task.assignedUserName || 'Sales Team';

                  return (
                    <tr
                      key={task._id}
                      className={`hover:bg-steel-50/80 dark:hover:bg-steel-900/40 transition-colors ${
                        isPast ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold block ${
                            isPast ? 'text-red-600 dark:text-red-400 font-bold' : 'text-steel-800 dark:text-steel-200'
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {isPast && (
                          <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Overdue
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <span className="font-bold text-steel-900 dark:text-white block">
                          {task.taskTitle}
                        </span>
                        {task.description && (
                          <span className="text-[11px] text-steel-500 dark:text-steel-400 block mt-0.5">
                            {task.description}
                          </span>
                        )}
                        {task.completionNotes && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 italic block mt-0.5">
                            Outcome: {task.completionNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1.5 text-steel-700 dark:text-steel-300 font-medium">
                          <UserIcon className="h-3.5 w-3.5 text-steel-400" />
                          <span>{assigneeName}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {task.status !== 'completed' ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setCompletionNotes('');
                              setCompleteModalOpen(true);
                            }}
                            icon={<Check className="h-3.5 w-3.5" />}
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

      {/* CREATE TASK MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule Operational Task"
        description="Assign task ownership, timeline, and priority."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="e.g., Call client regarding SS 316L pipe quotation revision..."
            value={taskForm.taskTitle}
            onChange={(e) => setTaskForm({ ...taskForm, taskTitle: e.target.value })}
            required
          />

          <Textarea
            label="Details / Objectives"
            placeholder="Key discussion points, specifications to confirm, or action items..."
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Due Date *"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
            />

            <Select
              label="Priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
              options={[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />

            <Select
              label="Assign Staff"
              value={taskForm.assignedUser}
              onChange={(e) => setTaskForm({ ...taskForm, assignedUser: e.target.value })}
              options={
                users.length > 0
                  ? users.map((u) => ({ value: u._id || u.id || '', label: `${u.name} (${u.role})` }))
                  : [{ value: '', label: 'Unassigned' }]
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-200 dark:border-steel-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Schedule Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* COMPLETE TASK MODAL */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Complete Operational Task"
        description={selectedTask?.taskTitle}
      >
        <div className="space-y-4">
          <Textarea
            label="Action Outcome / Resolution Notes"
            placeholder="Record what was agreed upon (e.g., customer approved price, requested revised schedule, MTR sent)..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-steel-200 dark:border-steel-800">
            <Button variant="outline" onClick={() => setCompleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleCompleteTask}>
              Mark Completed
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
