"use client"
import React, { useEffect } from 'react'
import { X, Download, RotateCcw, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type PaymentRecord } from './PaymentListTab'

interface PaymentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  payment: PaymentRecord
  payments: PaymentRecord[]
  onRefund: () => void
  onVerify: () => void
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val) + ' XAF'
}

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  payment,
  payments,
  onRefund,
  onVerify
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

  // Get other history records for this parcel
  const getHistoryForParcel = (parcelId: string) => {
    const dynamicItems = payments.filter((p) => p.parcelId === parcelId)
    
    // Add static items to represent past records for this parcel (as seen in the screenshot)
    const staticItems = [
      {
        type: 'Document Submission',
        date: '8 Jan 2025',
        amount: 50000,
        status: 'Verified' as const
      }
    ]
    
    // Return combined list, filter duplicates of the active payment ID to avoid showing twice
    const activeFilter = dynamicItems.filter(d => d.id === payment.id)
    const otherDynamic = dynamicItems.filter(d => d.id !== payment.id)

    return [
      ...activeFilter.map(d => ({
        type: d.type,
        date: d.date,
        amount: d.amount,
        status: d.status
      })),
      ...otherDynamic.map(d => ({
        type: d.type,
        date: d.date,
        amount: d.amount,
        status: d.status
      })),
      ...staticItems
    ]
  }

  const history = getHistoryForParcel(payment.parcelId)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[460px] md:w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-55">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <h2 className="text-sm font-extrabold text-slate-900">
            Payment {payment.id}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
          
          {/* Payment Details Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Payment Details</span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border block w-fit whitespace-nowrap uppercase tracking-wider",
                  payment.status === 'Verified' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  payment.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                  payment.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-200'
                )}
              >
                {payment.status}
              </span>
            </div>

            {/* Large Amount display */}
            <div className="text-3xl font-extrabold text-blue-600 my-1 tracking-tight">
              {formatCurrency(payment.amount)}
            </div>

            {/* Details List */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">User</span>
                <span className="text-slate-900 font-extrabold">{payment.applicantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Parcel</span>
                <span className="text-slate-900 font-extrabold">{payment.parcelId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Type</span>
                <span className="text-slate-900 font-medium">{payment.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date</span>
                <span className="text-slate-900 font-extrabold">{payment.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reference</span>
                <span className="text-slate-900 font-medium">{payment.id}</span>
              </div>
            </div>
          </div>

          {/* Payment Receipt Dashed Box */}
          <div className="border border-dashed border-slate-200 bg-slate-50/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <FileText className="w-7 h-7 text-slate-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">Payment Receipt</p>
              <p className="text-[10px] text-slate-400 font-semibold">PDF preview available</p>
            </div>
            <button
              onClick={() => alert(`Downloading receipt invoice_${payment.id}.pdf...`)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border-none"
            >
              <Download className="w-3.5 h-3.5" />
              Download Receipt
            </button>
          </div>

          {/* Payment History List */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800">
              Payment History for {payment.parcelId}
            </h3>
            
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100/50">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{item.type}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{item.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-blue-600">{formatCurrency(item.amount)}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 select-none">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3 select-none">
          <Button
            type="button"
            onClick={onVerify}
            className="flex-1 h-11 text-white text-xs font-bold shadow-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 border-none bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Verify Payment
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => alert(`Downloading receipt invoice_${payment.id}.pdf...`)}
            className="flex-1 h-11 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Receipt
          </Button>
        </div>

      </div>
    </div>
  )
}

export default PaymentDetailsModal