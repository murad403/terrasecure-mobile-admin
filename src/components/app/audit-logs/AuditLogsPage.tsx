"use client"
import { useState, useMemo } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import AuditLogsTable from './AuditLogsTable'
import AuditLogDetailsModal from './AuditLogDetailsModal'
import { useGetUserActivitiesQuery } from '@/redux/features/user/user.api'
import type { UserActivity } from '@/redux/features/user/user.type'

const AuditLogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  const [searchQuery, setSearchQuery] = useState('')
  const [kindFilter, setKindFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Convert dates to ISO 8601 format strings if provided
  const isoStartDate = useMemo(() => {
    if (!startDate) return undefined
    try {
      const d = new Date(startDate)
      if (isNaN(d.getTime())) return undefined
      d.setHours(0, 0, 0, 0)
      return d.toISOString()
    } catch {
      return undefined
    }
  }, [startDate])

  const isoEndDate = useMemo(() => {
    if (!endDate) return undefined
    try {
      const d = new Date(endDate)
      if (isNaN(d.getTime())) return undefined
      d.setHours(23, 59, 59, 999)
      return d.toISOString()
    } catch {
      return undefined
    }
  }, [endDate])

  // Fetch activities from backend API
  const { data: activitiesData, isLoading, isFetching } = useGetUserActivitiesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    kind: kindFilter !== 'ALL' ? kindFilter : undefined,
    action: actionFilter !== 'ALL' ? actionFilter : undefined,
    startDate: isoStartDate,
    endDate: isoEndDate,
  })

  const logs = activitiesData?.data || []
  const pagination = activitiesData?.pagination || {
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  }

  const handleViewDetails = (log: UserActivity) => {
    setSelectedActivityId(log.id)
    setSelectedActivity(log)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedActivityId(null)
    setSelectedActivity(null)
    setDrawerOpen(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setKindFilter('ALL')
    setActionFilter('ALL')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleKindChange = (val: string) => {
    setKindFilter(val)
    setCurrentPage(1)
  }

  const handleActionChange = (val: string) => {
    setActionFilter(val)
    setCurrentPage(1)
  }

  const handleStartDateChange = (val: string) => {
    setStartDate(val)
    setCurrentPage(1)
  }

  const handleEndDateChange = (val: string) => {
    setEndDate(val)
    setCurrentPage(1)
  }

  return (
    <DashboardChildrenLayout
      title="Audit Logs"
      subtitle="Complete action log for platform activity"
    >
      <div className="relative">
        {/* Logs Listing Table */}
        <AuditLogsTable
          logs={logs}
          isLoading={isLoading}
          isFetching={isFetching}
          onViewDetails={handleViewDetails}
          isDetailOpen={drawerOpen}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          kindFilter={kindFilter}
          setKindFilter={handleKindChange}
          actionFilter={actionFilter}
          setActionFilter={handleActionChange}
          startDate={startDate}
          setStartDate={handleStartDateChange}
          endDate={endDate}
          setEndDate={handleEndDateChange}
          onClearFilters={handleClearFilters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={pagination.totalPages}
          totalEntries={pagination.total}
          pageSize={pagination.limit}
        />

        {/* Sliding detail drawer */}
        <AuditLogDetailsModal
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          activityId={selectedActivityId}
          initialActivity={selectedActivity}
        />
      </div>
    </DashboardChildrenLayout>
  )
}

export default AuditLogsPage