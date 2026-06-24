"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import RegistrationsTable, { type Registration } from './RegistrationsTable'
import RegistrationSteps from './RegistrationSteps'
import AddRegistrationModal from '@/components/modal/AddRegistrationModal'

const initialRegistrations: Registration[] = [
  {
    id: 'REG-1283',
    ownerName: 'Pierre Mballa',
    nationalId: 'ID-849204',
    phone: '+237 677 889 900',
    email: 'pierre.mballa@gmail.com',
    parcelName: 'Bastos Estate Plot A',
    location: 'Yaoundé / Bastos',
    city: 'Yaoundé',
    district: 'Bastos',
    area: 1240,
    description: 'Prime commercial block in Bastos district. Suitable for embassy offices or luxury villa.',
    status: 'In Progress',
    activeStep: 3,
    createdDate: '10 Jun 2025'
  },
  {
    id: 'REG-1282',
    ownerName: 'Amina Fouda',
    nationalId: 'ID-104928',
    phone: '+237 655 443 322',
    email: 'amina.fouda@outlook.com',
    parcelName: 'Douala Bonanjo Commercial',
    location: 'Douala / Bonanjo',
    city: 'Douala',
    district: 'Bonanjo',
    area: 3500,
    description: 'High-value commercial land currently under boundary arbitration due to neighboring plot overlap.',
    status: 'In Progress',
    activeStep: 6,
    createdDate: '8 Jun 2025'
  },
  {
    id: 'REG-1281',
    ownerName: 'Grace Tanda',
    nationalId: 'ID-203948',
    phone: '+237 680 554 433',
    email: 'grace.tanda@yahoo.com',
    parcelName: 'Ntarikon Lot B',
    location: 'Bamenda / Ntarikon',
    city: 'Bamenda',
    district: 'Ntarikon',
    area: 2100,
    description: 'Reserved parcel for local municipal expansion or green spaces.',
    status: 'Completed',
    activeStep: 7,
    createdDate: '5 Jun 2025'
  },
  {
    id: 'REG-1280',
    ownerName: 'Samuel Kotto',
    nationalId: 'ID-503928',
    phone: '+237 678 123 456',
    email: 'samuel.kotto@gmail.com',
    parcelName: 'Akwa Commercial Strip',
    location: 'Douala / Akwa',
    city: 'Douala',
    district: 'Akwa',
    area: 750,
    description: 'Akwa business center parcel with fully validated surveyor bounds.',
    status: 'Pending',
    activeStep: 2,
    createdDate: '1 Jun 2025'
  },
  {
    id: 'REG-1199',
    ownerName: 'François Ngono',
    nationalId: 'ID-394810',
    phone: '+237 670 112 233',
    email: 'francois.ngono@gmail.com',
    parcelName: 'Hauts-Plateaux Agriculture',
    location: 'Bafoussam / Hauts-Plateaux',
    city: 'Bafoussam',
    district: 'Hauts-Plateaux',
    area: 1650,
    description: 'Fertile land registered under private sale verification.',
    status: 'In Progress',
    activeStep: 4,
    createdDate: '28 May 2025'
  },
  {
    id: 'REG-1198',
    ownerName: 'Halima Bello',
    nationalId: 'ID-492048',
    phone: '+237 612 345 678',
    email: 'halima.bello@outlook.com',
    parcelName: 'Garoua Nord Plot',
    location: 'Garoua / Nord',
    city: 'Garoua',
    district: 'Nord',
    area: 4200,
    description: 'Draft registry listing for rural developmental land planning.',
    status: 'Rejected',
    activeStep: 1,
    createdDate: '25 May 2025'
  },
  {
    id: 'REG-1197',
    ownerName: 'Ibrahim Alioum',
    nationalId: 'ID-492049',
    phone: '+237 667 788 991',
    email: 'ibrahim.alioum@outlook.com',
    parcelName: 'Maroua Agri Plot',
    location: 'Maroua / Kaélé',
    city: 'Maroua',
    district: 'Kaélé',
    area: 5600,
    description: 'Large agricultural tract published for cooperative farming audits.',
    status: 'In Progress',
    activeStep: 5,
    createdDate: '20 May 2025'
  }
]

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations)
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Open details side drawer for a registration
  const handleViewDetails = (reg: Registration) => {
    setSelectedReg(reg)
    setDrawerOpen(true)
  }

  // Close details side drawer
  const handleCloseDrawer = () => {
    setSelectedReg(null)
    setDrawerOpen(false)
  }

  // Handle adding a new registration from modal
  const handleAddRegistration = (newData: any) => {
    const newId = `REG-${Math.floor(1300 + Math.random() * 1000)}`
    
    const location = `${newData.city} / ${newData.district}`
    
    // Parse submission date safely
    let formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    if (newData.submissionDate) {
      const parsedDate = new Date(newData.submissionDate)
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    }

    const newReg: Registration = {
      ...newData,
      id: newId,
      location,
      status: 'Pending',
      activeStep: 1,
      createdDate: formattedDate
    }

    setRegistrations([newReg, ...registrations])
    setAddModalOpen(false)
  }

  // Handle updating details of a registration
  const handleUpdateRegistration = (id: string, updatedFields: any) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === id) {
          const merged = { ...reg, ...updatedFields }
          // If we are currently showing this registration in the drawer, keep its values updated
          if (selectedReg && selectedReg.id === id) {
            setSelectedReg(merged)
          }
          return merged
        }
        return reg
      })
    )
  }

  return (
    <DashboardChildrenLayout 
      title="Registration Workflow" 
      subtitle="Track and process land registration requests"
    >
      <RegistrationsTable
        registrations={registrations}
        onOpenAddModal={() => setAddModalOpen(true)}
        onViewDetails={handleViewDetails}
      />

      {/* Side drawer displaying stepper layout */}
      {drawerOpen && selectedReg && (
        <RegistrationSteps
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          registration={selectedReg}
          onUpdateRegistration={handleUpdateRegistration}
        />
      )}

      {/* Add registration modal dialog */}
      {addModalOpen && (
        <AddRegistrationModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddRegistration}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default RegistrationsPage