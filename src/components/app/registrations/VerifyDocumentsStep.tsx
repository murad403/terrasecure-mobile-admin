"use client"
import React, { useEffect, useState } from 'react'
import { File } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VerifyDocumentsStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

type DocStatus = 'Approved' | 'Pending' | 'Rejected'

interface DocumentItem {
  key: string
  name: string
}

const DOCUMENTS: DocumentItem[] = [
  { key: 'nationalIdDoc', name: 'National ID Card' },
  { key: 'proofOwnershipDoc', name: 'Proof of Ownership' },
  { key: 'surveyCertificateDoc', name: 'Survey Certificate' },
  { key: 'taxClearanceDoc', name: 'Tax Clearance' }
]

const VerifyDocumentsStep = ({ registration, onUpdate, onCompleteStep }: VerifyDocumentsStepProps) => {
  // Local state for documents status
  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>({
    nationalIdDoc: registration?.nationalIdDoc || 'Approved',
    proofOwnershipDoc: registration?.proofOwnershipDoc || 'Pending',
    surveyCertificateDoc: registration?.surveyCertificateDoc || 'Rejected',
    taxClearanceDoc: registration?.taxClearanceDoc || 'Approved'
  })

  useEffect(() => {
    setDocStatuses({
      nationalIdDoc: registration?.nationalIdDoc || 'Approved',
      proofOwnershipDoc: registration?.proofOwnershipDoc || 'Pending',
      surveyCertificateDoc: registration?.surveyCertificateDoc || 'Rejected',
      taxClearanceDoc: registration?.taxClearanceDoc || 'Approved'
    })
  }, [registration])

  const isStepCompleted = registration?.activeStep > 2

  const updateDocStatus = (key: string, status: DocStatus) => {
    const updated = { ...docStatuses, [key]: status }
    setDocStatuses(updated)
    
    // Persist to registration parent state
    onUpdate({
      [key]: status,
      // If all documents are approved, we can consider documentsVerified as true
      documentsVerified: Object.values(updated).every(val => val === 'Approved')
    })
  }

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-title">Step 2: Verify Documents</h3>
          <p className="text-xs font-semibold text-subtitle mt-0.5">
            {isStepCompleted ? 'Completed' : 'In Progress'}
          </p>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Documents Table/List */}
      <div className="border border-slate-100 rounded-xl bg-white overflow-hidden divide-y divide-slate-100">
        {DOCUMENTS.map((doc) => {
          const status = docStatuses[doc.key] || 'Pending'

          return (
            <div key={doc.key} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/20 transition-all">
              
              {/* Document Icon & Title */}
              <div className="flex items-center gap-3">
                <File className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-700">{doc.name}</span>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-4 select-none shrink-0">
                {/* Status Badges matching exact image coloring */}
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap block w-fit",
                    status === 'Approved' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                    status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
                  )}
                >
                  {status}
                </span>

                {/* Approve/Reject Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateDocStatus(doc.key, 'Approved')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer bg-white text-slate-600 border-slate-200 hover:bg-blue-50/40 hover:text-blue-600",
                      status === 'Approved' && 'border-blue-100 text-blue-600 bg-blue-50/30'
                    )}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDocStatus(doc.key, 'Rejected')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer bg-white text-slate-600 border-slate-200 hover:bg-rose-50/40 hover:text-rose-600",
                      status === 'Rejected' && 'border-rose-100 text-rose-600 bg-rose-50/30'
                    )}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Auto complete transition warning or trigger */}
      {!isStepCompleted && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCompleteStep}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg cursor-pointer"
          >
            Verify & Approve Documents
          </button>
        </div>
      )}
    </div>
  )
}

export default VerifyDocumentsStep
export type { DocStatus }