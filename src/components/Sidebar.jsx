import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  QrCode, 
  WalletCards, 
  Building,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenCheckIn }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & Allotment', icon: BedDouble },
    { id: 'bookings', label: 'Reservations', icon: CalendarCheck },
    { id: 'settlements', label: 'Payouts & Settlement', icon: WalletCards },
    { id: 'profile', label: 'Hotel Profile', icon: Building },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Main Nav */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Callout */}
        <div className="p-3.5 bg-gradient-to-br from-brand-50 to-blue-50/50 border border-brand-100/80 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-800">Front Desk Check-In</span>
          </div>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Scan guest booking voucher or enter reservation code to issue key card.
          </p>
          <button
            onClick={onOpenCheckIn}
            className="w-full py-2 bg-white hover:bg-slate-50 border border-brand-200 text-brand-700 text-xs font-bold rounded-lg transition-colors shadow-subtle"
          >
            Open Check-In Station
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>Hotels OTA v2.4</span>
        <span className="flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer">
          <HelpCircle className="w-3.5 h-3.5" />
          Support
        </span>
      </div>
    </aside>
  );
}
