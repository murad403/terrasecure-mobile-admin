"use client"
import React, { useState, useEffect } from 'react'
import { Search, Eye, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { type ConsultationRecord } from './ConsultationsPage'

interface ConsultationsTableProps {
  consultations: ConsultationRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onViewDetails: (item: ConsultationRecord) => void
  onUpdateStatus: (id: string, status: 'Approved' | 'Rejected') => void
}

const ConsultationsTable = ({
  consultations,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onViewDetails,
  onUpdateStatus
}: ConsultationsTableProps) => {
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, dateFilter])

  // Pagination calculations
  const totalEntries = consultations.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedConsultations = consultations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="All Statuses"
            options={['All Statuses', 'Pending', 'Approved', 'Rejected']}
            selected={statusFilter}
            onSelect={setStatusFilter}
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
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">REQUESTER</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DATE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedConsultations.length > 0 ? (
              paginatedConsultations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* ID Column with drawer click link */}
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="text-sm font-bold text-purple-600 hover:underline hover:text-purple-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                    >
                      {item.id}
                    </button>
                  </td>

                  {/* Requester Name */}
                  <td className="py-4 px-5 text-sm font-bold text-slate-700">
                    {item.requesterName}
                  </td>

                  {/* Related Parcel Link */}
                  <td className="py-4 px-5">
                    <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                      {item.parcelId}
                    </span>
                  </td>

                  {/* Date Submitted */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                    {item.date}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap",
                        item.status === 'Approved' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                        item.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                        item.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-200'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Action Icons Column */}
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-3">
                      {/* View Details Eye Icon */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Directly Approve Checkmark */}
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, 'Approved')}
                        className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                        title="Approve Request"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      {/* Directly Reject Cross */}
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, 'Rejected')}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                        title="Reject Request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No consultation requests found.
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

export default ConsultationsTable