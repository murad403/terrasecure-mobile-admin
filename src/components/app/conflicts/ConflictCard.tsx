"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Conflict } from './ConflictsPage';

interface ConflictCardProps {
  conflict: Conflict;
  onReviewOnMap: () => void;
  onResolve: () => void;
  onBlock: () => void;
  onApproveException: () => void;
}

const ConflictCard = ({
  conflict,
  onReviewOnMap,
  onResolve,
  onBlock,
  onApproveException,
}: ConflictCardProps) => {
  const getSeverityStyle = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Medium':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Low':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow mb-4">
      {/* Warning Icon */}
      <div className="bg-rose-50 border border-rose-100 text-rose-500 rounded-xl p-3 shrink-0 flex items-center justify-center w-12 h-12 mt-1">
        <AlertTriangle className="w-6 h-6 fill-rose-500/10 text-rose-500" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0 space-y-2 mt-1">
        {/* Header: ID & Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-extrabold text-slate-800">{conflict.id}</span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border leading-none ${getSeverityStyle(conflict.severity)}`}>
            {conflict.severity}
          </span>
          <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded leading-none">
            {conflict.type}
          </span>
        </div>

        {/* Involved Parcels */}
        <div className="text-[12px] font-semibold text-slate-500">
          Parcels:{' '}
          <span className="font-extrabold text-slate-800">
            {conflict.parcels.join(' ')}
          </span>
        </div>

        {/* Detected Date */}
        <div className="text-[11px] font-medium text-slate-400">
          Detected {conflict.detectedDate}
        </div>
      </div>

      {/* Action Buttons Stack */}
      <div className="flex flex-col gap-1.5 shrink-0 w-36">
        <button
          onClick={onReviewOnMap}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[11px] font-bold py-1.5 text-center cursor-pointer transition-colors shadow-sm"
        >
          Review on Map
        </button>
        <button
          onClick={onResolve}
          className="w-full bg-[#14532d] hover:bg-[#166534] text-white rounded-lg text-[11px] font-bold py-1.5 text-center cursor-pointer transition-colors shadow-sm"
        >
          Resolve Workflow
        </button>
        <button
          onClick={onBlock}
          className="w-full bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] text-[#ef4444] rounded-lg text-[11px] font-bold py-1.5 text-center cursor-pointer transition-colors"
        >
          Block Parcel
        </button>
        <button
          onClick={onApproveException}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold py-1.5 text-center cursor-pointer transition-colors"
        >
          Approve Exception
        </button>
      </div>
    </div>
  );
};

export default ConflictCard;