"use client"
import React from 'react'
import StatsCard from '@/components/shared/StatsCard'
import {
  Map,
  Users,
  Shield,
  MessageSquare,
  Globe,
  AlertTriangle,
  Bookmark,
  TrendingUp
} from 'lucide-react'

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Parcels',
      value: '12,847',
      trend: '8.2%',
      isPositive: true,
      icon: Map,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500'
    },
    {
      title: 'Total Users',
      value: '3,241',
      trend: '12.5%',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500'
    },
    {
      title: 'Active Investigations',
      value: '47',
      trend: '+3',
      isPositive: false, // Red indicator for warning
      icon: Shield,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500'
    },
    {
      title: 'Active Consultations',
      value: '128',
      trend: '22%',
      isPositive: true,
      icon: MessageSquare,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Published Lands',
      value: '8,932',
      trend: '5.1%',
      isPositive: true,
      icon: Globe,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500'
    },
    {
      title: 'Disputed Lands',
      value: '213',
      trend: '-4.3%',
      isPositive: true, // Green since disputed lands decreasing is good!
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500'
    },
    {
      title: 'Reserved Lands',
      value: '1,047',
      trend: '11%',
      isPositive: true,
      icon: Bookmark,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      title: 'Sold Lands',
      value: '2,655',
      trend: '18%',
      isPositive: true,
      icon: TrendingUp,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          isPositive={stat.isPositive}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  )
}

export default DashboardStats