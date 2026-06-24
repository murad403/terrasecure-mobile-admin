"use client"
import React, { useState, useEffect } from 'react'
import { X, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { type SurveyorRecord } from './SurveyorCard'

interface AssignSurveyorModalProps {
  isOpen: boolean
  onClose: () => void
  surveyors: SurveyorRecord[]
  onAssign: (data: {
    parcelId: string
    surveyorId: string
    visitType: string
    priority: 'Low' | 'Medium' | 'High'
    scheduledDateTime: string
    notes: string
    sendSms: boolean
  }) => void
}

const AssignSurveyorModal = ({
  isOpen,
  onClose,
  surveyors,
  onAssign
}: AssignSurveyorModalProps) => {
  const [parcelId, setParcelId] = useState('')
  const [selectedSurveyorId, setSelectedSurveyorId] = useState('')
  const [visitType, setVisitType] = useState('Initial Survey')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [sendSms, setSendSms] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setParcelId('')
      setSelectedSurveyorId(surveyors[0]?.id || '')
      setVisitType('Initial Survey')
      setPriority('Medium')
      setScheduledDateTime('')
      setNotes('')
      setSendSms(true)
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, surveyors])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcelId.trim()) { setError('Parcel ID is required'); return }
    if (!scheduledDateTime) { setError('Scheduled Date & Time is required'); return }
    setError('')
    onAssign({ parcelId, surveyorId: selectedSurveyorId, visitType, priority, scheduledDateTime, notes, sendSms })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-base font-extrabold text-slate-900 leading-none">Assign Surveyor</h2>
            <p className="text-xs text-slate-500 font-medium">Create a new surveyor assignment</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 select-none overflow-y-auto flex-1">
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          {/* Parcel ID */}
          <div className="space-y-1.5">
            <Label htmlFor="parcelIdInput" className="text-xs font-bold text-slate-700">Parcel ID *</Label>
            <Input
              id="parcelIdInput"
              placeholder="e.g. CM-2849"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              className="font-semibold text-xs h-10 px-3.5 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Select Surveyor List */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Select Surveyor *</Label>
            <div className="space-y-2 max-h-[230px] overflow-y-auto pr-0.5">
              {surveyors.map((surveyor) => {
                const isSelected = selectedSurveyorId === surveyor.id
                const avatarCls = cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 tracking-wider uppercase",
                  surveyor.status === 'busy'      && "bg-amber-100 text-amber-700",
                  surveyor.status === 'available' && "bg-emerald-100 text-emerald-700",
                  surveyor.status === 'offline'   && "bg-slate-100 text-slate-500"
                )
                const statusBadgeCls = cn(
                  "inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase",
                  surveyor.status === 'busy'      && 'bg-amber-50 text-amber-600 border border-amber-200',
                  surveyor.status === 'available' && 'bg-emerald-50 text-emerald-600 border border-emerald-200',
                  surveyor.status === 'offline'   && 'bg-slate-100 text-slate-500 border border-slate-200'
                )
                return (
                  <div
                    key={surveyor.id}
                    onClick={() => setSelectedSurveyorId(surveyor.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      isSelected
                        ? "bg-blue-50/30 border-blue-400 shadow-sm"
                        : "bg-white border-slate-150 hover:bg-slate-50/60 border-slate-200"
                    )}
                  >
                    <div className={avatarCls}>{surveyor.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 truncate">{surveyor.fullName}</span>
                        <span className={statusBadgeCls}>{surveyor.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {surveyor.region} · {surveyor.target} · {surveyor.activeCount} active · ⭐ {surveyor.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Visit Type & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="visitTypeSelect" className="text-xs font-bold text-slate-700">Visit Type</Label>
              <select
                id="visitTypeSelect"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none font-semibold cursor-pointer"
              >
                <option value="Initial Survey">Initial Survey</option>
                <option value="Verification Visit">Verification Visit</option>
                <option value="Dispute Investigation">Dispute Investigation</option>
                <option value="Re-survey">Re-survey</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prioritySelect" className="text-xs font-bold text-slate-700">Priority</Label>
              <select
                id="prioritySelect"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none font-semibold cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Scheduled Date & Time */}
          <div className="space-y-1.5">
            <Label htmlFor="dateTimeInput" className="text-xs font-bold text-slate-700">Scheduled Date & Time *</Label>
            <Input
              id="dateTimeInput"
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="font-semibold text-xs h-10 px-3.5 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 focus:outline-none transition-none"
            />
          </div>

          {/* Notes / Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="visitNotes" className="text-xs font-bold text-slate-700">Notes / Instructions</Label>
            <textarea
              id="visitNotes"
              placeholder="Special instructions for the surveyor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none font-semibold min-h-[80px] leading-relaxed resize-none"
            />
          </div>

          {/* SMS Checkbox */}
          <div
            onClick={() => setSendSms(!sendSms)}
            className="flex items-center gap-2.5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
              className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-[11px] font-bold text-blue-600">Send SMS notification to surveyor</span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 border-none shadow-none"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              Create Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignSurveyorModal