import React, { useState } from 'react';
import { X, BedDouble, Plus, Check } from 'lucide-react';
import { partnerApi } from '../services/api';

const DEFAULT_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Complimentary Breakfast',
  'Deep Soaking Bathtub',
  'Floor-to-Ceiling Windows',
  '24/7 Butler Call',
  'Espresso Machine',
  'Balcony Skyline View',
  'Smart 4K IPTV',
];

export default function AddRoomModal({ isOpen, onClose, hotelId, onRoomAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Deluxe',
    price: '',
    original_price: '',
    max_guests: 2,
    bed_type: '1 King Bed',
    size_sqm: 40,
    remaining_rooms: 5,
    total_rooms: 10,
    free_breakfast: true,
    free_cancellation: true,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  });

  const [selectedAmenities, setSelectedAmenities] = useState([
    'Free High-Speed Wi-Fi',
    'Complimentary Breakfast',
    'Deep Soaking Bathtub',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError('Room name and nightly price are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        hotel_id: hotelId,
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : parseFloat(formData.price) * 1.2,
        max_guests: parseInt(formData.max_guests, 10),
        bed_type: formData.bed_type,
        size_sqm: parseInt(formData.size_sqm, 10),
        remaining_rooms: parseInt(formData.remaining_rooms, 10),
        total_rooms: parseInt(formData.total_rooms, 10),
        free_breakfast: formData.free_breakfast,
        free_cancellation: formData.free_cancellation,
        amenities: JSON.stringify(selectedAmenities),
        image: formData.image,
      };

      await partnerApi.createRoom(payload);
      if (onRoomAdded) onRoomAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create room category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Room Category</h3>
            <p className="text-xs text-slate-500">Configure new room specifications & allotment</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Room Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Executive Panoramic Suite"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              >
                <option value="Deluxe">Deluxe</option>
                <option value="Executive">Executive</option>
                <option value="Suite">Suite</option>
                <option value="Villa">Villa</option>
                <option value="Presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bed Configuration</label>
              <input
                type="text"
                value={formData.bed_type}
                onChange={(e) => setFormData({ ...formData, bed_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nightly Rate *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 450"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Strikethrough Price</label>
              <input
                type="number"
                placeholder="e.g. 520"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Guests</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.max_guests}
                onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Size (sqm)</label>
              <input
                type="number"
                min="10"
                value={formData.size_sqm}
                onChange={(e) => setFormData({ ...formData, size_sqm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Allotment</label>
              <input
                type="number"
                min="1"
                value={formData.remaining_rooms}
                onChange={(e) => setFormData({ ...formData, remaining_rooms: e.target.value, total_rooms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Amenities Included</label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Creating Room...' : 'Publish Room Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
