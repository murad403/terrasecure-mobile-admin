import React, { useState } from 'react'
import { Parcel, Criterion } from './ReliabilityScorePage'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface ParcelScoresProps {
  parcels: Parcel[];
  criteria: Criterion[];
}

const ParcelScoresTab = ({ parcels, criteria }: ParcelScoresProps) => {
  // Pre-expand 'CM-2848' to match the second screenshot's open state by default.
  const [expandedParcels, setExpandedParcels] = useState<Record<string, boolean>>({
    'CM-2848': true,
  })

  const toggleExpand = (id: string) => {
    setExpandedParcels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getBandStyles = (band: 'Very High' | 'High' | 'Medium' | 'Low') => {
    switch (band) {
      case 'Very High':
        return {
          text: 'text-emerald-800',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-100',
          circleBorder: 'border-emerald-500 text-emerald-700',
          progressBar: 'bg-emerald-600',
          progressText: 'text-emerald-700',
        }
      case 'High':
        return {
          text: 'text-[#059669]',
          badge: 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]',
          circleBorder: 'border-[#10b981] text-[#059669]',
          progressBar: 'bg-[#10b981]',
          progressText: 'text-[#059669]',
        }
      case 'Medium':
        return {
          text: 'text-amber-800',
          badge: 'bg-amber-50 text-amber-800 border-amber-100',
          circleBorder: 'border-amber-500 text-amber-700',
          progressBar: 'bg-amber-500',
          progressText: 'text-amber-700',
        }
      case 'Low':
        return {
          text: 'text-red-800',
          badge: 'bg-red-50 text-red-800 border-red-100',
          circleBorder: 'border-red-500 text-red-600',
          progressBar: 'bg-red-500',
          progressText: 'text-red-600',
        }
      default:
        return {
          text: 'text-gray-800',
          badge: 'bg-gray-50 text-gray-800 border-gray-100',
          circleBorder: 'border-gray-500 text-gray-800',
          progressBar: 'bg-gray-500',
          progressText: 'text-gray-700',
        }
    }
  }

  return (
    <div className="space-y-4">
      {parcels.map((parcel) => {
        const isExpanded = !!expandedParcels[parcel.id]
        const styles = getBandStyles(parcel.band)

        return (
          <div
            key={parcel.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 transition-all"
          >
            {/* Clickable Header for Collapsing/Expanding */}
            <div
              onClick={() => toggleExpand(parcel.id)}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
            >
              {/* Left Column: Score Circle, Details, Indicators */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Score Circle */}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-base ${styles.circleBorder} shrink-0`}
                >
                  {parcel.score}
                </div>

                {/* Details & Checklist Row */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{parcel.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${styles.badge}`}>
                      {parcel.band}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{parcel.name}</p>

                  {/* Checklist Indicators */}
                  <div className="flex items-center space-x-1 mt-2">
                    {parcel.criteriaStatus.map((met, idx) => {
                      return met ? (
                        <div
                          key={idx}
                          className="w-4 h-4 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-[9px] rounded font-extrabold"
                          title={criteria[idx]?.name}
                        >
                          ✓
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className="w-4 h-4 bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-[9px] rounded font-extrabold"
                          title={criteria[idx]?.name}
                        >
                          ✗
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Middle Right: Progress bar & numeric rating */}
              <div className="flex items-center space-x-4 w-full md:w-auto min-w-[200px] justify-between md:justify-end">
                <div className="flex items-center space-x-2 flex-1 md:flex-none">
                  <span className="text-[10px] text-gray-400 font-semibold">0</span>
                  <div className="w-full md:w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${styles.progressBar} rounded-full transition-all duration-500`}
                      style={{ width: `${parcel.score}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${styles.progressText} w-12 text-right`}>
                    {parcel.score}/100
                  </span>
                </div>

                {/* Chevron icon */}
                <div className="text-gray-400 p-1 hover:bg-gray-50 rounded-full">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </div>
            </div>

            {/* Expanded Content: 2-column checklist summary grid */}
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-50 animate-fade-in">
                {criteria.map((criterion, index) => {
                  const met = parcel.criteriaStatus[index]
                  if (met) {
                    return (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100/70 text-emerald-800 rounded-lg px-3 py-2 text-xs font-medium"
                      >
                        <span className="flex items-center">
                          <span className="mr-1.5 font-extrabold text-emerald-600">✓</span>
                          {criterion.name}
                        </span>
                        <span className="font-bold">+{criterion.weight}%</span>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between bg-red-50/50 border border-red-100/70 text-red-800 rounded-lg px-3 py-2 text-xs font-medium"
                      >
                        <span className="flex items-center">
                          <span className="mr-1.5 font-extrabold text-red-500">✗</span>
                          {criterion.name}
                        </span>
                        <span className="font-bold">0%</span>
                      </div>
                    )
                  }
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ParcelScoresTab