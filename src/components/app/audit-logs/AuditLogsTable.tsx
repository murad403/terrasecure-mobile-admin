"use client"
import React from 'react'
import { Search, Calendar, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import type { UserActivity } from '@/redux/features/user/user.type'

export const KIND_OPTIONS_MAP: Record<string, string> = {
  ALL: 'All Kinds',
  LAND_CONSULTATION: 'Land Consultation',
  LAND_INVESTIGATION: 'Land Investigation',
  LAND_PARCEL_TRANSFER: 'Land Parcel Transfer',
  LAND_PARCEL: 'Land Parcel',
  LAND_PARCEL_REGISTRATION: 'Land Parcel Registration',
  LAND_SITE_VISIT: 'Land Site Visit',
  LAND_PARCEL_OWNERSHIP: 'Land Parcel Ownership',
  LAND_PARCEL_DOCUMENT: 'Land Parcel Document',
  LAND_PARCEL_CONFLICT: 'Land Parcel Conflict',
  LAND_PARCEL_SURVEY: 'Land Parcel Survey',
  LAND_PURCHASE_INTEREST: 'Land Purchase Interest',
}

export const REVERSE_KIND_MAP: Record<string, string> = Object.entries(KIND_OPTIONS_MAP).reduce(
  (acc, [key, val]) => ({ ...acc, [val]: key }),
  {}
)

export const ACTION_OPTIONS_MAP: Record<string, string> = {
  ALL: 'All Actions',
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
}

export const REVERSE_ACTION_MAP: Record<string, string> = Object.entries(ACTION_OPTIONS_MAP).reduce(
  (acc, [key, val]) => ({ ...acc, [val]: key }),
  {}
)

interface AuditLogsTableProps {
  logs: UserActivity[]
  isLoading?: boolean
  isFetching?: boolean
  onViewDetails: (log: UserActivity) => void
  isDetailOpen: boolean
  
  // Filter state & setters from parent
  kindFilter: string
  setKindFilter: (val: string) => void
  actionFilter: string
  setActionFilter: (val: string) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  onClearFilters: () => void

  // Pagination from backend
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  totalEntries: number
  pageSize: number
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  isLoading,
  isFetching,
  onViewDetails,
  kindFilter,
  setKindFilter,
  actionFilter,
  setActionFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters,
  currentPage,
  setCurrentPage,
  totalPages,
  totalEntries,
  pageSize,
}) => {

  const getActionBadgeColor = (action?: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'UPDATE':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'DELETE':
        return 'bg-rose-50 text-rose-600 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const cleanText = (html?: string | null) => {
    if (!html) return null
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const selectedKindDisplay = KIND_OPTIONS_MAP[kindFilter] || 'All Kinds'
  const selectedActionDisplay = ACTION_OPTIONS_MAP[actionFilter] || 'All Actions'

  const hasActiveFilters =
    kindFilter !== 'ALL' ||
    actionFilter !== 'ALL' ||
    Boolean(startDate) ||
    Boolean(endDate)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            
            {/* Kind Dropdown */}
            <CustomFilterDropdown
              label="All Kinds"
              header="Activity Kind"
              options={Object.values(KIND_OPTIONS_MAP)}
              selected={selectedKindDisplay}
              onSelect={(val) => {
                const rawKey = REVERSE_KIND_MAP[val] || 'ALL'
                setKindFilter(rawKey)
              }}
              type="radio"
            />

            {/* Action Dropdown */}
            <CustomFilterDropdown
              label="All Actions"
              header="Action Type"
              options={Object.values(ACTION_OPTIONS_MAP)}
              selected={selectedActionDisplay}
              onSelect={(val) => {
                const rawKey = REVERSE_ACTION_MAP[val] || 'ALL'
                setActionFilter(rawKey)
              }}
              type="radio"
            />

            {/* Date Inputs */}
            <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:outline-none focus:ring-0 text-xs cursor-pointer"
                  title="Start Date"
                />
                <span className="text-slate-400 font-normal">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:outline-none focus:ring-0 text-xs cursor-pointer"
                  title="End Date"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}

          </div>

          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs font-semibold text-button-color animate-pulse self-end">
              <div className="w-2 h-2 rounded-full bg-button-color animate-ping" />
              Updating logs...
            </div>
          )}
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TIMESTAMP</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">USER</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">KIND</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ACTION</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TARGET / SLUG</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                </tr>
              ))
            ) : logs.length > 0 ? (
              logs.map((log) => {
                const snapshot = log.snapshot
                const targetText =
                  snapshot?.slug ||
                  snapshot?.title ||
                  log.landInvestigation?.slug ||
                  log.landParcel?.slug ||
                  log.landParcelRegistration?.slug ||
                  log.landConsultation?.slug ||
                  `#${log.id.slice(0, 8)}`

                const descriptionText =
                  cleanText(snapshot?.description) ||
                  cleanText(snapshot?.notes) ||
                  snapshot?.title ||
                  snapshot?.requestMsg ||
                  snapshot?.message ||
                  'N/A'

                return (
                  <tr
                    key={log.id}
                    onClick={() => onViewDetails(log)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-5 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>

                    {/* User */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        {log.user?.profilePicture?.url ? (
                          <img
                            src={log.user.profilePicture.url}
                            alt={log.user.name}
                            className="w-7 h-7 rounded-full object-cover border shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 border border-emerald-200 shadow-sm">
                            {getInitials(log.user?.name)}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-slate-800 whitespace-nowrap group-hover:text-button-color transition-colors">
                          {log.user?.name || `User #${log.userId}`}
                        </span>
                      </div>
                    </td>

                    {/* Kind */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-button-color border border-blue-100 uppercase tracking-wider inline-block whitespace-nowrap">
                        {log.kind ? log.kind.replace(/_/g, ' ') : 'N/A'}
                      </span>
                    </td>

                    {/* Action Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-block w-fit whitespace-nowrap shadow-sm uppercase tracking-wide",
                        getActionBadgeColor(log.action)
                      )}>
                        {log.action}
                      </span>
                    </td>

                    {/* Target / Slug */}
                    <td className="py-4 px-5 text-xs font-bold text-slate-700 font-mono whitespace-nowrap">
                      {targetText}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-5 text-xs font-semibold text-slate-600 max-w-xs truncate" title={descriptionText}>
                      {descriptionText}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                  No user activities found matching your criteria.
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

export default AuditLogsTable