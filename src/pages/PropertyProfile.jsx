import React, { useState } from 'react';
import { Building, MapPin, Star, Tag, Save, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { partnerApi } from '../services/api';

export default function PropertyProfile({ hotel, onRefresh }) {
  const [formData, setFormData] = useState({
    tagline: hotel?.tagline || '',
    address: hotel?.address || '',
    description: hotel?.description || '',
    star_rating: hotel?.star_rating || 5,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  let facilities = [];
  try {
    facilities = hotel?.facilities ? JSON.parse(hotel.facilities) : [];
  } catch (e) {
    facilities = [];
  }

  let gallery = [];
  try {
    gallery = hotel?.gallery ? JSON.parse(hotel.gallery) : [];
  } catch (e) {
    gallery = [];
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hotel?.id) return;

    setSaving(true);
    setSuccess(false);
    try {
      await partnerApi.updateHotel(hotel.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update property details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Property Profile</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {hotel?.status || 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official listing details and content displayed across consumer search portals.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Updates'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Property details updated successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Information */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hotel Property Name</label>
            <input
              type="text"
              disabled
              value={hotel?.name || ''}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">To rename registered property name, contact regional account manager.</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Marketing Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                disabled
                value={`${hotel?.city || ''}, ${hotel?.country || ''}`}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Star Classification</label>
              <select
                value={formData.star_rating}
                onChange={(e) => setFormData({ ...formData, star_rating: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              >
                <option value={5}>5-Star Luxury</option>
                <option value={4}>4-Star Premium</option>
                <option value={3}>3-Star Boutique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Property Description</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Right 1 Col: Media & Amenities Preview */}
        <div className="space-y-6">
          {/* Main Hero Photo */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
            <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-600" />
              <span>Primary Hero Photo</span>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
              <img
                src={hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={hotel?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
            <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Property Facilities</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {facilities.map((f, i) => (
                <span key={i} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
