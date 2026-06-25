import React from 'react'
import { SubscriptionPlan } from './SubscriptionPage'
import {
  Zap,
  Star,
  Crown,
  Rocket,
  Gem,
  Trophy,
  Sun,
  Flame,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react'

interface PlanCardProps {
  plan: SubscriptionPlan;
  onToggleActive: (id: string) => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (id: string) => void;
}

const SubscriptionPlanCard = ({
  plan,
  onToggleActive,
  onEdit,
  onDelete,
}: PlanCardProps) => {
  // Map string icon names to Lucide icons
  const renderIcon = () => {
    const size = 18
    switch (plan.icon) {
      case 'lightning':
        return <Zap size={size} className="text-amber-500 fill-amber-100" />
      case 'star':
        return <Star size={size} className="text-amber-500 fill-amber-100" />
      case 'crown':
        return <Crown size={size} className="text-amber-500 fill-amber-100" />
      case 'rocket':
        return <Rocket size={size} className="text-blue-500" />
      case 'diamond':
        return <Gem size={size} className="text-cyan-500" />
      case 'trophy':
        return <Trophy size={size} className="text-yellow-500" />
      case 'sun':
        return <Sun size={size} className="text-orange-500" />
      case 'fire':
        return <Flame size={size} className="text-red-500" />
      default:
        return <Zap size={size} className="text-gray-500" />
    }
  }

  // Get color configurations based on the badgeColor field
  const getBadgeColors = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          banner: 'bg-amber-500 text-white',
          border: 'border-2 border-amber-500',
          button: 'bg-amber-500 hover:bg-amber-600 text-white',
        }
      case 'green':
        return {
          banner: 'bg-emerald-600 text-white',
          border: 'border-2 border-emerald-600',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        }
      case 'purple':
        return {
          banner: 'bg-purple-600 text-white',
          border: 'border-2 border-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
        }
      case 'red':
        return {
          banner: 'bg-red-600 text-white',
          border: 'border-2 border-red-600',
          button: 'bg-red-600 hover:bg-red-700 text-white',
        }
      case 'blue':
        return {
          banner: 'bg-blue-600 text-white',
          border: 'border-2 border-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        }
      default:
        return {
          banner: 'bg-gray-600 text-white',
          border: 'border-2 border-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
        }
    }
  }

  const isPopular = !!plan.badgeLabel
  const colors = getBadgeColors(plan.badgeColor || 'orange')

  return (
    <div
      className={`bg-white rounded-xl shadow-sm flex flex-col relative overflow-hidden transition-all duration-200 ${
        isPopular ? `${colors.border}` : 'border border-gray-100'
      }`}
    >
      {/* MOST POPULAR header banner */}
      {isPopular && (
        <div className={`w-full py-1.5 text-center text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 ${colors.banner}`}>
          <Star size={10} className="fill-white text-white" />
          {plan.badgeLabel}
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Row 1: Icon, Title, Controls */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-50 rounded-xl shrink-0">
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{plan.name}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{plan.unlocksDescription}</p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Toggle switch */}
            <button
              onClick={() => onToggleActive(plan.id)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                plan.isActive ? 'bg-button-color' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  plan.isActive ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>

            {/* Pencil edit */}
            <button
              onClick={() => onEdit(plan)}
              className="text-[#10b981] hover:text-[#059669] p-0.5 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
              title="Edit Plan"
            >
              <Pencil size={13} />
            </button>

            {/* Trash delete */}
            <button
              onClick={() => onDelete(plan.id)}
              className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete Plan"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Pricing tag */}
        <div className="mt-4 mb-5">
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {plan.price.toLocaleString()} {plan.currency}
          </span>
          <span className="text-[10px] text-gray-400 ml-1">/ {plan.period.toLowerCase()}</span>
        </div>

        {/* Features List */}
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-center space-x-2 text-[11px] ${
                feature.enabled ? 'text-gray-700' : 'text-gray-400 font-light line-through decoration-gray-300'
              }`}
            >
              {feature.enabled ? (
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check size={9} strokeWidth={3} />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center shrink-0">
                  <X size={9} strokeWidth={3} />
                </div>
              )}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* Choose Button */}
        <button
          className={`w-full py-2 rounded-lg text-xs font-bold mt-auto transition-colors cursor-pointer flex items-center justify-center ${
            isPopular
              ? `${colors.button}`
              : 'border border-[#1b4332] text-[#1b4332] hover:bg-[#1b4332]/5'
          }`}
        >
          Choose {plan.name} Plan
        </button>
      </div>
    </div>
  )
}

export default SubscriptionPlanCard