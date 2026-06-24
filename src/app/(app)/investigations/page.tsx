import InvestigationsPage from '@/components/app/investigations/InvestigationsPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import React from 'react'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Investigations"
      subtitle="Manage land dispute investigation cases"
    >
      <InvestigationsPage />
    </DashboardChildrenLayout>
  )
}

export default page