"use client"
import { useState, useEffect } from 'react'
import { Pencil, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetTermsConditionsQuery, useUpdateTermsConditionsMutation } from '@/redux/features/auth/auth.api'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { toast } from 'sonner'

const TermsConditionsPage = () => {
  const { data: getRes, isLoading, isError, refetch } = useGetTermsConditionsQuery()
  const [updateTermsConditions, { isLoading: isUpdating }] = useUpdateTermsConditionsMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')

  // Sync content state when backend data is loaded
  useEffect(() => {
    if (getRes?.data !== undefined) {
      setContent(getRes.data || '')
    }
  }, [getRes])

  const startEditing = () => {
    setContent(getRes?.data || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setContent(getRes?.data || '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      const res = await updateTermsConditions({ data: content }).unwrap()
      if (res.success) {
        toast.success(res.message || 'Terms & Conditions updated successfully!')
        setIsEditing(false)
      } else {
        toast.error(res.message || 'Failed to update Terms & Conditions.')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error updating Terms & Conditions.')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6 relative">
      
      {/* Header and Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">Terms & Conditions</h2>
          <p className="text-xs text-gray-500 font-light">
            Manage legal agreements, user terms of service, and guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-auto py-2 flex items-center gap-1.5"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              disabled={isLoading}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/60 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              Edit Terms
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-7 h-7 text-button-color animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading Terms & Conditions...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-500">Failed to load Terms & Conditions.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-bold text-button-color hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : isEditing ? (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Edit HTML Content
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write Terms & Conditions content..."
            minHeight="380px"
          />
        </div>
      ) : (
        <div className="border border-gray-100 rounded-xl p-6 min-h-80 bg-slate-50/30">
          {getRes?.data ? (
            <div
              className="text-sm text-slate-700 leading-relaxed font-normal [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:my-3 [&_h1]:block [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:my-2.5 [&_h2]:block [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:my-2 [&_h3]:block [&_p]:my-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1"
              dangerouslySetInnerHTML={{ __html: getRes.data }}
            />
          ) : (
            <div className="flex items-center justify-center h-48 text-xs font-semibold text-slate-400">
              No Terms & Conditions content found. Click "Edit Terms" to add content.
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default TermsConditionsPage