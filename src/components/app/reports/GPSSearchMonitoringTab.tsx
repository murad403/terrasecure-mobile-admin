"use client"
import React from 'react'
import GPSSearchMonitoringStats from './GPSSearchMonitoringStats'
import RecentGPSSearchLogTable from './RecentGPSSearchLogTable'

const GPSSearchMonitoringTab = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <GPSSearchMonitoringStats />

      {/* Recent Search Log Table */}
      <RecentGPSSearchLogTable />
    </div>
  )
}

export default GPSSearchMonitoringTab