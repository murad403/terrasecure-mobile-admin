import DocumentsPage from '@/components/app/documents/DocumentsPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import React from 'react'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Document Management"
      subtitle="Review, approve, and manage uploaded documents"
    >
      <DocumentsPage />
    </DashboardChildrenLayout>
  )
}

export default page