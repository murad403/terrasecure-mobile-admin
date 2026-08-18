"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAssignSurveyorMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'
import { UserPicker } from '@/components/tools/UserPicker'
import { User } from '@/interfaces/user.interface'

interface AssignSurveyorStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const AssignSurveyorStep: React.FC<AssignSurveyorStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([registration.siteVisit?.surveyor].filter(Boolean) as User[]);

  const [assignSurveyor, { isLoading }] = useAssignSurveyorMutation()

  const isStepCompleted = (registration.step || 1) > 3

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUsers.length) {
      toast.error('Please enter or select a Surveyor.')
      return
    }

    try {
      await assignSurveyor({
        id: registration.id,
        data: { surveyorId: selectedUsers[0].id },
      }).unwrap()
      toast.success('Surveyor assigned successfully!')
      onNextStep()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to assign surveyor.')
    }
  }


  const handleUserSelect = (users: User[]) => {
    setSelectedUsers(users)
  }


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
        <div className="p-4 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3.5">
            {/* Avatar Container */}
            <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm bg-emerald-100 flex items-center justify-center">
              {registration.siteVisit.surveyor.profilePicture?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={registration.siteVisit.surveyor.profilePicture.url}
                  alt={`Profile picture of ${registration.siteVisit.surveyor.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-emerald-800">
                  {registration.siteVisit.surveyor.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info Group */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold tracking-wider text-emerald-600 uppercase">
                Assigned Surveyor
              </span>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">
                {registration.siteVisit.surveyor.name}
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                ID: #{registration.siteVisit.surveyor.id}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/60">
            Active
          </span>
        </div>
      )}

      {/* Todo: user role should be field agent */}
      <UserPicker type='radio' value={selectedUsers}
        onChange={handleUserSelect} />

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