"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useScheduleRegistrationSiteVisitMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface ScheduleFieldVisitStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

// Converts a Date object to local YYYY-MM-DDTHH:mm format for HTML datetime-local inputs
const formatToLocalDateTime = (date: Date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

const ScheduleFieldVisitStep: React.FC<ScheduleFieldVisitStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [scheduleSiteVisit, { isLoading }] = useScheduleRegistrationSiteVisitMutation()

  const initialScheduledAt = registration.siteVisit?.scheduledAt
    ? formatToLocalDateTime(new Date(registration.siteVisit.scheduledAt))
    : ''

  const [scheduledAt, setScheduledAt] = useState<string>(initialScheduledAt)
  const isStepCompleted = (registration.step || 1) > 4

  // Set the current local minute as the absolute minimum selectable date
  const minDateTime = formatToLocalDateTime()

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduledAt) {
      toast.error('Please select a date and time.')
      return
    }

    // Client-side validation fallback
    if (new Date(scheduledAt) < new Date()) {
      toast.error('Please select a future date and time.')
      return
    }

    try {
      const isoString = new Date(scheduledAt).toISOString()
      await scheduleSiteVisit({
        id: registration.id,
        data: { scheduledAt: isoString },
      }).unwrap()
      toast.success('Site visit scheduled successfully!')
      onNextStep()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to schedule site visit.')
    }
  }

  return (
    <form onSubmit={handleSchedule} className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 4: Schedule Field Visit</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Schedule on-ground parcel inspection'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Currently scheduled info */}
      {registration.siteVisit?.scheduledAt && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
          <span className="text-xs font-bold text-emerald-800 block">
            Scheduled Visit: {new Date(registration.siteVisit.scheduledAt).toLocaleString()}
          </span>
          {registration.siteVisit.surveyor && (
            <span className="text-[11px] text-emerald-650 block">
              Assigned Surveyor: {registration.siteVisit.surveyor.name}
            </span>
          )}
        </div>
      )}

      {/* Date Time Picker */}
      <div className="space-y-2">
        <Label htmlFor="scheduledAtInput" className="text-xs font-bold text-slate-700">
          Schedule Date & Time
        </Label>
        <Input
          id="scheduledAtInput"
          type="datetime-local"
          min={minDateTime}
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full text-xs font-semibold"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading ? 'Scheduling...' : 'Schedule Visit'}
        </Button>
      </div>
    </form>
  )
}

export default ScheduleFieldVisitStep