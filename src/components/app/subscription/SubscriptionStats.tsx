import React from 'react'
import { Info, RefreshCw } from 'lucide-react'

interface StatsProps {
  activePlans: string;
  activeFlags: string;
  activePayments: number;
  promoBannerVisible: string;
}

const SubscriptionStats = ({
  activePlans,
  activeFlags,
  activePayments,
  promoBannerVisible,
}: StatsProps) => {
  return (
    <div className="space-y-4">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Plans */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-xl md:text-2xl font-bold text-violet-600 tracking-tight">
              {activePlans}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Plans</p>
          </div>
        </div>

        {/* Card 2: Feature Flags On */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-xl md:text-2xl font-bold text-emerald-600 tracking-tight">
              {activeFlags}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feature Flags On</p>
          </div>
        </div>

        {/* Card 3: Payment Methods Active */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-xl md:text-2xl font-bold text-blue-600 tracking-tight">
              {activePayments}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Methods Active</p>
          </div>
        </div>

        {/* Card 4: Promo Banner */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-xl md:text-2xl font-bold text-amber-600 tracking-tight">
              {promoBannerVisible}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Banner</p>
          </div>
        </div>
      </div>

      {/* Info Alert Banner */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 px-4 flex items-center gap-2.5 text-xs text-blue-700 font-medium">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" style={{ animationDuration: '6s' }} />
        <span>
          All changes are applied <strong className="font-bold text-blue-800">instantly server-side</strong> — no app release required. <strong className="font-bold text-blue-800">Logged in Audit Logs</strong>.
        </span>
      </div>
    </div>
  )
}

export default SubscriptionStats