"use client"
import React, { useState, useEffect } from 'react'
import { X, Edit3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LandParcelSurveySource, LandParcelSurveyStatus } from '@/enum'
import { useUpdateSurveyMutation } from '@/redux/features/survey/survey.api'

interface EditSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
  initialSource?: string | null
  initialArea?: number | null
  initialScore?: number | null
  initialStatus?: string | null
}

const EditSurveyModal: React.FC<EditSurveyModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  initialSource,
  initialArea,
  initialScore,
  initialStatus,
}) => {
  const [source, setSource] = useState<string>(initialSource || 'MOBILE_GPS')
  const [computedAreaSqm, setComputedAreaSqm] = useState<string>(initialArea ? String(initialArea) : '')
  const [reliabilityScore, setReliabilityScore] = useState<string>(initialScore != null ? String(initialScore) : '')
  const [status, setStatus] = useState<string>(initialStatus || 'DRAFT')

  const [updateSurvey, { isLoading }] = useUpdateSurveyMutation()

  useEffect(() => {
    if (isOpen) {
      setSource(initialSource || 'MOBILE_GPS')
      setComputedAreaSqm(initialArea ? String(initialArea) : '')
      setReliabilityScore(initialScore != null ? String(initialScore) : '')
      setStatus(initialStatus || 'DRAFT')
    }
  }, [isOpen, initialSource, initialArea, initialScore, initialStatus])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyId) return

    try {
      const res = await updateSurvey({
        id: surveyId,
        data: {
          source: source as any,
          computedAreaSqm: computedAreaSqm ? Number(computedAreaSqm) : undefined,
          reliabilityScore: reliabilityScore ? Number(reliabilityScore) : undefined,
          status: status as any,
        },
      }).unwrap()

      toast.success(res.message || 'Survey updated successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update survey.')
    }
  }

  const sourceOptions = Object.values(LandParcelSurveySource)
  const statusOptions = Object.values(LandParcelSurveyStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-button-color/10 flex items-center justify-center text-button-color font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Edit Survey Parameters</h2>
              <p className="text-[11px] text-slate-500">Update source, area & status for Survey #{surveyId}</p>
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
          {/* Source */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Survey Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-button-color"
            >
              {sourceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Computed Area (Sqm) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Computed Area (sqm)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 1250.75"
              value={computedAreaSqm}
              onChange={(e) => setComputedAreaSqm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-button-color"
            />
          </div>

          {/* Reliability Score */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Reliability Score (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 10"
              value={reliabilityScore}
              onChange={(e) => setReliabilityScore(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-button-color"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-button-color"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Update Survey</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSurveyModal
