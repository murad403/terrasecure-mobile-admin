"use client"
import React from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchLog {
  query: string
  type: 'Parcel ID' | 'GPS Coords' | 'Location'
  user: string
  time: string
  result: 'Found' | 'Not Found'
}

const logs: SearchLog[] = [
  { query: 'CM-2847', type: 'Parcel ID', user: 'Amina Fouda', time: '2 min ago', result: 'Found' },
  { query: '3.848, 11.502', type: 'GPS Coords', user: 'Paul Biya Jr', time: '15 min ago', result: 'Found' },
  { query: 'Yaoundé / Bastos', type: 'Location', user: 'Jean Alima', time: '1h ago', result: 'Found' },
  { query: 'CM-9999', type: 'Parcel ID', user: 'Marie Nkodo', time: '2h ago', result: 'Not Found' },
  { query: '5.123, 9.456', type: 'GPS Coords', user: 'Grace Tanda', time: '3h ago', result: 'Found' },
  { query: 'Douala / Akwa', type: 'Location', user: 'Samuel Kotto', time: '4h ago', result: 'Found' }
]

const RecentGPSSearchLogTable = () => {
  const handleExport = () => {
    alert('Exporting GPS search log...')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Recent GPS Search Log
        </h3>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-150/50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">QUERY</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TYPE</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">USER</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TIME</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">RESULT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                <td className="py-3.5 px-5 text-sm font-bold text-[#16a34a]">{log.query}</td>
                <td className="py-3.5 px-5 text-sm">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold">
                    {log.type}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{log.user}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-500">{log.time}</td>
                <td className="py-3.5 px-5 text-sm">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-extrabold border inline-block w-fit whitespace-nowrap",
                      log.result === 'Found' ? 'bg-emerald-50 text-emerald-600 border-emerald-150' : 'bg-rose-50 text-rose-600 border-rose-150'
                    )}
                  >
                    {log.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentGPSSearchLogTable