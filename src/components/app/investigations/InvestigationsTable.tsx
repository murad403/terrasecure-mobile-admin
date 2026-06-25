"use client"
import React, { useState, useEffect } from 'react'
import { Search, Plus, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { type InvestigationRecord } from './InvestigationsPage'
import { Button } from '@/components/ui/button'

interface InvestigationsTableProps {
  investigations: InvestigationRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  assigneeFilter: string
  setAssigneeFilter: (assignee: string) => void
  onOpenCreateModal: () => void
  onViewDetails: (item: InvestigationRecord) => void
}

const InvestigationsTable = ({
  investigations,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  onOpenCreateModal,
  onViewDetails
}: InvestigationsTableProps) => {
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, assigneeFilter, dateFilter])

  // Pagination calculations
  const totalEntries = investigations.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedInvestigations = investigations.slice(
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
            options={['All Statuses', 'Open', 'In Progress', 'Closed']}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />

          {/* Assignee Dropdown */}
          <CustomFilterDropdown
            label="Assignee"
            header="Assignee"
            options={['Assignee', 'Inspector Alain Dimi', 'Inspector Marie Bello', 'Inspector Paul Njoya', 'Inspector Cécile Eba']}
            selected={assigneeFilter}
            onSelect={setAssigneeFilter}
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

        {/* Action Button: Create Investigation (Red background) */}
        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
          <Button
            type="button"
            onClick={onOpenCreateModal}
            className='w-auto'
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Investigation</span>
          </Button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CASE ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TITLE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ASSIGNEE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CREATED</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedInvestigations.length > 0 ? (
              paginatedInvestigations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* Case ID link (Red color) */}
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="text-sm font-bold text-red-600 hover:underline hover:text-red-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                    >
                      {item.id}
                    </button>
                  </td>

                  {/* Title */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700 max-w-[280px] truncate" title={item.title}>
                    {item.title}
                  </td>

                  {/* Parcel ID (Blue link) */}
                  <td className="py-4 px-5">
                    <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                      {item.parcelId}
                    </span>
                  </td>

                  {/* Assignee Name */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-650">
                    {item.assigneeName}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap",
                        item.status === 'Open' && 'bg-amber-50 text-amber-600 border-amber-200',
                        item.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-200',
                        item.status === 'Closed' && 'bg-slate-50 text-slate-600 border-slate-200'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                    {item.createdDate}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                        title="View Case Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No land dispute cases found matching search criteria.
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

export default InvestigationsTable