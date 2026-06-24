"use client"
import React from 'react'

const RevenueMonitoringStats = () => {
  const stats = [
    {
      title: 'Total Revenue (2025)',
      value: 'XAF 87.4M',
      change: '+18.2%',
      isPositive: true
    },
    {
      title: 'Avg Monthly Revenue',
      value: 'XAF 10.9M',
      change: '+5.4%',
      isPositive: true
    },
    {
      title: 'Pending Payments',
      value: 'XAF 3.2M',
      change: '-12%',
      isPositive: false
    },
    {
      title: 'Payment Success Rate',
      value: '94.7%',
      change: '+2.1%',
      isPositive: true
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
                stat.isPositive
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

export default RevenueMonitoringStats