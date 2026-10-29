import React from 'react';
import { Building2, Bell, QrCode, LogOut, ChevronDown, CheckCircle2, Menu, X } from 'lucide-react';

export default function Navbar({ user, hotel, onOpenCheckIn, onLogout, onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle, Branding & Property Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">Hotels Partner</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Extranet
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Property Operations & Revenue</p>
          </div>
        </div>

        {hotel && (
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-800 line-clamp-1">{hotel.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active & Live ({hotel.city}, {hotel.country})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Quick Check-in & Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCheckIn}
          className="flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Guest Check-In</span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
              alt={user?.name || "Partner"}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-slate-800">{user?.name || "Hotel Manager"}</div>
              <div className="text-slate-400 capitalize">{user?.role || "Partner"}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
