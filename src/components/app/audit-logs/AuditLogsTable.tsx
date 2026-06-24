"use client"
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  role: 'Super Admin' | 'Admin' | 'Supervisor' | 'Surveyor' | 'Field Agent'
  action: 'Publication' | 'Status Change' | 'Document Approval' | 'Login' | 'User Change' | 'Parcel Update' | 'Deletion'
  description: string
  ipAddress: string
  target?: string
}

interface AuditLogsTableProps {
  logs: AuditLog[]
  onViewDetails: (log: AuditLog) => void
  isDetailOpen: boolean
}

const AuditLogsTable = ({
  logs,
  onViewDetails,
  isDetailOpen
}: AuditLogsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilter, setUserFilter] = useState('All Users')
  const [actionFilter, setActionFilter] = useState('Action Type')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, userFilter, actionFilter, dateFilter])

  // Filtering Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target && log.target.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesUser = userFilter === 'All Users' || log.user === userFilter
    const matchesAction = actionFilter === 'Action Type' || log.action === actionFilter

    return matchesSearch && matchesUser && matchesAction
  })

  // Pagination calculations
  const totalEntries = filteredLogs.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Get unique users list for filter
  const userOptions = ['All Users', ...Array.from(new Set(logs.map(l => l.user)))]
  const actionOptions = ['Action Type', 'Publication', 'Status Change', 'Document Approval', 'Login', 'User Change', 'Parcel Update', 'Deletion']

  // Helpers for user avatar initials and color styling
  const getUserStyle = (role: AuditLog['role']) => {
    switch (role) {
      case 'Super Admin':
        return {
          avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-slate-800 text-white border-transparent'
        }
      case 'Admin':
        return {
          avatarBg: 'bg-green-100 text-green-800 border-green-205',
          badgeBg: 'bg-emerald-800 text-white border-transparent'
        }
      case 'Supervisor':
        return {
          avatarBg: 'bg-cyan-150 text-cyan-800 border-cyan-200',
          badgeBg: 'bg-emerald-700 text-white border-transparent'
        }
      case 'Surveyor':
        return {
          avatarBg: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeBg: 'bg-blue-600 text-white border-transparent'
        }
      case 'Field Agent':
        return {
          avatarBg: 'bg-orange-100 text-orange-850 border-orange-200',
          badgeBg: 'bg-orange-500 text-white border-transparent'
        }
      default:
        return {
          avatarBg: 'bg-slate-100 text-slate-700 border-slate-200',
          badgeBg: 'bg-slate-500 text-white border-transparent'
        }
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase()
  }

  // Helpers for Action Badge styling
  const getActionBadgeColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'Publication':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'Status Change':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'Document Approval':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'Login':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'User Change':
        return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'Parcel Update':
        return 'bg-teal-50 text-teal-600 border-teal-200'
      case 'Deletion':
        return 'bg-rose-50 text-rose-600 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Users Dropdown */}
          <CustomFilterDropdown
            label="All Users"
            header="All Users"
            options={userOptions}
            selected={userFilter}
            onSelect={setUserFilter}
          />

          {/* Action Type Dropdown */}
          <CustomFilterDropdown
            label="Action Type"
            header="Action Types"
            options={actionOptions}
            selected={actionFilter}
            onSelect={setActionFilter}
          />

          {/* Date Range Dropdown */}
          <CustomFilterDropdown
            label="Date Range"
            header="Date Range"
            options={['Date Range', 'Today', 'This Week', 'This Month']}
            selected={dateFilter}
            onSelect={setDateFilter}
          />
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TIMESTAMP</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">USER</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ACTION</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DESCRIPTION</th>
              {!isDetailOpen && (
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">IP ADDRESS</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => {
                const style = getUserStyle(log.role)
                return (
                  <tr
                    key={log.id}
                    onClick={() => onViewDetails(log)}
                    className="hover:bg-slate-50/30 transition-colors cursor-pointer"
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* User */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border shadow-sm",
                          style.avatarBg
                        )}>
                          {getInitials(log.user)}
                        </div>
                        {/* Name */}
                        <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                          {log.user}
                        </span>
                        {/* Role Badge */}
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-extrabold whitespace-nowrap uppercase tracking-wider",
                          style.badgeBg
                        )}>
                          {log.role}
                        </span>
                      </div>
                    </td>

                    {/* Action Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-block w-fit whitespace-nowrap shadow-sm uppercase tracking-wide",
                        getActionBadgeColor(log.action)
                      )}>
                        {log.action}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-600 leading-relaxed">
                      {log.description}
                    </td>

                    {/* IP Address */}
                    {!isDetailOpen && (
                      <td className="py-4 px-5 text-sm font-semibold text-slate-550 font-mono">
                        {log.ipAddress}
                      </td>
                    )}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={isDetailOpen ? 4 : 5} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No audit logs found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
      />
    </div>
  )
}

export default AuditLogsTable