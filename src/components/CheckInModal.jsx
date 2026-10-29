import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertCircle, Key, User, Calendar, BedDouble } from 'lucide-react';
import { partnerApi } from '../services/api';

export default function CheckInModal({ isOpen, onClose, onCheckInSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await partnerApi.checkInGuest(code.trim());
      setSuccessData(res.data);
      if (onCheckInSuccess) onCheckInSuccess();
    } catch (err) {
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setError(null);
    setSuccessData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!successData ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Front Desk Guest Check-In</h3>
                <p className="text-xs text-slate-500">Scan QR voucher or enter reservation code</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Booking Code or QR Data
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. HTL-SG-8812 or scan QR"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  autoFocus
                />
              </div>

              {/* Simulation Quick Buttons */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Demo Vouchers
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCode('HTL-SG-8812')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono transition-colors"
                  >
                    HTL-SG-8812 (SG)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCode('HTL-ID-7721')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono transition-colors"
                  >
                    HTL-ID-7721 (ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCode('HTL-MY-4402')}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono transition-colors"
                  >
                    HTL-MY-4402 (MY)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  {loading ? 'Verifying...' : 'Validate & Check In'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Guest Successfully Checked In!</h3>
            <p className="text-xs text-slate-500 mb-5">Digital key card issued and room marked occupied.</p>

            <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-2.5 mb-5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Reservation Code</span>
                <span className="font-mono font-bold text-brand-600 text-sm">{successData.booking_code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Guest Name</span>
                <span className="font-semibold text-slate-800">{successData.guest_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5" /> Room Category</span>
                <span className="font-semibold text-slate-800">{successData.room?.name || 'Deluxe Room'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Duration</span>
                <span className="font-semibold text-slate-800">{successData.nights} Night(s)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Key Card Assigned</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Suite 408</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Scan Next Guest
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
