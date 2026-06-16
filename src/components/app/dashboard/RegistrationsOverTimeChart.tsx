"use client"
import React from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'

const data = [
    { month: 'Jan', registrations: 150 },
    { month: 'Feb', registrations: 170 },
    { month: 'Mar', registrations: 220 },
    { month: 'Apr', registrations: 230 },
    { month: 'May', registrations: 210 },
    { month: 'Jun', registrations: 260 },
    { month: 'Jul', registrations: 310 },
    { month: 'Aug', registrations: 290 },
    { month: 'Sep', registrations: 335 },
    { month: 'Oct', registrations: 310 },
    { month: 'Nov', registrations: 360 },
    { month: 'Dec', registrations: 395 }
]

const RegistrationsOverTimeChart = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[380px] w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
                <span className="font-semibold text-title text-sm">Registrations Over Time</span>
                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    2025
                </span>
            </div>

            {/* Recharts Line Chart */}
            <div className="flex-1 w-full h-[260px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                            domain={[0, 600]}
                            ticks={[0, 150, 300, 450, 600]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E293B',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '11px'
                            }}
                            formatter={(value) => [`${value} Registrations`, '']}
                        />
                        <Line
                            type="monotone"
                            dataKey="registrations"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 0 }}
                            activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default RegistrationsOverTimeChart