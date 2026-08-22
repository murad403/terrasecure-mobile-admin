"use client"
import React from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useDeleteSurveyMutation } from '@/redux/features/survey/survey.api'

interface DeleteSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
}

const DeleteSurveyModal: React.FC<DeleteSurveyModalProps> = ({
  isOpen,
  onClose,
  surveyId,
}) => {
  const [deleteSurvey, { isLoading }] = useDeleteSurveyMutation()

  if (!isOpen) return null

  const handleDelete = async () => {
    if (!surveyId) return

    try {
      const res = await deleteSurvey(surveyId).unwrap()
      toast.success(res.message || 'Land parcel survey deleted successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete survey.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h2 className="text-base font-bold text-slate-900">Delete Land Survey</h2>
        <p className="text-xs text-slate-500 mt-1">
          Are you sure you want to delete Survey <strong className="text-slate-800">#{surveyId}</strong>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSurveyModal
