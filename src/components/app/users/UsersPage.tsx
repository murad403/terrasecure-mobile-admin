"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import UsersTable from './UsersTable'
import AddUserModal from '@/components/app/users/AddUserModal'
import EditUserModal from '@/components/app/users/EditUserModal'
import UserDetailsModal from '@/components/modal/UserDetailsModal'
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api'
import type { User } from '@/interfaces/user.interface'
import { UserRole, UserStatus, Gender } from '@/enum'

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filters and Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [genderFilter, setGenderFilter] = useState<string>('All')

  // RTK Query API Integration
  const { data: userResponse, isLoading, isFetching } = useRetrieveUsersQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    role: roleFilter !== 'All' ? (roleFilter as UserRole) : undefined,
    status: statusFilter !== 'All' ? (statusFilter as UserStatus) : undefined,
    gender: genderFilter !== 'All' ? (genderFilter as Gender) : undefined,
  })

  const users = userResponse?.data || []
  const pagination = userResponse?.pagination

  const handleViewDetails = (usr: User) => {
    setSelectedUser(usr)
    setDetailsOpen(true)
  }

  const handleOpenEdit = (usr: User) => {
    setSelectedUser(usr)
    setEditOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedUser(null)
    setDetailsOpen(false)
  }

  return (
    <DashboardChildrenLayout
      title="User Management"
      subtitle="Manage admin, surveyor, and client user accounts"
    >
      <UsersTable
        users={users}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        onOpenAddModal={() => setAddOpen(true)}
        onViewDetails={handleViewDetails}
        onOpenEdit={handleOpenEdit}
      />

      {/* Add User Modal */}
      {addOpen && (
        <AddUserModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={() => setAddOpen(false)}
        />
      )}

      {/* Edit User Modal */}
      {editOpen && selectedUser && (
        <EditUserModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          user={selectedUser as any}
          onEdit={() => setEditOpen(false)}
        />
      )}

      {/* User Details Slide-out Drawer */}
      {detailsOpen && selectedUser && (
        <UserDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          user={selectedUser}
          onOpenEdit={() => {
            setDetailsOpen(false)
            setEditOpen(true)
          }}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default UsersPage