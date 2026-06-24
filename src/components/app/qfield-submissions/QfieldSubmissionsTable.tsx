"use client"
import React, { useState, useEffect } from 'react'
import { Search, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'

export interface QfieldSubmission {
  id: string
  surveyor: string
  parcelId: string
  submittedAt: string
  gpsPoints: number
  syncStatus: 'Synced' | 'Unsynced'
  area: number
  latitude: number
  longitude: number
}

interface QfieldSubmissionsTableProps {
  submissions: QfieldSubmission[]
  onPreviewMap: (sub: QfieldSubmission) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

const QfieldSubmissionsTable = ({
  submissions,
  onPreviewMap,
  onAccept,
  onReject
}: QfieldSubmissionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [syncFilter, setSyncFilter] = useState('All')
  const [surveyorFilter, setSurveyorFilter] = useState('All')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, syncFilter, surveyorFilter])

  // Filtering Logic
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.surveyor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.parcelId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSync = syncFilter === 'All' || sub.syncStatus === syncFilter
    const matchesSurveyor = surveyorFilter === 'All' || sub.surveyor === surveyorFilter

    return matchesSearch && matchesSync && matchesSurveyor
  })

  // Pagination Calculations
  const totalEntries = filteredSubmissions.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Get unique surveyors for filter options
  const surveyorOptions = ['All', ...Array.from(new Set(submissions.map(s => s.surveyor)))]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">

      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Sync Status Dropdown */}
          <CustomFilterDropdown
            label="Sync Status"
            header="Sync Status"
            options={['All', 'Synced', 'Unsynced']}
            selected={syncFilter}
            onSelect={setSyncFilter}
          />

          {/* Surveyor Dropdown */}
          <CustomFilterDropdown
            label="Surveyor"
            header="Surveyors"
            options={surveyorOptions}
            selected={surveyorFilter}
            onSelect={setSurveyorFilter}
          />
        </div>
      </div>

      {/* Main Submissions List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SUBMISSION ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SURVEYOR</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SUBMITTED</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">GPS POINTS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SYNC STATUS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedSubmissions.length > 0 ? (
              paginatedSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* Submission ID */}
                  <td className="py-4 px-5 text-sm font-bold text-slate-700 font-mono">
                    {sub.id}
                  </td>

                  {/* Surveyor Name */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                    {sub.surveyor}
                  </td>

                  {/* Parcel ID */}
                  <td className="py-4 px-5 text-sm font-bold text-[#16a34a] hover:underline cursor-pointer">
                    {sub.parcelId}
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                    {sub.submittedAt}
                  </td>

                  {/* GPS Points */}
                  <td className="py-4 px-5 text-sm font-semibold">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-xs font-bold">
                      {sub.gpsPoints} pts
                    </span>
                  </td>

                  {/* Sync Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border block w-fit whitespace-nowrap",
                        sub.syncStatus === 'Synced' ? 'bg-emerald-50 text-emerald-600 border-emerald-150' : 'bg-rose-50 text-rose-600 border-rose-150'
                      )}
                    >
                      {sub.syncStatus}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onPreviewMap(sub)}
                        className="px-3 py-1 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer animate-all duration-150"
                      >
                        Preview Map
                      </button>
                      <button
                        type="button"
                        onClick={() => onAccept(sub.id)}
                        className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Accept/Sync GPS Data"
                      >
                        <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(sub.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Reject GPS Data"
                      >
                        <X className="w-4.5 h-4.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No GPS data submissions found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
      />
    </div>
  )
}

export default QfieldSubmissionsTable