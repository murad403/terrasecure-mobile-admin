"use client"
import React, { useState, useEffect } from 'react'
import { X, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LandSiteVisitKind } from '@/enum'
import { useScheduleSiteVisitMutation } from '@/redux/features/siteVisits/siteVisit.api'

interface ScheduleSiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
}

const kindOptions: LandSiteVisitKind[] = Object.values(LandSiteVisitKind) as LandSiteVisitKind[]

const ScheduleSiteVisitModal = ({ isOpen, onClose }: ScheduleSiteVisitModalProps) => {
  const [scheduleSiteVisit, { isLoading }] = useScheduleSiteVisitMutation()

  const [parcelId, setParcelId] = useState('')
  const [surveyorId, setSurveyorId] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [kind, setKind] = useState<LandSiteVisitKind>(kindOptions[0])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setParcelId('')
      setSurveyorId('')
      setDateTime('')
      setKind(kindOptions[0])
      setNotes('')
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcelId.trim()) {
      setError('Parcel ID is required')
      return
    }
    if (!surveyorId) {
      setError('Surveyor is required')
      return
    }
    if (!dateTime) {
      setError('Scheduled Date & Time is required')
      return
    }
    setError('')

    try {
      await scheduleSiteVisit({
        parcelId,
        surveyorId: Number(surveyorId),
        scheduledAt: new Date(dateTime).toISOString(),
        kind,
        notes: notes || undefined,
      }).unwrap()
      onClose()
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to schedule visit')
    }
  }

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-115 shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 p-6"
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
          {/* TODO: replace with a real surveyor-list query once available; using a raw ID input for now */}
          <div className="space-y-1.5">
            <Label htmlFor="surveyorId" className="text-xs font-bold text-slate-700">Assign Surveyor (ID)</Label>
            <Input
              id="surveyorId"
              type="number"
              placeholder="e.g. 1"
              value={surveyorId}
              onChange={(e) => setSurveyorId(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
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
            <Select value={kind} onValueChange={(val) => setKind(val as LandSiteVisitKind)}>
              <SelectTrigger id="visitTypeSelect" className="w-full">
                <SelectValue placeholder="Select Visit Type" />
              </SelectTrigger>
              <SelectContent>
                {kindOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Instructions / Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="visitNotes" className="text-xs font-bold text-slate-700">Notes / Instructions</Label>
            <textarea
              id="visitNotes"
              placeholder="Special instructions for the surveyor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-0 transition-none font-semibold min-h-22.5 leading-relaxed resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Schedule Visit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleSiteVisitModal