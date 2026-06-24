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
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PAYMENT ID</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">USER</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">AMOUNT</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TYPE</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DATE</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {payments.length > 0 ? (
            payments.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                {/* Payment ID */}
                <td className="py-4 px-5 text-sm font-bold text-slate-800">
                  {item.id}
                </td>

                {/* User */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                  {item.applicantName}
                </td>

                {/* Parcel */}
                <td className="py-4 px-5">
                  <span className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                    {item.parcelId}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-4 px-5 text-sm font-bold text-blue-600">
                  {formatCurrency(item.amount)}
                </td>

                {/* Type */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-650">
                  {item.type}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-5">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold block w-fit whitespace-nowrap",
                      item.status === 'Verified' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                      item.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                      item.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-200'
                    )}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                  {item.date}
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