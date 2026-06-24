"use client"
import React from 'react'
import ImportGISModal from './ImportGISModal'

interface ImportGeoJSONModalProps {
  isOpen: boolean
  onClose: () => void
}

const ImportGeoJSONModal = ({ isOpen, onClose }: ImportGeoJSONModalProps) => (
  <ImportGISModal isOpen={isOpen} onClose={onClose} defaultTab="geojson" />
)

export default ImportGeoJSONModal