"use client"
import React from 'react'
import UserRequestMonitoringStats from './UserRequestMonitoringStats'
import RequestActivityLogTable from './RequestActivityLogTable'

const UserRequestMonitoringTab = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <UserRequestMonitoringStats />

      {/* Activity Log Table */}
      <RequestActivityLogTable />
    </div>
  )
}

export default UserRequestMonitoringTab