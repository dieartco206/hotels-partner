import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { partnerApi } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;

    if (!loginEmail || !loginPass) {
      setError('Please provide email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await partnerApi.login(loginEmail, loginPass);
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    handleLogin(null, presetEmail, presetPass);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white shadow-md mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hotels Extranet</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">Hotel Partner & Property Management Portal</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-7 px-6 sm:px-8 rounded-2xl shadow-card border border-slate-200/80">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Partner Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="manager@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In to Extranet'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>One-Click Partner Demo Logins</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => quickLogin('partner.sg@marinabay.com', 'partner123')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🇸🇬 Singapore</span>
                    <span className="text-slate-400 font-normal">• Marina Bay Sands</span>
                  </div>
                  <div className="text-[11px] text-slate-500">partner.sg@marinabay.com</div>
                </div>
                <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('partner.id@ayana.com', 'partner123')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🇮🇩 Indonesia</span>
                    <span className="text-slate-400 font-normal">• AYANA Resort Bali</span>
                  </div>
                  <div className="text-[11px] text-slate-500">partner.id@ayana.com</div>
                </div>
                <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('partner.my@kualalumpur.com', 'partner123')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🇲🇾 Malaysia</span>
                    <span className="text-slate-400 font-normal">• Ritz-Carlton KL</span>
                  </div>
                  <div className="text-[11px] text-slate-500">partner.my@kualalumpur.com</div>
                </div>
                <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>TLS 256-Bit Encrypted Partner Extranet</span>
        </div>
      </div>
    </div>
  );
}
