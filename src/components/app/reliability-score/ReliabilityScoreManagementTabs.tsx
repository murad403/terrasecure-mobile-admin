import React from 'react'

interface TabsProps {
  activeTab: 'scoring-criteria' | 'parcel-scores';
  setActiveTab: (tab: 'scoring-criteria' | 'parcel-scores') => void;
}

const ReliabilityScoreManagementTabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setActiveTab('scoring-criteria')}
        className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
          activeTab === 'scoring-criteria'
            ? 'bg-button-color text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Scoring Criteria
      </button>
      <button
        onClick={() => setActiveTab('parcel-scores')}
        className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
          activeTab === 'parcel-scores'
            ? 'bg-button-color text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Parcel Scores
      </button>
    </div>
  )
}

export default ReliabilityScoreManagementTabs