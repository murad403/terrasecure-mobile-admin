import React from 'react'
import { CreditCard, Sliders } from 'lucide-react'

interface TabsProps {
  activeTab: 'plans' | 'controls';
  setActiveTab: (tab: 'plans' | 'controls') => void;
}

const SubscriptionTabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex items-center space-x-2 border-b border-gray-100 pb-1">
      {/* Subscription Plans Tab */}
      <button
        onClick={() => setActiveTab('plans')}
        className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'plans'
            ? 'bg-button-color text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <CreditCard size={14} />
        Subscription Plans
      </button>

      {/* Payment Controls & Feature Flags Tab */}
      <button
        onClick={() => setActiveTab('controls')}
        className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
          activeTab === 'controls'
            ? 'bg-button-color text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Sliders size={14} />
        Payment Controls & Feature Flags
      </button>
    </div>
  )
}

export default SubscriptionTabs