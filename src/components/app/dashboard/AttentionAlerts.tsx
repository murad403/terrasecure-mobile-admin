"use client"
import React from "react"
import { AlertTriangle, Info, ShieldAlert, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { AttentionData } from "@/redux/features/dashboard/dashboard.type"
import { cn } from "@/lib/utils"

interface AttentionAlertsProps {
  attention?: AttentionData;
}

export const AttentionAlerts: React.FC<AttentionAlertsProps> = ({ attention }) => {
  if (!attention || !attention.items || attention.items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Attention Required
          </h2>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
            {attention.summary.total} Action Items
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          {attention.summary.critical > 0 && (
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {attention.summary.critical} Critical
            </span>
          )}
          {attention.summary.info > 0 && (
            <span className="text-slate-600">
              {attention.summary.info} Info
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attention.items.map((item) => {
          const isCritical = item.severity === "critical";
          const isWarning = item.severity === "warning";

          return (
            <div
              key={item.id}
              className={cn(
                "relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md",
                isCritical
                  ? "bg-rose-50/60 border-rose-200/80 text-rose-950"
                  : isWarning
                  ? "bg-amber-50/60 border-amber-200/80 text-amber-950"
                  : "bg-blue-50/60 border-blue-200/80 text-slate-900"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0 mt-0.5",
                    isCritical
                      ? "bg-rose-500 text-white"
                      : isWarning
                      ? "bg-amber-500 text-white"
                      : "bg-blue-500 text-white"
                  )}
                >
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm tracking-tight text-slate-900 truncate">
                      {item.title}
                    </h3>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md shrink-0",
                        isCritical
                          ? "bg-rose-100 text-rose-800"
                          : isWarning
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {item.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                {item.actionHref && (
                  <Link
                    href={item.actionHref}
                    className={cn(
                      "inline-flex items-center gap-1 font-semibold text-xs transition-colors hover:underline",
                      isCritical
                        ? "text-rose-700 hover:text-rose-900"
                        : "text-blue-700 hover:text-blue-900"
                    )}
                  >
                    <span>{item.actionLabel || "Take Action"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttentionAlerts;
