"use client";
import React from 'react';
import { Label } from '@/components/ui/label';

interface ArchiveCaseStepProps {
  notes: string;
  setNotes: (v: string) => void;
}

const ArchiveCaseStep = ({
  notes,
  setNotes,
}: ArchiveCaseStepProps) => {
  return (
    <div className="space-y-4 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 6: Archive Case</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Archive the resolved case with documentation</p>
      </div>

      {/* Ready to Archive Status Card */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-emerald-800 space-y-1">
        <div className="text-xs font-extrabold flex items-center gap-1.5">
          <span>✅</span>
          <span>Ready to Archive</span>
        </div>
        <p className="text-[11px] font-semibold text-[#166534] leading-relaxed">
          All steps completed. The case will be archived with full audit trail. Involved parcel statuses will be updated automatically.
        </p>
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

export default ArchiveCaseStep;