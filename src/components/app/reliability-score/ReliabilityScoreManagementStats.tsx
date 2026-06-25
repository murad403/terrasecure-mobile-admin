import React from 'react'

interface StatsProps {
  totalWeight: number;
  criteriaCount: number;
  veryHighCount: number;
  lowCount: number;
}

const ReliabilityScoreManagementStats = ({
  totalWeight,
  criteriaCount,
  veryHighCount,
  lowCount,
}: StatsProps) => {
  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Weight */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{totalWeight}%</span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Weight</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Balanced</p>
          </div>
        </div>

        {/* Card 2: Criteria Count */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{criteriaCount}</span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Criteria Count</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Active scoring criteria</p>
          </div>
        </div>

        {/* Card 3: Very High Parcels */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {veryHighCount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Very High Parcels</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">≥ 90 score</p>
          </div>
        </div>

        {/* Card 4: Low Reliability */}
        <div className="bg-white p-5 rounded-xl border border-red-200/80 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
              {lowCount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Low Reliability</p>
            <p className="text-xs text-red-500 font-medium mt-0.5">&lt; 50 score — flagged</p>
          </div>
        </div>
      </div>

      {/* Reliability Score Bands Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-3">Reliability Score Bands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Band 1: Very High */}
          <div className="bg-[#f0fdf4] border border-[#dcfce7] p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-emerald-800">Very High</span>
              <span className="text-xs font-medium text-emerald-600">90–100</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              All major criteria met, independently verified
            </p>
          </div>

          {/* Band 2: High */}
          <div className="bg-[#ecfdf5] border border-[#d1fae5] p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-[#059669]">High</span>
              <span className="text-xs font-medium text-[#10b981]">70–89</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Most criteria met with minor gaps
            </p>
          </div>

          {/* Band 3: Medium */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-amber-800">Medium</span>
              <span className="text-xs font-medium text-amber-600">50–69</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Some key criteria missing, requires follow-up
            </p>
          </div>

          {/* Band 4: Low */}
          <div className="bg-[#fef2f2] border border-[#fee2e2] p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-red-800">Low</span>
              <span className="text-xs font-medium text-red-600">0–49</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Multiple critical criteria missing or disputed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReliabilityScoreManagementStats