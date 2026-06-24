"use client"
import React from 'react'

interface PaymentType {
  type: string
  count: string
  total: string
  avg: string
  successRate: string
}

const paymentTypes: PaymentType[] = [
  { type: 'Registration Fee', count: '1,847', total: '42,300,000', avg: '22,900', successRate: '96.2%' },
  { type: 'Transfer Tax', count: '312', total: '28,700,000', avg: '92,000', successRate: '94.1%' },
  { type: 'Consultation Fee', count: '412', total: '8,400,000', avg: '20,400', successRate: '98.5%' },
  { type: 'Surveying Fee', count: '288', total: '6,200,000', avg: '21,500', successRate: '91.3%' },
  { type: 'Other', count: '96', total: '2,200,000', avg: '22,900', successRate: '88.5%' }
]

const PaymentTypeBreakdown = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 mt-6">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
        Payment Type Breakdown
      </h3>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-3 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TYPE</th>
              <th className="py-3 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">COUNT</th>
              <th className="py-3 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TOTAL (XAF)</th>
              <th className="py-3 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">AVG (XAF)</th>
              <th className="py-3 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SUCCESS RATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paymentTypes.map((pt, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                <td className="py-3.5 px-5 text-sm font-semibold text-slate-700">{pt.type}</td>
                <td className="py-3.5 px-5 text-sm font-medium text-slate-600">{pt.count}</td>
                <td className="py-3.5 px-5 text-sm font-bold text-slate-700">{pt.total}</td>
                <td className="py-3.5 px-5 text-sm font-medium text-slate-600">{pt.avg}</td>
                <td className="py-3.5 px-5 text-sm font-bold text-slate-700">{pt.successRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentTypeBreakdown