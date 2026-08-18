"use client"
import React, { useState } from 'react'
import SiteVisitsTable from './SiteVisitsTable'
import ScheduleSiteVisitModal from './ScheduleSiteVisitModal'
import { useRetrieveSiteVisitDetailsQuery } from '@/redux/features/siteVisits/siteVisit.api'
import SiteVisitDetails from './SiteVisitDetails'

const SiteVisitsPage = () => {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: detailsData, isLoading: detailsLoading } = useRetrieveSiteVisitDetailsQuery(
    selectedVisitId as number,
    { skip: !selectedVisitId || !drawerOpen }
  )

  const handleViewDetails = (id: number) => {
    setSelectedVisitId(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedVisitId(null)
  }

  const activeVisit = detailsData?.data

  return (
    <div className="space-y-6">
      <SiteVisitsTable
        onOpenScheduleModal={() => setScheduleOpen(true)}
        onViewDetails={handleViewDetails}
      />

      {drawerOpen && selectedVisitId && (
        <SiteVisitDetails
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          visit={activeVisit}
          isLoading={detailsLoading}
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