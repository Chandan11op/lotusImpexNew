import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserPlus, Shield, Lock, Power, UserCheck, KeyRound } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create User Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    phone: '',
  });

  // Reset Password Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res?.success && res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-800">
        Access Denied: Staff User Management is restricted to Super Administrators only.
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createUser(newUserData);
      if (res?.success) {
        setCreateModalOpen(false);
        setNewUserData({ name: '', email: '', password: '', role: 'staff', phone: '' });
        loadUsers();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (userToToggle: User) => {
    if (userToToggle.id === currentUser?.id) {
      alert('You cannot deactivate your own account.');
      return;
    }
    try {
      const res = await api.toggleUserStatus(userToToggle.id);
      if (res?.success) {
        loadUsers();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle user status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset) return;
    try {
      const res = await api.resetUserPassword(selectedUserForReset.id, newPassword);
      if (res?.success) {
        setResetModalOpen(false);
        setSelectedUserForReset(null);
        setNewPassword('');
        alert('Password reset successfully.');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-steel-900">Staff & Roles Administration</h2>
          <p className="text-xs text-steel-500">
            Create internal staff accounts, assign roles, and manage permissions.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          icon={<UserPlus className="h-4 w-4" />}
        >
          Add Staff Member
        </Button>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving user accounts..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Staff Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Access Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-steel-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-steel-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-steel-600 font-mono">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={u.role === 'super_admin' ? 'purple' : 'default'}
                        size="sm"
                      >
                        {u.role === 'super_admin' ? 'Super Admin' : 'Staff'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-steel-500">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUserForReset(u);
                            setNewPassword('');
                            setResetModalOpen(true);
                          }}
                          icon={<KeyRound className="h-3.5 w-3.5" />}
                          title="Reset Password"
                        >
                          Password
                        </Button>
                        {u.id !== currentUser?.id && (
                          <Button
                            variant={u.isActive ? 'outline' : 'success'}
                            size="sm"
                            onClick={() => handleToggleStatus(u)}
                            icon={<Power className="h-3.5 w-3.5" />}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Create Staff Account */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Staff Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <Input
            label="Staff Full Name"
            required
            placeholder="e.g. Ramesh Patel"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
          />
          <Input
            label="Login Email"
            type="email"
            required
            placeholder="ramesh@lotusimpex.com"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <Input
            label="Initial Password"
            type="password"
            required
            placeholder="At least 6 characters"
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          />
          <Select
            label="Role Permission Level"
            value={newUserData.role}
            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
            options={[
              { label: 'Staff Engineer (Enquiries, Customers, Follow-ups)', value: 'staff' },
              { label: 'Super Administrator (Full System Control)', value: 'super_admin' },
            ]}
          />
          <Input
            label="Phone Number"
            placeholder="+91 98200 00000"
            value={newUserData.phone}
            onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reset Password */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Reset Password for ${selectedUserForReset?.name}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
          <Input
            label="New Password"
            type="password"
            required
            placeholder="Enter at least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
            <Button type="button" variant="outline" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
