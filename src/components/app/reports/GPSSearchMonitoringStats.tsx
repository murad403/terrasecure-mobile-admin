"use client"
import React from 'react'

const GPSSearchMonitoringStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Searches */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight mb-1">
          247
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total Searches Today
        </div>
      </div>

      {/* Successful Matches */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 tracking-tight mb-1">
          231 (93.5%)
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Successful Matches
        </div>
      </div>

      {/* Unique Users */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="text-2xl md:text-3xl font-extrabold text-purple-600 tracking-tight mb-1">
          84
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Unique Users Searching
        </div>
      </div>
    </div>
  )
}

export default GPSSearchMonitoringStats