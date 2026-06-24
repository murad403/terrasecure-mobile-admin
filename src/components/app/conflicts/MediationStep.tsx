"use client";
import React from 'react';

interface MediationStepProps {
  mediationDate: string;
  setMediationDate: (v: string) => void;
  partiesNotified: string[];
  setPartiesNotified: (v: string[]) => void;
  notes: string;
  setNotes: (v: string) => void;
  parcelIds: string[];
}

const MediationStep = ({
  mediationDate,
  setMediationDate,
  partiesNotified,
  setPartiesNotified,
  notes,
  setNotes,
  parcelIds = ['CM-2847', 'CM-2848'],
}: MediationStepProps) => {
  const toggleParty = (party: string) => {
    if (partiesNotified.includes(party)) {
      setPartiesNotified(partiesNotified.filter(p => p !== party));
    } else {
      setPartiesNotified([...partiesNotified, party]);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 3: Mediation</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Formal mediation session with all parties</p>
      </div>

      {/* Mediation Date */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Mediation Date
        </label>
        <input
          type="datetime-local"
          value={mediationDate}
          onChange={(e) => setMediationDate(e.target.value)}
          className="w-full h-10 px-3.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors cursor-pointer"
        />
      </div>

      {/* Parties Notified */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Parties Notified
        </label>
        <div className="space-y-2.5 mt-2 pl-1">
          {parcelIds.map((pid) => {
            const label = `Owner of ${pid}`;
            const isChecked = partiesNotified.includes(label);
            return (
              <label key={pid} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleParty(label)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Notes for this step
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full min-h-[90px] p-3 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default MediationStep;