"use client"
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import CustomPagination from '@/components/shared/CustomPagination'
import PaymentsTable from './PaymentsTable'
import PaymentDetailsModal from './PaymentDetailsModal'

export interface PaymentRecord {
  id: string
  registrationId: string
  applicantName: string
  amount: number
  method: 'MTN Mobile Money' | 'Orange Money' | 'Credit Card' | 'Bank Transfer'
  date: string
  status: 'Success' | 'Pending' | 'Failed'
  refNumber: string
  gatewayMessage: string
}

const initialPayments: PaymentRecord[] = [
  {
    id: 'PAY-782',
    registrationId: 'REG-1203',
    applicantName: 'Jean Alima',
    amount: 450000,
    method: 'Orange Money',
    date: '24 Jun 2026',
    status: 'Success',
    refNumber: 'REF-92847291',
    gatewayMessage: 'Orange Money transaction completed. Merchant API success.'
  },
  {
    id: 'PAY-781',
    registrationId: 'REG-1197',
    applicantName: 'Marie Nkodo',
    amount: 450000,
    method: 'MTN Mobile Money',
    date: '20 Jun 2026',
    status: 'Success',
    refNumber: 'REF-91827462',
    gatewayMessage: 'MTN MoMo transaction completed. Merchant API success.'
  },
  {
    id: 'PAY-780',
    registrationId: 'REG-1199',
    applicantName: 'Samuel Kotto',
    amount: 250000,
    method: 'Bank Transfer',
    date: '18 Jun 2026',
    status: 'Pending',
    refNumber: 'REF-82736412',
    gatewayMessage: 'Waiting for manual bank slip verification.'
  },
  {
    id: 'PAY-779',
    registrationId: 'REG-1201',
    applicantName: 'Grace Tanda',
    amount: 450000,
    method: 'Credit Card',
    date: '15 Jun 2026',
    status: 'Success',
    refNumber: 'REF-28374619',
    gatewayMessage: 'Stripe payment intent completed successfully.'
  },
  {
    id: 'PAY-778',
    registrationId: 'REG-1195',
    applicantName: 'Amina Fouda',
    amount: 450000,
    method: 'MTN Mobile Money',
    date: '12 Jun 2026',
    status: 'Failed',
    refNumber: 'REF-28374829',
    gatewayMessage: 'Transaction declined. Insufficient customer wallet balance.'
  },
  {
    id: 'PAY-777',
    registrationId: 'REG-1192',
    applicantName: 'Pierre Mballa',
    amount: 450000,
    method: 'Orange Money',
    date: '10 Jun 2026',
    status: 'Success',
    refNumber: 'REF-18273645',
    gatewayMessage: 'Orange Money transaction completed. Merchant API success.'
  },
  {
    id: 'PAY-776',
    registrationId: 'REG-1190',
    applicantName: 'Samuel Kotto',
    amount: 250000,
    method: 'Bank Transfer',
    date: '08 Jun 2026',
    status: 'Success',
    refNumber: 'REF-18273699',
    gatewayMessage: 'Direct bank transfer manual receipt verified.'
  },
  {
    id: 'PAY-775',
    registrationId: 'REG-1188',
    applicantName: 'Halima Bello',
    amount: 450000,
    method: 'Credit Card',
    date: '05 Jun 2026',
    status: 'Success',
    refNumber: 'REF-19283746',
    gatewayMessage: 'Stripe payment intent completed successfully.'
  }
]

const PaymentListTab = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [methodFilter, setMethodFilter] = useState('All Methods')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, methodFilter, dateFilter])

  const handleOpenDetails = (item: PaymentRecord) => {
    setSelectedPayment(item)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedPayment(null)
    setDetailsOpen(false)
  }

  const handleRefund = (id: string) => {
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            status: 'Failed' as const,
            gatewayMessage: 'Transaction refunded by Administrator.'
          }
          if (selectedPayment && selectedPayment.id === id) {
            setSelectedPayment(updated)
          }
          return updated
        }
        return item
      })
    )
    alert(`Payment ${id} refunded successfully.`)
  }

  // Filter calculations
  const filteredPayments = payments.filter((item) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.registrationId.toLowerCase().includes(query) ||
      item.applicantName.toLowerCase().includes(query) ||
      item.refNumber.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'All Statuses' || item.status === statusFilter

    const matchesMethod =
      methodFilter === 'All Methods' || item.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  // Pagination calculations
  const totalEntries = filteredPayments.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 select-none">
      
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="All Statuses"
            options={['All Statuses', 'Success', 'Pending', 'Failed']}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />

          {/* Method Dropdown */}
          <CustomFilterDropdown
            label="All Methods"
            header="All Methods"
            options={['All Methods', 'MTN Mobile Money', 'Orange Money', 'Credit Card', 'Bank Transfer']}
            selected={methodFilter}
            onSelect={setMethodFilter}
          />

          {/* Date Range Dropdown */}
          <CustomFilterDropdown
            label="Date Range"
            header="Date Range"
            options={['Date Range', 'Today', 'This Week', 'This Month', 'Custom Range']}
            selected={dateFilter}
            onSelect={setDateFilter}
          />
        </div>
      </div>

      {/* Grid Table */}
      <PaymentsTable
        payments={paginatedPayments}
        onViewDetails={handleOpenDetails}
      />

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
      />

      {/* Receipt Modal */}
      {detailsOpen && selectedPayment && (
        <PaymentDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          payment={selectedPayment}
          onRefund={() => handleRefund(selectedPayment.id)}
        />
      )}

    </div>
  )
}

export default PaymentListTab