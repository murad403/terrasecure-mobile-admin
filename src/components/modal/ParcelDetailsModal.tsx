"use client"
import React, { useEffect } from 'react'
import { X, MapPin } from 'lucide-react'
import ParcelDetailsTabs from '../app/parcels/ParcelDetailsTabs'
import { Parcel } from '@/pages/app/ParcelsPage'
import { cn } from '@/lib/utils'

interface ParcelDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  parcel: Parcel
  onAddOwner: () => void
  onUpdateStatus: (newStatus: string, reason: string) => void
  onEdit: () => void
  onBlock: () => void
  onDelete: () => void
}

const ParcelDetailsModal = ({
  isOpen,
  onClose,
  parcel,
  onAddOwner,
  onUpdateStatus,
  onEdit,
  onBlock,
  onDelete
}: ParcelDetailsModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Sliding Sheet Panel */}
      <div
        className="w-full max-w-md md:max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Top section) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex flex-col leading-snug">
            <h2 className="text-lg font-bold text-slate-800">
              Parcel {parcel.id}
            </h2>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              {parcel.city}, {parcel.district}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topographic Map visual area */}
        <div className="relative h-48 bg-[#D1FAE5]/60 border-b border-emerald-50 shrink-0 flex items-center justify-center overflow-hidden">
          {/* Topographic contours */}
          <svg className="absolute inset-0 w-full h-full text-emerald-800/10 stroke-current stroke-1" fill="none">
            <path d="M-50,20 C30,40 60,-30 110,30 C150,80 200,30 250,70 T450,20 T650,50" />
            <path d="M-50,45 C30,65 60,-5 110,55 C150,105 200,55 250,95 T450,45 T650,75" />
            <path d="M-50,70 C30,90 60,20 110,80 C150,130 200,80 250,120 T450,70 T650,100" />
            <path d="M-50,95 C30,115 60,45 110,105 C150,155 200,105 250,145 T450,95 T650,125" />
            {/* Abstract highway road paths */}
            <path d="M80,-20 L80,240" stroke="#94A3B8" strokeWidth="3" />
            <path d="M-20,130 H500" stroke="#94A3B8" strokeWidth="3" />
          </svg>

          {/* Dotted parcel area highlighting boundary */}
          <div className="absolute w-28 h-20 border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-md flex items-center justify-center animate-pulse">
            {/* Map Pin icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-md">
              <MapPin className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Red Highway Shield Badge */}
          <div className="absolute top-[65%] left-[20%] bg-rose-500 text-white text-[8px] font-bold px-1 rounded shadow-sm border border-rose-600 tracking-wider">
            N15
          </div>

          {/* Top-Right overlays: Status & Reliability Pills */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded text-[10px] font-bold border shrink-0 shadow-sm",
                parcel.status === 'Published' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                parcel.status === 'Validated' && 'bg-teal-50 text-teal-600 border-teal-100',
                parcel.status === 'Pending' && 'bg-yellow-50 text-yellow-600 border-yellow-100',
                parcel.status === 'Reserved' && 'bg-amber-50 text-amber-600 border-amber-100',
                parcel.status === 'Disputed' && 'bg-rose-50 text-rose-600 border-rose-100',
                parcel.status === 'Under Verification' && 'bg-blue-50 text-blue-600 border-blue-100',
                parcel.status === 'Sold' && 'bg-purple-50 text-purple-600 border-purple-100',
                parcel.status === 'Draft' && 'bg-slate-50 text-slate-500 border-slate-200',
                parcel.status === 'Blocked' && 'bg-red-50 text-red-600 border-red-100'
              )}
            >
              {parcel.status}
            </span>

            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold text-white border shrink-0 shadow-sm",
                parcel.reliability === 'Very High' && 'bg-[#047857] border-[#047857]',
                parcel.reliability === 'High' && 'bg-emerald-500 border-emerald-500',
                parcel.reliability === 'Medium' && 'bg-amber-500 border-amber-500',
                parcel.reliability === 'Low' && 'bg-red-500 border-red-500'
              )}
            >
              {parcel.reliability}
            </span>
          </div>

          {/* Bottom-Left overlay: Yaoundé, Bastos */}
          <div className="absolute bottom-2 left-3 bg-white px-2.5 py-0.5 rounded-md shadow-sm border border-slate-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] font-bold text-slate-700">
              {parcel.city}, {parcel.district}
            </span>
          </div>
        </div>

        {/* Scrollable details tabs content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          <ParcelDetailsTabs
            selectedParcel={parcel}
            onAddOwner={onAddOwner}
            onUpdateStatus={onUpdateStatus}
          />
        </div>

        {/* Sticky Action Footer (Bottom row) */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2.5 shrink-0">
          {/* Edit */}
          <button
            onClick={() => {
              onClose()
              onEdit()
            }}
            className="flex-1 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100/60 transition-colors shadow-sm cursor-pointer text-center"
          >
            Edit
          </button>

          {/* Block */}
          <button
            onClick={() => {
              onClose()
              onBlock()
            }}
            className="flex-1 py-2.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100/60 transition-colors shadow-sm cursor-pointer text-center"
          >
            Block
          </button>

          {/* Publish */}
          <button
            onClick={() => {
              onUpdateStatus('Published', 'Published from sticky footer actions panel')
              alert(`Parcel ${parcel.id} status updated to Published!`)
            }}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-button-color rounded-lg hover:bg-button-color/90 transition-colors shadow-sm cursor-pointer text-center"
          >
            Publish
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              onClose()
              onDelete()
            }}
            className="flex-1 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 transition-colors shadow-sm cursor-pointer text-center"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParcelDetailsModal