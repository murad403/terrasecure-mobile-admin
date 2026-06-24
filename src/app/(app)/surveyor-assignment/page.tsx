import SurveyorAssignmentPage from '@/components/app/surveyor-assignment/SurveyorAssignmentPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import React from 'react'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Surveyor Assignment"
      subtitle="Assign surveyors to parcels and manage field visit scheduling"
    >
      <SurveyorAssignmentPage />
    </DashboardChildrenLayout>
  )
}

export default page