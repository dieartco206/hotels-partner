import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  QrCode, 
  WalletCards, 
  Building,
  HelpCircle,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenCheckIn,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & Allotment', icon: BedDouble },
    { id: 'bookings', label: 'Reservations', icon: CalendarCheck },
    { id: 'settlements', label: 'Payouts & Settlement', icon: WalletCards },
    { id: 'profile', label: 'Hotel Profile', icon: Building },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Mobile Header in Drawer */}
        <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Partner Navigation
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-2xs font-bold border border-brand-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
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
        <div className="p-4 bg-gradient-to-br from-brand-50 to-blue-50/40 border border-brand-100/90 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-800">Front Desk Check-In</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Verify guest booking voucher code to issue room keycard immediately.
          </p>
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenCheckIn();
            }}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Open Scanner
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200/60 text-xs text-slate-400 flex items-center justify-between">
        <span className="font-mono text-[11px]">Extranet v3.2</span>
        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
          <HelpCircle className="w-3.5 h-3.5" />
          Partner FAQ
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed/Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 shrink-0 min-h-[calc(100vh-61px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
