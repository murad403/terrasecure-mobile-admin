"use client";
import React from 'react';

interface ArchiveCaseStepProps {
  notes: string;
  setNotes: (v: string) => void;
}

const ArchiveCaseStep = ({
  notes,
  setNotes,
}: ArchiveCaseStepProps) => {
  return (
    <div className="space-y-5 font-sans">
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
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Notes for this step
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full min-h-[120px] p-3.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default ArchiveCaseStep;