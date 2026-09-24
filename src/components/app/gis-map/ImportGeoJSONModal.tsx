"use client"
import ImportGISModal from './ImportGISModal'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'

interface ImportGeoJSONModalProps {
  isOpen: boolean
  onClose: () => void
  parcels?: ParcelListItem[]
  selectedParcelId?: number | string | null
  onSaveSuccess?: () => void
}

const ImportGeoJSONModal = ({
  isOpen,
  onClose,
  parcels,
  selectedParcelId,
  onSaveSuccess,
}: ImportGeoJSONModalProps) => (
  <ImportGISModal
    isOpen={isOpen}
    onClose={onClose}
    defaultTab="geojson"
    parcels={parcels}
    selectedParcelId={selectedParcelId}
    onSaveSuccess={onSaveSuccess}
  />
)

export default ImportGeoJSONModal