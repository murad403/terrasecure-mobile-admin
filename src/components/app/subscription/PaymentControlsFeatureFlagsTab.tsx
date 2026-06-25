import React, { useState } from 'react'
import { SettingsItem } from './SubscriptionPage'
import {
  Smartphone,
  CreditCard,
  Zap,
  Sliders,
  DollarSign,
  ShieldAlert,
  SmartphoneNfc,
  ClipboardList,
  Compass,
  Gauge,
  UserCheck,
  Globe,
  Plus,
} from 'lucide-react'

interface ControlsTabProps {
  paymentMethods: SettingsItem[];
  feeTypes: SettingsItem[];
  accessTiers: SettingsItem[];
  onToggleItem: (id: string, type: 'payment' | 'fee' | 'tier') => void;
}

const PaymentControlsFeatureFlagsTab = ({
  paymentMethods,
  feeTypes,
  accessTiers,
  onToggleItem,
}: ControlsTabProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleConfigure = (name: string) => {
    showToast(`Configuration panel for "${name}" opened successfully!`)
  }

  // Count active stats for labels
  const activePayments = paymentMethods.filter((p) => p.isActive).length
  const activeFees = feeTypes.filter((f) => f.isActive).length
  const activeTiers = accessTiers.filter((t) => t.isActive).length

  // Icon mapping helpers
  const getSettingsItemIcon = (id: string) => {
    const size = 18
    switch (id) {
      case 'pm-mtn':
      case 'pm-orange':
        return <Smartphone size={size} className="text-gray-500" />
      case 'pm-card':
        return <CreditCard size={size} className="text-blue-500" />
      case 'fee-consult':
        return <ClipboardList size={size} className="text-indigo-500" />
      case 'fee-survey':
        return <Compass size={size} className="text-emerald-500" />
      case 'fee-express':
        return <Gauge size={size} className="text-amber-500" />
      case 'tier-premium':
        return <UserCheck size={size} className="text-violet-500" />
      case 'tier-public':
        return <Globe size={size} className="text-teal-500" />
      default:
        return <Sliders size={size} className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-12 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Quick Payment Method Controls (Dark Card) */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap size={16} className="text-amber-400 fill-amber-300" />
            <span className="text-xs font-bold tracking-wide">Quick Payment Method Controls</span>
          </div>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] px-2 py-0.5 font-bold">
            No App Release Required
          </span>
        </div>

        {/* 3 Quick Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((pm) => {
            return (
              <div
                key={pm.id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold leading-normal text-slate-100">{pm.name}</p>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">
                    {pm.isActive ? '• Active' : '• Inactive'}
                  </p>
                </div>

                {/* Switch Toggle */}
                <button
                  onClick={() => onToggleItem(pm.id, 'payment')}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pm.isActive ? 'bg-[#10b981]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      pm.isActive ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category List: Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        {/* Category Header */}
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-55">
          <CreditCard size={16} className="text-violet-600" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Payment Methods</span>
          <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
            {activePayments}/{paymentMethods.length} on
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gray-50 rounded-xl shrink-0">
                  {getSettingsItemIcon(pm.id)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-gray-800">{pm.name}</h4>
                    {pm.isLive && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] px-1.5 py-0.2 rounded font-bold uppercase">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5 leading-normal max-w-xl">
                    {pm.description}
                  </p>
                  <p className="text-[9px] text-gray-400 font-light mt-1">
                    Modified by <span className="font-medium text-gray-500">{pm.lastModified}</span>
                  </p>
                </div>
              </div>

              {/* Action Button & Toggle Status */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 self-end sm:self-auto min-w-[140px]">
                <button
                  onClick={() => handleConfigure(pm.name)}
                  className="border border-gray-200 hover:bg-gray-55 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Configure
                </button>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded font-bold border w-12 text-center uppercase ${
                    pm.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-gray-50 text-gray-400 border-gray-150'
                  }`}
                >
                  {pm.isActive ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category List: Fee Types */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        {/* Category Header */}
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-55">
          <DollarSign size={16} className="text-emerald-600" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Fee Types</span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
            {activeFees}/{feeTypes.length} on
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {feeTypes.map((fee) => (
            <div key={fee.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gray-50 rounded-xl shrink-0">
                  {getSettingsItemIcon(fee.id)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-gray-800">{fee.name}</h4>
                    {fee.isLive && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] px-1.5 py-0.2 rounded font-bold uppercase">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5 leading-normal max-w-xl">
                    {fee.description}
                  </p>
                  <p className="text-[9px] text-gray-400 font-light mt-1">
                    Modified by <span className="font-medium text-gray-500">{fee.lastModified}</span>
                  </p>
                </div>
              </div>

              {/* Action Button & Toggle Status */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 self-end sm:self-auto min-w-[140px]">
                <button
                  onClick={() => handleConfigure(fee.name)}
                  className="border border-gray-200 hover:bg-gray-55 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Configure
                </button>
                <button
                  onClick={() => onToggleItem(fee.id, 'fee')}
                  className={`text-[10px] px-2.5 py-0.5 rounded font-bold border w-12 text-center uppercase transition-all cursor-pointer ${
                    fee.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50'
                      : 'bg-gray-50 text-gray-400 border-gray-150 hover:bg-gray-100'
                  }`}
                >
                  {fee.isActive ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category List: Access Tiers */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        {/* Category Header */}
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-55">
          <ShieldAlert size={16} className="text-amber-600" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Access Tiers</span>
          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
            {activeTiers}/{accessTiers.length} on
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {accessTiers.map((tier) => (
            <div key={tier.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gray-50 rounded-xl shrink-0">
                  {getSettingsItemIcon(tier.id)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-gray-800">{tier.name}</h4>
                    {tier.isLive && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] px-1.5 py-0.2 rounded font-bold uppercase">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5 leading-normal max-w-xl">
                    {tier.description}
                  </p>
                  <p className="text-[9px] text-gray-400 font-light mt-1">
                    Modified by <span className="font-medium text-gray-500">{tier.lastModified}</span>
                  </p>
                </div>
              </div>

              {/* Action Button & Toggle Status */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 self-end sm:self-auto min-w-[140px]">
                <button
                  onClick={() => handleConfigure(tier.name)}
                  className="border border-gray-200 hover:bg-gray-55 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Configure
                </button>
                <button
                  onClick={() => onToggleItem(tier.id, 'tier')}
                  className={`text-[10px] px-2.5 py-0.5 rounded font-bold border w-12 text-center uppercase transition-all cursor-pointer ${
                    tier.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50'
                      : 'bg-gray-50 text-gray-400 border-gray-150 hover:bg-gray-100'
                  }`}
                >
                  {tier.isActive ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaymentControlsFeatureFlagsTab