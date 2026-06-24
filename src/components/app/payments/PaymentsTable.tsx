"use client"
import React from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type PaymentRecord } from './PaymentListTab'

interface PaymentsTableProps {
  payments: PaymentRecord[]
  onViewDetails: (item: PaymentRecord) => void
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val) + ' XAF'
}

const PaymentsTable = ({ payments, onViewDetails }: PaymentsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white select-none">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/60 border-b border-slate-100">
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TRANSACTION ID</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">REGISTRATION</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">APPLICANT</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">AMOUNT</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">METHOD</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DATE</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {payments.length > 0 ? (
            payments.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                {/* Transaction ID */}
                <td className="py-4 px-5 text-sm font-bold text-slate-800">
                  {item.id}
                </td>

                {/* Registration ID link */}
                <td className="py-4 px-5">
                  <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                    {item.registrationId}
                  </span>
                </td>

                {/* Applicant */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                  {item.applicantName}
                </td>

                {/* Amount */}
                <td className="py-4 px-5 text-sm font-bold text-slate-800">
                  {formatCurrency(item.amount)}
                </td>

                {/* Method */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-650">
                  {item.method}
                </td>

                {/* Date */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                  {item.date}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-5">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap",
                      item.status === 'Success' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                      item.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                      item.status === 'Failed' && 'bg-rose-50 text-rose-600 border-rose-200'
                    )}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions column */}
                <td className="py-4 px-5 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                No payment transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentsTable