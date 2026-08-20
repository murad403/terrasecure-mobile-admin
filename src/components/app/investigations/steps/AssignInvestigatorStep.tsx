"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { UserPicker } from '@/components/tools/UserPicker'
import type { User } from '@/interfaces/user.interface'
import { useAssignInvestigatorMutation } from '@/redux/features/investigations/investigations.api'
import {
  assignInvestigatorSchema,
  type AssignInvestigatorFormValues,
} from '@/validation/investigation.validation'
import type { LandInvestigationUser } from '@/redux/features/investigations/investigations.type';



interface AssignInvestigatorStepProps {
  investigationId: number | string
  currentInvestigator?: LandInvestigationUser | null
  onSuccess?: () => void
}

export const AssignInvestigatorStep = ({
  investigationId,
  currentInvestigator,
  onSuccess,
}: AssignInvestigatorStepProps) => {
  const [selectedUser, setSelectedUser] = useState<User[]>(() => {
    if (currentInvestigator) {
      return [
        {
          id: currentInvestigator.id,
          name: currentInvestigator.name,
          email: currentInvestigator.email || '',
          profilePicture: currentInvestigator.profilePicture || null,
        } as any,
      ]
    }
    return []
  })

  const [assignInvestigator, { isLoading }] = useAssignInvestigatorMutation()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignInvestigatorFormValues>({
    resolver: zodResolver(assignInvestigatorSchema),
    defaultValues: {
      investigatorId: currentInvestigator?.id ? Number(currentInvestigator.id) : undefined,
    },
  })

  React.useEffect(() => {
    if (currentInvestigator) {
      setSelectedUser([
        {
          id: currentInvestigator.id,
          name: currentInvestigator.name,
          email: currentInvestigator.email || '',
          profilePicture: currentInvestigator.profilePicture || null,
        } as any,
      ])
      setValue('investigatorId', Number(currentInvestigator.id))
    }
  }, [currentInvestigator, setValue])


  const onSubmit = async (values: AssignInvestigatorFormValues) => {
    if (!investigationId) {
      toast.error('Investigation ID is missing.')
      return
    }

    try {
      const res = await assignInvestigator({
        investigationId,
        data: { investigatorId: Number(values.investigatorId) },
      }).unwrap()

      toast.success(res.message || 'Investigator assigned successfully!')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to assign investigator.')
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-button-color" />
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Step 2: Assign Investigator
        </h4>
      </div>

      {currentInvestigator && (
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
            Currently Assigned Investigator
          </span>
          <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-button-color font-bold text-xs flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
              {currentInvestigator.profilePicture?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentInvestigator.profilePicture.url}
                  alt={currentInvestigator.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentInvestigator.name?.substring(0, 2).toUpperCase() || 'IN'
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {currentInvestigator.name}
              </span>
              {currentInvestigator.email && (
                <span className="text-[11px] font-semibold text-slate-500 truncate">
                  {currentInvestigator.email}
                </span>
              )}
              {currentInvestigator.phone && (
                <span className="text-[10px] font-semibold text-slate-400 truncate">
                  {currentInvestigator.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      )}


      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-700 block">
          Select System Investigator <span className="text-rose-500">*</span>
        </Label>
        <UserPicker
          value={selectedUser}
          type="radio"
          placeholder="Search and select investigator..."
          onChange={(users) => {
            setSelectedUser(users)
            if (users.length > 0) {
              setValue('investigatorId', Number(users[0].id), { shouldValidate: true })
            }
          }}
        />
        {errors.investigatorId && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.investigatorId.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || selectedUser.length === 0}
        className="w-full text-xs font-bold py-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Assigning...</span>
          </div>
        ) : (
          'Assign Investigator'
        )}
      </Button>
    </form>
  )
}

export default AssignInvestigatorStep
