"use client"
import React, { useState } from 'react'
import { Search, Plus, Eye, Check, X, Loader2, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { Button } from '@/components/ui/button'
import formatDate from '@/utils/formatDate'
import {
  useRetrieveSiteVisitsQuery,
  useRetrieveMySiteVisitsQuery,
} from '@/redux/features/siteVisits/siteVisit.api'
import { LandSiteVisitKind, LandSiteVisitStatus } from '@/enum'

interface SiteVisitsTableProps {
  onOpenScheduleModal: () => void
  onViewDetails: (id: number) => void
  onEditVisit: (visit: any) => void
  onDeleteVisit: (id: number) => void
  onCompleteVisit: (id: number) => void
  onCancelVisit: (id: number) => void
  actionBusyId?: number | null
}

const statusOptions: LandSiteVisitStatus[] = Object.values(LandSiteVisitStatus) as LandSiteVisitStatus[];
const kindOptions: LandSiteVisitKind[] = Object.values(LandSiteVisitKind) as LandSiteVisitKind[];

// API doesn't return a flat "status" field — it's derived from the timestamps
const getVisitStatus = (visit: any): LandSiteVisitStatus => {
  if (visit.cancelledAt) return 'CANCELLED' as LandSiteVisitStatus
  if (visit.completedAt) return 'COMPLETED' as LandSiteVisitStatus
  return 'SCHEDULED' as LandSiteVisitStatus
}

const SiteVisitsTable = ({
  onOpenScheduleModal,
  onViewDetails,
  onEditVisit,
  onDeleteVisit,
  onCompleteVisit,
  onCancelVisit,
  actionBusyId,
}: SiteVisitsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [kindFilter, setKindFilter] = useState<string>('All')
  const [myOnly, setMyOnly] = useState(false)

  const listArgs = {
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter !== 'All' ? (statusFilter as LandSiteVisitStatus) : undefined,
    kind: kindFilter !== 'All' ? (kindFilter as LandSiteVisitKind) : undefined,
  }

  const { data, isLoading, isFetching } = useRetrieveSiteVisitsQuery(listArgs, {
    skip: myOnly,
  })
  const { data: myData, isLoading: myLoading, isFetching: myFetching } = useRetrieveMySiteVisitsQuery(listArgs, {
    skip: !myOnly,
  })

  const visits = (myOnly ? myData : data)?.data || []
  const pagination = (myOnly ? myData : data)?.pagination
  const loading = myOnly ? myLoading : isLoading
  const fetching = myOnly ? myFetching : isFetching
  const totalEntries = pagination?.total || visits.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 5

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between select-none">
      <div>
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search visits..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            <CustomFilterDropdown
              type="checkbox"
              label="All Statuses"
              header="Filter Status"
              options={statusOptions}
              selected={statusFilter}
              onSelect={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            />

            <CustomFilterDropdown
              type="checkbox"
              label="All Visit Types"
              header="Filter Visit Type"
              options={kindOptions}
              selected={kindFilter}
              onSelect={(val) => {
                setKindFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* All / My visits toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setMyOnly(false)
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer',
                  !myOnly ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                All Visits
              </button>
              <button
                type="button"
                onClick={() => {
                  setMyOnly(true)
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer',
                  myOnly ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                My Visits
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <Button type="button" onClick={onOpenScheduleModal} className="w-auto">
              <Plus className="w-4.5 h-4.5" />
              <span>Schedule Visit</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">VISIT ID</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL / LOCATION</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SURVEYOR</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PHONE</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TYPE</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SCHEDULED DATE</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm font-semibold text-slate-400">
                    Loading site visits...
                  </td>
                </tr>
              ) : visits.length > 0 ? (
                visits.map((item: any) => {
                  const status = getVisitStatus(item)

                  // Prefer a linked parcel; fall back to the registration's pending location; else N/A
                  const parcelLabel = item.parcel?.slug || item.parcelSlug || item.parcelId
                  const location = item.parcel?.location || item.registration?.location
                  const locationLabel = location ? `${location.city}, ${location.state}` : null

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-4 px-5 text-sm font-bold text-slate-800">
                        {item.slug || `SV-${item.id}`}
                      </td>

                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        {parcelLabel ? (
                          <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                            {parcelLabel}
                          </span>
                        ) : locationLabel ? (
                          <span>{locationLabel}</span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                        {item.registration?.slug && (
                          <div className="text-[11px] text-slate-400 font-medium">
                            {item.registration.slug}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        {item.surveyor?.name || 'N/A'}
                      </td>

                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        {item.phone || <span className="text-slate-400">N/A</span>}
                      </td>

                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        {item.kind ? item.kind.replaceAll('_', ' ') : 'N/A'}
                      </td>

                      <td className="py-4 px-5 text-sm text-slate-500">
                        {formatDate(item.scheduledAt)}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold block w-fit whitespace-nowrap',
                            status === 'SCHEDULED' && 'bg-indigo-50 text-indigo-600',
                            status === 'COMPLETED' && 'bg-emerald-50 text-emerald-600',
                            status === 'CANCELLED' && 'bg-rose-50 text-rose-600'
                          )}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {actionBusyId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-button-color" />
                          ) : (
                            <>
                              {status === 'SCHEDULED' && (
                                <button
                                  type="button"
                                  onClick={() => onCompleteVisit(item.id)}
                                  className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                                  title="Mark Complete"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {status === 'SCHEDULED' && (
                                <button
                                  type="button"
                                  onClick={() => onCancelVisit(item.id)}
                                  className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50/50 transition-colors cursor-pointer"
                                  title="Cancel Visit"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => onViewDetails(item.id)}
                                className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditVisit(item)}
                                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit Site Visit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteVisit(item.id)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                                title="Delete Site Visit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                    No scheduled site visits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
        isLoading={fetching || loading}
      />
    </div>
  )
}

export default SiteVisitsTable
