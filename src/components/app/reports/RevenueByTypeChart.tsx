"use client"
import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Registration Fee', value: 42.3, color: '#1b5e20' },
  { name: 'Transfer Tax', value: 28.7, color: '#2563eb' },
  { name: 'Consultation Fee', value: 8.4, color: '#8b5cf6' },
  { name: 'Surveying Fee', value: 6.2, color: '#ea580c' },
  { name: 'Other', value: 2.2, color: '#94a3b8' }
]

const RevenueByTypeChart = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col h-full min-h-[380px]">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
        Revenue by Type
      </h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="w-full h-[180px] relative">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                  formatter={(value: any) => [`${value}M XAF`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-400">
              Loading chart...
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="w-full mt-4 space-y-2 max-h-[160px] overflow-y-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="text-slate-800 font-bold whitespace-nowrap">{item.value}M XAF</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RevenueByTypeChart