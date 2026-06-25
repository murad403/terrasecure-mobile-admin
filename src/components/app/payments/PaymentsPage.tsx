"use client"
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import PaymentListTab from './PaymentListTab'
import PaymentMethodsTab from './PaymentMethodsTab'

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'methods'>('transactions')

  return (
    <div className="space-y-6">

      {/* Sliding Tab Switcher Buttons */}
      <div className="flex border border-slate-100 bg-slate-50 p-1 rounded-xl w-fit select-none shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={cn(
            "px-5 py-2 text-xs font-extrabold rounded-lg cursor-pointer transition-all",
            activeTab === 'transactions'
              ? "bg-button-color text-white shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          Payments List
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('methods')}
          className={cn(
            "px-5 py-2 text-xs font-extrabold rounded-lg cursor-pointer transition-all",
            activeTab === 'methods'
              ? "bg-button-color text-white shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          Payment Methods
        </button>
      </div>

      {/* Tab Render Content */}
      <div className="transition-all duration-300">
        {activeTab === 'transactions' ? (
          <PaymentListTab />
        ) : (
          <PaymentMethodsTab />
        )}
      </div>

    </div>
  )
}

export default PaymentsPage