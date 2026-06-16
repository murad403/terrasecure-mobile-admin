"use client"
import React from 'react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'

const data = [
    { month: 'Jan', revenue: 4.5 },
    { month: 'Feb', revenue: 5.0 },
    { month: 'Mar', revenue: 6.2 },
    { month: 'Apr', revenue: 5.8 },
    { month: 'May', revenue: 6.5 },
    { month: 'Jun', revenue: 7.5 },
    { month: 'Jul', revenue: 8.0 },
    { month: 'Aug', revenue: 7.0 }
]

const RevenueOverviewChart = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[380px] w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
                <span className="font-semibold text-title text-sm">Revenue Overview</span>
                <span className="text-[11px] text-subtitle font-medium">in Millions XAF</span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="flex-1 w-full h-[260px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        barSize={20}
                    >
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 10 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 10 }}
                            domain={[0, 12]}
                            ticks={[0, 3, 6, 9, 12]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E293B',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '11px'
                            }}
                            formatter={(value) => [`${value}M XAF`, 'Revenue']}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#EAB308" // Gold/Yellow hex code
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default RevenueOverviewChart