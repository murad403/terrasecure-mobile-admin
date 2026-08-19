"use client"
import React, { useState } from 'react'
import SiteVisitsTable from './SiteVisitsTable'
import ScheduleSiteVisitModal from './ScheduleSiteVisitModal'
import {
  useRetrieveSiteVisitDetailsQuery,
  useCompleteSiteVisitMutation,
  useCancelSiteVisitMutation,
  useDeleteSiteVisitMutation,
} from '@/redux/features/siteVisits/siteVisit.api'
import SiteVisitDetails from './SiteVisitDetails'
import { toast } from 'sonner'

const SiteVisitsPage = () => {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [busyVisitId, setBusyVisitId] = useState<number | null>(null)

  const { data: detailsData, isLoading: detailsLoading } = useRetrieveSiteVisitDetailsQuery(
    selectedVisitId as number,
    { skip: !selectedVisitId || !drawerOpen }
  )

  const [completeSiteVisit, { isLoading: isCompleting }] = useCompleteSiteVisitMutation()
  const [cancelSiteVisit, { isLoading: isCancelling }] = useCancelSiteVisitMutation()
  const [deleteSiteVisit, { isLoading: isDeleting }] = useDeleteSiteVisitMutation()

  const actionLoading = isCompleting || isCancelling || isDeleting

  const handleViewDetails = (id: number) => {
    setSelectedVisitId(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedVisitId(null)
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
    if (!confirm('Are you sure you want to cancel this site visit?')) return
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

  const handleDeleteVisit = async (id: number) => {
    if (!confirm('Are you sure you want to delete this site visit? This cannot be undone.')) return
    setBusyVisitId(id)
    try {
      await deleteSiteVisit(id).unwrap()
      toast.success('Site visit deleted')
      handleCloseDrawer()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete site visit')
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
        onCompleteVisit={handleCompleteVisit}
        onCancelVisit={handleCancelVisit}
        actionBusyId={busyVisitId}
      />

      {drawerOpen && selectedVisitId && (
        <SiteVisitDetails
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          visit={activeVisit}
          isLoading={detailsLoading}
          onComplete={handleCompleteVisit}
          onCancel={handleCancelVisit}
          onDelete={handleDeleteVisit}
          actionLoading={actionLoading || busyVisitId !== null}
        />
      )}

      {scheduleOpen && (
        <ScheduleSiteVisitModal
          isOpen={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
        />
      )}
    </div>
  )
}

export default SiteVisitsPage
