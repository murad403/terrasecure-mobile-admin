"use client"
import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type SurveyorRecord } from './SurveyorCard'

export interface AssignmentRecord {
  id: string
  parcelId: string
  surveyorId: string
  visitType: string
  priority: 'Low' | 'Medium' | 'High'
  scheduledDateTime: string
  notes: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
}

interface EditSurveyorModalProps {
  isOpen: boolean
  onClose: () => void
  surveyors: SurveyorRecord[]
  assignment: AssignmentRecord | null
  onSave: (updated: AssignmentRecord) => void
}

const EditSurveyorModal = ({
  isOpen,
  onClose,
  surveyors,
  assignment,
  onSave,
}: EditSurveyorModalProps) => {
  const [parcelId, setParcelId] = useState('')
  const [selectedSurveyorId, setSelectedSurveyorId] = useState('')
  const [visitType, setVisitType] = useState('Initial Survey')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && assignment) {
      document.body.style.overflow = 'hidden'
      setParcelId(assignment.parcelId)
      setSelectedSurveyorId(assignment.surveyorId)
      setVisitType(assignment.visitType)
      setPriority(assignment.priority)
      setScheduledDateTime(assignment.scheduledDateTime)
      setNotes(assignment.notes)
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, assignment])

  if (!isOpen || !assignment) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcelId.trim()) { setError('Parcel ID is required'); return }
    if (!scheduledDateTime) { setError('Scheduled Date & Time is required'); return }
    setError('')
    onSave({
      ...assignment,
      parcelId,
      surveyorId: selectedSurveyorId,
      visitType,
      priority,
      scheduledDateTime,
      notes,
    })
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
            <h2 className="text-base font-extrabold text-slate-900 leading-none">Edit Assignment</h2>
            <p className="text-xs text-slate-500 font-medium">Update the surveyor assignment details</p>
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
            <Label htmlFor="editParcelId">Parcel ID *</Label>
            <Input
              id="editParcelId"
              placeholder="e.g. CM-2849"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
            />
          </div>

          {/* Select Surveyor List */}
          <div className="space-y-2">
            <Label>Select Surveyor *</Label>
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
                        : "bg-white border-slate-200 hover:bg-slate-50/60"
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
              <Label htmlFor="editVisitType">Visit Type</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger id="editVisitType" className="w-full">
                  <SelectValue placeholder="Select Visit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Initial Survey">Initial Survey</SelectItem>
                  <SelectItem value="Verification Visit">Verification Visit</SelectItem>
                  <SelectItem value="Dispute Investigation">Dispute Investigation</SelectItem>
                  <SelectItem value="Re-survey">Re-survey</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editPriority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as 'Low' | 'Medium' | 'High')}>
                <SelectTrigger id="editPriority" className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scheduled Date & Time */}
          <div className="space-y-1.5">
            <Label htmlFor="editDateTime">Scheduled Date & Time *</Label>
            <Input
              id="editDateTime"
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
            />
          </div>

          {/* Notes / Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="editNotes">Notes / Instructions</Label>
            <textarea
              id="editNotes"
              placeholder="Special instructions for the surveyor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
            />
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
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSurveyorModal