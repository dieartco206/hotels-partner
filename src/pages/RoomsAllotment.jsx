import React, { useState } from 'react';
import { 
  BedDouble, 
  Plus, 
  Users, 
  Maximize2, 
  Sparkles, 
  Check, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { partnerApi } from '../services/api';

export default function RoomsAllotment({ hotel, rooms, onRefresh, onOpenAddRoom }) {
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const formatCurrency = (amount, currency = 'SGD') => {
    if (!amount) return '0';
    if (currency === 'IDR') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    } else if (currency === 'MYR') {
      return `RM ${Math.round(amount).toLocaleString('en-US')}`;
    }
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const handleAdjustAllotment = async (room, delta) => {
    const newRemaining = Math.max(0, room.remaining_rooms + delta);
    setUpdatingId(room.id);
    try {
      await partnerApi.updateAllotment(room.id, { remaining_rooms: newRemaining });
      setNotification(`Allotment for ${room.name} updated to ${newRemaining} rooms.`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update allotment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSavePrice = async (room) => {
    const newPrice = parseFloat(priceInput);
    if (!newPrice || newPrice <= 0) return;

    setUpdatingId(room.id);
    try {
      await partnerApi.updateAllotment(room.id, { price: newPrice });
      setNotification(`Nightly rate for ${room.name} updated to ${formatCurrency(newPrice, hotel?.currency)}.`);
      setTimeout(() => setNotification(null), 3000);
      setEditingPriceId(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update price');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rooms & Allotment Management</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-700 border border-brand-200">
              {rooms.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Control remaining inventory allotment and dynamic pricing in real-time.
          </p>
        </div>

        <button
          onClick={onOpenAddRoom}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room Category</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Room Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rooms.map((room) => {
          const isSoldOut = room.remaining_rooms <= 0 || room.status === 'sold_out';
          let parsedAmenities = [];
          try {
            parsedAmenities = room.amenities ? JSON.parse(room.amenities) : [];
          } catch (e) {
            parsedAmenities = [];
          }

          const isEditingPrice = editingPriceId === room.id;

          return (
            <div
              key={room.id}
              className={`bg-white border rounded-2xl p-5 shadow-subtle transition-all flex flex-col justify-between ${
                isSoldOut ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top Row: Room Header & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {room.type} Room
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{room.name}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                    isSoldOut
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isSoldOut ? 'Sold Out' : 'Available'}
                  </span>
                </div>

                {/* Specs Pill */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    {room.bed_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Up to {room.max_guests} Guests
                  </span>
                  {room.size_sqm > 0 && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      {room.size_sqm} sqm
                    </span>
                  )}
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {parsedAmenities.slice(0, 4).map((a, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {a}
                    </span>
                  ))}
                  {parsedAmenities.length > 4 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                      +{parsedAmenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Operations: Rate & Allotment Controls */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                {/* Nightly Rate Editor */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Nightly Rate</span>
                  {!isEditingPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(room.price, hotel?.currency)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingPriceId(room.id);
                          setPriceInput(room.price.toString());
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600 rounded transition-colors"
                        title="Adjust rate"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="w-24 px-2 py-1 bg-white border border-brand-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(room)}
                        disabled={updatingId === room.id}
                        className="px-2 py-1 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingPriceId(null)}
                        className="px-1.5 py-1 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Remaining Allotment Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                  <div>
                    <div className="font-semibold text-slate-700">Remaining Allotment</div>
                    <div className="text-[11px] text-slate-400">Total capacity: {room.total_rooms} rooms</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustAllotment(room, -1)}
                      disabled={room.remaining_rooms <= 0 || updatingId === room.id}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-extrabold text-slate-900 text-sm">
                      {room.remaining_rooms}
                    </span>
                    <button
                      onClick={() => handleAdjustAllotment(room, 1)}
                      disabled={updatingId === room.id}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
