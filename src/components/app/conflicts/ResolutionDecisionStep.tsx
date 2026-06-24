"use client";
import React from 'react';

interface ResolutionDecisionStepProps {
  decision: string;
  setDecision: (v: string) => void;
  justification: string;
  setJustification: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  parcelIds: string[];
}

const ResolutionDecisionStep = ({
  decision,
  setDecision,
  justification,
  setJustification,
  notes,
  setNotes,
  parcelIds = ['CM-2847', 'CM-2848'],
}: ResolutionDecisionStepProps) => {
  return (
    <div className="space-y-5 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 5: Resolution Decision</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Issue final resolution: approve, reject, or escalate</p>
      </div>

      {/* Resolution Decision Dropdown */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Resolution Decision *
        </label>
        <div className="relative">
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full h-10 pl-3.5 pr-8 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white appearance-none transition-colors cursor-pointer"
          >
            <option value={`Approve - ${parcelIds[0] || 'CM-2847'} takes precedence`}>
              Approve - {parcelIds[0] || 'CM-2847'} takes precedence
            </option>
            <option value={`Approve - ${parcelIds[1] || 'CM-2848'} takes precedence`}>
              Approve - {parcelIds[1] || 'CM-2848'} takes precedence
            </option>
            <option value="Reject Both / Request Resubmission">Reject Both / Request Resubmission</option>
            <option value="Escalate to Land Commission">Escalate to Land Commission</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Justification Textarea */}
      <div>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Resolution justification..."
          className="w-full min-h-[90px] p-3.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
        />
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
          className="w-full min-h-[90px] p-3.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default ResolutionDecisionStep;