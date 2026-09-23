"use client"
import React from 'react'
import ImportGISModal from './ImportGISModal'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'

interface ImportSHPModalProps {
  isOpen: boolean
  onClose: () => void
  parcels?: ParcelListItem[]
  selectedParcelId?: number | string | null
  onSaveSuccess?: () => void
}

const ImportSHPModal = ({
  isOpen,
  onClose,
  parcels,
  selectedParcelId,
  onSaveSuccess,
}: ImportSHPModalProps) => (
  <ImportGISModal
    isOpen={isOpen}
    onClose={onClose}
    defaultTab="shp"
    parcels={parcels}
    selectedParcelId={selectedParcelId}
    onSaveSuccess={onSaveSuccess}
  />
)

export default ImportSHPModal