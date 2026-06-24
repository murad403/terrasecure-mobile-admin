"use client"
import React, { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { type SiteVisitRecord } from './SiteVisitsPage'

interface SiteVisitsTableProps {
  siteVisits: SiteVisitRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  surveyorFilter: string
  setSurveyorFilter: (surveyor: string) => void
  onOpenScheduleModal: () => void
}

const SiteVisitsTable = ({
  siteVisits,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  surveyorFilter,
  setSurveyorFilter,
  onOpenScheduleModal
}: SiteVisitsTableProps) => {
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, surveyorFilter, dateFilter])

  // Pagination calculations
  const totalEntries = siteVisits.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedVisits = siteVisits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search visits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="All Statuses"
            options={['All Statuses', 'Scheduled', 'Completed', 'In Progress']}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />

          {/* Surveyor Dropdown */}
          <CustomFilterDropdown
            label="All Surveyors"
            header="All Surveyors"
            options={['All Surveyors', 'Paul Biya Jr', 'Martin Essono', 'Cécile Ondoua']}
            selected={surveyorFilter}
            onSelect={setSurveyorFilter}
          />

          {/* Date Range Dropdown */}
          <CustomFilterDropdown
            label="Date Range"
            header="Date Range"
            options={['Date Range', 'Today', 'This Week', 'This Month', 'Custom Range']}
            selected={dateFilter}
            onSelect={setDateFilter}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={onOpenScheduleModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-button-color hover:bg-button-color/90 text-white rounded-lg transition-all cursor-pointer shadow-sm border border-transparent"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">VISIT ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SURVEYOR</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SCHEDULED DATE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedVisits.length > 0 ? (
              paginatedVisits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* Visit ID */}
                  <td className="py-4 px-5 text-sm font-bold text-slate-800">
                    {item.id}
                  </td>

                  {/* Parcel ID link */}
                  <td className="py-4 px-5">
                    <span className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                      {item.parcelId}
                    </span>
                  </td>

                  {/* Surveyor Assigned */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                    {item.surveyorName}
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-5 text-sm text-slate-500">
                    {item.scheduledDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold block w-fit whitespace-nowrap",
                        item.status === 'Scheduled' && 'bg-indigo-50 text-indigo-600',
                        item.status === 'Completed' && 'bg-emerald-50 text-emerald-600',
                        item.status === 'In Progress' && 'bg-blue-50 text-blue-600'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No scheduled site visits found.
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

export default SiteVisitsTable