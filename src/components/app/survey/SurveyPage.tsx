"use client"
import React, { useState } from 'react'
import SurveyTable from './SurveyTable'
import SurveyDetailsModal from './SurveyDetailsModal'
import CreateSurveyModal from './CreateSurveyModal'
import UploadSurveyFileModal from './UploadSurveyFileModal'
import AssignSurveyorModal from './AssignSurveyorModal'
import VerifyGisModal from './VerifyGisModal'
import EditSurveyModal from './EditSurveyModal'
import DeleteSurveyModal from './DeleteSurveyModal'
import { ISurveyItem } from '@/redux/features/survey/survey.type'

const SurveyPage = () => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null)
  const [selectedSurveyItem, setSelectedSurveyItem] = useState<ISurveyItem | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false)
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState<boolean>(false)
  const [isAssignSurveyorModalOpen, setIsAssignSurveyorModalOpen] = useState<boolean>(false)
  const [isVerifyGisModalOpen, setIsVerifyGisModalOpen] = useState<boolean>(false)
  const [isEditSurveyModalOpen, setIsEditSurveyModalOpen] = useState<boolean>(false)
  const [isDeleteSurveyModalOpen, setIsDeleteSurveyModalOpen] = useState<boolean>(false)

  const handleViewDetails = (id: number) => {
    setSelectedSurveyId(id)
    setIsDetailsModalOpen(true)
  }

  const handleUploadFile = (id: number) => {
    setSelectedSurveyId(id)
    setIsUploadFileModalOpen(true)
  }

  const handleAssignSurveyor = (item: ISurveyItem) => {
    setSelectedSurveyId(item.id)
    setSelectedSurveyItem(item)
    setIsAssignSurveyorModalOpen(true)
  }

  const handleVerifyGis = (item: ISurveyItem) => {
    setSelectedSurveyId(item.id)
    setSelectedSurveyItem(item)
    setIsVerifyGisModalOpen(true)
  }

  const handleEditSurvey = (item: ISurveyItem) => {
    setSelectedSurveyId(item.id)
    setSelectedSurveyItem(item)
    setIsEditSurveyModalOpen(true)
  }

  const handleDeleteSurvey = (id: number) => {
    setSelectedSurveyId(id)
    setIsDeleteSurveyModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <SurveyTable
        onViewDetails={handleViewDetails}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onUploadFile={handleUploadFile}
        onAssignSurveyor={handleAssignSurveyor}
        onVerifyGis={handleVerifyGis}
        onEditSurvey={handleEditSurvey}
        onDeleteSurvey={handleDeleteSurvey}
      />

      <CreateSurveyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <SurveyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedSurveyId(null)
        }}
        surveyId={selectedSurveyId}
        onUploadFile={handleUploadFile}
        onAssignSurveyor={handleAssignSurveyor}
        onVerifyGis={handleVerifyGis}
        onEditSurvey={handleEditSurvey}
        onDeleteSurvey={handleDeleteSurvey}
      />

      <UploadSurveyFileModal
        isOpen={isUploadFileModalOpen}
        onClose={() => {
          setIsUploadFileModalOpen(false)
          setSelectedSurveyId(null)
        }}
        surveyId={selectedSurveyId}
      />

      <AssignSurveyorModal
        isOpen={isAssignSurveyorModalOpen}
        onClose={() => {
          setIsAssignSurveyorModalOpen(false)
          setSelectedSurveyId(null)
          setSelectedSurveyItem(null)
        }}
        surveyId={selectedSurveyId}
        currentSurveyor={selectedSurveyItem?.surveyor}
      />

      <VerifyGisModal
        isOpen={isVerifyGisModalOpen}
        onClose={() => {
          setIsVerifyGisModalOpen(false)
          setSelectedSurveyId(null)
          setSelectedSurveyItem(null)
        }}
        surveyId={selectedSurveyId}
        initialScore={selectedSurveyItem?.reliabilityScore}
        initialStatus={selectedSurveyItem?.status}
        initialNotes={selectedSurveyItem?.validationNotes}
      />

      <EditSurveyModal
        isOpen={isEditSurveyModalOpen}
        onClose={() => {
          setIsEditSurveyModalOpen(false)
          setSelectedSurveyId(null)
          setSelectedSurveyItem(null)
        }}
        surveyId={selectedSurveyId}
        initialSource={selectedSurveyItem?.source}
        initialArea={selectedSurveyItem?.computedAreaSqm}
        initialScore={selectedSurveyItem?.reliabilityScore}
        initialStatus={selectedSurveyItem?.status}
      />

      <DeleteSurveyModal
        isOpen={isDeleteSurveyModalOpen}
        onClose={() => {
          setIsDeleteSurveyModalOpen(false)
          setSelectedSurveyId(null)
        }}
        surveyId={selectedSurveyId}
      />
    </div>
  )
}

export default SurveyPage
