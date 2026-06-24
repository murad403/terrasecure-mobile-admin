"use client"
import React, { useState } from 'react'
import SiteVisitsTable from './SiteVisitsTable'
import ScheduleSiteVisitModal from './ScheduleSiteVisitModal'

export interface SiteVisitRecord {
  id: string
  parcelId: string
  surveyorName: string
  scheduledDate: string
  status: 'Scheduled' | 'Completed' | 'In Progress'
  notes: string
}

const initialVisits: SiteVisitRecord[] = [
  {
    id: 'VST-042',
    parcelId: 'CM-2849',
    surveyorName: 'Paul Biya Jr',
    scheduledDate: '15 Jun 2025 09:00',
    status: 'Scheduled',
    notes: 'Verify the northern plot coordinate boundary markers.'
  },
  {
    id: 'VST-041',
    parcelId: 'CM-2847',
    surveyorName: 'Martin Essono',
    scheduledDate: '12 Jun 2025 14:00',
    status: 'Completed',
    notes: 'Verify road access overlap alignment.'
  },
  {
    id: 'VST-040',
    parcelId: 'CM-2852',
    surveyorName: 'Paul Biya Jr',
    scheduledDate: '10 Jun 2025 10:30',
    status: 'In Progress',
    notes: 'Plot borders cleared, boundary points match survey charts.'
  },
  {
    id: 'VST-039',
    parcelId: 'CM-2850',
    surveyorName: 'Cécile Ondoua',
    scheduledDate: '5 Jun 2025 11:00',
    status: 'Completed',
    notes: 'Completed coordinates audit, files sent to GIS team.'
  },
  {
    id: 'VST-038',
    parcelId: 'CM-2848',
    surveyorName: 'Martin Essono',
    scheduledDate: '1 Jun 2025 09:30',
    status: 'Completed',
    notes: 'Applicant requested cancellation due to weather limits.'
  }
]

const SiteVisitsPage = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisitRecord[]>(initialVisits)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [surveyorFilter, setSurveyorFilter] = useState('All Surveyors')

  const handleScheduleVisit = (data: {
    parcelId: string
    surveyorName: string
    visitDate: string
    visitTime: string
    notes: string
  }) => {
    const nextNum = siteVisits.length > 0 
      ? parseInt(siteVisits[0].id.replace('VST-', '')) + 1
      : 43
    const newId = `VST-${String(nextNum).padStart(3, '0')}`

    // Format date nicely from input
    const formattedDate = new Date(data.visitDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    const newVisit: SiteVisitRecord = {
      id: newId,
      parcelId: data.parcelId,
      surveyorName: data.surveyorName,
      scheduledDate: `${formattedDate} ${data.visitTime}`,
      status: 'Scheduled',
      notes: data.notes
    }

    setSiteVisits([newVisit, ...siteVisits])
    setScheduleOpen(false)
  }

  const handleUpdateStatus = (id: string, status: 'Completed' | 'In Progress') => {
    setSiteVisits((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status }
        }
        return item
      })
    )
  }

  // Filter calculations
  const filteredVisits = siteVisits.filter((item) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.parcelId.toLowerCase().includes(query) ||
      item.surveyorName.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'All Statuses' || item.status === statusFilter

    const matchesSurveyor =
      surveyorFilter === 'All Surveyors' || item.surveyorName === surveyorFilter

    return matchesSearch && matchesStatus && matchesSurveyor
  })

  return (
    <div className="space-y-6">
      <SiteVisitsTable
        siteVisits={filteredVisits}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        surveyorFilter={surveyorFilter}
        setSurveyorFilter={setSurveyorFilter}
        onOpenScheduleModal={() => setScheduleOpen(true)}
      />

      {scheduleOpen && (
        <ScheduleSiteVisitModal
          isOpen={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onSchedule={handleScheduleVisit}
        />
      )}
    </div>
  )
}

export default SiteVisitsPage