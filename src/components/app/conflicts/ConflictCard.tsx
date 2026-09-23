"use client";
import { AlertTriangle, MapPin, ShieldCheck, Layers, GitCompare } from 'lucide-react';
import { ConflictParcel } from '@/redux/features/conflicts/conflicts.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConflictCardProps {
  conflict: ConflictParcel;
  onReviewOnMap: () => void;
  onResolve: () => void;
  onBlock: () => void;
}

const ConflictCard = ({ conflict, onReviewOnMap, onResolve, onBlock }: ConflictCardProps) => {
  // Extract conflicting parcel slugs
  const conflictingSlugs = conflict.conflicts
    ?.map((c) => c.conflictingParcel?.slug)
    .filter(Boolean) || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow mb-4">
      {/* Left Icon & Details */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Warning Icon */}
        <div className="bg-rose-50 border border-rose-100 text-rose-500 rounded-xl p-3 shrink-0 flex items-center justify-center w-12 h-12 mt-1">
          <AlertTriangle className="w-6 h-6 fill-rose-500/10 text-rose-500" />
        </div>

        {/* Main Details */}
        <div className="space-y-2 min-w-0 flex-1">
          {/* Header Badges: Slug, Parcel Code, Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight font-mono">
              {conflict.slug}
            </span>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {conflict.parcelCode}
            </span>
            <span
              className={cn(
                "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
                conflict.status === "BLOCKED"
                  ? "bg-rose-100 border-rose-300 text-rose-800"
                  : conflict.status === "SOLD"
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : conflict.status === "RESERVED"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
              )}
            >
              {conflict.status}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            {/* Reliability Score */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Reliability:</span>
              <span className="font-extrabold text-slate-900">{conflict.reliabilityScore}%</span>
            </div>

            {/* Conflict Count */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Conflicts:</span>
              <span className="font-extrabold text-amber-700">{conflict.conflictCount}</span>
            </div>

            {/* Area Size */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Area:</span>
              <span className="font-bold text-slate-800">{conflict.areaSqm} m²</span>
            </div>
          </div>

          {/* Conflicting Parcel Slugs */}
          {conflictingSlugs.length > 0 && (
            <div className="flex items-center gap-2 text-xs pt-1">
              <GitCompare className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-slate-500 font-medium">Conflicting Parcel Slug(s):</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {conflictingSlugs.map((slug) => (
                  <span
                    key={slug}
                    className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-mono"
                  >
                    {slug}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Stack (Keeping ALL buttons intact) */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-1.5 shrink-0 w-full md:w-36 pt-2 md:pt-0">
        <Button
          onClick={onReviewOnMap}
          className="w-full py-1 text-xs font-bold"
        >
          Review on Map
        </Button>
        <button
          onClick={onResolve}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold py-1.5 text-center cursor-pointer transition-colors shadow-sm"
        >
          Create Investigation
        </button>
        <button
          onClick={onBlock}
          disabled={conflict.status === "BLOCKED"}
          className={cn(
            "w-full rounded-lg text-[11px] font-bold py-1.5 text-center transition-colors border",
            conflict.status === "BLOCKED"
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600 cursor-pointer"
          )}
        >
          {conflict.status === "BLOCKED" ? "Blocked" : "Block Parcel"}
        </button>
      </div>
    </div>
  );
};

export default ConflictCard;