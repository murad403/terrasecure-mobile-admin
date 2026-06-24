"use client"
import React from 'react'
import { Download } from 'lucide-react'

interface RegistrationRecord {
  parcelId: string
  city: string
  area: string
  status: string
  owner: string
  date: string
}

const records: RegistrationRecord[] = [
  { parcelId: 'CM-2847', city: 'Yaoundé', area: '1,240 m²', status: 'Published', owner: 'Pierre Mballa', date: '12 Jan 2025' },
  { parcelId: 'CM-2848', city: 'Douala', area: '3,500 m²', status: 'Disputed', owner: 'Amina Fouda', date: '8 Feb 2025' },
  { parcelId: 'CM-2849', city: 'Yaoundé', area: '800 m²', status: 'Verified', owner: 'Jean-Pierre Nkodo', date: '15 Mar 2025' },
  { parcelId: 'CM-2850', city: 'Bamenda', area: '2,100 m²', status: 'Reserved', owner: 'Grace Tanda', date: '2 Apr 2025' },
  { parcelId: 'CM-2851', city: 'Bafoussam', area: '1,650 m²', status: 'Sold', owner: 'François Ngono', date: '20 Apr 2025' }
]

const LandRegistrationTable = () => {
  const handleExportPDF = () => {
    alert('Exporting land registration report as PDF...')
  }

  const handleExportCSV = () => {
    alert('Exporting land registration report as CSV...')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">
            Land Registration
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
            Generated · 5 record preview
          </p>
        </div>
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL ID</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CITY</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">AREA</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">OWNER</th>
              <th className="py-3.5 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((rec, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                <td className="py-3.5 px-5 text-sm font-bold text-[#16a34a]">{rec.parcelId}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{rec.city}</td>
                <td className="py-3.5 px-5 text-sm font-medium text-slate-600">{rec.area}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{rec.status}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{rec.owner}</td>
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-500">{rec.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LandRegistrationTable