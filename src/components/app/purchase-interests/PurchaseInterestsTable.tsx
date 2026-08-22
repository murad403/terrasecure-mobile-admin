"use client"
import React from 'react'
import { Search, Eye, MessageSquare, ArrowRightLeft, ShieldCheck, CheckCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import formatDate from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import type { PurchaseInterestItem } from '@/redux/features/purchase-interests/purchase-interests.type'

interface PurchaseInterestsTableProps {
  interests: PurchaseInterestItem[]
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
  statusFilter: string
  setStatusFilter: (status: string) => void
  onViewDetails: (item: PurchaseInterestItem) => void
  onReply: (item: PurchaseInterestItem) => void
  onTransfer: (item: PurchaseInterestItem) => void
  onVerifyTransfer: (item: PurchaseInterestItem) => void
  onCompleteTransfer: (item: PurchaseInterestItem) => void
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  PENDING: { label: 'Pending', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACKNOWLEDGED: { label: 'Acknowledged', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DECLINED: { label: 'Declined', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  MORE_INFO_REQUESTED: { label: 'More Info Requested', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  CONVERTED_TO_TRANSFER: { label: 'Converted To Transfer', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
}

export const getTransferActionState = (item: PurchaseInterestItem) => {
  const transfer = item.resultingTransfer
  const transferId = item.resultingTransferId || transfer?.id || null
  const transferStatus = transfer?.status

  if (transferStatus === 'COMPLETED' || item.parcel?.status === 'SOLD') {
    return { canInitiate: false, canVerify: false, canComplete: false, isDone: true, transferId }
  }

  if (transferStatus === 'VERIFIED') {
    return { canInitiate: false, canVerify: false, canComplete: true, isDone: false, transferId }
  }

  if (transferStatus === 'PENDING' || transferId || item.status === 'CONVERTED_TO_TRANSFER') {
    return { canInitiate: false, canVerify: true, canComplete: false, isDone: false, transferId }
  }

  return { canInitiate: true, canVerify: false, canComplete: false, isDone: false, transferId: null }
}

const PurchaseInterestsTable = ({
  interests,
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
  onReply,
  onTransfer,
  onVerifyTransfer,
  onCompleteTransfer,
}: PurchaseInterestsTableProps) => {
  const totalEntries = pagination?.total || interests.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none min-h-[calc(100vh-12rem)] flex flex-col justify-between">
      {/* Action & Filter Bar */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by buyer, parcel, or code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            {/* Status Filter Dropdown */}
            <CustomFilterDropdown
              label="All Statuses"
              header="Filter by Status"
              options={['All Statuses', 'PENDING', 'ACKNOWLEDGED', 'DECLINED', 'MORE_INFO_REQUESTED']}
              selected={statusFilter}
              onSelect={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto min-h-87.5">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center p-12 text-slate-500 font-semibold text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-button-color mr-2" />
              <span>Loading purchase interests...</span>
            </div>
          ) : interests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-semibold text-xs">
              <span>No purchase interests found matching your criteria.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Reference Code</th>
                  <th className="py-3 px-4">Buyer / Requester</th>
                  <th className="py-3 px-4">Target Parcel</th>
                  <th className="py-3 px-4">Offer Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {interests.map((item) => {
                  const statusBadge = STATUS_CONFIG[item.status] || {
                    label: item.status,
                    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
                  }

                  const formattedOffer = item.offerAmount
                    ? `${Number(item.offerAmount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ${item.currency || 'USD'}`
                    : 'N/A'

                  const transferState = getTransferActionState(item)

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Slug / Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {item.slug || `PI-${item.id}`}
                        </span>
                      </td>

                      {/* Buyer User */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-button-color font-extrabold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                            {item.user?.profilePicture?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.user.profilePicture.url}
                                alt={item.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              item.user?.name?.substring(0, 2).toUpperCase() || 'US'
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 truncate">
                              {item.user?.name || 'System User'}
                            </span>
                            {item.user?.phone && (
                              <span className="text-[10px] text-slate-400 font-semibold truncate">
                                {item.user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Target Parcel */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-blue-600">
                            {item.parcel?.parcelCode || item.parcel?.slug || `Parcel #${item.parcelId}`}
                          </span>
                          {item.parcel?.location?.city && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {item.parcel.location.city}, {item.parcel.location.state}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Offer Amount */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {formattedOffer}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider inline-block',
                            statusBadge.badgeClass
                          )}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-semibold whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onViewDetails(item)}
                            className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onReply(item)}
                            className="h-8 w-8 text-slate-400 hover:text-button-color hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Reply Response"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>

                          {/* Initiate Transfer */}
                          {transferState.canInitiate && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onTransfer(item)}
                              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Initiate Land Transfer"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Verify Transfer */}
                          {transferState.canVerify && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onVerifyTransfer(item)}
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Verify Land Transfer"
                            >
                              <ShieldCheck className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}

                          {/* Complete Transfer */}
                          {transferState.canComplete && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onCompleteTransfer(item)}
                              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Complete Land Transfer"
                            >
                              <CheckCheck className="w-4 h-4 text-emerald-600" />
                            </Button>
                          )}

                          {/* Complete Done Badge */}
                          {transferState.isDone && (
                            <span
                              className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full select-none"
                              title="Transfer Completed"
                            >
                              Transferred
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Custom Pagination */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totalEntries={totalEntries}
        pageSize={pageSize}
      />
    </div>
  )
}

export default PurchaseInterestsTable