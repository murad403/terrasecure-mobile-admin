"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Pencil, Eye, ShieldAlert, Trash2, Download, ChevronDown, ShieldX } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import modals
import AddParcelModal from '@/components/app/parcels/AddParcelModal'
import EditParcelModal from '@/components/app/parcels/EditParcelModal'
import BlockParcelModal from '@/components/modal/BlockParcelModal'
import DeleteParcelModal from '@/components/modal/DeleteParcelModal'
import ParcelDetailsModal from '@/components/modal/ParcelDetailsModal'
import AddOwnerModal from '@/components/app/parcels/AddOwnerModal'

// Import custom pagination
import CustomPagination from '@/components/shared/CustomPagination'
import { Button } from '@/components/ui/button'

export interface Owner {
  name: string
  phone: string
  email: string
  role: string
}

export interface Parcel {
  id: string
  name: string
  city: string
  district: string
  area: number
  status: string
  reliability: 'Very High' | 'High' | 'Medium' | 'Low'
  ownerName: string
  createdDate: string
  description: string
  latitude: number
  longitude: number
  owners: Owner[]
  documents: { name: string; size: string; date: string }[]
  history: { action: string; time: string; admin: string }[]
}

// Exact list of parcels from Image 2
const initialParcels: Parcel[] = [
  {
    id: 'CM-2847',
    name: 'Bastos Estate Plot A',
    city: 'Yaoundé',
    district: 'Bastos',
    area: 1240,
    status: 'Published',
    reliability: 'Very High',
    ownerName: 'Pierre Mballa',
    createdDate: '12 Jan 2025',
    description: 'Prime commercial block in Bastos district. Suitable for embassy offices or luxury villa.',
    latitude: 3.8964,
    longitude: 11.5126,
    owners: [
      { name: 'Pierre Mballa', phone: '+237 677 889 900', email: 'pierre.mballa@gmail.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Land_Title_2847.pdf', size: '2.4 MB', date: '2025-01-12' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-01-12 09:30', admin: 'Jean Alima' }
    ]
  },
  {
    id: 'CM-2848',
    name: 'Douala Bonanjo Commercial',
    city: 'Douala',
    district: 'Bonanjo',
    area: 3500,
    status: 'Disputed',
    reliability: 'Low',
    ownerName: 'Amina Fouda',
    createdDate: '8 Feb 2025',
    description: 'High-value commercial land currently under boundary arbitration due to neighboring plot overlap.',
    latitude: 4.0504,
    longitude: 9.7085,
    owners: [
      { name: 'Amina Fouda', phone: '+237 655 443 322', email: 'amina.fouda@outlook.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Boundary_Dispute_Report.pdf', size: '1.2 MB', date: '2025-02-08' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-02-08 10:15', admin: 'Sarah Admin' }
    ]
  },
  {
    id: 'CM-2849',
    name: 'Melen Residential Lot',
    city: 'Yaoundé',
    district: 'Melen',
    area: 800,
    status: 'Under Verification',
    reliability: 'Medium',
    ownerName: 'Jean-Pierre Nkodo',
    createdDate: '15 Mar 2025',
    description: 'Residential parcel undergoing GIS database coordinates validation check.',
    latitude: 3.8612,
    longitude: 11.5021,
    owners: [
      { name: 'Jean-Pierre Nkodo', phone: '+237 699 887 766', email: 'jp.nkodo@gmail.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Survey_Receipt.pdf', size: '0.8 MB', date: '2025-03-15' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-03-15 11:20', admin: 'Jean Alima' }
    ]
  },
  {
    id: 'CM-2850',
    name: 'Ntarikon Lot B',
    city: 'Bamenda',
    district: 'Ntarikon',
    area: 2100,
    status: 'Reserved',
    reliability: 'High',
    ownerName: 'Grace Tanda',
    createdDate: '2 Apr 2025',
    description: 'Reserved parcel for local municipal expansion or green spaces.',
    latitude: 5.9631,
    longitude: 10.1591,
    owners: [
      { name: 'Grace Tanda', phone: '+237 680 554 433', email: 'grace.tanda@yahoo.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Municipal_Notice.pdf', size: '1.4 MB', date: '2025-04-02' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-04-02 14:00', admin: 'Supervisor Paul' }
    ]
  },
  {
    id: 'CM-2851',
    name: 'Hauts-Plateaux Agriculture',
    city: 'Bafoussam',
    district: 'Hauts-Plateaux',
    area: 1650,
    status: 'Sold',
    reliability: 'Very High',
    ownerName: 'François Ngono',
    createdDate: '20 Apr 2025',
    description: 'Fertile land registered under private sale verification.',
    latitude: 5.4784,
    longitude: 10.4174,
    owners: [
      { name: 'François Ngono', phone: '+237 670 112 233', email: 'francois.ngono@gmail.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Sale_Agreement.pdf', size: '3.1 MB', date: '2025-04-20' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-04-20 16:30', admin: 'Sarah Admin' }
    ]
  },
  {
    id: 'CM-2852',
    name: 'Garoua Nord Plot',
    city: 'Garoua',
    district: 'Nord',
    area: 4200,
    status: 'Draft',
    reliability: 'Medium',
    ownerName: 'Halima Bello',
    createdDate: '1 May 2025',
    description: 'Draft registry listing for rural developmental land planning.',
    latitude: 9.3005,
    longitude: 13.3981,
    owners: [
      { name: 'Halima Bello', phone: '+237 612 345 678', email: 'halima.bello@outlook.com', role: 'Primary Owner' }
    ],
    documents: [],
    history: [
      { action: 'Draft Created', time: '2025-05-01 09:00', admin: 'Jean Alima' }
    ]
  },
  {
    id: 'CM-2853',
    name: 'Akwa Commercial Strip',
    city: 'Douala',
    district: 'Akwa',
    area: 750,
    status: 'Validated',
    reliability: 'High',
    ownerName: 'Samuel Kotto',
    createdDate: '14 May 2025',
    description: 'Akwa business center parcel with fully validated surveyor bounds.',
    latitude: 4.0452,
    longitude: 9.6912,
    owners: [
      { name: 'Samuel Kotto', phone: '+237 678 123 456', email: 'samuel.kotto@gmail.com', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Survey_Validation.pdf', size: '2.5 MB', date: '2025-05-14' }
    ],
    history: [
      { action: 'Parcel Registered', time: '2025-05-14 10:45', admin: 'Sarah Admin' }
    ]
  },
  {
    id: 'CM-2854',
    name: 'Biyem-Assi Hillside',
    city: 'Yaoundé',
    district: 'Biyem-Assi',
    area: 1900,
    status: 'Blocked',
    reliability: 'Low',
    ownerName: 'Rosine Bekolo',
    createdDate: '28 May 2025',
    description: 'Hillside block suspended due to geological hazard risk assessments.',
    latitude: 3.8415,
    longitude: 11.4892,
    owners: [
      { name: 'Rosine Bekolo', phone: '+237 654 987 321', email: 'rosine.bekolo@yahoo.fr', role: 'Primary Owner' }
    ],
    documents: [
      { name: 'Geological_Report.pdf', size: '5.1 MB', date: '2025-05-28' }
    ],
    history: [
      { action: 'Parcel Suspended', time: '2025-05-28 15:30', admin: 'Supervisor Paul' }
    ]
  },
  {
    id: 'CM-2855',
    name: 'Kaélé Agri-zone',
    city: 'Maroua',
    district: 'Kaélé',
    area: 5600,
    status: 'Published',
    reliability: 'Medium',
    ownerName: 'Ibrahim Alioum',
    createdDate: '3 Jun 2025',
    description: 'Large agricultural tract published for cooperative farming audits.',
    latitude: 10.5904,
    longitude: 14.2815,
    owners: [
      { name: 'Ibrahim Alioum', phone: '+237 667 788 991', email: 'ibrahim.alioum@outlook.com', role: 'Primary Owner' }
    ],
    documents: [],
    history: [
      { action: 'Parcel Registered', time: '2025-06-03 08:30', admin: 'Jean Alima' }
    ]
  },
  {
    id: 'CM-2856',
    name: 'New Bell Residential Lot',
    city: 'Douala',
    district: 'New Bell',
    area: 620,
    status: 'Under Verification',
    reliability: 'High',
    ownerName: 'Claudine Mvondo',
    createdDate: '10 Jun 2025',
    description: 'Residential lot coordinates undergoing field surveyor checks.',
    latitude: 4.0284,
    longitude: 9.7315,
    owners: [
      { name: 'Claudine Mvondo', phone: '+237 671 223 344', email: 'claudine.mvondo@gmail.com', role: 'Primary Owner' }
    ],
    documents: [],
    history: [
      { action: 'Parcel Registered', time: '2025-06-10 11:00', admin: 'Jean Alima' }
    ]
  }
]

// Custom Dropdown Component matching Image 1
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
    <div ref={dropdownRef} className="relative select-none">
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
                  "w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors",
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

const ParcelsPage = () => {
  const [parcels, setParcels] = useState<Parcel[]>(initialParcels)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('Date Range')
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'block' | 'delete' | 'details' | 'add_owner' | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, cityFilter, dateFilter])

  // Filter logic
  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.district.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || parcel.status === statusFilter
    const matchesCity = cityFilter === 'All' || parcel.city === cityFilter

    // Mock date filter checks
    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = parcel.createdDate.includes('Jun 2025')
    } else if (dateFilter === 'This Month') {
      matchesDate = parcel.createdDate.includes('Jun 2025') || parcel.createdDate.includes('May 2025')
    }

    return matchesSearch && matchesStatus && matchesCity && matchesDate
  })

  // Pagination Calculations
  const totalEntries = filteredParcels.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedParcels = filteredParcels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Modal handlers
  const handleOpenModal = (modalType: 'add' | 'edit' | 'block' | 'delete' | 'details', parcel?: Parcel) => {
    if (parcel) setSelectedParcel(parcel)
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedParcel(null)
  }

  // CRUD callbacks
  const handleAddParcel = (newParcelData: any) => {
    const newId = `CM-${Math.floor(2857 + Math.random() * 100)}`
    const cityDistrict = newParcelData.location.split('/')
    const city = (cityDistrict[0] || 'Yaoundé').trim()
    const district = (cityDistrict[1] || 'Bastos').trim()

    const newParcel: Parcel = {
      ...newParcelData,
      id: newId,
      city,
      district,
      reliability: 'High',
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      owners: [{ name: newParcelData.ownerName, phone: '+237 600 000 000', email: 'owner@landsecure.cm', role: 'Primary Owner' }],
      documents: [],
      history: [{ action: 'Parcel Registered', time: new Date().toISOString().replace('T', ' ').substring(0, 16), admin: 'Admin Jean Alima' }]
    }
    setParcels([newParcel, ...parcels])
    closeModal()
  }

  const handleUpdateParcel = (updatedFields: Partial<Parcel> & { location?: string }) => {
    if (!selectedParcel) return
    let city = selectedParcel.city
    let district = selectedParcel.district
    if (updatedFields.location) {
      const cityDistrict = updatedFields.location.split('/')
      city = (cityDistrict[0] || 'Yaoundé').trim()
      district = (cityDistrict[1] || 'Bastos').trim()
    }

    const { location, ...rest } = updatedFields

    setParcels(
      parcels.map((p) =>
        p.id === selectedParcel.id
          ? {
              ...p,
              ...rest,
              city,
              district,
              history: [
                ...p.history,
                {
                  action: 'Parcel Details Modified',
                  time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  admin: 'Admin Jean Alima'
                }
              ]
            }
          : p
      )
    )
    closeModal()
  }

  const handleBlockParcel = (reason: string) => {
    if (!selectedParcel) return
    setParcels(
      parcels.map((p) =>
        p.id === selectedParcel.id
          ? {
              ...p,
              status: 'Blocked',
              reliability: 'Low',
              history: [
                ...p.history,
                {
                  action: `Parcel Blocked. Reason: ${reason}`,
                  time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  admin: 'Admin Jean Alima'
                }
              ]
            }
          : p
      )
    )
    closeModal()
  }

  const handleDeleteParcel = () => {
    if (!selectedParcel) return
    setParcels(parcels.filter((p) => p.id !== selectedParcel.id))
    closeModal()
  }

  const openAddOwnerModal = () => {
    setActiveModal('add_owner')
  }

  const handleAddOwner = (newOwner: Owner) => {
    if (!selectedParcel) return
    const updatedParcel = {
      ...selectedParcel,
      owners: [...selectedParcel.owners, newOwner],
      history: [
        ...selectedParcel.history,
        {
          action: `Owner added: ${newOwner.name} (${newOwner.role})`,
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          admin: 'Admin Jean Alima'
        }
      ]
    }
    setParcels(parcels.map((p) => (p.id === selectedParcel.id ? updatedParcel : p)))
    setSelectedParcel(updatedParcel)
    setActiveModal('details')
  }

  const handleUpdateStatus = (newStatus: string, reason: string) => {
    if (!selectedParcel) return
    const updatedParcel = {
      ...selectedParcel,
      status: newStatus,
      history: [
        ...selectedParcel.history,
        {
          action: `Status changed to ${newStatus}. Reason: ${reason}`,
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          admin: 'Admin Jean Alima'
        }
      ]
    }
    setParcels(parcels.map((p) => (p.id === selectedParcel.id ? updatedParcel : p)))
    setSelectedParcel(updatedParcel)
  }

  return (
    <DashboardChildrenLayout title="Parcel Management" subtitle="Manage all land parcels across Cameroon cities">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        
        {/* Action / Filter Bar */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
            {/* Search Input */}
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

            {/* Custom Filter "All Statuses" */}
            <CustomFilterDropdown
              label="All Statuses"
              header="All Statuses"
              options={['All', 'Published', 'Reserved', 'Disputed', 'Sold', 'Draft', 'Blocked', 'Under Verification', 'Validated']}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />

            {/* Custom Filter "All Cities" */}
            <CustomFilterDropdown
              label="All Cities"
              header="All Cities"
              options={['All', 'Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua']}
              selected={cityFilter}
              onSelect={setCityFilter}
            />

            {/* Custom Filter "Date Range" */}
            <CustomFilterDropdown
              label="Date Range"
              header="Date Range"
              options={['Date Range', 'This Week', 'This Month', 'This Year']}
              selected={dateFilter}
              onSelect={setDateFilter}
            />
          </div>

          {/* Export & Add buttons */}
          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
            <button
              onClick={() => alert('Exporting data as CSV...')}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <Button
              onClick={() => handleOpenModal('add')}
              className='w-auto'
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Parcel</span>
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Parcel ID</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">City / District</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Area Size</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Reliability</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Owner</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">Created</th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedParcels.length > 0 ? (
                paginatedParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Blue ID Link */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleOpenModal('details', parcel)}
                        className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left outline-none cursor-pointer"
                      >
                        {parcel.id}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                      {parcel.city} / {parcel.district}
                    </td>
                    <td className="py-4 px-5 text-sm font-semibold text-slate-600 font-mono">
                      {parcel.area.toLocaleString()} m²
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded text-[11px] font-bold border",
                          parcel.status === 'Published' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                          parcel.status === 'Validated' && 'bg-teal-50 text-teal-600 border-teal-100',
                          parcel.status === 'Pending' && 'bg-yellow-50 text-yellow-600 border-yellow-100',
                          parcel.status === 'Reserved' && 'bg-amber-50 text-amber-600 border-amber-100',
                          parcel.status === 'Disputed' && 'bg-rose-50 text-rose-600 border-rose-100',
                          parcel.status === 'Under Verification' && 'bg-blue-50 text-blue-600 border-blue-100',
                          parcel.status === 'Sold' && 'bg-purple-50 text-purple-600 border-purple-100',
                          parcel.status === 'Draft' && 'bg-slate-50 text-slate-500 border-slate-200',
                          parcel.status === 'Blocked' && 'bg-red-50 text-red-600 border-red-100'
                        )}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    {/* Reliability Levels matching Image 2 */}
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border",
                          parcel.reliability === 'Very High' && 'bg-[#047857] border-[#047857]',
                          parcel.reliability === 'High' && 'bg-emerald-500 border-emerald-500',
                          parcel.reliability === 'Medium' && 'bg-amber-500 border-amber-500',
                          parcel.reliability === 'Low' && 'bg-red-500 border-red-500'
                        )}
                      >
                        {parcel.reliability}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                      {parcel.ownerName}
                    </td>
                    <td className="py-4 px-5 text-sm font-semibold text-slate-400">
                      {parcel.createdDate}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Details Eye Button (Blue) */}
                        <button
                          onClick={() => handleOpenModal('details', parcel)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>

                        {/* Edit Pencil Button (Green) */}
                        <button
                          onClick={() => handleOpenModal('edit', parcel)}
                          className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                          title="Edit Parcel"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </button>

                        {/* Block Ban Button (Red) */}
                        <button
                          disabled={parcel.status === 'Blocked'}
                          onClick={() => handleOpenModal('block', parcel)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors cursor-pointer",
                            parcel.status === 'Blocked' 
                              ? "text-slate-200 cursor-not-allowed" 
                              : "text-red-500 hover:text-red-700 hover:bg-red-50/50"
                          )}
                          title="Block Parcel"
                        >
                          <ShieldX className="w-4.5 h-4.5" />
                        </button>

                        {/* Delete Button (Trash) */}
                        {/* <button
                          onClick={() => handleOpenModal('delete', parcel)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Delete Parcel"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                    No parcels found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Custom Pagination Component */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalEntries={totalEntries}
          pageSize={pageSize}
        />

      </div>

      {/* Render Modals */}
      {activeModal === 'add' && (
        <AddParcelModal
          isOpen={true}
          onClose={closeModal}
          onAdd={handleAddParcel}
        />
      )}

      {activeModal === 'edit' && selectedParcel && (
        <EditParcelModal
          isOpen={true}
          onClose={closeModal}
          parcel={selectedParcel}
          onUpdate={handleUpdateParcel}
        />
      )}

      {activeModal === 'block' && selectedParcel && (
        <BlockParcelModal
          isOpen={true}
          onClose={closeModal}
          parcel={selectedParcel}
          onBlock={handleBlockParcel}
        />
      )}

      {activeModal === 'delete' && selectedParcel && (
        <DeleteParcelModal
          isOpen={true}
          onClose={closeModal}
          parcel={selectedParcel}
          onDelete={handleDeleteParcel}
        />
      )}

      {activeModal === 'details' && selectedParcel && (
        <ParcelDetailsModal
          isOpen={true}
          onClose={closeModal}
          parcel={selectedParcel}
          onAddOwner={openAddOwnerModal}
          onUpdateStatus={handleUpdateStatus}
          onEdit={() => handleOpenModal('edit', selectedParcel)}
          onBlock={() => handleOpenModal('block', selectedParcel)}
          onDelete={() => handleOpenModal('delete', selectedParcel)}
        />
      )}

      {activeModal === 'add_owner' && selectedParcel && (
        <AddOwnerModal
          isOpen={true}
          onClose={closeModal}
          onAddOwner={handleAddOwner}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default ParcelsPage