"use client"
import React, { useState } from 'react'
import { User, Clock, MapPin, Pencil, X, CheckCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import SurveyorRoster from './SurveyorRoster'
import AssignSurveyorModal from './AssignSurveyorModal'
import EditSurveyorModal, { type AssignmentRecord } from './EditSurveyorModal'
import { type SurveyorRecord } from './SurveyorCard'

/* ─── Static surveyor roster ─────────────────────────────── */
const INITIAL_SURVEYORS: SurveyorRecord[] = [
  { id: 'PBJ', fullName: 'Paul Biya Jr',   status: 'busy',      initials: 'PBJ', region: 'Centre Region',    target: 'Urban Parcels',    activeCount: 2, doneCount: 147, rating: 4.8 },
  { id: 'ME',  fullName: 'Martin Essono',  status: 'available', initials: 'ME',  region: 'Littoral Region',  target: 'GIS Mapping',      activeCount: 0, doneCount: 203, rating: 4.9 },
  { id: 'CO',  fullName: 'Cécile Ondoua',  status: 'available', initials: 'CO',  region: 'South Region',     target: 'Rural Parcels',    activeCount: 1, doneCount: 89,  rating: 4.6 },
  { id: 'AD',  fullName: 'Alain Dimi',     status: 'offline',   initials: 'AD',  region: 'Northwest Region', target: 'Boundary Disputes', activeCount: 0, doneCount: 64,  rating: 4.3 },
]

/* ─── Static initial assignments ─────────────────────────── */
const INITIAL_ASSIGNMENTS: AssignmentRecord[] = [
  {
    id: 'ASN-012', parcelId: 'CM-2849', surveyorId: 'PBJ',
    visitType: 'Initial Survey',       priority: 'High',
    scheduledDateTime: '2025-06-15T09:00',
    notes: 'GPS equipment confirmed. Check northern boundary carefully.',
    status: 'In Progress',
  },
  {
    id: 'ASN-011', parcelId: 'CM-2847', surveyorId: 'ME',
    visitType: 'Verification Visit',   priority: 'Medium',
    scheduledDateTime: '2025-06-12T14:00',
    notes: 'Completed. All 24 GPS points submitted.',
    status: 'Completed',
  },
  {
    id: 'ASN-010', parcelId: 'CM-2852', surveyorId: 'PBJ',
    visitType: 'Dispute Investigation', priority: 'High',
    scheduledDateTime: '2025-06-10T10:30',
    notes: 'Boundary dispute between CM-2932 and CM-2852.',
    status: 'In Progress',
  },
  {
    id: 'ASN-009', parcelId: 'CM-2850', surveyorId: 'CO',
    visitType: 'Initial Survey',       priority: 'Low',
    scheduledDateTime: '2025-06-05T11:00',
    notes: '',
    status: 'Completed',
  },
]

type FilterTab = 'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled']

/* ─── Helpers ─────────────────────────────────────────────── */
function formatDateTime(dt: string) {
  if (!dt) return '—'
  const d = new Date(dt)
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

function getSurveyorName(id: string, surveyors: SurveyorRecord[]) {
  return surveyors.find((s) => s.id === id)?.fullName ?? id
}

function statusBadgeCls(status: AssignmentRecord['status']) {
  return cn(
    "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide",
    status === 'In Progress' && "bg-blue-50 text-blue-600 border border-blue-200",
    status === 'Completed'   && "bg-emerald-50 text-emerald-600 border border-emerald-200",
    status === 'Pending'     && "bg-amber-50 text-amber-600 border border-amber-200",
    status === 'Cancelled'   && "bg-red-50 text-red-500 border border-red-200"
  )
}

function priorityBadgeCls(priority: AssignmentRecord['priority']) {
  return cn(
    "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide",
    priority === 'High'   && "bg-rose-50 text-rose-500 border border-rose-200",
    priority === 'Medium' && "bg-amber-50 text-amber-600 border border-amber-200",
    priority === 'Low'    && "bg-slate-100 text-slate-500 border border-slate-200"
  )
}

/* ─── Component ───────────────────────────────────────────── */
const SurveyorAssignmentPage = () => {
  const [surveyors]   = useState<SurveyorRecord[]>(INITIAL_SURVEYORS)
  const [assignments, setAssignments] = useState<AssignmentRecord[]>(INITIAL_ASSIGNMENTS)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All')
  const [isAssignOpen,  setIsAssignOpen]  = useState(false)
  const [isEditOpen,    setIsEditOpen]    = useState(false)
  const [editTarget, setEditTarget] = useState<AssignmentRecord | null>(null)

  /* ─── Filter ─── */
  const filtered = activeFilter === 'All'
    ? assignments
    : assignments.filter((a) => a.status === activeFilter)

  /* ─── Handlers ─── */
  const handleAssign = (data: {
    parcelId: string; surveyorId: string; visitType: string;
    priority: 'Low' | 'Medium' | 'High'; scheduledDateTime: string;
    notes: string; sendSms: boolean;
  }) => {
    const nextNum = assignments.length + 1
    const newId = `ASN-${String(nextNum).padStart(3, '0')}`
    const newRecord: AssignmentRecord = {
      id: newId,
      parcelId: data.parcelId,
      surveyorId: data.surveyorId,
      visitType: data.visitType,
      priority: data.priority,
      scheduledDateTime: data.scheduledDateTime,
      notes: data.notes,
      status: 'Pending',
    }
    setAssignments((prev) => [newRecord, ...prev])
    setIsAssignOpen(false)
  }

  const handleEdit = (assignment: AssignmentRecord) => {
    setEditTarget(assignment)
    setIsEditOpen(true)
  }

  const handleSave = (updated: AssignmentRecord) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setIsEditOpen(false)
    setEditTarget(null)
  }

  const handleCancel = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    )
  }

  return (
    <div className="space-y-5">
      {/* Surveyor Roster */}
      <SurveyorRoster surveyors={surveyors} />

      {/* Filter bar + action button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                activeFilter === tab
                  ? "bg-[#1b5e20] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAssignOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Assign Surveyor
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-sm font-semibold">
            No assignments found.
          </div>
        ) : (
          filtered.map((assignment) => {
            const isEditable = assignment.status === 'In Progress' || assignment.status === 'Pending'
            const isCompleted = assignment.status === 'Completed'

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row 1: IDs + badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-800">{assignment.id}</span>
                      <span className="text-xs font-extrabold text-blue-600">{assignment.parcelId}</span>
                      <span className={statusBadgeCls(assignment.status)}>{assignment.status}</span>
                      <span className={priorityBadgeCls(assignment.priority)}>{assignment.priority} priority</span>
                    </div>

                    {/* Row 2: meta info */}
                    <div className="flex items-center gap-4 flex-wrap text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 shrink-0" />
                        {getSurveyorName(assignment.surveyorId, surveyors)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        {formatDateTime(assignment.scheduledDateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {assignment.visitType}
                      </span>
                    </div>

                    {/* Row 3: notes */}
                    {assignment.notes && (
                      <p className="text-[11px] text-slate-400 font-medium italic truncate">
                        {assignment.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      isEditable && (
                        <>
                          <button
                            onClick={() => handleEdit(assignment)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancel(assignment.id)}
                            title="Cancel"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modals */}
      <AssignSurveyorModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        surveyors={surveyors}
        onAssign={handleAssign}
      />
      <EditSurveyorModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditTarget(null) }}
        surveyors={surveyors}
        assignment={editTarget}
        onSave={handleSave}
      />
    </div>
  )
}

export default SurveyorAssignmentPage