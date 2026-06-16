"use client"
import React from 'react'
import DashboardStats from '@/components/app/dashboard/DashboardStats'
import GISCoverage from '@/components/app/dashboard/GISCoverage'
import GISCoverageMap from '@/components/app/dashboard/GISCoverageMap'
import ParcelsByStatusChart from '@/components/app/dashboard/ParcelsByStatusChart'
import QuickActions from '@/components/app/dashboard/QuickActions'
import RecentActivity from '@/components/app/dashboard/RecentActivity'
import RegistrationsOverTimeChart from '@/components/app/dashboard/RegistrationsOverTimeChart'
import RevenueOverviewChart from '@/components/app/dashboard/RevenueOverviewChart'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'

const DashboardPage = () => {
    return (
        <DashboardChildrenLayout
            title="Dashboard"
            subtitle="Land Monitoring & Security Overview — Cameroon"
        >
            <div className="space-y-6 pb-12">
                {/* Stats cards grid */}
                <DashboardStats />
                
                {/* First chart row: Donut & Line charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 flex flex-col">
                        <ParcelsByStatusChart />
                    </div>
                    <div className="lg:col-span-8 flex flex-col">
                        <RegistrationsOverTimeChart />
                    </div>
                </div>

                {/* Second chart row: Revenue Bar & GIS Coverage Progress Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 flex flex-col">
                        <RevenueOverviewChart />
                    </div>
                    <div className="lg:col-span-4 flex flex-col">
                        <GISCoverage />
                    </div>
                </div>

                {/* Third row: Recent Activity & Quick Actions / GIS Coverage Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 flex flex-col">
                        <RecentActivity />
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <QuickActions />
                        <GISCoverageMap />
                    </div>
                </div>
            </div>
        </DashboardChildrenLayout>
    )
}

export default DashboardPage