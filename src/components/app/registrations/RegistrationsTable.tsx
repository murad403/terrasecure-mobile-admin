"use client"
import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Eye, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface Registration {
  id: string
  ownerName: string
  nationalId: string
  phone: string
  email: string
  parcelName: string
  location: string
  city: string
  district: string
  area: number
  description: string
  status: string
  activeStep: number
  createdDate: string
}

// Custom Dropdown Component matching Parcels Page style
interface CustomFilterDropdownProps {
  label: string
  header: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
}

const CustomFilterDropdown = ({
  label,
  header,
  options,
  selected,
  onSelect
}: CustomFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative select-none z-30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer w-40 sm:w-44 leading-relaxed"
      >
        <span className="truncate">{selected === 'All' || selected === 'Date Range' ? label : selected}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-35 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Blue Header */}
          <div className="bg-button-color text-white px-4 py-2 text-xs font-bold text-center border-b border-blue-400/20 tracking-wider select-none uppercase">
            {header}
          </div>
          {/* Options */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer",
                  selected === opt && "bg-slate-50 text-button-color font-bold"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface RegistrationsTableProps {
  registrations: Registration[]
  onOpenAddModal: () => void
  onViewDetails: (reg: Registration) => void
}

const RegistrationsTable = ({ registrations, onOpenAddModal, onViewDetails }: RegistrationsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [stepFilter, setStepFilter] = useState('All')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, cityFilter, stepFilter])

  // Filtering Logic
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.parcelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.district.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter
    const matchesCity = cityFilter === 'All' || reg.city === cityFilter

    // Filter by Step: "All" or "Step 1" to "Step 7"
    let matchesStep = true
    if (stepFilter !== 'All') {
      const stepNum = parseInt(stepFilter.replace('Step ', ''))
      matchesStep = reg.activeStep === stepNum
    }

    return matchesSearch && matchesStatus && matchesCity && matchesStep
  })

  // Pagination Calculations
  const totalEntries = filteredRegistrations.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleExport = () => {
    alert('Exporting land registrations list as CSV...')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">

      {/* Search & Filters Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parcels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
            />
          </div>

          {/* City Dropdown */}
          <CustomFilterDropdown
            label="All Cities"
            header="All Cities"
            options={['All', 'Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua']}
            selected={cityFilter}
            onSelect={setCityFilter}
          />

          {/* Status Dropdown */}
          <CustomFilterDropdown
            label="All Statuses"
            header="All Statuses"
            options={['All', 'In Progress', 'Completed', 'Pending', 'Rejected']}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />

          {/* Steps Dropdown */}
          <CustomFilterDropdown
            label="All Steps"
            header="All Steps"
            options={['All', 'Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7']}
            selected={stepFilter}
            onSelect={setStepFilter}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-button-color hover:bg-button-color/90 text-white rounded-lg transition-all cursor-pointer shadow-sm border border-transparent"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>New Registration</span>
          </button>
        </div>
      </div>

      {/* Main Registrations List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">REGISTRATION ID</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">APPLICANT</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CITY / DISTRICT</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">SUBMITTED</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">CURRENT STEP</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
              <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedRegistrations.length > 0 ? (
              paginatedRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* Registration ID link */}
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(reg)}
                      className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left outline-none cursor-pointer bg-transparent border-none p-0"
                    >
                      {reg.id}
                    </button>
                  </td>

                  {/* Applicant Name */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                    {reg.ownerName}
                  </td>

                  {/* Location Zone */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                    {reg.city} / {reg.district}
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-500">
                    {reg.createdDate}
                  </td>

                  {/* Current Step Segmented 7-Bar Stepper */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5 sm:gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-1.5 rounded-sm",
                              i < reg.activeStep ? "bg-button-color" : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Step {reg.activeStep}/7</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border block w-fit whitespace-nowrap",
                        reg.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                        reg.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-200',
                        reg.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-200',
                        reg.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-200'
                      )}
                    >
                      {reg.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onViewDetails(reg)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                        title="View Steps Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                  No registrations found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
      />
    </div>
  )
}

export default RegistrationsTable;