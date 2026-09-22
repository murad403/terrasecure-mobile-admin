"use client"
import React from "react"
import {
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  UserX,
  CreditCard,
  MessageSquare,
  AlertCircle,
  FileCheck2,
} from "lucide-react"
import { DashboardKpis } from "@/redux/features/dashboard/dashboard.type"
import { cn } from "@/lib/utils"

interface DashboardKpiCardsProps {
  kpis?: DashboardKpis;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({ kpis }) => {
  if (!kpis) return null;

  const formatCurrency = (amountStr?: string, currency: string = "USD") => {
    if (!amountStr) return `${currency} 0.00`;
    const num = parseFloat(amountStr);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Executive KPIs & Metrics
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          Real-time Platform Snapshot
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Users & Activity */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Platform Users
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {kpis.users.total.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({kpis.users.new.value} new)
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">DAU</span>
              <span className="font-bold text-slate-800">{kpis.users.dau.value}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">WAU</span>
              <span className="font-bold text-slate-800">{kpis.users.wau.value}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Churn Risk</span>
              <span className="font-bold text-rose-600">{kpis.users.churnRisk.value}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Parcels & Reliability */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Land Parcels
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {kpis.parcels.total.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({kpis.parcels.listedForSale.value} listed)
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Avg Score:</span>
              <span className="font-bold text-slate-900">{kpis.parcels.avgReliability.value}%</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Median ${kpis.parcels.medianPricePerSqm.amount}/m²
            </div>
          </div>
        </div>

        {/* KPI 3: Revenue & Financial Volume */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              7D Revenue & Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {formatCurrency(kpis.money.revenue_7d.amount, kpis.money.revenue_7d.currency)}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Wallet Bal:</span>
            <span className="font-bold text-slate-800">
              {formatCurrency(kpis.money.totalWalletBalance.amount, kpis.money.totalWalletBalance.currency)}
            </span>
          </div>
        </div>

        {/* KPI 4: Quality & Dispute Rate */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dispute Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {kpis.quality.disputeRate.value}%
              </span>
              <span className="text-xs text-emerald-600 font-bold">
                Healthy
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Rejected Docs:</span>
            <span className="font-bold text-slate-800">
              {kpis.quality.rejectedDocs.value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKpiCards;
