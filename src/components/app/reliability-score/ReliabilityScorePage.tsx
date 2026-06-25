"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import ReliabilityScoreManagementStats from './ReliabilityScoreManagementStats'
import ReliabilityScoreManagementTabs from './ReliabilityScoreManagementTabs'
import ScoringCriteriaTab from './ScoringCriteriaTab'
import ParcelScoresTab from './ParcelScoresTab'

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: 'Documents' | 'GIS / GPS' | 'Legal' | 'History';
}

export interface Parcel {
  id: string;
  name: string;
  score: number;
  band: 'Very High' | 'High' | 'Medium' | 'Low';
  criteriaStatus: boolean[]; // Array of 8 booleans
}

const defaultCriteria: Criterion[] = [
  {
    id: 'c1',
    name: 'Title Deed Present',
    description: 'Original title deed or legal document present and verified',
    weight: 25,
    category: 'Documents',
  },
  {
    id: 'c2',
    name: 'Survey Plan Verified',
    description: 'Official survey plan with surveyor stamp and GPS coordinates',
    weight: 20,
    category: 'GIS / GPS',
  },
  {
    id: 'c3',
    name: 'GPS Accuracy (< 5m)',
    description: 'GPS points collected within 5-metre tolerance',
    weight: 15,
    category: 'GIS / GPS',
  },
  {
    id: 'c4',
    name: 'No Boundary Overlap',
    description: 'Parcel polygon does not intersect any existing registered parcel',
    weight: 15,
    category: 'GIS / GPS',
  },
  {
    id: 'c5',
    name: 'Owner ID Verified',
    description: 'National ID / passport of registered owner verified against civil registry',
    weight: 10,
    category: 'Legal',
  },
  {
    id: 'c6',
    name: 'Tax Clearance',
    description: 'Land tax clearance certificate from municipal authority',
    weight: 8,
    category: 'Legal',
  },
  {
    id: 'c7',
    name: 'No Active Disputes',
    description: 'No open investigation or conflict case linked to this parcel',
    weight: 5,
    category: 'Legal',
  },
  {
    id: 'c8',
    name: 'Clean Ownership History',
    description: 'No prior fraud flags, reversals, or contested transfers',
    weight: 2,
    category: 'History',
  },
]

const initialParcels: Parcel[] = [
  {
    id: 'CM-2847',
    name: 'Pierre Mballa',
    score: 95,
    band: 'Very High',
    criteriaStatus: [true, true, true, true, true, true, true, true],
  },
  {
    id: 'CM-2848',
    name: 'Amina Fouda',
    score: 42,
    band: 'Low',
    criteriaStatus: [true, false, false, true, true, false, false, false],
  },
  {
    id: 'CM-2849',
    name: 'Jean-Pierre Nkodou',
    score: 68,
    band: 'Medium',
    criteriaStatus: [true, true, false, true, true, true, false, false],
  },
  {
    id: 'CM-2850',
    name: 'Grace Tanda',
    score: 81,
    band: 'High',
    criteriaStatus: [true, true, true, true, false, true, true, false],
  },
  {
    id: 'CM-2851',
    name: 'François Ngono',
    score: 93,
    band: 'Very High',
    criteriaStatus: [true, true, true, true, true, true, true, false],
  },
]

const ReliabilityScorePage = () => {
  const [activeTab, setActiveTab] = useState<'scoring-criteria' | 'parcel-scores'>('scoring-criteria')
  const [criteria, setCriteria] = useState<Criterion[]>(defaultCriteria)

  const defaultOffsets: Record<string, number> = {
    'CM-2847': -5,
    'CM-2848': -8,
    'CM-2849': -10,
    'CM-2850': -7,
    'CM-2851': -5,
  }

  // Calculate score and band dynamically based on the current criteria weights and predefined statuses
  const parcels = initialParcels.map((p) => {
    let rawScore = 0
    p.criteriaStatus.forEach((met, index) => {
      if (met && criteria[index]) {
        rawScore += criteria[index].weight
      }
    })

    const offset = defaultOffsets[p.id] || 0
    const calculatedScore = Math.min(100, Math.max(0, rawScore + offset))

    let band: 'Very High' | 'High' | 'Medium' | 'Low' = 'Low'
    if (calculatedScore >= 90) band = 'Very High'
    else if (calculatedScore >= 70) band = 'High'
    else if (calculatedScore >= 50) band = 'Medium'

    return {
      ...p,
      score: calculatedScore,
      band,
    }
  })

  // Calculate stats based on computed parcels
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
  const criteriaCount = criteria.length
  const veryHighParcelsCount = 2841 // Fixed based on screen
  const lowReliabilityCount = 213   // Fixed based on screen

  const handleUpdateCriterion = (updated: Criterion) => {
    setCriteria((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  return (
    <DashboardChildrenLayout
      title="Reliability Score Management"
      subtitle="Configure scoring criteria and monitor parcel reliability ratings"
    >
      <div className="space-y-6">
        {/* Stats and Score Bands Panels */}
        <ReliabilityScoreManagementStats
          totalWeight={totalWeight}
          criteriaCount={criteriaCount}
          veryHighCount={veryHighParcelsCount}
          lowCount={lowReliabilityCount}
        />

        {/* Tab Selection */}
        <ReliabilityScoreManagementTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Contents */}
        <div className="mt-4">
          {activeTab === 'scoring-criteria' ? (
            <ScoringCriteriaTab
              criteria={criteria}
              onUpdateCriterion={handleUpdateCriterion}
            />
          ) : (
            <ParcelScoresTab
              parcels={parcels}
              criteria={criteria}
            />
          )}
        </div>
      </div>
    </DashboardChildrenLayout>
  )
}

export default ReliabilityScorePage