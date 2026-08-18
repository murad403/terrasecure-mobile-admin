"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { X, Calendar, Loader2 } from 'lucide-react'
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
import { useScheduleSiteVisitMutation } from '@/redux/features/siteVisits/siteVisit.api'
import { useRetrieveParcelsQuery } from '@/redux/features/parcel/parcel.api'
import { toast } from 'sonner'

interface ScheduleSiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
}

const kindOptions: LandSiteVisitKind[] = Object.values(LandSiteVisitKind) as LandSiteVisitKind[]

// Converts a Date object to local YYYY-MM-DDTHH:mm format for HTML datetime-local inputs
const formatToLocalDateTime = (date: Date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

const getParcelLabel = (parcel: any) =>
  parcel?.slug || parcel?.parcelCode || (parcel?.id ? `Parcel ${parcel.id}` : '')

const ScheduleSiteVisitModal = ({ isOpen, onClose }: ScheduleSiteVisitModalProps) => {
  const [scheduleSiteVisit, { isLoading }] = useScheduleSiteVisitMutation()
  const { data: parcelsData, isLoading: parcelsLoading } = useRetrieveParcelsQuery(undefined, {
    skip: !isOpen,
  })

  const [parcelText, setParcelText] = useState('')
  const [parcelFocus, setParcelFocus] = useState(false)
  const [dateTime, setDateTime] = useState('')
  const [kind, setKind] = useState<LandSiteVisitKind>(kindOptions[0])
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const minDateTime = formatToLocalDateTime()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setParcelText('')
      setParcelFocus(false)
      setDateTime('')
      setKind(kindOptions[0])
      setPhone('')
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const parcels = useMemo(() => {
    const list = (parcelsData?.data ?? []) as any[]
    const query = parcelText.trim().toLowerCase()
    if (!query) return list.slice(0, 50)
    return list.filter((parcel) =>
      [parcel?.slug, parcel?.parcelCode, String(parcel?.id ?? '')].some(
        (value) => value && String(value).toLowerCase().includes(query)
      )
    )
  }, [parcelsData, parcelText])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = parcelText.trim()
    if (!slug) {
      setError('Parcel slug is required')
      return
    }
    if (!dateTime) {
      setError('Scheduled Date & Time is required')
      return
    }
    if (new Date(dateTime) < new Date()) {
      setError('Please select a future date and time')
      return
    }
    setError('')

    try {
      await scheduleSiteVisit({
        parcelSlug: slug,
        scheduledAt: new Date(dateTime).toISOString(),
        kind,
        phone: phone.trim() || undefined,
      }).unwrap()
      toast.success('Site visit scheduled successfully!')
      onClose()
    } catch (err: any) {
      const message = err?.data?.message || 'Failed to schedule site visit'
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
            <h2 className="text-lg font-extrabold text-slate-900 leading-none">
              Schedule Site Visit
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Schedule a surveyor visit for a parcel
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

          {/* Parcel Slug with suggestions */}
          <div className="space-y-1.5">
            <Label htmlFor="parcelSlug" className="text-xs font-bold text-slate-700">
              Parcel Slug
            </Label>
            <div className="relative">
              <Input
                id="parcelSlug"
                placeholder="e.g. CM-2849"
                value={parcelText}
                onChange={(e) => {
                  setParcelText(e.target.value)
                  setParcelFocus(true)
                }}
                onFocus={() => setParcelFocus(true)}
                onBlur={() => setTimeout(() => setParcelFocus(false), 150)}
                className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
              />
              {parcelFocus && (
                <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  {parcelsLoading ? (
                    <p className="px-3.5 py-3 text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading parcels...
                    </p>
                  ) : parcels.length > 0 ? (
                    parcels.map((parcel) => {
                      const label = getParcelLabel(parcel)
                      return (
                        <button
                          key={parcel?.id ?? label}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setParcelText(label)
                            setParcelFocus(false)
                          }}
                          className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                          {label}
                        </button>
                      )
                    })
                  ) : (
                    <p className="px-3.5 py-3 text-xs font-semibold text-slate-400">
                      No matching parcels found — type a slug manually.
                    </p>
                  )}
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Pick an existing parcel or type a slug manually
            </p>
          </div>

          {/* Date & Time Input */}
          <div className="space-y-1.5">
            <Label htmlFor="dateTimeInput" className="text-xs font-bold text-slate-700">
              Scheduled Date & Time
            </Label>
            <Input
              id="dateTimeInput"
              type="datetime-local"
              min={minDateTime}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Visit Type */}
          <div className="space-y-1.5">
            <Label htmlFor="visitTypeSelect" className="text-xs font-bold text-slate-700">
              Visit Type
            </Label>
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

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="visitPhone" className="text-xs font-bold text-slate-700">
              Contact Phone (optional)
            </Label>
            <Input
              id="visitPhone"
              type="tel"
              placeholder="e.g. +237 677 889 900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-semibold text-xs md:text-sm text-title h-11 px-3.5 border-slate-200 rounded-xl focus:border-button-color focus:ring-0 focus:outline-none transition-none"
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
