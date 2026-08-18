"use client"
import React, { useState } from 'react'
import { Plus, Search, Eye, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/SearchInput'
import formatDate from '@/utils/formatDate'
import { LandParcelOwnershipType, LandParcelRegistrationStatus } from '@/enum'
import { useRetrieveRegistrationsQuery } from '@/redux/features/registrations/registration.api'
import { UserPicker } from '@/components/tools/UserPicker'

interface RegistrationsTableProps {
  onOpenAddModal: () => void
  onViewDetails: (id: number) => void
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  onOpenAddModal,
  onViewDetails,
}) => {
  // Table filters & pagination state managed internally
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [ownershipTypeFilter, setOwnershipTypeFilter] = useState<string>('All')

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setOwnershipTypeFilter('All')
    setCurrentPage(1)
  }

  // Fetch paginated & filtered registrations directly inside component
  const { data, isLoading, isFetching } = useRetrieveRegistrationsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    ownershipType: ownershipTypeFilter !== 'All' ? ownershipTypeFilter : undefined,
  })

  const registrationsList = data?.data || []
  const pagination = data?.pagination

  const statusOptions = Object.values(LandParcelRegistrationStatus) as LandParcelRegistrationStatus[]
  const ownershipTypeOptions = Object.values(LandParcelOwnershipType) as LandParcelOwnershipType[]

  const totalEntries = pagination?.total || registrationsList.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between">
      <div>
        {/* Search & Filters Action Bar */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <SearchInput
                type="text"
                placeholder="Search registrations..."
                value={searchQuery}
                onDebounceSearch={(value) => {
                  setSearchQuery(value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            <UserPicker onChange={(x) => console.log(x)} />
              
            {/* Status Filter */}
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

            {/* Ownership Type Filter */}
            <CustomFilterDropdown
              type="checkbox"
              label="All Ownership Types"
              header="Filter Ownership"
              options={ownershipTypeOptions}
              selected={ownershipTypeFilter}
              onSelect={(val) => {
                setOwnershipTypeFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* Clear Filters Button */}
            {searchQuery || statusFilter !== 'All' || ownershipTypeFilter !== 'All' ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="w-fit inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border-slate-200 px-4 py-2.75"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </Button>
            ) : null}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <Button className="w-auto" type="button" onClick={onOpenAddModal}>
              <Plus className="w-4.5 h-4.5" />
              <span>New Registration</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  REGISTRATION ID
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  APPLICANT(S)
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  LOCATION
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  SUBMITTED
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  CURRENT STEP
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  STATUS
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-semibold text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-button-color" />
                      <span>Loading land registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : registrationsList && registrationsList.length > 0 ? (
                registrationsList.map((reg: any) => {
                  const primaryRegistrant = reg.registrants?.[0]
                  const extraRegistrantsCount = (reg.registrants?.length || 0) - 1
                  const locationText = reg.location?.city ? `${reg.location.city}, ${reg.location.state}` : 'N/A'
                  const stepNum = reg.step || 1

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/20 transition-colors">
                      {/* Slug / ID */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          onClick={() => onViewDetails(reg.id)}
                          className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                        >
                          {reg.slug || `REG-${reg.id}`}
                        </button>
                      </td>

                      {/* Applicant */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <span>{primaryRegistrant?.ownerName || 'N/A'}</span>
                          {extraRegistrantsCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                              +{extraRegistrantsCount} co-owner
                            </span>
                          )}
                        </div>
                        {primaryRegistrant?.ownerPhone && (
                          <div className="text-[11px] text-slate-400 font-medium">
                            {primaryRegistrant.ownerPhone}
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                        {locationText}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                        {formatDate(reg.submittedAt || reg.createdAt)}
                      </td>

                      {/* Step Stepper */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5 sm:gap-1">
                            {Array.from({ length: 7 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-3 h-1.5 rounded-sm',
                                  i < stepNum ? 'bg-button-color' : 'bg-slate-200'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                            Step {stepNum}/7
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap',
                            (reg.status === 'PUBLISHED' || reg.status === 'CONVERTED' || reg.status === 'Completed') &&
                            'bg-emerald-50 text-emerald-600 border-emerald-200',
                            (reg.status === 'UNDER_VERIFICATION' || reg.status === 'In Progress') &&
                            'bg-blue-50 text-blue-600 border-blue-200',
                            (reg.status === 'DRAFT' || reg.status === 'Pending') &&
                            'bg-amber-50 text-amber-600 border-amber-200',
                            (reg.status === 'CLOSED' || reg.status === 'REJECTED' || reg.status === 'Rejected') &&
                            'bg-rose-50 text-rose-600 border-rose-200'
                          )}
                        >
                          {reg.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => onViewDetails(reg.id)}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/404-error.svg" alt="No results found" className="w-80" />
                      <p className="text-sm font-semibold text-slate-400 -mt-10 mb-5">
                        No parcel registrations found matching your filters. Try to clear the filters or adjust your search criteria.
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
  )
}

export default RegistrationsTable;