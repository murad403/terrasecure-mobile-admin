"use client"
import React, { useState } from 'react'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'

interface ReportsFilterProps {
  onGenerateReport?: (filters: { startDate: string; endDate: string; city: string; district: string }) => void
}

const ReportsFilter = ({ onGenerateReport }: ReportsFilterProps) => {
  const [startDate, setStartDate] = useState('2002-01-01')
  const [endDate, setEndDate] = useState('2025-12-31')
  const [city, setCity] = useState('All Cities')
  const [district, setDistrict] = useState('All Districts')

  const handleGenerate = () => {
    if (onGenerateReport) {
      onGenerateReport({ startDate, endDate, city, district })
    } else {
      alert('Generating report with selected criteria...')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex flex-col md:flex-row items-end gap-4">
      {/* Start Date */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-10 px-3 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-700 font-semibold focus:border-button-color focus:bg-white focus:outline-none transition-all w-full md:w-44"
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-10 px-3 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-700 font-semibold focus:border-button-color focus:bg-white focus:outline-none transition-all w-full md:w-44"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</label>
        <CustomFilterDropdown
          label="All Cities"
          header="All Cities"
          options={['All Cities', 'Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua']}
          selected={city === 'All Cities' ? 'All Cities' : city}
          onSelect={setCity}
        />
      </div>

      {/* District */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">District</label>
        <CustomFilterDropdown
          label="All Districts"
          header="All Districts"
          options={['All Districts', 'Bastos', 'Bonanjo', 'Ntarikon', 'Akwa', 'Nord', 'Kaélé']}
          selected={district === 'All Districts' ? 'All Districts' : district}
          onSelect={setDistrict}
        />
      </div>

      {/* Generate Report Button */}
      <button
        type="button"
        onClick={handleGenerate}
        className="h-10 px-6 bg-[#1b5e20] hover:bg-[#123f16] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer w-full md:w-auto shrink-0 shadow-sm"
      >
        Generate Report
      </button>
    </div>
  )
}

export default ReportsFilter