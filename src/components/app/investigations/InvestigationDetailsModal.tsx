"use client"
import React, { useState, useEffect, useRef } from 'react'
import { X, MapPin, Upload, ChevronDown, Check } from 'lucide-react'
import { type InvestigationRecord } from './InvestigationsPage'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface InvestigationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  investigation: InvestigationRecord
  onReassign: (newInspector: string) => void
  onUploadFindings: (notes: string, fileName?: string) => void
  onCloseCase: () => void
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const InvestigationDetailsModal = ({
  isOpen,
  onClose,
  investigation,
  onReassign,
  onUploadFindings,
  onCloseCase
}: InvestigationDetailsModalProps) => {
  const [notes, setNotes] = useState(investigation.notes || '')
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    investigation.uploadedFiles.length > 0 ? investigation.uploadedFiles[0] : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setNotes(investigation.notes || '')
      setUploadedFile(investigation.uploadedFiles.length > 0 ? investigation.uploadedFiles[0] : null)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, investigation])

  if (!isOpen) return null

  const initials = getInitials(investigation.assigneeName)

  const handleUploadClick = () => {
    onUploadFindings(notes, uploadedFile || 'findings_report_inv_case.pdf')
    alert('Investigation findings notes and files uploaded successfully! Step 3 is now complete.')
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[450px] md:w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="space-y-0.5 select-none">
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              {investigation.id}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed max-w-[320px] truncate" title={investigation.title}>
              {investigation.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none text-xs">
          
          {/* Related Parcel Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Related Parcel
            </span>
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                {investigation.parcelId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider select-none">
                Disputed
              </span>
            </div>
          </div>

          {/* Assigned Investigator Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Assigned Investigator
            </span>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 font-extrabold text-sm shrink-0 shadow-sm uppercase tracking-wide">
                  {initials}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">{investigation.assigneeName}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 block leading-tight">
                    {investigation.assigneeRole}
                  </span>
                </div>
              </div>

              {/* Reassign dropdown selector */}
              <div className="relative shrink-0">
                <select
                  value={investigation.assigneeName}
                  onChange={(e) => onReassign(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 focus:outline-none transition-none cursor-pointer"
                >
                  <option value="Inspector Alain Dimi">Inspector Alain Dimi</option>
                  <option value="Inspector Marie Bello">Inspector Marie Bello</option>
                  <option value="Inspector Paul Njoya">Inspector Paul Njoya</option>
                  <option value="Inspector Cécile Eba">Inspector Cécile Eba</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Investigation Timeline */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Investigation Timeline
            </span>
            <div className="relative pl-6 space-y-4 pt-1 select-none">
              
              {/* Vertical timeline line */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-100" />

              {/* Steps mappings */}
              {investigation.timeline.map((step) => {
                const isStepCompleted = step.isCompleted
                
                return (
                  <div key={step.stepNumber} className="relative flex items-start gap-4 text-xs">
                    
                    {/* Circle indicators */}
                    <div className="absolute -left-6 mt-0.5 shrink-0">
                      {isStepCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white border border-blue-600 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white text-slate-400 flex items-center justify-center text-[10px] font-bold">
                          {step.stepNumber}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={cn(
                        "text-xs font-bold",
                        isStepCompleted ? "text-slate-800" : "text-slate-400"
                      )}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                        {step.subtext}
                      </p>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>

          {/* Upload Findings */}
          {investigation.status !== 'Closed' && (
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Upload Findings
              </span>
              
              {/* Dashed upload input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer transition-colors text-center select-none"
              >
                <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 block">
                  {uploadedFile ? `Attached: ${uploadedFile}` : 'Drop files here or click to upload'}
                </span>
              </div>

              {/* Textarea notes */}
              <textarea
                placeholder="Investigation notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl p-4 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-[90px] leading-relaxed resize-none block"
              />

              {/* Action upload button */}
              <Button
                type="button"
                onClick={handleUploadClick}
                className='w-auto'
              >
                Upload Findings
              </Button>
            </div>
          )}

        </div>

        {/* Footer actions: Close Investigation */}
        {investigation.status !== 'Closed' && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-stretch shrink-0 select-none">
            <Button
              type="button"
              onClick={onCloseCase}
              className='bg-red-700 hover:bg-red-800/90'
            >
              Close Investigation
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}

export default InvestigationDetailsModal