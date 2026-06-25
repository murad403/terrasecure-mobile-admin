"use client";
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Pencil, Trash2, Check, MapPin, Calendar, Ruler, Layers } from 'lucide-react';
import { Zone } from './GisMapPage';
import { Button } from '@/components/ui/button';

interface ManageZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  onDeleteZone: (id: string) => void;
  onEditZone: (zone: Zone) => void;
  onOpenAddZone: () => void;
}

const ManageZoneModal = ({
  isOpen,
  onClose,
  zones,
  onDeleteZone,
  onEditZone,
  onOpenAddZone,
}: ManageZoneModalProps) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Covered / Surveyed' | 'Uncovered / Unsurveyed' | 'Future Survey Needed'>('All');

  if (!isOpen) return null;

  // Calculate dynamic stats
  const coveredCount = zones.filter(z => z.type === 'Covered / Surveyed').length;
  const uncoveredCount = zones.filter(z => z.type === 'Uncovered / Unsurveyed').length;
  const futureCount = zones.filter(z => z.type === 'Future Survey Needed').length;

  // Filter zones
  const filteredZones = zones.filter(z => {
    if (activeFilter === 'All') return true;
    return z.type === activeFilter;
  });

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-9998 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Right Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[620px] bg-white z-9999 shadow-2xl flex flex-col overflow-hidden border-l border-slate-100 font-sans transition-transform duration-300 ease-out transform translate-x-0">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900 leading-tight">Coverage Zone Management</h2>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              Define covered, uncovered, and future-survey zones · {zones.length} zones total
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* Covered */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3.5 flex flex-col">
              <span className="text-[#15803d] text-2xl font-extrabold leading-none">{coveredCount}</span>
              <span className="text-[#166534] text-[10px] font-bold mt-1.5">Covered / Surveyed</span>
            </div>
            
            {/* Uncovered */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col">
              <span className="text-[#475569] text-2xl font-extrabold leading-none">{uncoveredCount}</span>
              <span className="text-[#475569] text-[10px] font-bold mt-1.5">Uncovered / Unsurveyed</span>
            </div>
            
            {/* Future Survey */}
            <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-3.5 flex flex-col">
              <span className="text-[#a16207] text-2xl font-extrabold leading-none">{futureCount}</span>
              <span className="text-[#854d0e] text-[10px] font-bold mt-1.5">Future Survey Needed</span>
            </div>
          </div>

          {/* Filters and Add Zone Button */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* All Zones */}
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                  activeFilter === 'All'
                    ? 'bg-button-color border-button-color text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Zones
              </button>

              {/* Covered */}
              <button
                onClick={() => setActiveFilter('Covered / Surveyed')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'Covered / Surveyed'
                    ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  activeFilter === 'Covered / Surveyed'
                    ? 'bg-[#15803d] border-[#15803d] text-white'
                    : 'border-slate-300 bg-white'
                }`}>
                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                </div>
                Covered
              </button>

              {/* Uncovered */}
              <button
                onClick={() => setActiveFilter('Uncovered / Unsurveyed')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'Uncovered / Unsurveyed'
                    ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#334155]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded bg-slate-300 border border-slate-400 shrink-0" />
                Uncovered
              </button>

              {/* Future Survey */}
              <button
                onClick={() => setActiveFilter('Future Survey Needed')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'Future Survey Needed'
                    ? 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                Future Survey Needed
              </button>
            </div>

            {/* Add Zone Button */}
            <Button
              onClick={onOpenAddZone}
              className='w-auto py-2'
            >
              <Plus className="w-3.5 h-3.5" />
              Add Zone
            </Button>
          </div>

          {/* Zones List */}
          <div className="divide-y divide-slate-100">
            {filteredZones.map((zone) => {
              const isCovered = zone.type === 'Covered / Surveyed';
              const isUncovered = zone.type === 'Uncovered / Unsurveyed';
              const isFuture = zone.type === 'Future Survey Needed';

              return (
                <div key={zone.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3">
                  {/* Left Status Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isCovered && (
                      <div className="w-6 h-6 rounded-full bg-[#15803d] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    )}
                    {isUncovered && (
                      <div className="w-6 h-6 rounded bg-[#cbd5e1] border border-[#94a3b8] shrink-0" />
                    )}
                    {isFuture && (
                      <div className="w-6 h-6 rounded-full bg-[#fefce8] border border-[#fef08a] flex items-center justify-center text-red-500">
                        <MapPin className="w-3.5 h-3.5 fill-red-500/20 text-red-500" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-[13px] font-bold text-slate-800 truncate">{zone.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{zone.id}</span>
                      
                      {/* Badge */}
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                        isCovered ? 'bg-[#e2fbe8] text-[#15803d] border border-[#bbf7d0]' :
                        isUncovered ? 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]' :
                        'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                      }`}>
                        {zone.type}
                      </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold mt-1 flex-wrap">
                      <span>{zone.city} – {zone.district}</span>
                      
                      {/* Area */}
                      {zone.area && (
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <Ruler className="w-3 h-3 text-slate-400" />
                          {zone.area} km²
                        </span>
                      )}

                      {/* Parcels Count */}
                      {zone.parcelsCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <Layers className="w-3 h-3 text-slate-400" />
                          {zone.parcelsCount} parcels
                        </span>
                      )}

                      {/* Last Survey Date */}
                      {zone.lastSurveyDate && (
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Last survey: {zone.lastSurveyDate}
                        </span>
                      )}
                    </div>

                    {/* Description Notes */}
                    {zone.notes && (
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                        {zone.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center shrink-0 ml-2 mt-0.5">
                    <button
                      onClick={() => onEditZone(zone)}
                      className="text-slate-400 hover:text-emerald-600 p-1.5 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteZone(zone.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredZones.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-semibold text-sm">
                No coverage zones found matching the filter.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-center border-t border-slate-100 bg-white shrink-0">
          <Button
            onClick={onClose}
          className='w-full'
          >
            Done
          </Button>
        </div>

      </div>
    </>,
    document.body
  );
};

export default ManageZoneModal;