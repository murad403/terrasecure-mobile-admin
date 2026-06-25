"use client"
import React from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Settings,
  ShieldCheck,
  FileText,
  Clipboard,
  Info,
  Bell,
  Shield,
  Database,
} from 'lucide-react'

const settingsMenu = [
  {
    name: 'General',
    path: '/settings',
    icon: <Settings size={14} />,
  },
  {
    name: 'Roles & Permissions',
    path: '/settings/roles-permissions',
    icon: <ShieldCheck size={14} />,
  },
  {
    name: 'Privacy Policy',
    path: '/settings/privacy-policy',
    icon: <FileText size={14} />,
  },
  {
    name: 'Terms & Conditions',
    path: '/settings/terms-conditions',
    icon: <Clipboard size={14} />,
  },
  {
    name: 'About Us',
    path: '/settings/about-us',
    icon: <Info size={14} />,
  },
  {
    name: 'Notifications',
    path: '/settings/notifications',
    icon: <Bell size={14} />,
  },
  {
    name: 'Security',
    path: '/settings/security',
    icon: <Shield size={14} />,
  },
  {
    name: 'Backup & Restore',
    path: '/settings/backup-restore',
    icon: <Database size={14} />,
  },
]

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <DashboardChildrenLayout
      title="Settings"
      subtitle="Platform configuration and preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm space-y-0.5 shrink-0">
          {settingsMenu.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border-l-2 ${
                  isActive
                    ? 'bg-[#f0fdf4] text-[#1b4332] border-[#1b4332]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#1b4332]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </aside>

        {/* Dynamic Route Content */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </DashboardChildrenLayout>
  )
}

export default SettingsLayout