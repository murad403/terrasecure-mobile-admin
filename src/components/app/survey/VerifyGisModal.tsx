"use client"
import React, { useState, useEffect } from 'react'
import { X, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useVerifyGisDataForsurveryMutation } from '@/redux/features/survey/survey.api'

interface VerifyGisModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
  initialScore?: number | null
  initialStatus?: string | null
  initialNotes?: string | null
}

const VerifyGisModal: React.FC<VerifyGisModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  initialScore,
  initialStatus,
  initialNotes,
}) => {
  const [reliabilityScore, setReliabilityScore] = useState<number>(initialScore ?? 10)
  const [status, setStatus] = useState<'VALIDATED' | 'REJECTED'>(
    initialStatus === 'REJECTED' ? 'REJECTED' : 'VALIDATED'
  )
  const [validationNotes, setValidationNotes] = useState<string>(initialNotes ?? '')

  const [verifyGis, { isLoading }] = useVerifyGisDataForsurveryMutation()

  useEffect(() => {
    if (isOpen) {
      setReliabilityScore(initialScore ?? 10)
      setStatus(initialStatus === 'REJECTED' ? 'REJECTED' : 'VALIDATED')
      setValidationNotes(initialNotes ?? '')
    }
  }, [isOpen, initialScore, initialStatus, initialNotes])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyId) return

    try {
      const res = await verifyGis({
        id: surveyId,
        data: {
          reliabilityScore: Number(reliabilityScore),
          status,
          validationNotes: validationNotes.trim() || undefined,
        },
      }).unwrap()

      toast.success(res.message || 'GIS data verified successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to verify GIS data.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Verify GIS Survey Data</h2>
              <p className="text-[11px] text-slate-500">Review & verify GIS spatial accuracy for Survey #{surveyId}</p>
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
          {/* Verification Decision */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Verification Decision</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('VALIDATED')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  status === 'VALIDATED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>VALIDATED</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('REJECTED')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  status === 'REJECTED'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <X className="w-4 h-4 text-rose-600" />
                <span>REJECTED</span>
              </button>
            </div>
          </div>

          {/* Reliability Score (0 to 100) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Reliability Score (0 - 100)</label>
              <span className="font-mono font-bold text-button-color bg-button-color/10 px-2 py-0.5 rounded">
                {reliabilityScore} / 100
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={reliabilityScore}
              onChange={(e) => setReliabilityScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-button-color"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Low)</span>
              <span>50 (Medium)</span>
              <span>100 (High Precision)</span>
            </div>
          </div>

          {/* Validation Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Validation Notes</label>
            <textarea
              rows={3}
              placeholder="Add review notes or findings..."
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-button-color placeholder:text-slate-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Verification</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyGisModal
