"use client";
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, MapPin, FolderPlus } from 'lucide-react';
import { Zone } from './GisMapPage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (zone: Omit<Zone, 'id'>) => void;
}

const AddZoneModal = ({ isOpen, onClose, onAdd }: AddZoneModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Zone['type']>('Covered / Surveyed');
  const [city, setCity] = useState('All Statuses');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [lastSurveyDate, setLastSurveyDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const isFormValid = name.trim() !== '' && district.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onAdd({
      name,
      type,
      city,
      district,
      area: area || '0',
      lastSurveyDate: type === 'Covered / Surveyed' ? (lastSurveyDate || 'N/A') : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset fields
    setName('');
    setType('Covered / Surveyed');
    setCity('All Statuses');
    setDistrict('');
    setArea('');
    setLastSurveyDate('');
    setNotes('');
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
          <h2 className="text-[16px] font-bold text-slate-900">Add Coverage Zone</h2>
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
            <Label>
              Zone Name *
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bastos Zone"
            />
          </div>

          {/* Zone Type */}
          <div>
            <Label>
              Zone Type *
            </Label>
            <div className="space-y-2">
              {zoneTypes.map((t) => {
                const isSelected = type === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? t.selectedClass : 'bg-white border-slate-200 hover:bg-slate-50/50'
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
              <Label>
                City
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                  <SelectItem value="Douala">Douala</SelectItem>
                  <SelectItem value="Garoua">Garoua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                District *
              </Label>
              <Input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bastos"
                required
              />
            </div>
          </div>

          {/* Area & Last Survey Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Area (km²)
              </Label>
              <Input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 4.2"
              />
            </div>

            <div>
              <Label>
                Last Survey Date
              </Label>
              <Input
                type="text"
                value={lastSurveyDate}
                onChange={(e) => setLastSurveyDate(e.target.value)}
                placeholder="e.g. Jan 2024"
                disabled={type !== 'Covered / Surveyed'}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>
              Notes
            </Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
            />
          </div>

          {/* Buttons */}
          <div className="px-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between py-4 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <Button
              className='w-1/2'
              type="submit"
              disabled={!isFormValid}
            >
              <FolderPlus className="w-4 h-4" />
              Add Zone
            </Button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};

export default AddZoneModal;