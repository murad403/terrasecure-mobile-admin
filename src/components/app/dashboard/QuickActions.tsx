"use client"
import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
    {
        name: 'New Registration',
        bgClass: 'bg-[#4A89F3] hover:bg-[#4A89F3]/90 text-white',
        onClick: () => alert('New Registration Action')
    },
    {
        name: 'New Investigation',
        bgClass: 'bg-[#B91C1C] hover:bg-[#B91C1C]/90 text-white',
        onClick: () => alert('New Investigation Action')
    },
    {
        name: 'View Conflicts',
        bgClass: 'bg-[#EA580C] hover:bg-[#EA580C]/90 text-white',
        onClick: () => alert('View Conflicts Action')
    },
    {
        name: 'Generate Report',
        bgClass: 'bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white',
        onClick: () => alert('Generate Report Action')
    }
]

const QuickActions = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[270px] w-full">
            {/* Title */}
            <div className="border-b border-slate-50 pb-2 mb-3">
                <span className="font-semibold text-title text-sm">Quick Actions</span>
            </div>

            {/* Action Buttons list */}
            <div className="flex-1 flex flex-col justify-between gap-2">
                {actions.map((act) => (
                    <button
                        key={act.name}
                        onClick={act.onClick}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm active:translate-y-px",
                            act.bgClass
                        )}
                    >
                        <span>{act.name}</span>
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default QuickActions