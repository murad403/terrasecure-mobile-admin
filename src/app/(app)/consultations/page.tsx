import ConsultationsPage from '@/components/app/consultations/ConsultationsPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import React from 'react'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Consultations"
      subtitle="Review and respond to land consultation requests"
    >
      <ConsultationsPage />
    </DashboardChildrenLayout>
  )
}

export default page