"use client"
import { Search, Eye, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import formatDate from '@/utils/formatDate'
import type { LandConsultationItem } from '@/redux/features/consultations/consultations.type'

interface ConsultationsTableProps {
  consultations: LandConsultationItem[]
  isLoading: boolean
  isFetching: boolean
  pagination?: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  }
  currentPage: number
  setCurrentPage: (page: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onViewDetails: (item: LandConsultationItem) => void
  onDeleteConsultation: (item: LandConsultationItem) => void
}

const ConsultationsTable = ({
  consultations,
  isLoading,
  isFetching,
  pagination,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onViewDetails,
  onDeleteConsultation,
}: ConsultationsTableProps) => {
  const totalEntries = pagination?.total || consultations.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between">
      {/* Search & Filters Action Bar */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full flex-wrap">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search consultations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            {/* Status Dropdown */}
            <CustomFilterDropdown
              label="All Statuses"
              header="All Statuses"
              options={['All Statuses', 'PENDING', 'ACCEPTED', 'REJECTED']}
              selected={statusFilter}
              onSelect={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Main Table Grid */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-187.5">
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-button-color" />
                      <span>Loading consultations...</span>
                    </div>
                  </td>
                </tr>
              ) : consultations.length > 0 ? (
                consultations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Slug / ID Column */}
                    <td className="py-4 px-5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        className="text-sm font-extrabold text-purple-600 hover:underline hover:text-purple-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                      >
                        {item.slug || `CON-${item.id}`}
                      </button>
                    </td>

                    {/* Requester Name & Profile Picture */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-button-color font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 shadow-xs">
                          {item.user?.profilePicture?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.user.profilePicture.url}
                              alt={item.user.name || 'User Profile'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            item.user?.name
                              ? item.user.name.substring(0, 2).toUpperCase()
                              : 'US'
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {item.user?.name || 'N/A'}
                        </span>
                      </div>
                    </td>


                    {/* Related Parcel Code */}
                    <td className="py-4 px-5">
                      <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                        {item.parcel?.parcelCode || item.parcel?.slug || `Parcel #${item.parcelId}`}
                      </span>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border block w-fit whitespace-nowrap uppercase tracking-wider",
                          item.status === 'ACCEPTED' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                          item.status === 'PENDING' && 'bg-amber-50 text-amber-600 border-amber-200',
                          item.status === 'REJECTED' && 'bg-rose-50 text-rose-600 border-rose-200'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Action Icons Column: Eye (Details) + Trash2 (Delete) */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Details Eye Icon */}
                        <button
                          type="button"
                          onClick={() => onViewDetails(item)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Trash Icon to Delete Consultation */}
                        <button
                          type="button"
                          onClick={() => onDeleteConsultation(item)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                          title="Delete Consultation"
                        >
                          <Trash2 className="w-4 h-4" />
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

export default ConsultationsTable