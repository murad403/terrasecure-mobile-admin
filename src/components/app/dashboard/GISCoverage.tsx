"use client"
import React from 'react'
import { cn } from '@/lib/utils'

const regions = [
    { name: 'Yaoundé', value: 78, colorClass: 'bg-blue-500', textClass: 'text-blue-600' },
    { name: 'Douala', value: 65, colorClass: 'bg-blue-500', textClass: 'text-blue-600' },
    { name: 'Bamenda', value: 42, colorClass: 'bg-amber-500', textClass: 'text-amber-600' },
    { name: 'Bafoussam', value: 58, colorClass: 'bg-amber-500', textClass: 'text-amber-600' },
    { name: 'Garoua', value: 31, colorClass: 'bg-slate-300', textClass: 'text-slate-500' },
    { name: 'Maroua', value: 24, colorClass: 'bg-slate-300', textClass: 'text-slate-500' }
]

const GISCoverage = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[380px] w-full">
            {/* Header */}
            <div className="border-b border-slate-50 pb-3 mb-2">
                <span className="font-semibold text-title text-sm">GIS Coverage</span>
            </div>

            {/* Progress Bars List */}
            <div className="flex-1 flex flex-col justify-around py-1">
                {regions.map((region) => (
                    <div key={region.name} className="space-y-1.5">
                        {/* Label and Value */}
                        <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-slate-700">{region.name}</span>
                            <span className={region.textClass}>{region.value}%</span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500", region.colorClass)}
                                style={{ width: `${region.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GISCoverage