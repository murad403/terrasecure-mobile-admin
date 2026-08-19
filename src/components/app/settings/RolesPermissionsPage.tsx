"use client"
import React, { useState, useMemo } from 'react'
import { Shield, Users, Search, Loader2, Check, UserCheck, Key, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import CustomPagination from '@/components/shared/CustomPagination'
import {
  useRetrievePermissionsQuery,
  useGetRolesWithPermissionsQuery,
  useGetUserListQuery,
  useSetUserRolesMutation,
  useGrantPermissionsMutation,
  useRevokePermissionsMutation,
} from '@/redux/features/user/user.api'
import type { RbacUserItem, PermissionItem } from '@/redux/features/user/user.type'

const ALL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'FIELD_AGENT', 'SURVEYOR', 'USER']

const RolesPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'users'>('matrix')

  // User Role Assignments Search & Pagination State
  const [userSearchQuery, setUserSearchQuery] = useState<string>('')
  const [userPage, setUserPage] = useState<number>(1)
  const [userLimit] = useState<number>(20)

  // API Queries
  const { data: permissionsRes, isLoading: loadingPerms } = useRetrievePermissionsQuery()
  const { data: rolesWithPermsRes, isLoading: loadingRoles } = useGetRolesWithPermissionsQuery()
  const {
    data: userListRes,
    isLoading: loadingUsers,
    isFetching: fetchingUsers,
  } = useGetUserListQuery({
    page: userPage,
    limit: userLimit,
    search: userSearchQuery.trim() || undefined,
  })

  // API Mutations
  const [grantPermissions, { isLoading: isGranting }] = useGrantPermissionsMutation()
  const [revokePermissions, { isLoading: isRevoking }] = useRevokePermissionsMutation()
  const [setUserRoles, { isLoading: isUpdatingRoles }] = useSetUserRolesMutation()

  // Matrix Filter State
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL')
  const [permissionSearch, setPermissionSearch] = useState<string>('')
  const [updatingCell, setUpdatingCell] = useState<{ role: string; key: string } | null>(null)

  // Edit User Roles Modal State
  const [editingUser, setEditingUser] = useState<RbacUserItem | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const permissions = permissionsRes?.data || []
  const rolesWithPermissions = rolesWithPermsRes?.data || []
  const users = userListRes?.data || []
  const userPagination = userListRes?.pagination
  const totalUserEntries = userPagination?.total || users.length
  const totalUserPages = userPagination?.totalPages || 1

  // Create a map of role -> Set(permissionKeys) for fast lookup
  const rolePermissionsMap = useMemo(() => {
    const map = new Map<string, Set<string>>()
    rolesWithPermissions.forEach((item) => {
      map.set(item.role, new Set(item.permissions))
    })
    return map
  }, [rolesWithPermissions])

  // Group permissions by category prefix (e.g., land_parcel:create -> category "land_parcel")
  const groupedPermissions = useMemo(() => {
    const filtered = permissions.filter(
      (p) =>
        p.key.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(permissionSearch.toLowerCase())
    )

    const groups: Record<string, PermissionItem[]> = {}
    filtered.forEach((item) => {
      const parts = item.key.split(':')
      const category = parts.length > 1 ? parts[0] : 'general'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }, [permissions, permissionSearch])

  // Handle permission toggle for a specific role and key
  const handleTogglePermission = async (role: string, permissionKey: string, isCurrentlyGranted: boolean) => {
    setUpdatingCell({ role, key: permissionKey })
    try {
      if (isCurrentlyGranted) {
        const res = await revokePermissions({
          role,
          data: { permissionKeys: [permissionKey] },
        }).unwrap()
        toast.success(res.message || `Revoked '${permissionKey}' from '${role}'`)
      } else {
        const res = await grantPermissions({
          role,
          data: { permissionKeys: [permissionKey] },
        }).unwrap()
        toast.success(res.message || `Granted '${permissionKey}' to '${role}'`)
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update permission')
    } finally {
      setUpdatingCell(null)
    }
  }

  // Handle User Roles Save
  const handleOpenEditUser = (user: RbacUserItem) => {
    setEditingUser(user)
    setSelectedRoles(user.roles || [])
  }

  const handleSaveUserRoles = async () => {
    if (!editingUser) return

    if (selectedRoles.length === 0) {
      toast.warning('At least one role is required for user.')
      return
    }

    try {
      const res = await setUserRoles({
        userId: editingUser.id,
        data: { roles: selectedRoles },
      }).unwrap()

      toast.success(res.message || 'User roles updated successfully!')
      setEditingUser(null)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update user roles')
    }
  }

  const toggleRoleSelection = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const isMatrixLoading = loadingPerms || loadingRoles

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage granular system permissions, role matrices, and user assigned roles
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/60">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield size={14} />
            <span>Role-Permissions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={14} />
            <span>User Role Assignments</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROLE-PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-5">
          {/* Controls: Search and Role Filter */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search permission key or description..."
                  value={permissionSearch}
                  onChange={(e) => setPermissionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-button-color focus:bg-white transition-all"
                />
              </div>

              {/* Role Column Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Highlight Role:
                </span>
                <button
                  onClick={() => setSelectedRoleFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                    selectedRoleFilter === 'ALL'
                      ? 'bg-button-color text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Roles
                </button>
                {ALL_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer border ${
                      selectedRoleFilter === role
                        ? 'bg-slate-900 text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix Content */}
          {isMatrixLoading ? (
            <div className="flex items-center justify-center min-h-[40vh] bg-white rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-button-color" />
                <span>Loading permission matrix...</span>
              </div>
            </div>
          ) : Object.keys(groupedPermissions).length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 text-xs font-medium">
              No permissions found matching your search.
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedPermissions).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-button-color" />
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        {category.replace(/_/g, ' ')}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                        {items.length} permissions
                      </span>
                    </div>
                  </div>

                  {/* Table Matrix */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-200">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30">
                          <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider w-2/5">
                            Permission Key & Description
                          </th>
                          {ALL_ROLES.map((role) => {
                            const isSelected = selectedRoleFilter === role
                            return (
                              <th
                                key={role}
                                className={`px-3 py-3 text-[10px] font-extrabold text-center uppercase tracking-wider transition-colors ${
                                  isSelected
                                    ? 'text-button-color bg-blue-50/40'
                                    : 'text-slate-600'
                                }`}
                              >
                                {role}
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60">
                        {items.map((perm) => (
                          <tr key={perm.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-mono text-xs font-bold text-slate-900">
                                {perm.key}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {perm.description}
                              </div>
                            </td>
                            {ALL_ROLES.map((role) => {
                              const isGranted = rolePermissionsMap.get(role)?.has(perm.key) || false
                              const isUpdating =
                                updatingCell?.role === role && updatingCell?.key === perm.key
                              const isHighlighted = selectedRoleFilter === role

                              return (
                                <td
                                  key={role}
                                  className={`px-3 py-3 text-center align-middle transition-colors ${
                                    isHighlighted ? 'bg-blue-50/20' : ''
                                  }`}
                                >
                                  <button
                                    type="button"
                                    disabled={isGranting || isRevoking}
                                    onClick={() =>
                                      handleTogglePermission(role, perm.key, isGranted)
                                    }
                                    className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all cursor-pointer border ${
                                      isGranted
                                        ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-sm'
                                        : 'bg-slate-100 text-slate-300 border-slate-200 hover:bg-slate-200 hover:text-slate-500'
                                    } disabled:opacity-50`}
                                    title={`${isGranted ? 'Revoke' : 'Grant'} ${perm.key} to ${role}`}
                                  >
                                    {isUpdating ? (
                                      <Loader2 size={12} className="animate-spin text-white" />
                                    ) : isGranted ? (
                                      <Check size={14} strokeWidth={3} />
                                    ) : null}
                                  </button>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER ROLE ASSIGNMENTS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5 space-y-5">
          {/* Top Bar with Title and Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">
                System Users & Assigned Roles
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Search and assign administrative roles to users to manage platform permissions
              </p>
            </div>

            {/* User Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name, email, or code..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value)
                  setUserPage(1)
                }}
                className="w-full pl-9 pr-8 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-button-color focus:bg-white transition-all"
              />
              {userSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setUserSearchQuery('')
                    setUserPage(1)
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center p-12 text-slate-500 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-button-color mr-2" />
              Loading users list...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No users found matching your search.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Assigned Roles
                      </th>
                      <th className="px-5 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-button-color font-bold text-xs flex items-center justify-center uppercase shrink-0 border border-blue-100">
                              {usr.name
                                ? usr.name.substring(0, 2).toUpperCase()
                                : 'US'}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">
                                {usr.name || 'N/A'}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {usr.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            {usr.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {usr.roles && usr.roles.length > 0 ? (
                              usr.roles.map((r) => (
                                <span
                                  key={r}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900 text-white uppercase tracking-wider"
                                >
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No roles</span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(usr)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-button-color bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={12} />
                            <span>Edit Roles</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <CustomPagination
                currentPage={userPage}
                totalPages={totalUserPages}
                onPageChange={(page) => setUserPage(page)}
                totalEntries={totalUserEntries}
                pageSize={userLimit}
                isLoading={fetchingUsers}
              />
            </>
          )}
        </div>
      )}

      {/* EDIT USER ROLES MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-button-color" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Update User Roles
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs font-bold text-slate-800">{editingUser.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{editingUser.email}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Roles for this User:
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {ALL_ROLES.map((role) => {
                  const isChecked = selectedRoles.includes(role)
                  return (
                    <label
                      key={role}
                      onClick={() => toggleRoleSelection(role)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                        isChecked
                          ? 'bg-blue-50/60 border-button-color text-button-color font-bold'
                          : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-slate-300 text-button-color focus:ring-button-color"
                      />
                      <span className="text-xs uppercase">{role}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isUpdatingRoles}
                onClick={handleSaveUserRoles}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-button-color hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdatingRoles ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                <span>Save Roles</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RolesPermissionsPage