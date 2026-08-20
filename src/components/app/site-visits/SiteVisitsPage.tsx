"use client"
import React, { useState } from 'react'
import SiteVisitsTable from './SiteVisitsTable'
import ScheduleSiteVisitModal from './ScheduleSiteVisitModal'
import EditSiteVisitModal from './EditSiteVisitModal'
import DeleteSiteVisitModal from './DeleteSiteVisitModal'
import SiteVisitDetails from './SiteVisitDetails'
import {
  useRetrieveSiteVisitDetailsQuery,
  useCompleteSiteVisitMutation,
  useCancelSiteVisitMutation,
} from '@/redux/features/siteVisits/siteVisit.api'
import { toast } from 'sonner'

const SiteVisitsPage = () => {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [busyVisitId, setBusyVisitId] = useState<number | null>(null)

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false)
  const [selectedEditVisit, setSelectedEditVisit] = useState<any | null>(null)

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDeleteVisit, setSelectedDeleteVisit] = useState<{ id: number; slug?: string } | null>(null)

  const { data: detailsData, isLoading: detailsLoading } = useRetrieveSiteVisitDetailsQuery(
    selectedVisitId as number,
    { skip: !selectedVisitId || !drawerOpen }
  )

  const [completeSiteVisit, { isLoading: isCompleting }] = useCompleteSiteVisitMutation()
  const [cancelSiteVisit, { isLoading: isCancelling }] = useCancelSiteVisitMutation()

  const actionLoading = isCompleting || isCancelling

  const handleViewDetails = (id: number) => {
    setSelectedVisitId(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedVisitId(null)
  }

  const handleEditVisit = (visit: any) => {
    setSelectedEditVisit(visit)
    setEditOpen(true)
  }

  const handleDeleteVisitTrigger = (id: number, slug?: string) => {
    setSelectedDeleteVisit({ id, slug })
    setDeleteOpen(true)
  }

  const handleCompleteVisit = async (id: number) => {
    setBusyVisitId(id)
    try {
      await completeSiteVisit(id).unwrap()
      toast.success('Site visit marked as completed')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to complete site visit')
    } finally {
      setBusyVisitId(null)
    }
  }

  const handleCancelVisit = async (id: number) => {
    setBusyVisitId(id)
    try {
      await cancelSiteVisit(id).unwrap()
      toast.success('Site visit cancelled')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel site visit')
    } finally {
      setBusyVisitId(null)
    }
  }

  const activeVisit = detailsData?.data

  return (
    <div className="space-y-6">
      <SiteVisitsTable
        onOpenScheduleModal={() => setScheduleOpen(true)}
        onViewDetails={handleViewDetails}
        onEditVisit={handleEditVisit}
        onDeleteVisit={(id) => handleDeleteVisitTrigger(id)}
        onCompleteVisit={handleCompleteVisit}
        onCancelVisit={handleCancelVisit}
        actionBusyId={busyVisitId}
      />

      {/* Details Drawer */}
      {drawerOpen && selectedVisitId && (
        <SiteVisitDetails
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          visit={activeVisit}
          isLoading={detailsLoading}
          onComplete={handleCompleteVisit}
          onCancel={handleCancelVisit}
          onDelete={(id) => {
            handleDeleteVisitTrigger(id, activeVisit?.slug)
            handleCloseDrawer()
          }}
          actionLoading={actionLoading || busyVisitId !== null}
        />
      )}

      {/* Schedule Modal */}
      {scheduleOpen && (
        <ScheduleSiteVisitModal
          isOpen={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
        />
      )}

      {/* Edit Site Visit Modal */}
      {editOpen && selectedEditVisit && (
        <EditSiteVisitModal
          isOpen={editOpen}
          onClose={() => {
            setEditOpen(false)
            setSelectedEditVisit(null)
          }}
          visit={selectedEditVisit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && selectedDeleteVisit && (
        <DeleteSiteVisitModal
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false)
            setSelectedDeleteVisit(null)
          }}
          visitId={selectedDeleteVisit.id}
          visitSlug={selectedDeleteVisit.slug}
        />
      )}
    </div>
  )
}

export default SiteVisitsPage
