"use client"
import React, { useState } from 'react'
import ConsultationsTable from './ConsultationsTable'
import ConsultationsDetailsModal from './ConsultationsDetailsModal'
import DeleteConsultationModal from '@/components/app/consultations/DeleteConsultationModal'
import { toast } from 'sonner'
import {
  useRetrieveLandConsultationsQuery,
  useDeleteLandConsultationMutation,
} from '@/redux/features/consultations/consultations.api'
import type { LandConsultationItem } from '@/redux/features/consultations/consultations.type'

const ConsultationsPage = () => {
  // Query Filter States
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  // Details Modal State
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Delete Modal State
  const [deletingConsultation, setDeletingConsultation] = useState<LandConsultationItem | null>(null)

  // API Queries & Mutations
  const { data: consultationsRes, isLoading, isFetching } = useRetrieveLandConsultationsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery.trim() || undefined,
    status: statusFilter !== 'All Statuses' ? statusFilter : undefined,
  })

  const [deleteConsultation, { isLoading: isDeleting }] = useDeleteLandConsultationMutation()

  const consultations = consultationsRes?.data || []
  const pagination = consultationsRes?.pagination

  const handleOpenDrawer = (item: LandConsultationItem) => {
    setSelectedConsultationId(item.id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedConsultationId(null)
    setDrawerOpen(false)
  }

  const handleOpenDeleteModal = (item: LandConsultationItem) => {
    setDeletingConsultation(item)
  }

  const handleConfirmDelete = async () => {
    if (!deletingConsultation) return

    try {
      const res = await deleteConsultation(deletingConsultation.id).unwrap()
      toast.success(res.message || 'Consultation deleted successfully!')
      setDeletingConsultation(null)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete consultation.')
    }
  }

  return (
    <div className="space-y-6">
      <ConsultationsTable
        consultations={consultations}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onViewDetails={handleOpenDrawer}
        onDeleteConsultation={handleOpenDeleteModal}
      />

      {drawerOpen && selectedConsultationId && (
        <ConsultationsDetailsModal
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          consultationId={selectedConsultationId}
        />
      )}

      {/* Delete Consultation Modal */}
      {deletingConsultation && (
        <DeleteConsultationModal
          isOpen={Boolean(deletingConsultation)}
          onClose={() => setDeletingConsultation(null)}
          consultation={deletingConsultation}
          onConfirmDelete={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}

export default ConsultationsPage
