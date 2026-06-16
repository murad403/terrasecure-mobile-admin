"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const data = [
  { name: 'Published', value: 8932, color: '#3B82F6' },
  { name: 'Sold', value: 2655, color: '#EC4899' },
  { name: 'Reserved', value: 1047, color: '#C2410C' },
  { name: 'Disputed', value: 213, color: '#EF4444' },
  { name: 'Validated', value: 1500, color: '#10B981' },
  { name: 'Draft', value: 500, color: '#94A3B8' }
]

const ParcelsByStatusChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[380px]">
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <span className="font-semibold text-title text-sm">Parcels by Status</span>
        <span className="text-[11px] text-subtitle font-medium">Total 14,847</span>
      </div>

      {/* Donut Chart Container */}
      <div className="relative flex-1 flex items-center justify-center my-2 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px'
              }}
              formatter={(value) => [`${value} Parcels`, '']}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-title">14.8k</span>
          <span className="text-[9px] text-subtitle uppercase tracking-wider font-semibold">Parcels</span>
        </div>
      </div>

      {/* Custom Grid Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-3 border-t border-slate-50">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600 font-medium truncate">{item.name}</span>
            <span className="text-subtitle text-[10px] ml-auto font-mono">
              {((item.value / 14847) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParcelsByStatusChart