"use client"
import React, { useEffect } from 'react'
import { X, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { type PaymentRecord } from './PaymentListTab'

interface PaymentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  payment: PaymentRecord
  onRefund: () => void
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val) + ' XAF'
}

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  payment,
  onRefund
}: PaymentDetailsModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Info Body */}
        <div className="p-6 space-y-4 select-none text-xs">
          
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 font-semibold text-slate-700 divide-y divide-slate-100/50">
            {/* ID */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-slate-400">Transaction ID</span>
              <span className="text-slate-900 font-bold">{payment.id}</span>
            </div>

            {/* Registration */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Registration ID</span>
              <span className="text-blue-600 font-bold hover:underline cursor-pointer">{payment.registrationId}</span>
            </div>

            {/* Ref Number */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Gateway Ref</span>
              <span className="text-slate-800 font-mono tracking-wide">{payment.refNumber}</span>
            </div>

            {/* Requester */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Payer Name</span>
              <span className="text-slate-800">{payment.applicantName}</span>
            </div>

            {/* Method */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Payment Method</span>
              <span className="text-slate-800">{payment.method}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Amount Charged</span>
              <span className="text-slate-900 font-bold text-sm">{formatCurrency(payment.amount)}</span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Transaction Date</span>
              <span className="text-slate-500">{payment.date}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-400">Status</span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border block w-fit whitespace-nowrap uppercase tracking-wider",
                  payment.status === 'Success' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  payment.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                  payment.status === 'Failed' && 'bg-rose-50 text-rose-600 border-rose-200'
                )}
              >
                {payment.status}
              </span>
            </div>
          </div>

          {/* Gateway Message */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Gateway Log Message
            </span>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500 font-semibold leading-relaxed">
              {payment.gatewayMessage}
            </div>
          </div>

          {/* Buttons: Download Receipt & Refund */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => alert(`Downloading receipt invoice_${payment.id}.pdf...`)}
              className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt Invoice</span>
            </button>

            {payment.status === 'Success' && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to issue a full refund for transaction ${payment.id}?`)) {
                    onRefund()
                    onClose()
                  }
                }}
                className="w-full py-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Issue Full Refund</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default PaymentDetailsModal