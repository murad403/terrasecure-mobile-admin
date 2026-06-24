"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, MapPin, Save } from 'lucide-react';
import { Zone } from './GisMapPage';

interface EditZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
  onSave: (zone: Zone) => void;
}

const EditZoneModal = ({ isOpen, onClose, zone, onSave }: EditZoneModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Zone['type']>('Covered / Surveyed');
  const [city, setCity] = useState('All Statuses');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [lastSurveyDate, setLastSurveyDate] = useState('');
  const [notes, setNotes] = useState('');

  // Prefill form when zone changes or modal opens
  useEffect(() => {
    if (zone) {
      setName(zone.name || '');
      setType(zone.type || 'Covered / Surveyed');
      setCity(zone.city || 'All Statuses');
      setDistrict(zone.district || '');
      setArea(zone.area || '');
      setLastSurveyDate(zone.lastSurveyDate || '');
      setNotes(zone.notes || '');
    }
  }, [zone, isOpen]);

  if (!isOpen) return null;

  const isFormValid = name.trim() !== '' && district.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSave({
      ...zone,
      name,
      type,
      city,
      district,
      area: area || '0',
      lastSurveyDate: type === 'Covered / Surveyed' ? lastSurveyDate : undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const zoneTypes: {
    value: Zone['type'];
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    selectedClass: string;
  }[] = [
    {
      value: 'Covered / Surveyed',
      label: 'Covered / Surveyed',
      sublabel: 'Full GPS survey done, parcels registered',
      icon: (
        <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3px]" />
        </div>
      ),
      selectedClass: 'border-[#15803d] bg-[#f0fdf4] text-[#15803d]',
    },
    {
      value: 'Uncovered / Unsurveyed',
      label: 'Uncovered / Unsurveyed',
      sublabel: 'No survey data available',
      icon: <div className="w-5 h-5 rounded bg-slate-300 border border-slate-400 shrink-0" />,
      selectedClass: 'border-[#475569] bg-[#f8fafc] text-[#475569]',
    },
    {
      value: 'Future Survey Needed',
      label: 'Future Survey Needed',
      sublabel: 'Flagged for upcoming field survey',
      icon: <MapPin className="w-5 h-5 text-red-500 fill-red-500/20 shrink-0" />,
      selectedClass: 'border-[#a16207] bg-[#fefce8] text-[#a16207]',
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 font-sans">
      <div className="bg-white rounded-[20px] w-full max-w-[550px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <h2 className="text-[16px] font-bold text-slate-900">Edit Zone</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Zone Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Zone Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bastos Zone"
              className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
              required
            />
          </div>

          {/* Zone Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Zone Type *
            </label>
            <div className="space-y-2">
              {zoneTypes.map((t) => {
                const isSelected = type === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                      isSelected ? t.selectedClass : 'bg-white border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{t.icon}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800">{t.label}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">
                        {t.sublabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                City
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white appearance-none transition-colors cursor-pointer"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Douala">Douala</option>
                  <option value="Garoua">Garoua</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                District *
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bastos"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Area & Last Survey Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Area (km²)
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 4.2"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Last Survey Date
              </label>
              <input
                type="text"
                value={lastSurveyDate}
                onChange={(e) => setLastSurveyDate(e.target.value)}
                placeholder="e.g. Jan 2024"
                disabled={type !== 'Covered / Surveyed'}
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="w-full min-h-[80px] p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full h-11 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isFormValid 
                  ? 'bg-[#15803d] hover:bg-[#166534] text-white shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};

export default EditZoneModal;