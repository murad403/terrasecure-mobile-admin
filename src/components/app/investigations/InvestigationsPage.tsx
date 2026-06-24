"use client"
import React, { useState } from 'react'
import InvestigationsTable from './InvestigationsTable'
import InvestigationDetailsModal from './InvestigationDetailsModal'
import CreateInvestigationModal from './CreateInvestigationModal'

export interface TimelineStep {
  stepNumber: number
  title: string
  subtext: string
  isCompleted: boolean
}

export interface InvestigationRecord {
  id: string
  title: string
  parcelId: string
  assigneeName: string
  assigneeRole: string
  status: 'Open' | 'In Progress' | 'Closed'
  createdDate: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  type: string
  timeline: TimelineStep[]
  notes: string
  uploadedFiles: string[]
}

const initialInvestigations: InvestigationRecord[] = [
  {
    id: 'INV-047',
    title: 'Boundary Overlap Investigation',
    parcelId: 'CM-2848',
    assigneeName: 'Inspector Alain Dimi',
    assigneeRole: 'Senior Investigator',
    status: 'Open',
    createdDate: '5 Jun 2025',
    description: 'Dispute filed regarding overlap with adjacent parcel boundary limits. Survey data verification required.',
    priority: 'High',
    type: 'Boundary Overlap',
    timeline: [
      { stepNumber: 1, title: 'Case Opened', subtext: 'Admin Jean Alima · 5 Jun 2025', isCompleted: true },
      { stepNumber: 2, title: 'Investigator Assigned', subtext: 'Inspector Alain Dimi · 6 Jun 2025', isCompleted: true },
      { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · Pending', isCompleted: false },
      { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · Pending', isCompleted: false }
    ],
    notes: '',
    uploadedFiles: []
  },
  {
    id: 'INV-046',
    title: 'Duplicate Registration Claim',
    parcelId: 'CM-2854',
    assigneeName: 'Inspector Marie Bello',
    assigneeRole: 'Lead Land Inspector',
    status: 'In Progress',
    createdDate: '1 Jun 2025',
    description: 'Two separate applicants claims registered on the same coordinates zone in Yaoundé.',
    priority: 'High',
    type: 'Duplicate Claim',
    timeline: [
      { stepNumber: 1, title: 'Case Opened', subtext: 'Admin Jean Alima · 1 Jun 2025', isCompleted: true },
      { stepNumber: 2, title: 'Investigator Assigned', subtext: 'Inspector Marie Bello · 2 Jun 2025', isCompleted: true },
      { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · Pending', isCompleted: false },
      { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · Pending', isCompleted: false }
    ],
    notes: '',
    uploadedFiles: []
  },
  {
    id: 'INV-045',
    title: 'Fraudulent Document Submission',
    parcelId: 'CM-2881',
    assigneeName: 'Inspector Paul Njoya',
    assigneeRole: 'Title Auditor',
    status: 'Closed',
    createdDate: '20 May 2025',
    description: 'Ownership certificate documents submitted appear to have forged seals and signatures.',
    priority: 'High',
    type: 'Fraudulent Document',
    timeline: [
      { stepNumber: 1, title: 'Case Opened', subtext: 'Admin Jean Alima · 20 May 2025', isCompleted: true },
      { stepNumber: 2, title: 'Investigator Assigned', subtext: 'Inspector Paul Njoya · 21 May 2025', isCompleted: true },
      { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · 23 May 2025', isCompleted: true },
      { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · 25 May 2025', isCompleted: true }
    ],
    notes: 'The signatures on the title deed do not match records in the central registry database.',
    uploadedFiles: ['deed_audit_report.pdf']
  },
  {
    id: 'INV-044',
    title: 'Ownership Dispute - Family Claim',
    parcelId: 'CM-2790',
    assigneeName: 'Inspector Alain Dimi',
    assigneeRole: 'Senior Investigator',
    status: 'In Progress',
    createdDate: '15 May 2025',
    description: 'Inheritance dispute concerning the partition of plot limits between heirs.',
    priority: 'Medium',
    type: 'Family Dispute',
    timeline: [
      { stepNumber: 1, title: 'Case Opened', subtext: 'Admin Jean Alima · 15 May 2025', isCompleted: true },
      { stepNumber: 2, title: 'Investigator Assigned', subtext: 'Inspector Alain Dimi · 16 May 2025', isCompleted: true },
      { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · Pending', isCompleted: false },
      { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · Pending', isCompleted: false }
    ],
    notes: '',
    uploadedFiles: []
  },
  {
    id: 'INV-043',
    title: 'Invalid GPS Polygon Submission',
    parcelId: 'CM-2751',
    assigneeName: 'Inspector Cécile Eba',
    assigneeRole: 'GIS Mapping Specialist',
    status: 'Closed',
    createdDate: '2 May 2025',
    description: 'GPS survey coordinates submitted create a polygon shape that intersects with a public highway reserve.',
    priority: 'Medium',
    type: 'Invalid GPS',
    timeline: [
      { stepNumber: 1, title: 'Case Opened', subtext: 'Admin Jean Alima · 2 May 2025', isCompleted: true },
      { stepNumber: 2, title: 'Investigator Assigned', subtext: 'Inspector Cécile Eba · 3 May 2025', isCompleted: true },
      { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · 5 May 2025', isCompleted: true },
      { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · 8 May 2025', isCompleted: true }
    ],
    notes: 'Corrected coordinate map submitted, public reserve overlap resolved.',
    uploadedFiles: ['revised_gis_overlap_fix.shp']
  }
]

const InvestigationsPage = () => {
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>(initialInvestigations)
  const [selectedInvestigation, setSelectedInvestigation] = useState<InvestigationRecord | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [assigneeFilter, setAssigneeFilter] = useState('Assignee')

  const handleCreateCase = (data: {
    title: string
    parcelId: string
    type: string
    priority: 'High' | 'Medium' | 'Low'
    assigneeName: string
    description: string
  }) => {
    const newNum = investigations.length > 0 
      ? parseInt(investigations[0].id.replace('INV-', '')) + 1
      : 48
    const newId = `INV-${String(newNum).padStart(3, '0')}`

    const newCase: InvestigationRecord = {
      id: newId,
      title: data.title,
      parcelId: data.parcelId,
      assigneeName: data.assigneeName,
      assigneeRole: data.assigneeName === 'Inspector Alain Dimi' ? 'Senior Investigator' : 'Lead Inspector',
      status: 'Open',
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: data.description,
      priority: data.priority,
      type: data.type,
      timeline: [
        { stepNumber: 1, title: 'Case Opened', subtext: `Admin Jean Alima · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, isCompleted: true },
        { stepNumber: 2, title: 'Investigator Assigned', subtext: `${data.assigneeName} · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, isCompleted: true },
        { stepNumber: 3, title: 'Findings Uploaded', subtext: 'Report submitted · Pending', isCompleted: false },
        { stepNumber: 4, title: 'Case Closed', subtext: 'Resolution documented · Pending', isCompleted: false }
      ],
      notes: '',
      uploadedFiles: []
    }

    setInvestigations([newCase, ...investigations])
    setCreateOpen(false)
  }

  const handleReassign = (id: string, newInspector: string) => {
    setInvestigations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTimeline = item.timeline.map((step) => {
            if (step.stepNumber === 2) {
              return {
                ...step,
                subtext: `${newInspector} · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
              }
            }
            return step
          })

          const updated: InvestigationRecord = {
            ...item,
            assigneeName: newInspector,
            timeline: updatedTimeline
          }

          if (selectedInvestigation && selectedInvestigation.id === id) {
            setSelectedInvestigation(updated)
          }
          return updated
        }
        return item
      })
    )
  }

  const handleUploadFindings = (id: string, notesText: string, fileName?: string) => {
    setInvestigations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTimeline = item.timeline.map((step) => {
            if (step.stepNumber === 3) {
              return {
                ...step,
                subtext: `Report submitted · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                isCompleted: true
              }
            }
            return step
          })

          const files = item.uploadedFiles
          if (fileName && !files.includes(fileName)) {
            files.push(fileName)
          }

          const updated: InvestigationRecord = {
            ...item,
            notes: notesText,
            timeline: updatedTimeline,
            status: item.status === 'Open' ? 'In Progress' : item.status,
            uploadedFiles: files
          }

          if (selectedInvestigation && selectedInvestigation.id === id) {
            setSelectedInvestigation(updated)
          }
          return updated
        }
        return item
      })
    )
  }

  const handleCloseCase = (id: string) => {
    setInvestigations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTimeline = item.timeline.map((step) => {
            if (step.stepNumber === 4) {
              return {
                ...step,
                subtext: `Resolution documented · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                isCompleted: true
              }
            }
            return step
          })

          const updated: InvestigationRecord = {
            ...item,
            status: 'Closed',
            timeline: updatedTimeline
          }

          if (selectedInvestigation && selectedInvestigation.id === id) {
            setSelectedInvestigation(updated)
          }
          return updated
        }
        return item
      })
    )
  }

  const handleOpenDetails = (item: InvestigationRecord) => {
    setSelectedInvestigation(item)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedInvestigation(null)
    setDetailsOpen(false)
  }

  // Filter calculations
  const filteredInvestigations = investigations.filter((item) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.parcelId.toLowerCase().includes(query) ||
      item.assigneeName.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'All Statuses' || item.status === statusFilter

    const matchesAssignee =
      assigneeFilter === 'Assignee' || item.assigneeName === assigneeFilter

    return matchesSearch && matchesStatus && matchesAssignee
  })

  return (
    <div className="space-y-6 select-none">
      <InvestigationsTable
        investigations={filteredInvestigations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        onOpenCreateModal={() => setCreateOpen(true)}
        onViewDetails={handleOpenDetails}
      />

      {/* Centered Create Modal */}
      {createOpen && (
        <CreateInvestigationModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreateCase}
        />
      )}

      {/* Slide-out details drawer */}
      {detailsOpen && selectedInvestigation && (
        <InvestigationDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          investigation={selectedInvestigation}
          onReassign={(newInspector) => handleReassign(selectedInvestigation.id, newInspector)}
          onUploadFindings={(notes, file) => handleUploadFindings(selectedInvestigation.id, notes, file)}
          onCloseCase={() => {
            handleCloseCase(selectedInvestigation.id)
            handleCloseDetails()
          }}
        />
      )}
    </div>
  )
}

export default InvestigationsPage