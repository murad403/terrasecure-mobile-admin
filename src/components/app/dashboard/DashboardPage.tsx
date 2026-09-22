"use client"
import { useState } from "react"
import DashboardChildrenLayout from "@/components/shared/DashboardChildrenLayout"
import { useGetAdminOverviewQuery } from "@/redux/features/dashboard/dashboard.api"
import AttentionAlerts from "./AttentionAlerts"
import DashboardKpiCards from "./DashboardKpiCards"
import FunnelsAndSlaSection from "./FunnelsAndSlaSection"
import TrendsAndBreakdownsSection from "./TrendsAndBreakdownsSection"
import ActionQueuesSection from "./ActionQueuesSection"
import ActivityAndTeamSection from "./ActivityAndTeamSection"
import { RefreshCw, Calendar, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<string>("7d")
  const { data: response, isLoading, isFetching, error, refetch } = useGetAdminOverviewQuery({ timeRange })

  const overview = response?.data

  const timeRangeOptions = [
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "YTD", value: "ytd" },
    { label: "All Time", value: "all" },
  ]

  return (
    <DashboardChildrenLayout
      title="Admin Dashboard Overview"
      subtitle="Comprehensive land security operations, KPIs & real-time analytics"
    >
      <div className="space-y-6 pb-12">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Time Horizon Filter
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Comparing against previous period
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Time Range Selector */}
            <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 text-xs font-semibold">
              {timeRangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeRange(opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all cursor-pointer",
                    timeRange === opt.value
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Manual Refetch Button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Fetching admin overview metrics...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Failed to load dashboard overview</h4>
              <p className="text-xs text-rose-700">
                Please verify server connection or check your authentication token.
              </p>
            </div>
          </div>
        )}

        {/* Main Dashboard Sections */}
        {!isLoading && overview && (
          <>
            {/* Attention Required Alerts */}
            <AttentionAlerts attention={overview.attention} />

            {/* Executive KPIs Grid */}
            <DashboardKpiCards kpis={overview.kpis} />

            {/* Operational SLA & Funnel Section */}
            <FunnelsAndSlaSection funnel={overview.funnel} sla={overview.sla} />

            {/* Trends and Breakdowns (Recharts) */}
            <TrendsAndBreakdownsSection trends={overview.trends} breakdowns={overview.breakdowns} />

            {/* Action Queues */}
            <ActionQueuesSection queues={overview.queues} />

            {/* Activity Timeline and Team Workload */}
            <ActivityAndTeamSection
              activities={overview.activity?.items}
              workload={overview.team?.workload}
            />
          </>
        )}
      </div>
    </DashboardChildrenLayout>
  )
}

export default DashboardPage