"use client"
import React, { useState } from 'react'
import { Parcel } from '@/components/app/parcels/ParcelsPage'
import { cn } from '@/lib/utils'

// Import tabs
import ParcelInfoTab from './ParcelInfoTab'
import ParcelOwnersTab from './ParcelOwnersTab'
import ParcelDocumentsTab from './ParcelDocumentsTab'
import ParcelHistoryTab from './ParcelHistoryTab'
import ParcelStatusTab from './ParcelStatusTab'

interface ParcelDetailsTabsProps {
  selectedParcel: Parcel
  onAddOwner: () => void
  onUpdateStatus: (newStatus: string, reason: string) => void
}

const ParcelDetailsTabs = ({
  selectedParcel,
  onAddOwner,
  onUpdateStatus
}: ParcelDetailsTabsProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'owners' | 'documents' | 'history' | 'status'>('info')

  const tabItems = [
    { id: 'info', label: 'Info' },
    { id: 'owners', label: 'Owners' },
    { id: 'documents', label: 'Documents' },
    { id: 'history', label: 'History' },
    { id: 'status', label: 'Status' }
  ] as const

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-100 px-3 overflow-x-auto shrink-0 bg-slate-50/50">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 px-4 text-xs font-semibold tracking-wide border-b-2 transition-all outline-none whitespace-nowrap",
                isActive
                  ? "border-button-color text-button-color"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content viewport */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'info' && <ParcelInfoTab parcel={selectedParcel} />}
        {activeTab === 'owners' && (
          <ParcelOwnersTab
            owners={selectedParcel.owners}
            onAddOwner={onAddOwner}
          />
        )}
        {activeTab === 'documents' && <ParcelDocumentsTab documents={selectedParcel.documents} />}
        {activeTab === 'history' && <ParcelHistoryTab history={selectedParcel.history} />}
        {activeTab === 'status' && (
          <ParcelStatusTab
            parcel={selectedParcel}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </div>
    </div>
  )
}

export default ParcelDetailsTabs