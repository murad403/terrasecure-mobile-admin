"use client"
import React, { useState, useEffect, useRef } from 'react'
import { X, AlertTriangle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateInvestigationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    title: string
    parcelId: string
    type: string
    priority: 'High' | 'Medium' | 'Low'
    assigneeName: string
    description: string
  }) => void
}

const CreateInvestigationModal = ({
  isOpen,
  onClose,
  onCreate
}: CreateInvestigationModalProps) => {
  const [title, setTitle] = useState('')
  const [parcelId, setParcelId] = useState('')
  const [type, setType] = useState('Boundary Overlap')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [assigneeName, setAssigneeName] = useState('Inspector Alain Dimi')
  const [description, setDescription] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEvidenceFile(file.name)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTitle('')
      setParcelId('')
      setType('Boundary Overlap')
      setPriority('High')
      setAssigneeName('Inspector Alain Dimi')
      setDescription('')
      setEvidenceFile(null)
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Case Title is required')
      return
    }
    if (!parcelId.trim()) {
      setError('Related Parcel ID is required')
      return
    }
    setError('')
    onCreate({
      title,
      parcelId,
      type,
      priority,
      assigneeName,
      description
    })
  }

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="space-y-0.5 select-none">
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              Create Investigation
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              Open a new land dispute investigation case
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Scroll wrapper */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 select-none">
          
          {/* Info warning banner */}
          <div className="bg-amber-50 border border-amber-100/50 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-700 leading-relaxed">
              A new Case ID (INV-XXX) will be auto-assigned upon creation.
            </span>
          </div>

          {error && (
            <p className="text-xs text-destructive font-semibold">{error}</p>
          )}

          {/* Case Title */}
          <div className="space-y-1.5">
            <Label htmlFor="caseTitle" className="text-xs font-bold text-slate-700">Case Title</Label>
            <Input
              id="caseTitle"
              placeholder="e.g. Boundary Overlap Investigation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title"
            />
          </div>

          {/* Related Parcel ID */}
          <div className="space-y-1.5">
            <Label htmlFor="relatedParcel" className="text-xs font-bold text-slate-700">Related Parcel ID</Label>
            <Input
              id="relatedParcel"
              placeholder="e.g. CM-2848"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title"
            />
          </div>

          {/* Two-column selects */}
          <div className="grid grid-cols-2 gap-3">
            {/* Investigation Type */}
            <div className="space-y-1.5">
              <Label htmlFor="investigationType" className="text-xs font-bold text-slate-700">Investigation Type</Label>
              <select
                id="investigationType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-button-color transition-none leading-relaxed cursor-pointer"
              >
                <option value="Boundary Overlap">Boundary Overlap</option>
                <option value="Duplicate Claim">Duplicate Claim</option>
                <option value="Fraudulent Document">Fraudulent Document</option>
                <option value="Invalid GPS">Invalid GPS</option>
              </select>
            </div>

            {/* Priority Level */}
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs font-bold text-slate-700">Priority Level</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-button-color transition-none leading-relaxed cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Assign Investigator */}
          <div className="space-y-1.5">
            <Label htmlFor="assignInvestigator" className="text-xs font-bold text-slate-700">Assign Investigator</Label>
            <select
              id="assignInvestigator"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title focus:outline-none focus:border-button-color transition-none font-semibold leading-relaxed cursor-pointer"
            >
              <option value="Inspector Alain Dimi">Inspector Alain Dimi</option>
              <option value="Inspector Marie Bello">Inspector Marie Bello</option>
              <option value="Inspector Paul Njoya">Inspector Paul Njoya</option>
              <option value="Inspector Cécile Eba">Inspector Cécile Eba</option>
            </select>
          </div>

          {/* Description / Initial Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-bold text-slate-700">Description / Initial Notes</Label>
            <textarea
              id="description"
              placeholder="Describe the dispute or issue that requires investigation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-[90px] leading-relaxed resize-none"
            />
          </div>

          {/* Attach Evidence */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 block">Attach Evidence (optional)</Label>
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
                {evidenceFile ? `Attached: ${evidenceFile}` : 'Drop files here or click to browse'}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 block tracking-wide">
                PDF, JPG, PNG — max 10MB each
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-3.5 w-1/2 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className='w-1/2'
            >
              Create Investigation
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateInvestigationModal