"use client"
import React, { useState } from 'react'
import AdminSidebar from '@/components/shared/AdminSidebar'
import AdminTopbar from '@/components/shared/AdminTopbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Sidebar navigation */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main application panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar search and actions */}
        <AdminTopbar setMobileOpen={setMobileOpen} />

        {/* Dynamic page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout