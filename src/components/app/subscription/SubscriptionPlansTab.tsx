import React from 'react'
import { SubscriptionPlan, PromoBanner } from './SubscriptionPage'
import PromotionalBannerForm from './PromotionalBannerForm'
import SubscriptionPlanCard from './SubscriptionPlanCard'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlansTabProps {
  plans: SubscriptionPlan[];
  promoBanner: PromoBanner;
  setPromoBanner: (banner: PromoBanner) => void;
  onToggleActive: (id: string) => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const SubscriptionPlansTab = ({
  plans,
  promoBanner,
  setPromoBanner,
  onToggleActive,
  onEdit,
  onDelete,
  onAddClick,
}: PlansTabProps) => {
  const activePlansCount = plans.filter((p) => p.isActive).length

  return (
    <div className="space-y-6">
      {/* Promotional Banner Card */}
      <PromotionalBannerForm banner={promoBanner} onUpdate={setPromoBanner} />

      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-none">Subscription Plans</h3>
          <p className="text-[11px] text-gray-500 mt-1.5">
            {activePlansCount} active · displayed in this order to clients
          </p>
        </div>
        <Button
          onClick={onAddClick}
          className='w-auto'
        >
          <Plus size={14} />
          Add Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            onToggleActive={onToggleActive}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Client Preview Footer */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-gray-400 font-light">
          Preview footer shown to clients: Cancel anytime · No hidden fees · Secured payments
        </p>
      </div>
    </div>
  )
}

export default SubscriptionPlansTab