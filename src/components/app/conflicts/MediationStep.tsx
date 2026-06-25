"use client";
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    <div className="space-y-4 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 3: Mediation</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Formal mediation session with all parties</p>
      </div>

      {/* Mediation Date */}
      <div className="space-y-1.5">
        <Label htmlFor="mediationDate">
          Mediation Date
        </Label>
        <Input
          id="mediationDate"
          type="datetime-local"
          value={mediationDate}
          onChange={(e) => setMediationDate(e.target.value)}
        />
      </div>

      {/* Parties Notified */}
      <div className="space-y-1.5">
        <Label>
          Parties Notified
        </Label>
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
      <div className="space-y-1.5">
        <Label htmlFor="notes">
          Notes for this step
        </Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={3}
          className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
        />
      </div>
    </div>
  );
};

export default MediationStep;