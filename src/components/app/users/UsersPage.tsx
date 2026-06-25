"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import UsersTable from './UsersTable'
import AddUserModal from '@/components/app/users/AddUserModal'
import EditUserModal from '@/components/app/users/EditUserModal'
import UserDetailsModal from '@/components/modal/UserDetailsModal'

export interface ActivityItem {
  id: string
  text: string
  time: string
}

export interface UserRecord {
  id: string
  fullName: string
  phone: string
  email: string
  role: string
  status: 'Active' | 'Suspended'
  createdDate: string
  requestsSubmitted: number
  parcelsRegistered: number
  recentActivity: ActivityItem[]
}

const initialUsers: UserRecord[] = [
  {
    id: 'USR-001',
    fullName: 'Jean Alima',
    phone: '+237 677 881 002',
    email: 'j.alima@landsecure.cm',
    role: 'Super Admin',
    status: 'Active',
    createdDate: '1 Jan 2024',
    requestsSubmitted: 24,
    parcelsRegistered: 8,
    recentActivity: [
      { id: '1', text: 'Submitted registration REG-1203', time: '2 days ago' },
      { id: '2', text: 'Updated parcel CM-2847 details', time: '5 days ago' },
      { id: '3', text: 'Logged in from mobile device', time: '1 week ago' }
    ]
  },
  {
    id: 'USR-002',
    fullName: 'Marie Nkodo',
    phone: '+237 654 123 456',
    email: 'm.nkodo@gov.cm',
    role: 'Admin',
    status: 'Active',
    createdDate: '15 Feb 2024',
    requestsSubmitted: 14,
    parcelsRegistered: 4,
    recentActivity: [
      { id: '1', text: 'Approved boundary coordinates for REG-1197', time: '3 days ago' },
      { id: '2', text: 'Modified role permissions for supervisor group', time: '10 days ago' }
    ]
  },
  {
    id: 'USR-003',
    fullName: 'Paul Biya Jr',
    phone: '+237 699 234 567',
    email: 'p.biya@survey.cm',
    role: 'Surveyor',
    status: 'Active',
    createdDate: '3 Mar 2024',
    requestsSubmitted: 32,
    parcelsRegistered: 12,
    recentActivity: [
      { id: '1', text: 'Uploaded GIS shapefile for REG-1283', time: '1 day ago' },
      { id: '2', text: 'Concluded field inspection for REG-1199', time: '6 days ago' }
    ]
  },
  {
    id: 'USR-004',
    fullName: 'Grace Tanda',
    phone: '+237 677 345 678',
    email: 'g.tanda@field.cm',
    role: 'Field Agent',
    status: 'Active',
    createdDate: '20 Apr 2024',
    requestsSubmitted: 8,
    parcelsRegistered: 2,
    recentActivity: [
      { id: '1', text: 'Logged parcel coordinates in Yaoundé', time: '4 days ago' }
    ]
  },
  {
    id: 'USR-005',
    fullName: 'Samuel Kotto',
    phone: '+237 699 456 789',
    email: 's.kotto@landsecure.cm',
    role: 'Supervisor',
    status: 'Active',
    createdDate: '5 May 2024',
    requestsSubmitted: 18,
    parcelsRegistered: 6,
    recentActivity: [
      { id: '1', text: 'Authorized surveyor assignment for Bastos Plot B', time: '12 hours ago' }
    ]
  },
  {
    id: 'USR-006',
    fullName: 'Amina Fouda',
    phone: '+237 654 567 898',
    email: 'a.fouda@gmail.com',
    role: 'Client',
    status: 'Suspended',
    createdDate: '12 Jun 2024',
    requestsSubmitted: 2,
    parcelsRegistered: 1,
    recentActivity: [
      { id: '1', text: 'Requested boundary correction audit', time: '2 weeks ago' }
    ]
  },
  {
    id: 'USR-007',
    fullName: 'François Ngono',
    phone: '+237 677 678 901',
    email: 'f.ngono@client.cm',
    role: 'Client',
    status: 'Active',
    createdDate: '30 Jun 2024',
    requestsSubmitted: 3,
    parcelsRegistered: 1,
    recentActivity: [
      { id: '1', text: 'Created new land registration claim', time: '3 weeks ago' }
    ]
  },
  {
    id: 'USR-008',
    fullName: 'Halima Bello',
    phone: '+237 699 789 012',
    email: 'h.bello@gov.cm',
    role: 'Admin',
    status: 'Active',
    createdDate: '14 Aug 2024',
    requestsSubmitted: 11,
    parcelsRegistered: 3,
    recentActivity: [
      { id: '1', text: 'Activated database publication status', time: '1 month ago' }
    ]
  }
]

const UsersPage = () => {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const handleAddUser = (data: any) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`
    const newUser: UserRecord = {
      id: newId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      role: data.role,
      status: data.status ? 'Active' : 'Suspended',
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      requestsSubmitted: 0,
      parcelsRegistered: 0,
      recentActivity: []
    }
    setUsers([newUser, ...users])
    setAddOpen(false)
  }

  const handleEditUser = (data: any) => {
    if (!selectedUser) return

    setUsers((prev) =>
      prev.map((usr) => {
        if (usr.id === selectedUser.id) {
          const merged: UserRecord = {
            ...usr,
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            role: data.role,
            status: data.status ? 'Active' : 'Suspended'
          }
          setSelectedUser(merged)
          return merged
        }
        return usr
      })
    )
    setEditOpen(false)
  }

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((usr) => {
        if (usr.id === id) {
          const updated: UserRecord = {
            ...usr,
            status: usr.status === 'Active' ? 'Suspended' : 'Active'
          }
          if (selectedUser && selectedUser.id === id) {
            setSelectedUser(updated)
          }
          return updated
        }
        return usr
      })
    )
  }

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((usr) => usr.id !== id))
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(null)
      setDetailsOpen(false)
    }
  }

  const handleViewDetails = (usr: UserRecord) => {
    setSelectedUser(usr)
    setDetailsOpen(true)
  }

  const handleOpenEdit = (usr: UserRecord) => {
    setSelectedUser(usr)
    setEditOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedUser(null)
    setDetailsOpen(false)
  }

  // Filter logic
  const filteredUsers = users.filter((usr) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      usr.fullName.toLowerCase().includes(query) ||
      usr.email.toLowerCase().includes(query) ||
      usr.phone.includes(query)

    const matchesRole = roleFilter === 'All Roles' || usr.role === roleFilter
    const matchesStatus = statusFilter === 'All Statuses' || usr.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <DashboardChildrenLayout
      title="User Management"
      subtitle="Manage admin and client user accounts"
    >
      <UsersTable
        users={filteredUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenAddModal={() => setAddOpen(true)}
        onViewDetails={handleViewDetails}
        onOpenEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Add User Modal */}
      {addOpen && (
        <AddUserModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={handleAddUser}
        />
      )}

      {/* Edit User Modal */}
      {editOpen && selectedUser && (
        <EditUserModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          user={selectedUser}
          onEdit={handleEditUser}
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
          onToggleStatus={() => handleToggleStatus(selectedUser.id)}
          onDelete={() => handleDeleteUser(selectedUser.id)}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default UsersPage