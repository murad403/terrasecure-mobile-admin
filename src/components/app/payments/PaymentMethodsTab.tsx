"use client"
import React from 'react'

const PaymentMethodsTab = () => {
  const methods = [
    {
      icon: '📱',
      title: 'Mobile Money',
      subtitle: 'Generic',
      status: 'Coming Soon'
    },
    {
      icon: '🟠',
      title: 'Orange Money',
      subtitle: 'Orange Cameroon',
      status: 'Coming Soon'
    },
    {
      icon: '🟡',
      title: 'MTN MoMo',
      subtitle: 'MTN Cameroon',
      status: 'Coming Soon'
    },
    {
      icon: '💳',
      title: 'Bank Card',
      subtitle: 'Visa / Mastercard',
      status: 'Coming Soon'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
      {methods.map((method, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
        >
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl select-none">
              {method.icon}
            </div>
            
            <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/45 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase select-none">
              {method.status}
            </span>
          </div>

          {/* Details */}
          <div className="mt-4 flex-1">
            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
              {method.title}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              {method.subtitle}
            </p>
          </div>

          {/* Configure button */}
          <button
            type="button"
            disabled
            className="w-full h-10 bg-slate-50 text-slate-400 font-bold text-xs rounded-xl border border-slate-100/80 mt-6 cursor-not-allowed select-none flex items-center justify-center"
          >
            Configure
          </button>
        </div>
      ))}
    </div>
  )
}

export default PaymentMethodsTab