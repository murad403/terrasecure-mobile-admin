"use client"
import { Search, Plus, Eye, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import formatDate from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { LandInvestigationKind, LandInvestigationPriorityLevel } from '@/enum'
import type { LandInvestigationItem } from '@/redux/features/investigations/investigations.type'

interface InvestigationsTableProps {
  investigations: LandInvestigationItem[]
  isLoading: boolean
  isFetching: boolean
  pagination?: {
    total: number
    limit: number
    page: number
    totalPages: number
  }
  currentPage: number
  setCurrentPage: (page: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  kindFilter: string
  setKindFilter: (kind: string) => void
  priorityFilter: string
  setPriorityFilter: (priority: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onOpenCreateModal: () => void
  onViewDetails: (item: LandInvestigationItem) => void
}

const KIND_LABELS: Record<string, string> = Object.keys(LandInvestigationKind).reduce(
  (acc, key) => {
    acc[key] = key.replace(/_/g, ' ')
    return acc
  },
  {} as Record<string, string>
)

const InvestigationsTable = ({
  investigations,
  isLoading,
  isFetching,
  pagination,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  kindFilter,
  setKindFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  onOpenCreateModal,
  onViewDetails,
}: InvestigationsTableProps) => {
  const totalEntries = pagination?.total || investigations.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none min-h-[calc(100vh-12rem)]">
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search investigations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Kind Filter Dropdown */}
          <CustomFilterDropdown
            label="All Kinds"
            header="Filter by Kind"
            options={['All Kinds', ...Object.values(LandInvestigationKind)]}
            selected={kindFilter}
            onSelect={(val) => {
              setKindFilter(val)
              setCurrentPage(1)
            }}
          />

          {/* Priority Filter Dropdown */}
          <CustomFilterDropdown
            label="All Priorities"
            header="Filter by Priority"
            options={['All Priorities', ...Object.values(LandInvestigationPriorityLevel)]}
            selected={priorityFilter}
            onSelect={(val) => {
              setPriorityFilter(val)
              setCurrentPage(1)
            }}
          />


          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="Filter by Status"
            options={['All Statuses', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'CLOSED']}
            selected={statusFilter}
            onSelect={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
          />
        </div>

        {/* Action Button: Create Investigation */}
        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
          <Button type="button" onClick={onOpenCreateModal} className="w-auto cursor-pointer">
            <Plus className="w-4.5 h-4.5" />
            <span>Create Investigation</span>
          </Button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                CASE ID
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                TITLE & KIND
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                PRIORITY
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                PARCEL
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                REQUESTER
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                STATUS
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                CREATED
              </th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm font-semibold text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-button-color" />
                    <span>Loading investigations...</span>
                  </div>
                </td>
              </tr>
            ) : investigations.length > 0 ? (
              investigations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Case ID / Slug */}
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="text-sm font-extrabold text-red-600 hover:underline hover:text-red-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                    >
                      {item.slug || `INV-${item.id}`}
                    </button>
                  </td>

                  {/* Title & Kind */}
                  <td className="py-4 px-5">
                    <div
                      className="font-bold text-xs text-slate-900 max-w-50 truncate"
                      title={item.title || 'Land Investigation'}
                    >
                      {item.title || 'Land Investigation'}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {KIND_LABELS[item.kind] || item.kind}
                    </span>
                  </td>

                  {/* Priority Level */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-extrabold border block w-fit uppercase tracking-wider',
                        item.priorityLevel === 'HIGH' &&
                          'bg-rose-50 text-rose-600 border-rose-200',
                        item.priorityLevel === 'MEDIUM' &&
                          'bg-amber-50 text-amber-600 border-amber-200',
                        item.priorityLevel === 'LOW' && 'bg-blue-50 text-blue-600 border-blue-200'
                      )}
                    >
                      {item.priorityLevel || 'MEDIUM'}
                    </span>
                  </td>

                  {/* Parcel */}
                  <td className="py-4 px-5">
                    <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                      {item.parcel?.parcelCode || item.parcel?.slug || `Parcel #${item.parcelId}`}
                    </span>
                  </td>

                  {/* Requester */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-button-color font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                        {item.requester?.profilePicture?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.requester.profilePicture.url}
                            alt={item.requester.name || 'Requester'}
                            className="w-full h-full object-cover"
                          />
                        ) : item.requester?.name ? (
                          item.requester.name.substring(0, 2).toUpperCase()
                        ) : (
                          'US'
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {item.requester?.name || 'System User'}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold border block w-fit whitespace-nowrap uppercase tracking-wider',
                        item.status === 'PENDING' && 'bg-amber-50 text-amber-600 border-amber-200',
                        item.status === 'UNDER_REVIEW' && 'bg-blue-50 text-blue-600 border-blue-200',
                        item.status === 'RESOLVED' &&
                          'bg-emerald-50 text-emerald-600 border-emerald-200',
                        item.status === 'REJECTED' && 'bg-rose-50 text-rose-600 border-rose-200'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-5 text-xs font-semibold text-slate-500">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
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
                <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
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
        isLoading={isFetching}
      />
    </div>
  )
}

export default InvestigationsTable