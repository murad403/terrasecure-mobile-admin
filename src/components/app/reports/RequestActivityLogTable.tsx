"use client"
import React from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityLog {
  user: string
  requestType: string
  parcelId: string
  status: 'In Progress' | 'Pending' | 'Completed' | 'Approved' | 'Rejected'
  time: string
}

const logs: ActivityLog[] = [
  { user: 'Pierre Mballa', requestType: 'Registration', parcelId: 'CM-2847', status: 'In Progress', time: '2 min ago' },
  { user: 'Amina Fouda', requestType: 'Consultation', parcelId: 'CM-2848', status: 'Pending', time: '15 min ago' },
  { user: 'Grace Tanda', requestType: 'Registration', parcelId: 'CM-2850', status: 'Completed', time: '1h ago' },
  { user: 'Samuel Kotto', requestType: 'Document Upload', parcelId: 'CM-2853', status: 'Approved', time: '2h ago' },
  { user: 'François Ngono', requestType: 'Registration', parcelId: 'CM-2851', status: 'Rejected', time: '3h ago' }
]

const RequestActivityLogTable = () => {
  const handleExport = () => {
    alert('Exporting activity log...')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Request Activity Log
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
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">USER</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">REQUEST TYPE</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{log.user}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-600">{log.requestType}</td>
                <td className="py-3.5 px-5 text-sm font-bold text-[#16a34a]">{log.parcelId}</td>
                <td className="py-3.5 px-5 text-sm">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block w-fit whitespace-nowrap",
                      (log.status === 'In Progress' || log.status === 'Pending') && 'bg-amber-50 text-amber-600 border-amber-200',
                      (log.status === 'Completed' || log.status === 'Approved') && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                      log.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-200'
                    )}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-500">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestActivityLogTable