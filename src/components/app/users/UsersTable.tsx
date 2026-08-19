"use client"
import React from 'react'
import { Search, Download, Plus, Eye, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { Button } from '@/components/ui/button'
import type { User } from '@/interfaces/user.interface'
import type { Pagination } from '@/redux/api/api-response.interface'
import formatDate from '@/utils/formatDate'

interface UsersTableProps {
  users: User[]
  isLoading?: boolean
  isFetching?: boolean
  pagination?: Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  genderFilter: string
  setGenderFilter: (gender: string) => void
  onOpenAddModal: () => void
  onViewDetails: (user: User) => void
  onOpenEdit: (user: User) => void
}

const statusOptions = ['All', 'ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED', 'DELETED']
const roleOptions = ['All', 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'FIELD_AGENT', 'SURVEYOR']
const genderOptions = ['All', 'MALE', 'FEMALE', 'NOT_SPECIFIED']

const getInitials = (name?: string | null) => {
  if (!name) return 'US'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getRoleBadgeClass = (roles?: string[] | null) => {
  const primaryRole = roles?.[0] || 'USER'
  switch (primaryRole) {
    case 'SUPER_ADMIN':
      return 'bg-slate-900 text-white border-transparent'
    case 'ADMIN':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'SURVEYOR':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200'
    case 'FIELD_AGENT':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'SUPERVISOR':
      return 'bg-teal-50 text-teal-600 border-teal-200'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const getStatusBadgeClass = (status?: string | null) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200'
    case 'SUSPENDED':
      return 'bg-rose-50 text-rose-600 border-rose-200'
    case 'LOCKED':
      return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'INACTIVE':
      return 'bg-slate-100 text-slate-500 border-slate-200'
    case 'DELETED':
      return 'bg-slate-200 text-slate-600 border-slate-300'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const UsersTable = ({
  users,
  isLoading,
  isFetching,
  pagination,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  genderFilter,
  setGenderFilter,
  onOpenAddModal,
  onViewDetails,
  onOpenEdit,
}: UsersTableProps) => {
  const totalEntries = pagination?.total || users.length
  const totalPages = pagination?.totalPages || 1
  const pageSize = pagination?.limit || 20

  const handleExport = () => {
    const headers = 'ID,Slug,Name,Email,Phone,Gender,Roles,Status,Created\n'
    const rows = users
      .map(
        (u) =>
          `"${u.id}","${u.slug || ''}","${u.name || ''}","${u.email || u.publicEmail || ''}","${
            u.phone || u.publicPhone || ''
          }","${u.gender || ''}","${(u.roles || []).join('; ')}","${u.status}","${u.createdAt || ''}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between">
      <div>
        {/* Search & Filters Action Bar */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            {/* Status Dropdown */}
            <CustomFilterDropdown
              label="All Statuses"
              header="Filter Status"
              options={statusOptions}
              selected={statusFilter}
              onSelect={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* Role Dropdown */}
            <CustomFilterDropdown
              label="All Roles"
              header="Filter Role"
              options={roleOptions}
              selected={roleFilter}
              onSelect={(val) => {
                setRoleFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* Gender Dropdown */}
            <CustomFilterDropdown
              label="All Genders"
              header="Filter Gender"
              options={genderOptions}
              selected={genderFilter}
              onSelect={(val) => {
                setGenderFilter(val)
                setCurrentPage(1)
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Export</span>
            </button>

            <Button type="button" onClick={onOpenAddModal} className="w-auto">
              <Plus className="w-4.5 h-4.5" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        {/* Main Users List Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">NAME</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PHONE</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">EMAIL</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">ROLE</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">GENDER</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CREATED</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm font-semibold text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((usr) => {
                  const initials = getInitials(usr.name)
                  const displayRoles = usr.roles?.length ? usr.roles.join(', ') : 'USER'
                  const displayPhone = usr.phone || usr.publicPhone || 'N/A'
                  const displayEmail = usr.email || usr.publicEmail || 'N/A'
                  const displayGender = usr.gender ? usr.gender.replace('_', ' ') : 'N/A'

                  return (
                    <tr key={usr.id} className="hover:bg-slate-50/20 transition-colors">
                      {/* Name with avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {usr.profilePicture?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={usr.profilePicture.url}
                              alt={usr.name || 'User avatar'}
                              className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-button-color font-extrabold text-xs flex items-center justify-center shrink-0 uppercase shadow-sm">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-700">{usr.name || 'N/A'}</div>
                            {usr.slug && (
                              <div className="text-[11px] text-slate-400 font-mono">{usr.slug}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-500 font-mono tracking-wide">
                        {displayPhone}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                        {displayEmail}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap uppercase tracking-wider select-none',
                            getRoleBadgeClass(usr.roles)
                          )}
                        >
                          {displayRoles}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                        {displayGender}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap uppercase tracking-wider select-none',
                            getStatusBadgeClass(usr.status)
                          )}
                        >
                          {usr.status}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                        {formatDate(usr?.createdAt)}
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
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                    No users found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
        isLoading={isFetching || isLoading}
      />
    </div>
  )
}

export default UsersTable