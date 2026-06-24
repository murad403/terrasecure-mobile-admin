"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Download, Plus, Eye, Pencil, UserRound, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import { type UserRecord } from './UsersPage'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'

interface UsersTableProps {
  users: UserRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onOpenAddModal: () => void
  onViewDetails: (user: UserRecord) => void
  onOpenEdit: (user: UserRecord) => void
  onToggleStatus: (id: string) => void
  onDeleteUser: (id: string) => void
}

// Custom Dropdown Component matching Registrations/Parcels Page style


const getInitials = (name: string) => {
  if (name === 'Paul Biya Jr') return 'PIJ'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getAvatarBg = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return 'bg-[#263238] text-[#90a4ae]'
    case 'Admin':
      return 'bg-blue-50 text-blue-600'
    case 'Surveyor':
      return 'bg-[#e8eaf6] text-[#3f51b5]'
    case 'Field Agent':
      return 'bg-amber-50 text-amber-600'
    case 'Supervisor':
      return 'bg-teal-50 text-teal-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return 'bg-slate-900 text-white border-transparent'
    case 'Admin':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'Surveyor':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200'
    case 'Field Agent':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'Supervisor':
      return 'bg-teal-50 text-teal-600 border-teal-200'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const UsersTable = ({
  users,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onOpenAddModal,
  onViewDetails,
  onOpenEdit,
  onToggleStatus,
  onDeleteUser
}: UsersTableProps) => {
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter, statusFilter, dateFilter])

  // Pagination calculations
  const totalEntries = users.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleExport = () => {
    // Generate simple csv file and trigger download
    const headers = 'ID,Name,Phone,Email,Role,Status,Created\n'
    const rows = users
      .map((u) => `"${u.id}","${u.fullName}","${u.phone}","${u.email}","${u.role}","${u.status}","${u.createdDate}"`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Role Dropdown */}
          <CustomFilterDropdown
            label="All Roles"
            header="All Roles"
            options={['All Roles', 'Super Admin', 'Admin', 'Surveyor', 'Field Agent', 'Supervisor', 'Client']}
            selected={roleFilter}
            onSelect={setRoleFilter}
          />

          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="All Statuses"
            options={['All Statuses', 'Active', 'Suspended']}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />

          {/* Date Range Dropdown */}
          <CustomFilterDropdown
            label="Date Range"
            header="Date Range"
            options={['Date Range', 'Today', 'This Week', 'This Month', 'Custom Range']}
            selected={dateFilter}
            onSelect={setDateFilter}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-button-color hover:bg-button-color/90 text-white rounded-lg transition-all cursor-pointer shadow-sm border border-transparent"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Main Users List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">NAME</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PHONE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">EMAIL</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ROLE</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CREATED</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((usr) => {
                const initials = getInitials(usr.fullName)
                const avatarBg = getAvatarBg(usr.role)

                return (
                  <tr key={usr.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Name with initials badge */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 select-none shadow-sm uppercase tracking-wide",
                          avatarBg
                        )}>
                          {initials}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{usr.fullName}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-500 font-mono tracking-wide">
                      {usr.phone}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                      {usr.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap uppercase tracking-wider select-none",
                        getRoleBadgeClass(usr.role)
                      )}>
                        {usr.role}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap",
                        usr.status === 'Active' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                        usr.status === 'Suspended' && 'bg-rose-50 text-rose-600 border-rose-200'
                      )}>
                        {usr.status}
                      </span>
                    </td>

                    {/* Created date */}
                    <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                      {usr.createdDate}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetails(usr)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEdit(usr)}
                          className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(usr.id)}
                          className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50/50 transition-colors cursor-pointer"
                          title={usr.status === 'Active' ? 'Suspend User' : 'Activate User'}
                        >
                          <UserRound className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete user ${usr.fullName}?`)) {
                              onDeleteUser(usr.id)
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No users found matching your filter criteria.
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

export default UsersTable