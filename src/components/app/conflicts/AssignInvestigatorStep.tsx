"use client";
import React from 'react';

interface AssignInvestigatorStepProps {
  investigator: string;
  setInvestigator: (v: string) => void;
  priority: string;
  setPriority: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

const AssignInvestigatorStep = ({
  investigator,
  setInvestigator,
  priority,
  setPriority,
  notes,
  setNotes,
}: AssignInvestigatorStepProps) => {
  return (
    <div className="space-y-5 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 1: Assign Investigator</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Assign a qualified investigator to the case</p>
      </div>

      {/* Investigator Selection */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Assign Investigator
        </label>
        <div className="relative">
          <select
            value={investigator}
            onChange={(e) => setInvestigator(e.target.value)}
            className="w-full h-10 pl-3.5 pr-8 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white appearance-none transition-colors cursor-pointer"
          >
            <option value="Inspector Alain Dimi – Available">Inspector Alain Dimi – Available</option>
            <option value="Inspector Marie Bello – Busy (2 cases)">Inspector Marie Bello – Busy (2 cases)</option>
            <option value="Inspector Paul Njoya – Available">Inspector Paul Njoya – Available</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Priority Level
        </label>
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full h-10 pl-3.5 pr-8 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white appearance-none transition-colors cursor-pointer"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
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

export default AssignInvestigatorStep;