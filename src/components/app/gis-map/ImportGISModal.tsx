"use client"
import React, { useState, useRef, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'

interface ImportGISModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'geojson' | 'shp'
}

const ImportGISModal = ({ isOpen, onClose, defaultTab = 'geojson' }: ImportGISModalProps) => {
  const [activeTab, setActiveTab] = useState<'geojson' | 'shp'>(defaultTab)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Sync default tab when prop changes
  useEffect(() => { setActiveTab(defaultTab) }, [defaultTab])

  if (!isOpen || !mounted) return null

  const accept = activeTab === 'geojson' ? '.geojson,.json' : '.shp,.zip'
  const label = activeTab === 'geojson' ? 'GeoJSON' : 'SHP'
  const dropLabel = `Drop ${label} file or click to browse`

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
  }

  const handleTabChange = (tab: 'geojson' | 'shp') => {
    setActiveTab(tab)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-base font-bold text-slate-900">Import GIS Data</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('geojson')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'geojson'
                  ? 'bg-button-color text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              GeoJSON
            </button>
            <button
              onClick={() => handleTabChange('shp')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'shp'
                  ? 'bg-button-color text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              SHP
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="px-6 pb-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors select-none ${
              dragging
                ? 'border-[#1b5e20] bg-green-50/50'
                : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center text-slate-400">
              <Upload className="w-8 h-8 stroke-[1.5]" />
            </div>
            {file ? (
              <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
            ) : (
              <>
                <p className="text-sm text-slate-600 font-medium text-center">{dropLabel}</p>
                <p className="text-xs text-slate-400 font-medium">Max 50MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 w-1/2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
          className='w-1/2'
          >
            Confirm Import
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImportGISModal
