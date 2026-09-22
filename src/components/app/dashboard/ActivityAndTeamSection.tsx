"use client"
import React from "react"
import { History, UserCheck, Shield, FileText, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { ActivityItem, TeamWorkload } from "@/redux/features/dashboard/dashboard.type"

interface ActivityAndTeamSectionProps {
  activities?: ActivityItem[];
  workload?: TeamWorkload[];
}

export const ActivityAndTeamSection: React.FC<ActivityAndTeamSectionProps> = ({
  activities,
  workload,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Timeline (2 cols) */}
      <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent System Activity</h3>
              <p className="text-xs text-slate-500">Live platform operations and audits</p>
            </div>
          </div>
          <Link
            href="/audit-logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 pt-1">
          {activities && activities.length > 0 ? (
            activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100 text-xs transition-colors hover:bg-slate-100/60"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                    {act.actor.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{act.actor.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-slate-600 truncate">
                      {act.kind.replace(/_/g, " ")}:{" "}
                      <span className="font-semibold text-slate-800">
                        {act.target.label || act.target.id}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                  {new Date(act.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No recent activities.</p>
          )}
        </div>
      </div>

      {/* Admin Team Workload (1 col) */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Admin Workload</h3>
            <p className="text-xs text-slate-500">Active tasks per administrator</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {workload && workload.length > 0 ? (
            workload.map((user) => (
              <div
                key={user.userId}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-900">{user.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/60 text-[10px] text-slate-600">
                  <div>
                    Regs: <span className="font-bold">{user.openRegistrations}</span>
                  </div>
                  <div>
                    Conflicts: <span className="font-bold">{user.openConflicts}</span>
                  </div>
                  <div>
                    Invs: <span className="font-bold">{user.openInvestigations}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No team members active.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityAndTeamSection;
