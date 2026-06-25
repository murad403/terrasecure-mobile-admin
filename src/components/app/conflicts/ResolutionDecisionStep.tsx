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
    <div className="space-y-4 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 5: Resolution Decision</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Issue final resolution: approve, reject, or escalate</p>
      </div>

      {/* Resolution Decision Dropdown */}
      <div className="space-y-1.5">
        <Label htmlFor="decision">
          Resolution Decision *
        </Label>
        <Select value={decision} onValueChange={setDecision}>
          <SelectTrigger id="decision" className="w-full">
            <SelectValue placeholder="Select Decision" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={`Approve - ${parcelIds[0] || 'CM-2847'} takes precedence`}>
              Approve - {parcelIds[0] || 'CM-2847'} takes precedence
            </SelectItem>
            <SelectItem value={`Approve - ${parcelIds[1] || 'CM-2848'} takes precedence`}>
              Approve - {parcelIds[1] || 'CM-2848'} takes precedence
            </SelectItem>
            <SelectItem value="Reject Both / Request Resubmission">Reject Both / Request Resubmission</SelectItem>
            <SelectItem value="Escalate to Land Commission">Escalate to Land Commission</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Justification Textarea */}
      <div className="space-y-1.5">
        <Label htmlFor="justification">
          Justification
        </Label>
        <textarea
          id="justification"
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Resolution justification..."
          rows={3}
          className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
        />
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

export default ResolutionDecisionStep;