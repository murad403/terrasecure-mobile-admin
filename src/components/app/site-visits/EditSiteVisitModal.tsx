"use client"
import React, { useState, useEffect } from 'react'
import { X, Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LandSiteVisitKind } from '@/enum'
import { useUpdateSiteVisitMutation } from '@/redux/features/siteVisits/siteVisit.api'
import { UserPicker } from '@/components/tools/UserPicker'
import type { User } from '@/interfaces/user.interface'
import { toast } from 'sonner'

interface EditSiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
  visit: any | null
}

const kindOptions: LandSiteVisitKind[] = Object.values(LandSiteVisitKind) as LandSiteVisitKind[]

const formatToLocalDateTime = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

export const EditSiteVisitModal = ({ isOpen, onClose, visit }: EditSiteVisitModalProps) => {
  const [updateSiteVisit, { isLoading }] = useUpdateSiteVisitMutation()

  const [dateTime, setDateTime] = useState('')
  const [kind, setKind] = useState<LandSiteVisitKind>(LandSiteVisitKind.INITIAL_SURVEY)
  const [phone, setPhone] = useState('')
  const [selectedSurveyors, setSelectedSurveyors] = useState<User[] | any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && visit) {
      document.body.style.overflow = 'hidden'
      setDateTime(formatToLocalDateTime(visit.scheduledAt))
      setKind(visit.kind || LandSiteVisitKind.INITIAL_SURVEY)
      setPhone(visit.phone || '')
      if (visit.surveyor) {
        setSelectedSurveyors([visit.surveyor])
      } else {
        setSelectedSurveyors([])
      }
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, visit])

  if (!isOpen || !visit) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateTime) {
      setError('Scheduled Date & Time is required')
      return
    }
    setError('')

    try {
      const payload: any = {
        kind,
        scheduledAt: new Date(dateTime).toISOString(),
        phone: phone.trim() || undefined,
      }

      if (selectedSurveyors.length > 0) {
        payload.surveyorId = selectedSurveyors[0].id
      }

      const res = await updateSiteVisit({
        id: visit.id,
        data: payload,
      }).unwrap()

      toast.success(res?.message || 'Land site visit updated successfully!')
      onClose()
    } catch (err: any) {
      const message = err?.data?.message || 'Failed to update site visit'
      setError(message)
      toast.error(message)
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
            <div className="flex items-center gap-2">
              <Pencil className="w-4.5 h-4.5 text-button-color" />
              <h2 className="text-lg font-extrabold text-slate-900 leading-none">
                Update Site Visit
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Edit schedule or details for visit #{visit.slug || visit.id}
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

           {/* Assigned Surveyor */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 block">
              Assigned Surveyor (optional)
            </Label>
            <UserPicker
              type="radio"
              placeholder="Search surveyor..."
              value={selectedSurveyors}
              onChange={setSelectedSurveyors}
            />
          </div>

          {/* Visit Type */}
          <div className="space-y-1.5">
            <Label htmlFor="editVisitKind" className="text-xs font-bold text-slate-700">
              Visit Type / Kind <span className="text-rose-500">*</span>
            </Label>
            <Select value={kind} onValueChange={(val) => setKind(val as LandSiteVisitKind)}>
              <SelectTrigger id="editVisitKind" className="w-full">
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

          {/* Scheduled Date & Time */}
          <div className="space-y-1.5">
            <Label htmlFor="editDateTimeInput" className="text-xs font-bold text-slate-700">
              Scheduled Date & Time <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="editDateTimeInput"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="editVisitPhone" className="text-xs font-bold text-slate-700">
              Contact Phone (optional)
            </Label>
            <Input
              id="editVisitPhone"
              type="tel"
              placeholder="e.g. +12345678901"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
          </div>

         

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-1/2 cursor-pointer font-bold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSiteVisitModal
