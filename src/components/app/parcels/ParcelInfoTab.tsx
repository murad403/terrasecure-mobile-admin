"use client"
import React from 'react'
import { Parcel } from '@/components/app/parcels/ParcelsPage'

interface ParcelInfoTabProps {
  parcel: Parcel
}

const ParcelInfoTab = ({ parcel }: ParcelInfoTabProps) => {
  const details = [
    { label: 'Parcel ID', value: parcel.id },
    { label: 'City / District', value: `${parcel.city} / ${parcel.district}` },
    { label: 'Area Size', value: `${parcel.area.toLocaleString()} m²` },
    { label: 'Price per m²', value: '45,000 XAF' },
    { label: 'GPS Coordinates', value: `${parcel.latitude.toFixed(3)}°N, ${parcel.longitude.toFixed(3)}°E` },
    { label: 'Calculated Area', value: `${parcel.area.toLocaleString()} m²` },
    { label: 'Owner', value: parcel.ownerName },
    { label: 'Created Date', value: parcel.createdDate }
  ]

  return (
    <div className="space-y-0.5 animate-in fade-in duration-200">
      {details.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0 text-sm font-semibold"
        >
          <span className="text-slate-400 font-semibold">{item.label}</span>
          <span className="text-slate-700 font-bold text-right">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default ParcelInfoTab