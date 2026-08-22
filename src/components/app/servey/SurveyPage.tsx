"use client"
import React, { useState } from 'react'
import ServeyTable from './ServeyTable'
import ServeyDetailsModal from './ServeyDetailsModal'

const SurveyPage = () => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false)

  const handleViewDetails = (id: number) => {
    setSelectedSurveyId(id)
    setIsDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedSurveyId(null)
  }

  return (
    <div className="space-y-6">
      <ServeyTable onViewDetails={handleViewDetails} />

      <ServeyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        surveyId={selectedSurveyId}
      />
    </div>
  )
}

export default SurveyPage