"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import PurchaseInterestsTable, { getTransferActionState } from './PurchaseInterestsTable'
import PurchaseInterestDetailsModal from './PurchaseInterestDetailsModal'
import ReplyInterestModal from './ReplyInterestModal'
import CreateTransferModal from './CreateTransferModal'
import TransferActionModal from './TransferActionModal'
import { useGetPurchaseInterestsQuery } from '@/redux/features/purchase-interests/purchase-interests.api'
import type { PurchaseInterestItem } from '@/redux/features/purchase-interests/purchase-interests.type'

const PurchaseInterestsPage = () => {
  // Query States
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  // Selected Item & Modals
  const [selectedInterest, setSelectedInterest] = useState<PurchaseInterestItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)

  // Transfer Action Modal State (Verify / Complete)
  const [actionModalState, setActionModalState] = useState<{
    isOpen: boolean
    actionType: 'VERIFY' | 'COMPLETE'
    transferId: number | string | null
  }>({
    isOpen: false,
    actionType: 'VERIFY',
    transferId: null,
  })

  // API Call
  const { data: interestsRes, isLoading, isFetching } = useGetPurchaseInterestsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery.trim() || undefined,
    status: statusFilter !== 'All Statuses' ? statusFilter : undefined,
  })

  const interests = interestsRes?.data || []
  const pagination = interestsRes?.pagination

  const handleViewDetails = (item: PurchaseInterestItem) => {
    setSelectedInterest(item)
    setDetailsOpen(true)
  }

  const handleReply = (item: PurchaseInterestItem) => {
    setSelectedInterest(item)
    setReplyOpen(true)
  }

  const handleTransfer = (item: PurchaseInterestItem) => {
    setSelectedInterest(item)
    setTransferOpen(true)
  }

  const handleVerifyTransfer = (item: PurchaseInterestItem) => {
    const state = getTransferActionState(item)
    if (state.transferId) {
      setActionModalState({
        isOpen: true,
        actionType: 'VERIFY',
        transferId: state.transferId,
      })
    }
  }

  const handleCompleteTransfer = (item: PurchaseInterestItem) => {
    const state = getTransferActionState(item)
    if (state.transferId) {
      setActionModalState({
        isOpen: true,
        actionType: 'COMPLETE',
        transferId: state.transferId,
      })
    }
  }

  return (
    <DashboardChildrenLayout
      title="Purchase Interests"
      subtitle="Manage buyer purchase inquiries and land transfers"
    >
      <div className="space-y-6 select-none">
        <PurchaseInterestsTable
          interests={interests}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onViewDetails={handleViewDetails}
          onReply={handleReply}
          onTransfer={handleTransfer}
          onVerifyTransfer={handleVerifyTransfer}
          onCompleteTransfer={handleCompleteTransfer}
        />

        {/* Details Drawer Modal */}
        {detailsOpen && selectedInterest && (
          <PurchaseInterestDetailsModal
            isOpen={detailsOpen}
            onClose={() => {
              setDetailsOpen(false)
              setSelectedInterest(null)
            }}
            interestId={selectedInterest.id}
            initialInterest={selectedInterest}
          />
        )}

        {/* Reply Response Modal */}
        {replyOpen && selectedInterest && (
          <ReplyInterestModal
            isOpen={replyOpen}
            onClose={() => {
              setReplyOpen(false)
              setSelectedInterest(null)
            }}
            interestId={selectedInterest.id}
            initialStatus={selectedInterest.status}
            initialMessage={selectedInterest.responseMsg || ''}
          />
        )}

        {/* Create Land Transfer Modal */}
        {transferOpen && selectedInterest && (
          <CreateTransferModal
            isOpen={transferOpen}
            onClose={() => {
              setTransferOpen(false)
              setSelectedInterest(null)
            }}
            initialParcelSlug={selectedInterest.parcel?.slug || ''}
            purchaseInterestId={selectedInterest.id}
            defaultOfferAmount={selectedInterest.offerAmount}
            sellerName={selectedInterest.parcel?.owners?.[0]?.ownerName || ''}
            sellerPhone={selectedInterest.parcel?.owners?.[0]?.ownerPhone || ''}
            buyerName={selectedInterest.user?.name || ''}
            buyerPhone={selectedInterest.user?.phone || ''}
          />
        )}

        {/* Transfer Action Modal (Verify / Complete) */}
        {actionModalState.isOpen && actionModalState.transferId && (
          <TransferActionModal
            isOpen={actionModalState.isOpen}
            onClose={() =>
              setActionModalState((prev) => ({ ...prev, isOpen: false, transferId: null }))
            }
            transferId={actionModalState.transferId}
            actionType={actionModalState.actionType}
          />
        )}
      </div>
    </DashboardChildrenLayout>
  )
}

export default PurchaseInterestsPage