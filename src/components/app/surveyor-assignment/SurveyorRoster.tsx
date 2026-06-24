"use client"
import React from 'react'
import SurveyorCard, { type SurveyorRecord } from './SurveyorCard'

interface SurveyorRosterProps {
  surveyors: SurveyorRecord[]
}

const SurveyorRoster = ({ surveyors }: SurveyorRosterProps) => {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Surveyor Roster</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {surveyors.map((surveyor) => (
          <SurveyorCard key={surveyor.id} surveyor={surveyor} />
        ))}
      </div>
    </div>
  )
}

export default SurveyorRoster