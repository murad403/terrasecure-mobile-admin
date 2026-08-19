"use client"
import { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Pencil, Eye, ShieldX, Trash2, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import AddParcelModal from '@/components/app/parcels/AddParcelModal'
import EditParcelModal from '@/components/app/parcels/EditParcelModal'
import ParcelBlockModal from '@/components/app/parcels/ParcelBlockModal'
import ParcelDeleteModal from '@/components/app/parcels/ParcelDeleteModal'
import ParcelDetailsModal from '@/components/modal/ParcelDetailsModal'
import CustomPagination from '@/components/shared/CustomPagination'
import { Button } from '@/components/ui/button'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import SearchInput from '@/components/ui/SearchInput'
import formatDate from '@/utils/formatDate'
import { useRetrieveParcelsQuery } from '@/redux/features/parcel/parcel.api'
import type { ParcelListItem, ParcelStatus } from '@/redux/features/parcel/parcel.type'

const statusOptions: (ParcelStatus | 'All')[] = [
  'All',
  'DRAFT',
  'UNDER_VERIFICATION',
  'PUBLISHED',
  'RESERVED',
  'CLOSED',
]

const ParcelsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const [selectedParcelId, setSelectedParcelId] = useState<number | null>(null)
  const [selectedParcelItem, setSelectedParcelItem] = useState<ParcelListItem | null>(null)
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'block' | 'delete' | 'details' | null>(null)

  // Fetch live paginated parcels from API
  const { data, isLoading, isFetching } = useRetrieveParcelsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  })

  const parcelsList: ParcelListItem[] = data?.data || []
  const pagination = data?.pagination

  const totalEntries = pagination?.total || parcelsList.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setCurrentPage(1)
  }

  const handleOpenDetails = (item: ParcelListItem) => {
    setSelectedParcelId(item.id)
    setSelectedParcelItem(item)
    setActiveModal('details')
  }

  const handleOpenEdit = (item: ParcelListItem) => {
    setSelectedParcelItem(item)
    setActiveModal('edit')
  }

  const handleOpenBlock = (item: ParcelListItem) => {
    setSelectedParcelItem(item)
    setActiveModal('block')
  }

  const handleOpenDelete = (item: ParcelListItem) => {
    setSelectedParcelItem(item)
    setActiveModal('delete')
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <DashboardChildrenLayout title="Parcel Management" subtitle="Manage and monitor registered land parcels">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between">
        <div>
          {/* Action / Filter Bar */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <SearchInput
                  type="text"
                  placeholder="Search parcels..."
                  value={searchQuery}
                  onDebounceSearch={(value) => {
                    setSearchQuery(value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
                />
              </div>

              {/* Status Filter Dropdown */}
              <CustomFilterDropdown
                type="checkbox"
                label="All Statuses"
                header="Filter Status"
                options={statusOptions as string[]}
                selected={statusFilter}
                onSelect={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
              />

              {/* Clear Filters Button */}
              {searchQuery || statusFilter !== 'All' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-fit inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border-slate-200 px-4 py-2.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </Button>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
              <Button
                onClick={() => setActiveModal('add')}
                className="w-auto"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add Parcel</span>
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel ID</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">City / State</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Area Size</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Reliability</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Owner</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Created</th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm font-semibold text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-button-color" />
                        <span>Loading land parcels...</span>
                      </div>
                    </td>
                  </tr>
                ) : parcelsList && parcelsList.length > 0 ? (
                  parcelsList.map((item) => {
                    const primaryOwner = item.owners?.[0]
                    const coOwnersCount = (item.owners?.length || 0) - 1

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                        {/* Blue ID Link */}
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(item)}
                            className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left outline-none cursor-pointer border-none bg-transparent p-0"
                          >
                            {item.slug || item.parcelCode || `PCL-${item.id}`}
                          </button>
                        </td>

                        {/* City / State */}
                        <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                          {item.location?.city ? `${item.location.city}${item.location.state ? `, ${item.location.state}` : ''}` : 'N/A'}
                        </td>

                        {/* Area Size */}
                        <td className="py-4 px-5 text-sm font-semibold text-slate-600 font-mono">
                          {item.areaSqm ? item.areaSqm.toLocaleString() : 0} m²
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border block w-fit whitespace-nowrap",
                              item.status === 'PUBLISHED' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                              item.status === 'UNDER_VERIFICATION' && 'bg-blue-50 text-blue-600 border-blue-200',
                              item.status === 'DRAFT' && 'bg-slate-50 text-slate-600 border-slate-200',
                              item.status === 'RESERVED' && 'bg-amber-50 text-amber-600 border-amber-200',
                              item.status === 'CLOSED' && 'bg-rose-50 text-rose-600 border-rose-200',
                              item.status === 'BLOCKED' && 'bg-red-50 text-red-600 border-red-200'
                            )}
                          >
                            {item.status || 'N/A'}
                          </span>
                        </td>

                        {/* Reliability */}
                        <td className="py-4 px-5">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border block w-fit",
                              (item.reliabilityScore ?? 0) >= 85 && 'bg-[#047857] border-[#047857]',
                              (item.reliabilityScore ?? 0) >= 70 && (item.reliabilityScore ?? 0) < 85 && 'bg-emerald-500 border-emerald-500',
                              (item.reliabilityScore ?? 0) >= 50 && (item.reliabilityScore ?? 0) < 70 && 'bg-amber-500 border-amber-500',
                              (item.reliabilityScore ?? 0) < 50 && 'bg-red-500 border-red-500'
                            )}
                          >
                            {item.reliabilityScore !== undefined && item.reliabilityScore !== null ? `${item.reliabilityScore}%` : 'N/A'}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <span>{primaryOwner?.ownerName || 'N/A'}</span>
                            {coOwnersCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                                +{coOwnersCount} co-owner
                              </span>
                            )}
                          </div>
                          {primaryOwner?.ownerPhone && (
                            <div className="text-[11px] text-slate-400 font-medium">
                              {primaryOwner.ownerPhone}
                            </div>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-5 text-sm font-semibold text-slate-400">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(item)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                              title="Edit Parcel"
                            >
                              <Pencil className="w-4.5 h-4.5" />
                            </button>

                            {/* Block Button */}
                            <button
                              type="button"
                              disabled={item.status === 'BLOCKED'}
                              onClick={() => handleOpenBlock(item)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors cursor-pointer",
                                item.status === 'BLOCKED'
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-amber-600 hover:text-amber-800 hover:bg-amber-50/50"
                              )}
                              title="Block Parcel"
                            >
                              <ShieldX className="w-4.5 h-4.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                              title="Delete Parcel"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/404-error.svg" alt="No results found" className="w-80" />
                        <p className="text-sm font-semibold text-slate-400 -mt-10 mb-5">
                          No land parcels found matching your filters. Try clearing the filters or adjust your search criteria.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResetFilters}
                          className="w-fit inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border-slate-200 px-4 py-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear Filters</span>
                        </Button>
                      </div>
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
          isLoading={isFetching || isLoading}
        />
      </div>

      {/* Render Modals */}
      {activeModal === 'details' && selectedParcelId && (
        <ParcelDetailsModal
          isOpen={true}
          onClose={closeModal}
          parcelId={selectedParcelId}
          onEdit={() => setActiveModal('edit')}
          onBlock={() => setActiveModal('block')}
          onDelete={() => setActiveModal('delete')}
        />
      )}

      {activeModal === 'edit' && selectedParcelItem && (
        <EditParcelModal
          isOpen={true}
          onClose={closeModal}
          parcelItem={selectedParcelItem}
        />
      )}

      {activeModal === 'block' && selectedParcelItem && (
        <ParcelBlockModal
          isOpen={true}
          onClose={closeModal}
          parcelItem={selectedParcelItem}
        />
      )}

      {activeModal === 'delete' && selectedParcelItem && (
        <ParcelDeleteModal
          isOpen={true}
          onClose={closeModal}
          parcelItem={selectedParcelItem}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default ParcelsPage