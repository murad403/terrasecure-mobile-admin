"use client"
import React from "react"
import { Filter, Clock } from "lucide-react"
import { FunnelData, SlaData } from "@/redux/features/dashboard/dashboard.type"

interface FunnelsAndSlaSectionProps {
  funnel?: FunnelData;
  sla?: SlaData;
}

export const FunnelsAndSlaSection: React.FC<FunnelsAndSlaSectionProps> = ({ funnel, sla }) => {
  if (!funnel && !sla) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
      {/* SLA Performance Card */}
      {sla && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  SLA & Resolution Operational Health
                </h3>
                <p className="text-xs text-slate-500">
                  Target response standards vs active breaches
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Investigations SLA */}
            <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 truncate">Investigations</span>
                <span className="text-[10px] font-semibold text-slate-500 shrink-0 bg-slate-200/60 px-1.5 py-0.5 rounded">
                  Target: {sla.investigations.target_hours}h
                </span>
              </div>
              <div className="flex items-center justify-between text-xs gap-1 pt-0.5">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-base font-extrabold text-rose-600">
                    {sla.investigations.breached}
                  </span>
                  <span className="text-[11px] text-slate-500">Breached</span>
                </div>
                <div className="flex items-baseline gap-1 text-emerald-600 font-semibold text-[11px] shrink-0">
                  <span>{sla.investigations.on_track}</span>
                  <span>On Track</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full"
                  style={{
                    width: `${
                      sla.investigations.breached + sla.investigations.on_track > 0
                        ? (sla.investigations.breached /
                            (sla.investigations.breached + sla.investigations.on_track)) *
                          100
                        : 50
                    }%`,
                  }}
                />
                <div className="bg-emerald-500 h-full flex-1" />
              </div>
            </div>

            {/* Site Visits SLA */}
            <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 truncate">Site Visits</span>
                <span className="text-[10px] font-semibold text-slate-500 shrink-0 bg-slate-200/60 px-1.5 py-0.5 rounded">
                  Target: {sla.site_visits.target_hours}h
                </span>
              </div>
              <div className="flex items-center justify-between text-xs gap-1 pt-0.5">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-base font-extrabold text-amber-600">
                    {sla.site_visits.breached}
                  </span>
                  <span className="text-[11px] text-slate-500">Breached</span>
                </div>
                <div className="flex items-baseline gap-1 text-emerald-600 font-semibold text-[11px] shrink-0">
                  <span>{sla.site_visits.on_track}</span>
                  <span>On Track</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${
                      sla.site_visits.breached + sla.site_visits.on_track > 0
                        ? (sla.site_visits.breached /
                            (sla.site_visits.breached + sla.site_visits.on_track)) *
                          100
                        : 20
                    }%`,
                  }}
                />
                <div className="bg-emerald-500 h-full flex-1" />
              </div>
            </div>

            {/* Registrations SLA */}
            <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 truncate">Registrations</span>
                <span className="text-[10px] font-semibold text-slate-500 shrink-0 bg-slate-200/60 px-1.5 py-0.5 rounded">
                  Target: {sla.registrations.target_hours}h
                </span>
              </div>
              <div className="flex items-center justify-between text-xs gap-1 pt-0.5">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-base font-extrabold text-slate-800">
                    {sla.registrations.breached}
                  </span>
                  <span className="text-[11px] text-slate-500">Breached</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 shrink-0">
                  100% Compliance
                </div>
              </div>
            </div>

            {/* Land Requests SLA */}
            <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 truncate">Land Requests</span>
                <span className="text-[10px] font-semibold text-slate-500 shrink-0 bg-slate-200/60 px-1.5 py-0.5 rounded">
                  Target: {sla.land_requests.target_hours}h
                </span>
              </div>
              <div className="flex items-center justify-between text-xs gap-1 pt-0.5">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-base font-extrabold text-emerald-600">
                    {sla.land_requests.breached}
                  </span>
                  <span className="text-[11px] text-slate-500">Breached</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 shrink-0">
                  Optimal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Funnel Card */}
      {funnel?.registration && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {funnel.registration.label}
                </h3>
                <p className="text-xs text-slate-500">
                  Conversion & Drop-off stage analytics
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {funnel.registration.steps.map((step, idx) => (
              <div
                key={step.key}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800 truncate">{step.label}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold text-slate-900">{step.value}</span>
                  {step.dropOffPct !== null ? (
                    <span className="text-[10px] font-bold text-slate-400">
                      {step.dropOffPct}% drop
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Entry</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelsAndSlaSection;
