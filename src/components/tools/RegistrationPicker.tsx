"use client"
import React, { useState, useRef, useEffect } from 'react'
import { FileText, ClipboardList } from 'lucide-react'
import useDebounce from '@/hooks/useDebounce'
import { useRetrieveRegistrationsQuery } from '@/redux/features/registrations/registration.api'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface RegistrationPickerProps {
  value?: RegistrationItem[]
  onChange: (registrations: RegistrationItem[]) => void
  placeholder?: string
  type?: 'checkbox' | 'radio'
}

export const getRegistrationLabel = (item: RegistrationItem): string =>
  item.slug || (item.id != null ? `REG-${String(item.id).padStart(5, '0')}` : '')

const getRegistrationSub = (item: RegistrationItem): string => {
  if (item.areaSqm) return `${item.areaSqm} m²`
  if (item.status) return item.status
  return item.id != null ? `Registration #${item.id}` : ''
}

export const RegistrationPicker: React.FC<RegistrationPickerProps> = ({
  value = [],
  onChange,
  placeholder = 'Select registration...',
  type = 'checkbox',
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: registrationResponse, isFetching, isError } = useRetrieveRegistrationsQuery(
    {
      page: 1,
      limit: 20,
      search: debouncedSearch,
    },
    {
      skip: !isOpen,
    }
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item: RegistrationItem) => {
    const exists = value.some((r) => r.id === item.id)

    if (type === 'radio') {
      onChange(exists ? [] : [item])
      setIsOpen(false)
    } else {
      if (exists) {
        onChange(value.filter((r) => r.id !== item.id))
      } else {
        onChange([...value, item])
      }
    }
  }

  const handleRemoveBadge = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    onChange(value.filter((r) => r.id !== id))
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
    setSearchTerm('')
  }

  const availableRegistrations =
    registrationResponse?.data?.filter((reg: any) => !value.some((v) => v.id === reg.id)) ?? []

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selector Display Field */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between min-h-10.5 w-full px-3 py-1.5 border rounded-lg shadow-sm bg-white cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500"
      >
        {/* Selected Items / Badges inside Picker Bar */}
        <div className="flex flex-wrap gap-1 items-center max-w-[80%] overflow-hidden">
          {value.length > 0 ? (
            value.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200"
              >
                <span className="truncate max-w-40 font-mono font-bold">{getRegistrationLabel(item)}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveBadge(e, item.id)}
                  className="hover:text-blue-900 font-bold ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-gray-400 hover:text-gray-600 text-sm px-1"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400 text-xs">▼</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden flex flex-col">
          {/* Search Input inside Dropdown */}
          <div className="p-2 border-b bg-gray-50">
            <input
              type="text"
              autoFocus
              className="w-full px-2 py-1.5 text-xs border rounded outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              placeholder="Search registrations by slug/notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Registration List Container */}
          <div className="overflow-y-auto max-h-48">
            {isFetching ? (
              <div className="p-3 text-xs text-center text-gray-500">Loading registrations...</div>
            ) : isError ? (
              <div className="p-3 text-xs text-center text-red-500">Failed to load registrations</div>
            ) : availableRegistrations.length === 0 ? (
              <div className="p-3 text-xs text-center text-gray-500">
                {value.length > 0 ? 'No more registrations found' : 'No registrations found'}
              </div>
            ) : (
              <ul className="py-1">
                {availableRegistrations.map((item: any) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                      <ClipboardList className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-slate-800 font-mono truncate">{getRegistrationLabel(item)}</span>
                      <span className="text-[11px] text-gray-400 truncate">
                        {getRegistrationSub(item)}
                        {item.step ? ` · Step ${item.step}` : ''}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
