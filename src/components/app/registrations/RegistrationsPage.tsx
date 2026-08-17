"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import RegistrationsTable from './RegistrationsTable'
import RegistrationSteps from './RegistrationSteps'
import AddRegistrationModal from '@/components/app/registrations/AddRegistrationModal'
import { useRetrieveRegistrationsQuery, useRetrieveRegistrationDetailsQuery } from '@/redux/features/registrations/registration.api'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

const RegistrationsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [ownershipTypeFilter, setOwnershipTypeFilter] = useState<string>('All')

  const [selectedRegId, setSelectedRegId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

  // Fetch paginated & filtered registrations from API
  const { data, isLoading } = useRetrieveRegistrationsQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    ownershipType: ownershipTypeFilter !== 'All' ? ownershipTypeFilter : undefined,
  })

  // Fetch detailed registration data when drawer is open
  const { data: detailsData, isLoading: detailsLoading } = useRetrieveRegistrationDetailsQuery(
    selectedRegId,
    { skip: !selectedRegId || !drawerOpen }
  )

  const handleViewDetails = (reg: RegistrationItem) => {
    setSelectedRegId(reg.id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedRegId(null)
  }

  const registrationsList = data?.data || []
  const pagination = data?.pagination
  const activeRegistration = detailsData?.data || (registrationsList.find((r: any) => r.id === selectedRegId) as RegistrationItem)

  return (
    <DashboardChildrenLayout
      title="Registration Workflow"
      subtitle="Track and process land parcel registration requests"
    >
      <RegistrationsTable
        registrations={registrationsList}
        pagination={pagination}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ownershipTypeFilter={ownershipTypeFilter}
        setOwnershipTypeFilter={setOwnershipTypeFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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

export default RegistrationsPage