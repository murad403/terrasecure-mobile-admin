"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import ReportsTabs from './ReportsTabs'
import ReportsFilter from './ReportsFilter'
import RevenueMonitoringTab from './RevenueMonitoringTab'
import LandRegistrationTab from './LandRegistrationTab'
import UserRequestMonitoringTab from './UserRequestMonitoringTab'
import GPSSearchMonitoringTab from './GPSSearchMonitoringTab'
import InvestigationsTab from './InvestigationsTab'

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('revenue')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'revenue':
        return <RevenueMonitoringTab />
      case 'registration':
        return <LandRegistrationTab />
      case 'requests':
        return <UserRequestMonitoringTab />
      case 'gps':
        return <GPSSearchMonitoringTab />
      case 'investigations':
        return <InvestigationsTab />
      default:
        return <RevenueMonitoringTab />
    }
  }

  return (
    <DashboardChildrenLayout
      title="Reports & Analytics"
      subtitle="Revenue monitoring, user requests, GPS search analytics, and custom reports"
    >
      {/* Tab Selectors */}
      <ReportsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Filter Component */}
      <ReportsFilter />

      {/* Active Tab Panel */}
      <div className="mt-6">
        {renderActiveTab()}
      </div>
    </DashboardChildrenLayout>
  )
}

export default ReportsPage