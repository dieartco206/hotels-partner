import React from 'react';
import { 
  WalletCards, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  Building, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

export default function Settlements({ settlements, hotel }) {
  const formatCurrency = (amount, currency = 'SGD') => {
    if (!amount) return '0';
    if (currency === 'IDR') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    } else if (currency === 'MYR') {
      return `RM ${Math.round(amount).toLocaleString('en-US')}`;
    }
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const totalGross = settlements.reduce((acc, s) => acc + (s.gross_amount || 0), 0);
  const totalCommission = settlements.reduce((acc, s) => acc + (s.platform_commission || 0), 0);
  const totalNet = settlements.reduce((acc, s) => acc + (s.net_payout || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payouts & Settlement Ledger</h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Automated Bi-Weekly
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Track property earnings, platform commission deductions (15%), and scheduled bank disbursements.
        </p>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 mb-1">Gross Booking Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 truncate">
            {formatCurrency(totalGross, hotel?.currency)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Total processed reservations</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 mb-1">Platform Commission (15%)</div>
          <div className="text-2xl font-extrabold text-brand-600 truncate">
            {formatCurrency(totalCommission, hotel?.currency)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Standard OTA distribution fee</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="text-xs font-semibold text-emerald-800 mb-1">Net Partner Payout</div>
          <div className="text-2xl font-extrabold text-emerald-700 truncate">
            {formatCurrency(totalNet, hotel?.currency)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible for direct transfer</span>
          </div>
        </div>
      </div>

      {/* Bank Account Verification Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Verified Corporate Disbursement Account</div>
            <div className="text-xs text-slate-500">
              DBS Singapore / BCA Nusantara / Maybank Berhad • Account: <span className="font-mono font-semibold text-slate-700">8892-0192-4410</span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          KYC Verified
        </span>
      </div>

      {/* Settlements Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Disbursement Statements History
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No settlement statements generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Settlement ID</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold">Gross Amount</th>
                  <th className="py-3 px-4 font-semibold">Commission (15%)</th>
                  <th className="py-3 px-4 font-semibold">Net Payout</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((s) => {
                  const dateStr = new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {s.settlement_code}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{dateStr}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {formatCurrency(s.gross_amount, s.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        -{formatCurrency(s.platform_commission, s.currency)}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                        {formatCurrency(s.net_payout, s.currency)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          s.status === 'transferred' || s.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
