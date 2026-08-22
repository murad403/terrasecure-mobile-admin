"use client"
import React, { useState, useEffect } from 'react'
import { X, UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useUpdateSurveySurveyorMutation } from '@/redux/features/survey/survey.api'
import { UserPicker } from '@/components/tools/UserPicker'
import { User } from '@/interfaces/user.interface'

interface AssignSurveyorModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
  currentSurveyor?: { id: number; name: string } | null
}

const AssignSurveyorModal: React.FC<AssignSurveyorModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  currentSurveyor,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const [updateSurveyor, { isLoading }] = useUpdateSurveySurveyorMutation()

  useEffect(() => {
    if (isOpen) {
      setSelectedUsers([])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyId) return

    const idToAssign = selectedUsers.length > 0 ? selectedUsers[0].id : null

    if (!idToAssign) {
      toast.warning('Please select a Surveyor.')
      return
    }

    try {
      const res = await updateSurveyor({
        id: surveyId,
        data: { surveyorId: idToAssign },
      }).unwrap()

      toast.success(res.message || 'Surveyor updated successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update surveyor.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-visible animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-button-color/10 flex items-center justify-center text-button-color font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Assign / Update Surveyor</h2>
              <p className="text-[11px] text-slate-500">Update assigned surveyor for Survey #{surveyId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {currentSurveyor && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="text-slate-500 font-medium block">Currently Assigned:</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {currentSurveyor.name} (ID: #{currentSurveyor.id})
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select Surveyor</label>
            <UserPicker
              value={selectedUsers}
              onChange={(users) => setSelectedUsers(users)}
              type="radio"
              placeholder="Search surveyor by name..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" className="w-auto" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2 w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Update Surveyor</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignSurveyorModal
