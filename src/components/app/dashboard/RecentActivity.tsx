"use client"
import { FileText, Check, AlertTriangle, MessageSquare, Radio, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'


const activities = [
    {
        id: 1,
        title: 'Registration REG-1203 submitted for Parcel CM-3847',
        time: '2 min ago',
        icon: FileText,
        bgClass: 'bg-amber-50',
        colorClass: 'text-amber-500'
    },
    {
        id: 2,
        title: 'Parcel CM-2109 published by Admin Jean Alima',
        time: '15 min ago',
        icon: Check,
        bgClass: 'bg-emerald-50',
        colorClass: 'text-emerald-500'
    },
    {
        id: 3,
        title: 'Boundary conflict: CM-1847 ⇄ CM-1848 detected',
        time: '28 min ago',
        icon: AlertTriangle,
        bgClass: 'bg-rose-50',
        colorClass: 'text-rose-500'
    },
    {
        id: 4,
        title: 'Consultation request from Marie Nkodo — CM-4021',
        time: '1h ago',
        icon: MessageSquare,
        bgClass: 'bg-purple-50',
        colorClass: 'text-purple-500'
    },
    {
        id: 5,
        title: 'QField data received — Surveyor Paul Biya · 24 pts',
        time: '2h ago',
        icon: Radio,
        bgClass: 'bg-sky-50',
        colorClass: 'text-sky-500'
    },
    {
        id: 6,
        title: 'Payment 450,000 XAF received — REG-1192',
        time: '3h ago',
        icon: CreditCard,
        bgClass: 'bg-yellow-50',
        colorClass: 'text-yellow-600'
    }
]

const RecentActivity = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[440px] w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
                <span className="font-semibold text-title text-sm">Recent Activity</span>
                <button
                    onClick={() => alert('View all activities')}
                    className="text-xs text-button-color hover:underline font-semibold"
                >
                    View all
                </button>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2 scrollbar-thin">
                {activities.map((act) => {
                    const Icon = act.icon
                    return (
                        <div key={act.id} className="flex items-start gap-3.5">
                            {/* Icon */}
                            <div className={cn("w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 shadow-sm", act.bgClass, act.colorClass)}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 leading-tight">
                                <p className="text-xs font-semibold text-slate-700 leading-normal">
                                    {act.title}
                                </p>
                                <span className="text-[10px] text-subtitle mt-1 block">
                                    {act.time}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RecentActivity