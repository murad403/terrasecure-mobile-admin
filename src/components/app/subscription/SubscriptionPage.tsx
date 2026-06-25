"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import SubscriptionStats from './SubscriptionStats'
import SubscriptionTabs from './SubscriptionTabs'
import SubscriptionPlansTab from './SubscriptionPlansTab'
import PaymentControlsFeatureFlagsTab from './PaymentControlsFeatureFlagsTab'
import AddPlanModal from './AddPlanModal'
import EditPlanModal from './EditPlanModal'

export interface PlanFeature {
  text: string;
  enabled: boolean;
}

export interface SubscriptionPlan {
  id: string;
  icon: string; // 'lightning' | 'star' | 'crown' | 'rocket' | 'diamond' | 'trophy' | 'sun' | 'fire'
  name: string;
  unlocksDescription: string;
  price: number;
  currency: string;
  period: string;
  features: PlanFeature[];
  badgeLabel: string;
  badgeColor: string; // 'orange' | 'green' | 'purple' | 'red' | 'blue'
  displayOrder: number;
  isActive: boolean;
}

export interface PromoBanner {
  labelPill: string;
  subtitle: string;
  title: string;
  isActive: boolean;
}

export interface SettingsItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isLive?: boolean;
  lastModified: string;
}

const initialPlans: SubscriptionPlan[] = [
  {
    id: 'p1',
    icon: 'lightning',
    name: 'Daily',
    unlocksDescription: '3 unlocks per day',
    price: 500,
    currency: 'XAF',
    period: 'Daily',
    badgeLabel: '',
    badgeColor: 'orange',
    displayOrder: 1,
    isActive: true,
    features: [
      { text: '3 premium parcel unlocks', enabled: true },
      { text: 'Owner contact info', enabled: true },
      { text: 'Title deed details', enabled: true },
      { text: 'Priority support', enabled: false },
      { text: 'Export reports', enabled: false },
    ],
  },
  {
    id: 'p2',
    icon: 'star',
    name: 'Weekly',
    unlocksDescription: '20 unlocks per week',
    price: 2500,
    currency: 'XAF',
    period: 'Weekly',
    badgeLabel: 'MOST POPULAR',
    badgeColor: 'orange',
    displayOrder: 2,
    isActive: true,
    features: [
      { text: '20 premium parcel unlocks', enabled: true },
      { text: 'Owner contact info', enabled: true },
      { text: 'Title deed details', enabled: true },
      { text: 'Priority support', enabled: true },
      { text: 'Export reports', enabled: false },
    ],
  },
  {
    id: 'p3',
    icon: 'crown',
    name: 'Monthly',
    unlocksDescription: 'Unlimited unlocks',
    price: 8000,
    currency: 'XAF',
    period: 'Monthly',
    badgeLabel: '',
    badgeColor: 'orange',
    displayOrder: 3,
    isActive: true,
    features: [
      { text: 'Unlimited premium parcel unlocks', enabled: true },
      { text: 'Owner contact info', enabled: true },
      { text: 'Title deed details', enabled: true },
      { text: 'Priority support', enabled: true },
      { text: 'Export reports', enabled: true },
    ],
  },
]

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'controls'>('plans')
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [promoBanner, setPromoBanner] = useState<PromoBanner>({
    labelPill: 'Limited Time',
    subtitle: 'Explore parcels at no cost!',
    title: 'Free Access During Launch Period',
    isActive: true,
  })

  // Quick Controls & Payment Settings State
  const [paymentMethods, setPaymentMethods] = useState<SettingsItem[]>([
    {
      id: 'pm-mtn',
      name: 'MTN Mobile Money',
      description: 'Allow users to pay via MTN MoMo. Requires MTN API credentials configured on the server.',
      isActive: false,
      lastModified: 'Jean Alima · Just now',
    },
    {
      id: 'pm-orange',
      name: 'Orange Money',
      description: 'Enable Orange Money as a payment method for land fees. Orange Cameroon partnership required.',
      isActive: false,
      lastModified: 'Jean Alima · 10 Jun 2025 09:14',
    },
    {
      id: 'pm-card',
      name: 'Bank Card (Visa / Mastercard)',
      description: 'Accept Visa and Mastercard payments via PayDunya. Higher transaction fees apply.',
      isActive: true,
      isLive: true,
      lastModified: 'System · 1 Jan 2025 00:00',
    },
  ])

  const [feeTypes, setFeeTypes] = useState<SettingsItem[]>([
    {
      id: 'fee-consult',
      name: 'Consultation Fees',
      description: 'Charge clients a fee to submit consultation requests for parcels.',
      isActive: true,
      isLive: true,
      lastModified: 'Jean Alima · 5 Jun 2025 14:30',
    },
    {
      id: 'fee-survey',
      name: 'Surveying Fee',
      description: 'Charge applicants for field surveyor assignments.',
      isActive: true,
      isLive: true,
      lastModified: 'Marie Nkodo · 2 Jun 2025 11:00',
    },
    {
      id: 'fee-express',
      name: 'Express Processing Fee',
      description: 'Allow applicants to pay extra to move their registration to the front of the queue.',
      isActive: false,
      lastModified: 'Jean Alima · 8 Jun 2025 16:45',
    },
  ])

  const [accessTiers, setAccessTiers] = useState<SettingsItem[]>([
    {
      id: 'tier-premium',
      name: 'Premium Client Access',
      description: 'Unlock advanced features for premium clients: bulk upload, priority support, extended storage, API access.',
      isActive: false,
      lastModified: 'Jean Alima · 9 Jun 2025 10:00',
    },
    {
      id: 'tier-public',
      name: 'Public Map Access',
      description: 'Allow unauthenticated users to view published parcels on the public GIS map (read-only).',
      isActive: true,
      isLive: true,
      lastModified: 'System · 1 Jan 2025 00:00',
    },
  ])

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

  // Plan Handlers
  const handleAddPlan = (newPlanData: Omit<SubscriptionPlan, 'id'>) => {
    const newPlan: SubscriptionPlan = {
      ...newPlanData,
      id: `p-${Date.now()}`,
    }
    setPlans((prev) => [...prev, newPlan].sort((a, b) => a.displayOrder - b.displayOrder))
    setIsAddOpen(false)
  }

  const handleEditPlan = (updatedPlan: SubscriptionPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)).sort((a, b) => a.displayOrder - b.displayOrder)
    )
    setIsEditOpen(false)
    setEditingPlan(null)
  }

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      setPlans((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleTogglePlanActive = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  const handleToggleSettingsItem = (id: string, type: 'payment' | 'fee' | 'tier') => {
    const updater = (items: SettingsItem[]) =>
      items.map((item) => {
        if (item.id === id) {
          const nextActive = !item.isActive
          return {
            ...item,
            isActive: nextActive,
            isLive: nextActive ? true : item.isLive, // Keep live flag sync
            lastModified: `Jean Alima · Just now`,
          }
        }
        return item
      })

    if (type === 'payment') setPaymentMethods(updater)
    else if (type === 'fee') setFeeTypes(updater)
    else if (type === 'tier') setAccessTiers(updater)
  }

  // Count active stats
  const activePlansCount = plans.filter((p) => p.isActive).length
  const totalPlansCount = plans.length
  
  const allFeatureFlags = [...feeTypes, ...accessTiers]
  const activeFeatureFlagsCount = allFeatureFlags.filter((f) => f.isActive).length
  const totalFeatureFlagsCount = allFeatureFlags.length

  const activePaymentMethodsCount = paymentMethods.filter((p) => p.isActive).length

  return (
    <DashboardChildrenLayout
      title="Subscription & Feature Flags"
      subtitle="Control payment methods, fees, access tiers, and subscription plans"
    >
      <div className="space-y-6">
        {/* Stats Panel */}
        <SubscriptionStats
          activePlans={`${activePlansCount}/${totalPlansCount}`}
          activeFlags={`${activeFeatureFlagsCount}/${totalFeatureFlagsCount}`}
          activePayments={activePaymentMethodsCount}
          promoBannerVisible={promoBanner.isActive ? 'Visible' : 'Hidden'}
        />

        {/* Tab switcher */}
        <SubscriptionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab contents */}
        {activeTab === 'plans' ? (
          <SubscriptionPlansTab
            plans={plans}
            promoBanner={promoBanner}
            setPromoBanner={setPromoBanner}
            onToggleActive={handleTogglePlanActive}
            onEdit={(plan) => {
              setEditingPlan(plan)
              setIsEditOpen(true)
            }}
            onDelete={handleDeletePlan}
            onAddClick={() => setIsAddOpen(true)}
          />
        ) : (
          <PaymentControlsFeatureFlagsTab
            paymentMethods={paymentMethods}
            feeTypes={feeTypes}
            accessTiers={accessTiers}
            onToggleItem={handleToggleSettingsItem}
          />
        )}
      </div>

      {/* Add Plan Modal */}
      {isAddOpen && (
        <AddPlanModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddPlan}
          nextDisplayOrder={plans.length + 1}
        />
      )}

      {/* Edit Plan Modal */}
      {isEditOpen && editingPlan && (
        <EditPlanModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false)
            setEditingPlan(null)
          }}
          plan={editingPlan}
          onSave={handleEditPlan}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default SubscriptionPage