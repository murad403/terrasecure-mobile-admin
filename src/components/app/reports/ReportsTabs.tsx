"use client"
import React from 'react'
import { CreditCard, Map, Users, MapPin, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportsTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TABS = [
  {
    id: 'revenue',
    label: 'Revenue Monitoring',
    icon: CreditCard,
    color: 'text-amber-500',
    borderColor: 'border-amber-500 bg-amber-50/10'
  },
  {
    id: 'registration',
    label: 'Land Registration',
    icon: Map,
    color: 'text-emerald-600',
    borderColor: 'border-emerald-600 bg-emerald-50/10'
  },
  {
    id: 'requests',
    label: 'User Request Monitoring',
    icon: Users,
    color: 'text-purple-600',
    borderColor: 'border-purple-600 bg-purple-50/10'
  },
  {
    id: 'gps',
    label: 'GPS Search Monitoring',
    icon: MapPin,
    color: 'text-blue-600',
    borderColor: 'border-blue-600 bg-blue-50/10'
  },
  {
    id: 'investigations',
    label: 'Investigations',
    icon: Activity,
    color: 'text-rose-600',
    borderColor: 'border-rose-600 bg-rose-50/10'
  }
]

const ReportsTabs = ({ activeTab, setActiveTab }: ReportsTabsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white shadow-sm hover:shadow-md hover:scale-[1.01] duration-150",
              isActive
                ? cn("border-2", tab.borderColor)
                : "border-slate-100 hover:border-slate-200"
            )}
          >
            <div className={cn("p-2 rounded-xl bg-slate-50 mb-3", isActive && "bg-white")}>
              <Icon className={cn("w-5 h-5", tab.color)} />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none">
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ReportsTabs