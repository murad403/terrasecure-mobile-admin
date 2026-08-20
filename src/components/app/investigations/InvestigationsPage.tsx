"use client"
import React, { useState } from 'react'
import InvestigationsTable from './InvestigationsTable'
import InvestigationDetailsModal from './InvestigationDetailsModal'
import CreateInvestigationModal from './CreateInvestigationModal'
import { useRetrieveLandInvestigationsQuery } from '@/redux/features/investigations/investigations.api'
import type { LandInvestigationItem } from '@/redux/features/investigations/investigations.type'

const InvestigationsPage = () => {
  // Query Filter States
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [kindFilter, setKindFilter] = useState('All Kinds')
  const [priorityFilter, setPriorityFilter] = useState('All Priorities')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  // Modals & Drawer State
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<number | string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // API Query
  const { data: investigationsRes, isLoading, isFetching } = useRetrieveLandInvestigationsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery.trim() || undefined,
    kind: kindFilter !== 'All Kinds' ? kindFilter : undefined,
    priorityLevel: priorityFilter !== 'All Priorities' ? priorityFilter : undefined,
    status: statusFilter !== 'All Statuses' ? statusFilter : undefined,
  })

  const investigations = investigationsRes?.data || []
  const pagination = investigationsRes?.pagination

  const handleOpenDetails = (item: LandInvestigationItem) => {
    setSelectedInvestigationId(item.id)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedInvestigationId(null)
    setDetailsOpen(false)
  }

  return (
    <div className="space-y-6 select-none">
      <InvestigationsTable
        investigations={investigations}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        kindFilter={kindFilter}
        setKindFilter={setKindFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenCreateModal={() => setCreateOpen(true)}
        onViewDetails={handleOpenDetails}
      />

      {/* Create Investigation Modal */}
      {createOpen && (
        <CreateInvestigationModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {/* Details Drawer */}
      {detailsOpen && selectedInvestigationId && (
        <InvestigationDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          investigationId={selectedInvestigationId}
        />
      )}
    </div>
  )
}

export default InvestigationsPage