"use client"
import React from "react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, PieChart as PieIcon, Map } from "lucide-react"
import { DashboardTrends, DashboardBreakdowns } from "@/redux/features/dashboard/dashboard.type"

interface TrendsAndBreakdownsProps {
  trends?: DashboardTrends;
  breakdowns?: DashboardBreakdowns;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

export const TrendsAndBreakdownsSection: React.FC<TrendsAndBreakdownsProps> = ({
  trends,
  breakdowns,
}) => {
  if (!trends && !breakdowns) return null;

  // Format trend data for registrations chart
  const registrationTrendData = trends?.series?.registrations?.map((item) => ({
    date: new Date(item.t).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Submitted: item.submitted,
    Approved: item.approved,
    InReview: item.inReview,
    Rejected: item.rejected,
  })) || [];

  // Breakdowns Data
  const requestsKindData = breakdowns?.requestsByKind?.map((b) => ({
    name: b.key.replace(/_/g, " "),
    count: b.value,
  })) || [];

  const parcelStatusData = breakdowns?.parcelsByStatus?.map((b) => ({
    name: b.key,
    value: b.value,
  })) || [];

  const regionData = breakdowns?.parcelsByRegion?.map((b) => ({
    region: b.key,
    count: b.value,
    reliability: b.avgReliability,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        {/* Trend Area Chart (2 cols on xl) */}
        <div className="xl:col-span-2 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Land Registration & Application Dynamics ({trends?.period || "7d"})
                </h3>
                <p className="text-xs text-slate-500">
                  Daily submissions, reviews & final approvals
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="Submitted" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSubmitted)" />
                <Area type="monotone" dataKey="Approved" stroke="#10B981" fillOpacity={1} fill="url(#colorApproved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Kind Bar Chart (1 col on xl) */}
        <div className="xl:col-span-1 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <PieIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Requests by Kind</h3>
                <p className="text-xs text-slate-500">Distribution across modules</p>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsKindData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#334155" }} width={115} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional & Status Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {/* Parcels by Region */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="font-bold text-sm text-slate-900">Parcels by Region & Reliability</h3>
          </div>
          <div className="space-y-2">
            {regionData.length > 0 ? (
              regionData.map((reg) => (
                <div
                  key={reg.region}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="font-bold text-slate-800">{reg.region}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-medium">{reg.count} parcels</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {reg.reliability}% score
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No regional breakdown recorded.</p>
            )}
          </div>
        </div>

        {/* Parcels by Status */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-bold text-sm text-slate-900">Parcels by Status</h3>
          </div>
          <div className="space-y-2">
            {parcelStatusData.length > 0 ? (
              parcelStatusData.map((st, i) => (
                <div
                  key={st.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="font-bold text-slate-800">{st.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{st.value}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No parcel status breakdown.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsAndBreakdownsSection;
