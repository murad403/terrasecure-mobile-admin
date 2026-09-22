"use client"
import React from "react"
import { History, UserCheck, User } from "lucide-react"
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
      {/* Activity Timeline (2 cols on xl) */}
      <div className="xl:col-span-2 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent System Activity</h3>
              <p className="text-xs text-slate-500">Live platform operations and audits</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
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
                    <div className="flex items-center gap-2 flex-wrap">
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

      {/* Admin Team Workload (1 col on xl) */}
      <div className="xl:col-span-1 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
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
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-bold text-slate-900 truncate">{user.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/60 text-center">
                  <div className="bg-white/80 p-1.5 rounded border border-slate-200/60">
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Regs</span>
                    <span className="font-extrabold text-slate-800 text-xs">{user.openRegistrations}</span>
                  </div>
                  <div className="bg-white/80 p-1.5 rounded border border-slate-200/60">
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Conflicts</span>
                    <span className="font-extrabold text-slate-800 text-xs">{user.openConflicts}</span>
                  </div>
                  <div className="bg-white/80 p-1.5 rounded border border-slate-200/60">
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Invs</span>
                    <span className="font-extrabold text-slate-800 text-xs">{user.openInvestigations}</span>
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
