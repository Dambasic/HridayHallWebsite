import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('admin@hridaybanquet.com');
  const [password, setPassword] = useState('HridayAdmin@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage('');
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <SEOHead title="Admin Login | Hriday Banquet Hall" robots="noindex, nofollow" />
      {/* Background Lighting Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-maroon-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Website Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ivory-100 hover:text-gold-300 transition px-3.5 py-2 rounded-full bg-[#390014]/80 border border-gold-400/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-400 mx-auto shadow-gold-sm mb-4 bg-burgundy-950">
            <img src="/hriday-logo.png" alt="Hriday Banquet Hall" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ivory-50">
            Hriday Banquet Hall
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold-300 mt-1 font-semibold">
            Management &amp; Content Portal
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-charcoal-900/95 backdrop-blur-xl border border-gold-400/40 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/15 text-ivory-50">
            <ShieldCheck className="w-5 h-5 text-gold-300" />
            <h2 className="text-base font-semibold">Secure Administrator Access</h2>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/20 border border-rose-400/60 text-rose-100 text-xs rounded-xl flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-200 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-300 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin@hridaybanquet.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-charcoal-950/90 border border-charcoal-600 rounded-xl text-sm text-white placeholder:text-ivory-200/60 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-300 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-charcoal-950/90 border border-charcoal-600 rounded-xl text-sm text-white placeholder:text-ivory-200/60 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-charcoal-950 font-bold text-sm tracking-wide transition shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Setup Hint */}
          <div className="mt-8 pt-6 border-t border-white/15 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-ivory-100">
              <KeyRound className="w-3.5 h-3.5 text-gold-300" />
              <span>Initial Setup Credentials Pre-filled</span>
            </div>
            <p className="text-[11px] text-gold-200 mt-1">
              You can change your password anytime inside General Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
