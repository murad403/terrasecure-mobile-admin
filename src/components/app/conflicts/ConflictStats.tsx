"use client";
import React from 'react';

interface ConflictStatsProps {
  total: number;
  overlaps: number;
  duplicates: number;
  invalidGeoms: number;
  boundaryConflicts: number;
}

const ConflictStats = ({
  total,
  overlaps,
  duplicates,
  invalidGeoms,
  boundaryConflicts,
}: ConflictStatsProps) => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {/* Total Conflicts */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-red-600 text-2xl font-extrabold leading-none">{total}</span>
        <span className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wider">Total Conflicts</span>
      </div>

      {/* Overlaps */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-amber-600 text-2xl font-extrabold leading-none">{overlaps}</span>
        <span className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wider">Overlaps</span>
      </div>

      {/* Duplicates */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-purple-600 text-2xl font-extrabold leading-none">{duplicates}</span>
        <span className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wider">Duplicates</span>
      </div>

      {/* Invalid Geometries */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-blue-600 text-2xl font-extrabold leading-none">{invalidGeoms}</span>
        <span className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wider">Invalid Geometries</span>
      </div>

      {/* Boundary Conflicts */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-emerald-600 text-2xl font-extrabold leading-none">{boundaryConflicts}</span>
        <span className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wider">Boundary Conflicts</span>
      </div>
    </div>
  );
};

export default ConflictStats;