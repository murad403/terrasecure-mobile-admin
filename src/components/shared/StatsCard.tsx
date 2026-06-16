"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  trend: string
  isPositive: boolean
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

const StatsCard = ({
  title,
  value,
  trend,
  isPositive,
  icon: Icon,
  iconBg,
  iconColor
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[120px]">
      {/* Top section: Icon & Trend badge */}
      <div className="flex items-center justify-between">
        {/* Circular Icon background */}
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Trend Pill */}
        <span
          className={cn(
            "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide",
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trend}</span>
        </span>
      </div>

      {/* Bottom section: Value & Description */}
      <div className="mt-3">
        <h3 className="text-xl md:text-2xl font-bold text-title tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-xs text-subtitle mt-1.5 font-medium tracking-wide">
          {title}
        </p>
      </div>
    </div>
  )
}

export default StatsCard