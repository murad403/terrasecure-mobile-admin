"use client"
import React, { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 4.6 },
  { month: 'Feb', revenue: 5.2 },
  { month: 'Mar', revenue: 6.8 },
  { month: 'Apr', revenue: 6.0 },
  { month: 'May', revenue: 7.2 },
  { month: 'Jun', revenue: 8.5 },
  { month: 'Jul', revenue: 9.0 },
  { month: 'Aug', revenue: 8.0 }
]

const MonthlyRevenueChart = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExportPDF = () => {
    alert('Exporting chart as PDF...')
  }

  const handleExportCSV = () => {
    alert('Exporting chart data as CSV...')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col h-full min-h-[380px]">
      {/* Chart Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Monthly Revenue (Millions XAF)
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100/50 text-rose-600 border border-rose-150 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            PDF
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100/50 text-emerald-600 border border-emerald-150 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="flex-1 min-h-[260px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => `${val}M`}
                domain={[0, 10]}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc', radius: 4 }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => [`${value}M XAF`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#1b5e20" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-400">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthlyRevenueChart