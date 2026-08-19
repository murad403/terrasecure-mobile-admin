"use client"
import { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import UsersTable from './UsersTable'
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api'
import { UserRole, UserStatus, Gender } from '@/enum'

const UsersPage = () => {
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
      />
    </DashboardChildrenLayout>
  )
}

export default UsersPage