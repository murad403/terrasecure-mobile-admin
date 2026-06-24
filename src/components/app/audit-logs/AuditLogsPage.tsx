"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import AuditLogsTable, { type AuditLog } from './AuditLogsTable'
import AuditLogDetailsModal from './AuditLogDetailsModal'

const initialLogs: AuditLog[] = [
  {
    id: '#1',
    timestamp: '11 Jun 2025 09:14:32',
    user: 'Jean Alima',
    role: 'Super Admin',
    action: 'Publication',
    description: 'Parcel CM-2847 published to platform',
    ipAddress: '197.155.20.12',
    target: 'CM-2847'
  },
  {
    id: '#2',
    timestamp: '11 Jun 2025 09:02:11',
    user: 'Marie Nkodo',
    role: 'Admin',
    action: 'Status Change',
    description: 'Parcel CM-2849 status changed to Under Verification',
    ipAddress: '197.155.20.15',
    target: 'CM-2849'
  },
  {
    id: '#3',
    timestamp: '11 Jun 2025 08:47:59',
    user: 'Samuel Kotto',
    role: 'Supervisor',
    action: 'Document Approval',
    description: 'Title deed for REG-1202 approved',
    ipAddress: '197.155.21.03',
    target: 'REG-1202'
  },
  {
    id: '#4',
    timestamp: '10 Jun 2025 16:38:44',
    user: 'Paul Biya Jr',
    role: 'Surveyor',
    action: 'Login',
    description: 'Successful login from mobile device',
    ipAddress: '197.155.22.88'
  },
  {
    id: '#5',
    timestamp: '10 Jun 2025 15:21:07',
    user: 'Jean Alima',
    role: 'Super Admin',
    action: 'User Change',
    description: 'Role updated for Halima Bello: Field Agent -> Admin',
    ipAddress: '197.155.20.12',
    target: 'Halima Bello'
  },
  {
    id: '#6',
    timestamp: '10 Jun 2025 14:10:33',
    user: 'Marie Nkodo',
    role: 'Admin',
    action: 'Parcel Update',
    description: 'Parcel CM-2853 coordinates updated',
    ipAddress: '197.155.20.15',
    target: 'CM-2853'
  },
  {
    id: '#7',
    timestamp: '10 Jun 2025 13:05:20',
    user: 'Jean Alima',
    role: 'Super Admin',
    action: 'Deletion',
    description: 'Draft parcel CM-2840 permanently deleted',
    ipAddress: '197.155.20.12',
    target: 'CM-2840'
  },
  {
    id: '#8',
    timestamp: '10 Jun 2025 11:50:02',
    user: 'Grace Tanda',
    role: 'Field Agent',
    action: 'Login',
    description: 'Successful login from field device',
    ipAddress: '197.155.25.44'
  }
]

const AuditLogsPage = () => {
  const [logs] = useState<AuditLog[]>(initialLogs)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedLog(null)
    setDrawerOpen(false)
  }

  return (
    <DashboardChildrenLayout
      title="Audit Logs"
      subtitle="Complete action log for platform activity"
    >
      <div className="relative">
        {/* Logs Listing Table */}
        <AuditLogsTable
          logs={logs}
          onViewDetails={handleViewDetails}
          isDetailOpen={drawerOpen}
        />

        {/* Sliding detail drawer */}
        <AuditLogDetailsModal
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          log={selectedLog}
        />
      </div>
    </DashboardChildrenLayout>
  )
}

export default AuditLogsPage