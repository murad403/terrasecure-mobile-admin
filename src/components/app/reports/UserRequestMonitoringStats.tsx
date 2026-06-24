"use client"
import React from 'react'

const UserRequestMonitoringStats = () => {
  const stats = [
    {
      title: 'Parcel Registrations',
      value: '3,241',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Consultation Requests',
      value: '847',
      change: '+8.1%',
      isPositive: true
    },
    {
      title: 'Document Verifications',
      value: '1,203',
      change: '-3.2%',
      isPositive: false
    },
    {
      title: 'Investigation Cases',
      value: '47',
      change: '+2',
      isPositive: true,
      customClass: 'bg-orange-50 text-orange-600 border border-orange-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {stat.title}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-0.5 ${
                stat.customClass
                  ? stat.customClass
                  : stat.isPositive
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserRequestMonitoringStats