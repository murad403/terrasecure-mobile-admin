"use client";
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="space-y-4 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 1: Assign Investigator</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Assign a qualified investigator to the case</p>
      </div>

      {/* Investigator Selection */}
      <div className="space-y-1.5">
        <Label htmlFor="investigator">
          Assign Investigator
        </Label>
        <Select value={investigator} onValueChange={setInvestigator}>
          <SelectTrigger id="investigator" className="w-full">
            <SelectValue placeholder="Select Investigator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inspector Alain Dimi – Available">Inspector Alain Dimi – Available</SelectItem>
            <SelectItem value="Inspector Marie Bello – Busy (2 cases)">Inspector Marie Bello – Busy (2 cases)</SelectItem>
            <SelectItem value="Inspector Paul Njoya – Available">Inspector Paul Njoya – Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Level */}
      <div className="space-y-1.5">
        <Label htmlFor="priority">
          Priority Level
        </Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
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

export default AssignInvestigatorStep;