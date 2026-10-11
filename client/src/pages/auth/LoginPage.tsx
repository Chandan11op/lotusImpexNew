import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Shield, Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate('/crm');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const autofillDemoAdmin = () => {
    setEmail('chandan110906@gmail.com');
    setPassword('Chandan');
    setError(null);
  };

  const autofillDemoStaff = () => {
    setEmail('staff@lotusimpex.com');
    setPassword('StaffUser2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-steel-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-steel-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Lotus Impex Website</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-steel-900 border border-steel-700 flex items-center justify-center text-cyan-400 shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight">LOTUS IMPEX CRM</h2>
          <p className="mt-1 text-xs text-steel-400">
            Internal Pipeline & Customer Communications Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-steel-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Staff / Administrator Email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@lotusimpex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitting}
                className="w-full justify-center"
                icon={<Lock className="h-4 w-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-6 pt-6 border-t border-steel-100 space-y-3">
            <span className="text-[11px] font-bold text-steel-500 uppercase tracking-wider block text-center">
              Demonstration Quick Autofill
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={autofillDemoAdmin}
                className="text-xs justify-center"
              >
                Super Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={autofillDemoStaff}
                className="text-xs justify-center"
              >
                Sales Staff
              </Button>
            </div>
            <p className="text-[11px] text-steel-400 text-center">
              Super Admin: <code className="text-steel-600 font-mono">chandan110906@gmail.com / Chandan</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
