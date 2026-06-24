"use client"
import React, { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface ScheduleSiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (data: {
    parcelId: string
    surveyorName: string
    visitDate: string
    visitTime: string
    notes: string
  }) => void
}

const ScheduleSiteVisitModal = ({
  isOpen,
  onClose,
  onSchedule
}: ScheduleSiteVisitModalProps) => {
  const [parcelId, setParcelId] = useState('')
  const [surveyorName, setSurveyorName] = useState('Paul Biya Jr - Available')
  const [dateTime, setDateTime] = useState('')
  const [visitType, setVisitType] = useState('Initial Survey')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [smsSent, setSmsSent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setParcelId('')
      setSurveyorName('Paul Biya Jr - Available')
      setDateTime('')
      setVisitType('Initial Survey')
      setNotes('')
      setError('')
      setSmsSent(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSmsToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setSmsSent(!smsSent)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcelId.trim()) {
      setError('Parcel ID is required')
      return
    }
    if (!dateTime) {
      setError('Scheduled Date & Time is required')
      return
    }
    setError('')

    const [datePart, timePart] = dateTime.split('T')
    
    // Strip availability status to pass clean surveyor name
    const cleanSurveyorName = surveyorName.split(' - ')[0]

    onSchedule({
      parcelId,
      surveyorName: cleanSurveyorName,
      visitDate: datePart,
      visitTime: timePart || '09:00',
      notes: visitType !== 'Initial Survey' ? `[Type: ${visitType}] ${notes}` : notes
    })
  }

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-[460px] shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900 leading-none">
              Schedule Site Visit
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Assign a surveyor to visit a parcel
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 select-none">
          {error && (
            <p className="text-xs text-destructive font-semibold">{error}</p>
          )}

          {/* Parcel ID */}
          <div className="space-y-1.5">
            <Label htmlFor="parcelId" className="text-xs font-bold text-slate-700">Parcel ID</Label>
            <Input
              id="parcelId"
              placeholder="e.g. CM-2849"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Surveyor Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="surveyorSelect" className="text-xs font-bold text-slate-700">Assign Surveyor</Label>
            <select
              id="surveyorSelect"
              value={surveyorName}
              onChange={(e) => setSurveyorName(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-200 bg-white rounded-xl text-xs md:text-sm text-title focus:outline-none focus:border-button-color focus:ring-0 transition-none font-semibold leading-relaxed cursor-pointer"
            >
              <option value="Paul Biya Jr - Available">Paul Biya Jr - Available</option>
              <option value="Martin Essono - Available">Martin Essono - Available</option>
              <option value="Cécile Ondoua - Available">Cécile Ondoua - Available</option>
            </select>
          </div>

          {/* Date & Time Input */}
          <div className="space-y-1.5">
            <Label htmlFor="dateTimeInput" className="text-xs font-bold text-slate-700">Scheduled Date & Time</Label>
            <Input
              id="dateTimeInput"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Visit Type */}
          <div className="space-y-1.5">
            <Label htmlFor="visitTypeSelect" className="text-xs font-bold text-slate-700">Visit Type</Label>
            <select
              id="visitTypeSelect"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-200 bg-white rounded-xl text-xs md:text-sm text-title focus:outline-none focus:border-button-color focus:ring-0 transition-none font-semibold leading-relaxed cursor-pointer"
            >
              <option value="Initial Survey">Initial Survey</option>
              <option value="Boundary Verification">Boundary Verification</option>
              <option value="Dispute Investigation">Dispute Investigation</option>
              <option value="Re-survey">Re-survey</option>
            </select>
          </div>

          {/* Special Instructions / Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="visitNotes" className="text-xs font-bold text-slate-700">Notes / Instructions</Label>
            <textarea
              id="visitNotes"
              placeholder="Special instructions for the surveyor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-0 transition-none font-semibold min-h-[90px] leading-relaxed resize-none"
            />
          </div>

          {/* SMS Notification Toggle Button */}
          <div>
            <button
              onClick={handleSmsToggle}
              type="button"
              className={cn(
                "w-full py-2.5 px-4 font-semibold text-xs text-center rounded-xl cursor-pointer transition-colors border flex items-center justify-center",
                smsSent
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/50"
                  : "bg-blue-50/50 border-blue-200 text-blue-600 hover:bg-blue-50"
              )}
            >
              {smsSent ? "✓ SMS notification enabled" : "Send SMS notification to surveyor"}
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              <Calendar className="w-4 h-4" />
              Schedule Visit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleSiteVisitModal