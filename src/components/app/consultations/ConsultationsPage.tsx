"use client"
import React, { useState } from 'react'
import ConsultationsTable from './ConsultationsTable'
import ConsultationsDetailsModal from './ConsultationsDetailsModal'

export interface ConsultationRecord {
  id: string
  requesterName: string
  parcelId: string
  date: string
  status: 'Pending' | 'Approved' | 'Rejected'
  gpsCoordinates: string
  message: string
  adminResponse: string
}

const initialConsultations: ConsultationRecord[] = [
  {
    id: 'CON-128',
    requesterName: 'Amina Fouda',
    parcelId: 'CM-2848',
    date: '10 Jun 2025',
    status: 'Pending',
    gpsCoordinates: 'GPS: 3.851°N, 11.505°E',
    message: 'I am interested in this parcel for potential purchase. I would like to verify the ownership documents and understand the current legal status before proceeding.',
    adminResponse: ''
  },
  {
    id: 'CON-127',
    requesterName: 'Pierre Mballa',
    parcelId: 'CM-2847',
    date: '8 Jun 2025',
    status: 'Approved',
    gpsCoordinates: 'GPS: 4.154°N, 9.243°E',
    message: 'Requesting official consultation for plot boundary limits adjustment.',
    adminResponse: 'Approved boundary limits adjust review and updated maps.'
  },
  {
    id: 'CON-126',
    requesterName: 'François Ngono',
    parcelId: 'CM-2851',
    date: '5 Jun 2025',
    status: 'Rejected',
    gpsCoordinates: 'GPS: 3.844°N, 11.501°E',
    message: 'Need clarification on the zoning regulations for this parcel area.',
    adminResponse: 'Zoning regulation check failed. Land is protected forest zone.'
  },
  {
    id: 'CON-125',
    requesterName: 'Grace Tanda',
    parcelId: 'CM-2858',
    date: '1 Jun 2025',
    status: 'Approved',
    gpsCoordinates: 'GPS: 5.960°N, 10.150°E',
    message: 'Querying about the land registration status and history details.',
    adminResponse: 'Ownership details confirmed. Registered under Land Act.'
  },
  {
    id: 'CON-124',
    requesterName: 'Samuel Kotto',
    parcelId: 'CM-2853',
    date: '28 May 2025',
    status: 'Pending',
    gpsCoordinates: 'GPS: 4.051°N, 9.768°E',
    message: 'Request to check if there are any conflicting claims active on this coordinate zone.',
    adminResponse: ''
  }
]

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(initialConsultations)
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const handleUpdateStatus = (id: string, status: 'Approved' | 'Rejected', responseText: string) => {
    setConsultations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            status,
            adminResponse: responseText
          }
          if (selectedConsultation && selectedConsultation.id === id) {
            setSelectedConsultation(updated)
          }
          return updated
        }
        return item
      })
    )
  }

  const handleOpenDrawer = (item: ConsultationRecord) => {
    setSelectedConsultation(item)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedConsultation(null)
    setDrawerOpen(false)
  }

  // Filter calculations
  const filteredConsultations = consultations.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All Statuses' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <ConsultationsTable
        consultations={filteredConsultations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onViewDetails={handleOpenDrawer}
        onUpdateStatus={(id, status) => handleUpdateStatus(id, status, '')}
      />

      {drawerOpen && selectedConsultation && (
        <ConsultationsDetailsModal
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          consultation={selectedConsultation}
          onApprove={(responseText) => {
            handleUpdateStatus(selectedConsultation.id, 'Approved', responseText)
            handleCloseDrawer()
          }}
          onReject={(responseText) => {
            handleUpdateStatus(selectedConsultation.id, 'Rejected', responseText)
            handleCloseDrawer()
          }}
        />
      )}
    </div>
  )
}

export default ConsultationsPage
