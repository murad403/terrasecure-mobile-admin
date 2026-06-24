"use client"
import React from 'react'
import RevenueMonitoringStats from './RevenueMonitoringStats'
import MonthlyRevenueChart from './MonthlyRevenueChart'
import RevenueByTypeChart from './RevenueByTypeChart'
import PaymentTypeBreakdown from './PaymentTypeBreakdown'

const RevenueMonitoringTab = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <RevenueMonitoringStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyRevenueChart />
        </div>
        <div>
          <RevenueByTypeChart />
        </div>
      </div>

      {/* Payment Breakdown Table */}
      <PaymentTypeBreakdown />
    </div>
  )
}

export default RevenueMonitoringTab