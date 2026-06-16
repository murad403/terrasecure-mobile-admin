"use client"
import React from 'react'

type TProps = {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const DashboardChildrenLayout = ({ children, title, subtitle }: TProps) => {
  return (
    <section className='p-4 md:p-6 lg:p-8'>
        {/* Header */}
        <div className="mb-6">
            <h1 className='text-2xl font-bold text-title tracking-tight'>{title}</h1>
            <p className='text-subtitle text-xs md:text-sm mt-1 font-light'>{subtitle}</p>
        </div>
        
        {/* Main content */}
        <main>
            {children}
        </main>
    </section>
  )
}

export default DashboardChildrenLayout