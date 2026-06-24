"use client"
import React, { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import DocumentsTable from './DocumentsTable'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'

export interface DocumentRecord {
  id: string
  name: string
  type: string
  parcelId: string
  ownerName: string
  status: 'Approved' | 'Pending' | 'Rejected'
  date: string
}

const initialDocuments: DocumentRecord[] = [
  {
    id: 'DOC-001',
    name: 'Title_Deed_CM2847.pdf',
    type: 'Title Deed',
    parcelId: 'CM-2847',
    ownerName: 'Pierre Mballa',
    status: 'Approved',
    date: '10 Jun 2025'
  },
  {
    id: 'DOC-002',
    name: 'Survey_Plan_CM2849.pdf',
    type: 'Survey Plan',
    parcelId: 'CM-2849',
    ownerName: 'Jean-Pierre Nkodo',
    status: 'Pending',
    date: '8 Jun 2025'
  },
  {
    id: 'DOC-003',
    name: 'NationalID_Fouda.jpg',
    type: 'ID Document',
    parcelId: 'CM-2848',
    ownerName: 'Amina Fouda',
    status: 'Rejected',
    date: '5 Jun 2025'
  },
  {
    id: 'DOC-004',
    name: 'TaxClear_Tanda.pdf',
    type: 'Tax Clearance',
    parcelId: 'CM-2850',
    ownerName: 'Grace Tanda',
    status: 'Approved',
    date: '1 Jun 2025'
  },
  {
    id: 'DOC-005',
    name: 'Photo_CM2852.jpg',
    type: 'Photo Evidence',
    parcelId: 'CM-2852',
    ownerName: 'Halima Bello',
    status: 'Pending',
    date: '28 May 2025'
  }
]

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments)
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('Doc Type')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Automatically select all documents on load to match the screenshot "5 selected"
  useEffect(() => {
    setSelectedIds(initialDocuments.map(doc => doc.id))
  }, [])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredDocuments.map(doc => doc.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id))
    }
  }

  // Row callbacks
  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === id) {
          return { ...doc, status: newStatus }
        }
        return doc
      })
    )
    alert(`Document ${id} is now ${newStatus}.`)
  }

  // Bulk action callbacks
  const handleBulkStatusChange = (status: 'Approved' | 'Rejected') => {
    if (selectedIds.length === 0) return
    setDocuments(prev =>
      prev.map(doc => {
        if (selectedIds.includes(doc.id)) {
          return { ...doc, status }
        }
        return doc
      })
    )
    alert(`Successfully ${status.toLowerCase()}ed ${selectedIds.length} selected documents.`)
  }

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return
    setDocuments(prev => prev.filter(doc => !selectedIds.includes(doc.id)))
    setSelectedIds([])
    alert(`Successfully archived selected documents.`)
  }

  // Filtering Logic
  const filteredDocuments = documents.filter(doc => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.parcelId.toLowerCase().includes(query) ||
      doc.ownerName.toLowerCase().includes(query)

    const matchesType = typeFilter === 'Doc Type' || doc.type === typeFilter
    const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search & Filters Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full flex-wrap select-none">
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search parcels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
          />
        </div>

        {/* Doc Type Dropdown */}
        <CustomFilterDropdown
          label="Doc Type"
          header="Doc Type"
          options={['Doc Type', 'Title Deed', 'Survey Plan', 'ID Document', 'Tax Clearance', 'Photo Evidence']}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />

        {/* Status Dropdown */}
        <CustomFilterDropdown
          label="All Statuses"
          header="All Statuses"
          options={['All Statuses', 'Approved', 'Pending', 'Rejected']}
          selected={statusFilter}
          onSelect={setStatusFilter}
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

      {/* Bulk Action Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-[#eefcf5] border border-emerald-100 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm animate-in fade-in duration-200 select-none">
          <span className="text-emerald-700 font-extrabold text-sm">
            {selectedIds.length} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('Approved')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm border-none"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkStatusChange('Rejected')}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm border-none"
            >
              Reject
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Archive
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <DocumentsTable
        documents={filteredDocuments}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}

export default DocumentsPage