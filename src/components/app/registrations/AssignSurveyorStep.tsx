"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAssignSurveyorMutation } from '@/redux/features/registrations/registration.api'
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api'
import { toast } from 'sonner'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface AssignSurveyorStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const AssignSurveyorStep: React.FC<AssignSurveyorStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [assignSurveyor, { isLoading }] = useAssignSurveyorMutation()
  const { data: usersData } = useRetrieveUsersQuery(undefined);

  const currentSurveyorId = registration.siteVisit?.surveyorId || registration.siteVisit?.surveyor?.id
  const [selectedSurveyorId, setSelectedSurveyorId] = useState<string>(
    currentSurveyorId ? String(currentSurveyorId) : ''
  )

  const isStepCompleted = (registration.step || 1) > 3

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSurveyorId) {
      toast.error('Please enter or select a Surveyor ID.')
      return
    }

    try {
      await assignSurveyor({
        id: registration.id,
        data: { surveyorId: Number(selectedSurveyorId) },
      }).unwrap()
      toast.success('Surveyor assigned successfully!')
      onNextStep()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to assign surveyor.')
    }
  }

  const usersList = usersData?.data || usersData || []

  return (
    <form onSubmit={handleAssign} className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 3: Assign Surveyor</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Assign licensed field surveyor'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Currently assigned surveyor badge if exists */}
      {registration.siteVisit?.surveyor && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 block">
              Currently Assigned Surveyor: {registration.siteVisit.surveyor.name}
            </span>
            <span className="text-[11px] text-emerald-650">
              Surveyor ID: #{registration.siteVisit.surveyor.id}
            </span>
          </div>
        </div>
      )}

      {/* Surveyor Selection / Input */}
      <div className="space-y-4">
        {Array.isArray(usersList) && usersList.length > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="surveyorSelect" className="text-xs font-bold text-slate-700">
              Select Certified Surveyor
            </Label>
            <Select
              value={selectedSurveyorId}
              onValueChange={(val) => setSelectedSurveyorId(val)}
            >
              <SelectTrigger id="surveyorSelect" className="w-full">
                <SelectValue placeholder="Select Surveyor" />
              </SelectTrigger>
              <SelectContent>
                {usersList.map((user: any) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name || user.fullName || user.email} (ID: {user.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="surveyorIdInput" className="text-xs font-bold text-slate-700">
              Surveyor ID
            </Label>
            <Input
              id="surveyorIdInput"
              type="number"
              placeholder="e.g. 2"
              value={selectedSurveyorId}
              onChange={(e) => setSelectedSurveyorId(e.target.value)}
              className="w-full text-xs font-semibold"
              required
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading ? 'Assigning...' : 'Assign Surveyor'}
        </Button>
      </div>
    </form>
  )
}

export default AssignSurveyorStep