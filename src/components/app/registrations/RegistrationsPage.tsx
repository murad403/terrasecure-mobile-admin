"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import RegistrationsTable from './RegistrationsTable'
import RegistrationSteps from './RegistrationSteps'
import AddRegistrationModal from '@/components/app/registrations/AddRegistrationModal'
import { useRetrieveRegistrationDetailsQuery } from '@/redux/features/registrations/registration.api'

const RegistrationsPage: React.FC = () => {
  const [selectedRegId, setSelectedRegId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

  // Fetch detailed registration data when drawer is open
  const { data: detailsData, isLoading: detailsLoading } = useRetrieveRegistrationDetailsQuery(
    selectedRegId,
    { skip: !selectedRegId || !drawerOpen }
  )

  const handleViewDetails = (id: number) => {
    setSelectedRegId(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedRegId(null)
  }

  const activeRegistration = detailsData?.data

  return (
    <DashboardChildrenLayout
      title="Registration Workflow"
      subtitle="Track and process land parcel registration requests"
    >
      <RegistrationsTable
        onOpenAddModal={() => setAddModalOpen(true)}
        onViewDetails={handleViewDetails}
      />

      {/* Side drawer displaying stepper layout & live API details */}
      {drawerOpen && selectedRegId && (
        <RegistrationSteps
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          registrationId={selectedRegId}
          registration={activeRegistration}
          isLoadingDetails={detailsLoading}
        />
      )}

      {/* Add registration modal */}
      {addModalOpen && (
        <AddRegistrationModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default RegistrationsPage;