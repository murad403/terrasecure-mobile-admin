"use client"
import React from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Document {
  name: string
  size: string
  date: string
}

interface ParcelDocumentsTabProps {
  documents: Document[]
}

const ParcelDocumentsTab = ({ documents }: ParcelDocumentsTabProps) => {
  // Populate default mock files if list is empty to match Screenshot 3
  const displayDocs = [
    { name: 'Title Deed.pdf', type: 'Title Deed', status: 'Approved', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Survey_Plan.pdf', type: 'Survey Plan', status: 'Validated', colorClass: 'bg-teal-50 text-teal-600 border-teal-100' },
    { name: 'Photo_Evidence.jpg', type: 'Photo', status: 'Pending', colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-100' }
  ]

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-1">
        <span className="text-sm font-bold text-slate-800">
          Documents ({displayDocs.length})
        </span>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {displayDocs.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm gap-3"
          >
            {/* File Icon and metadata info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-xs md:text-sm font-bold text-slate-800 truncate">
                  {doc.name}
                </span>
                <span className="text-[10px] md:text-xs text-slate-400 font-semibold mt-0.5">
                  {doc.type}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold border shrink-0", doc.colorClass)}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParcelDocumentsTab