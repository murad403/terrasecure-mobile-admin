"use client"
import React from "react"
import {
  ShieldAlert,
  MapPin,
  ShoppingCart,
  FileSearch,
  ArrowRight,
  UserCheck,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { DashboardQueues } from "@/redux/features/dashboard/dashboard.type"
import { cn } from "@/lib/utils"

interface ActionQueuesSectionProps {
  queues?: DashboardQueues;
}

export const ActionQueuesSection: React.FC<ActionQueuesSectionProps> = ({ queues }) => {
  if (!queues) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">
        Operational Action Queues
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Queue 1: Unassigned Investigations */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-3">
              Unassigned Investigations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Requires field officer assignment
            </p>

            <div className="mt-3 space-y-2">
              {queues.unassignedInvestigations.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{item.slug}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                      {item.priorityLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>Parcel: {item.parcelCode}</span>
                    <span className="text-rose-600 font-medium">{item.ageDays}d old</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Queue 2: Pending Site Visits */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-3">
              Pending Site Visits
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Surveyor field visits pending audit
            </p>

            <div className="mt-3 space-y-2">
              {queues.pendingSiteVisits.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{item.slug}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 uppercase font-extrabold">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>Surveyor: {item.surveyorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Queue 3: Pending Purchase Interests */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-3">
              Purchase Interests
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Buyers interested in parcels
            </p>

            <div className="mt-3 space-y-2">
              {queues.pendingPurchaseInterests.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{item.slug}</span>
                    <span className="text-blue-700 font-extrabold">
                      ${item.offerAmount.amount}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Buyer: {item.buyerName} ({item.parcelCode})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Queue 4: Unverified Documents */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <FileSearch className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-3">
              Unverified Documents
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Title deeds & IDs pending verification
            </p>

            <div className="mt-3 space-y-2">
              {queues.unverifiedDocuments.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate max-w-30">{item.docType}</span>
                    <span className="text-[10px] text-slate-500">v{item.version}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    By: {item.uploadedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionQueuesSection;
