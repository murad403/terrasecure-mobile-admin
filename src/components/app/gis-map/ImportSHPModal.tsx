"use client"
import React from 'react'
import ImportGISModal from './ImportGISModal'

interface ImportSHPModalProps {
  isOpen: boolean
  onClose: () => void
}

const ImportSHPModal = ({ isOpen, onClose }: ImportSHPModalProps) => (
  <ImportGISModal isOpen={isOpen} onClose={onClose} defaultTab="shp" />
)

export default ImportSHPModal