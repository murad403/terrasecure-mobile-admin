"use client"
import React, { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2, MapPin, CheckCircle2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { useUpdateParcelBoundaryMutation } from '@/redux/features/parcel/parcel.api'
import type { ParcelListItem, GeoJsonPolygon } from '@/redux/features/parcel/parcel.type'
import { toast } from 'sonner'

interface ImportGISModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'geojson' | 'shp'
  parcels?: ParcelListItem[]
  selectedParcelId?: number | string | null
  onSaveSuccess?: () => void
}

function extractPolygonFromGeoJson(data: any): GeoJsonPolygon | null {
  if (!data) return null;

  // FeatureCollection
  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    for (const feature of data.features) {
      const polygon = extractPolygonFromGeoJson(feature);
      if (polygon) return polygon;
    }
  }

  // Feature
  if (data.type === 'Feature' && data.geometry) {
    return extractPolygonFromGeoJson(data.geometry);
  }

  // Polygon
  if (data.type === 'Polygon' && Array.isArray(data.coordinates) && data.coordinates.length > 0) {
    const rawRing = data.coordinates[0];
    if (!Array.isArray(rawRing) || rawRing.length < 3) return null;

    const closedRing: [number, number][] = rawRing.map((pt: any) => [Number(pt[0]), Number(pt[1])]);
    const first = closedRing[0];
    const last = closedRing[closedRing.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      closedRing.push([first[0], first[1]]);
    }

    if (closedRing.length < 4) return null;

    return {
      type: 'Polygon',
      coordinates: [closedRing],
    };
  }

  // MultiPolygon -> extract first polygon ring
  if (data.type === 'MultiPolygon' && Array.isArray(data.coordinates) && data.coordinates.length > 0) {
    const rawRing = data.coordinates[0][0];
    if (!Array.isArray(rawRing) || rawRing.length < 3) return null;

    const closedRing: [number, number][] = rawRing.map((pt: any) => [Number(pt[0]), Number(pt[1])]);
    const first = closedRing[0];
    const last = closedRing[closedRing.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      closedRing.push([first[0], first[1]]);
    }

    if (closedRing.length < 4) return null;

    return {
      type: 'Polygon',
      coordinates: [closedRing],
    };
  }

  return null;
}

const ImportGISModal = ({
  isOpen,
  onClose,
  defaultTab = 'geojson',
  parcels = [],
  selectedParcelId: initialSelectedParcelId = null,
  onSaveSuccess,
}: ImportGISModalProps) => {
  const [activeTab, setActiveTab] = useState<'geojson' | 'shp'>(defaultTab)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [targetParcelId, setTargetParcelId] = useState<number | string | null>(initialSelectedParcelId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  const [updateParcelBoundary, { isLoading: isSubmitting }] = useUpdateParcelBoundaryMutation()

  useEffect(() => { setMounted(true) }, [])

  // Sync defaultTab & targetParcelId when modal opens or props change
  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    if (initialSelectedParcelId) {
      setTargetParcelId(initialSelectedParcelId)
    } else if (parcels.length > 0 && !targetParcelId) {
      setTargetParcelId(parcels[0].id)
    }
  }, [initialSelectedParcelId, parcels])

  if (!isOpen || !mounted) return null

  const accept = activeTab === 'geojson' ? '.geojson,.json' : '.shp,.zip,.json,.geojson'
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

  const handleConfirmImport = async () => {
    if (!targetParcelId) {
      toast.error('Please select a target parcel to update boundary.')
      return
    }

    if (!file) {
      toast.error(`Please select or drop a ${label} file.`)
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const textContent = event.target?.result as string
        const parsedJson = JSON.parse(textContent)
        const polygon = extractPolygonFromGeoJson(parsedJson)

        if (!polygon) {
          toast.error('Could not extract a valid closed Polygon boundary from file.');
          return;
        }

        await updateParcelBoundary({
          id: targetParcelId,
          data: { boundary: polygon },
        }).unwrap()

        toast.success(`Parcel boundary imported successfully from ${file.name}!`)
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (err: any) {
        toast.error(err?.data?.message || 'Invalid file contents or failed to update boundary.')
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file.')
    }

    reader.readAsText(file)
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Import GIS Boundary Data</h2>
            <p className="text-xs text-slate-500">Upload GeoJSON/SHP polygon to update parcel geometry</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Parcel Selector */}
        <div className="px-6 pt-4 pb-2">
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-button-color" />
            Target Parcel to Update:
          </label>
          <select
            value={targetParcelId ? String(targetParcelId) : ''}
            onChange={(e) => setTargetParcelId(e.target.value)}
            className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-button-color"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.parcelCode || p.slug || `#${p.id}`} — {p.status || 'DRAFT'} ({p.areaSqm ? `${p.areaSqm} m²` : 'No Area'})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTabChange('geojson')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'geojson'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Import GeoJSON
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('shp')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Import SHP
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
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors select-none ${
              dragging
                ? 'border-[#1b5e20] bg-green-50/50'
                : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Upload className="w-5 h-5" />
            </div>
            {file ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                {file.name}
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 font-semibold text-center">{dropLabel}</p>
                <p className="text-[11px] text-slate-400 font-medium">Supports GeoJSON & ESRI SHP JSON data</p>
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
        <div className="flex items-center gap-3 px-6 pb-6 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmImport}
            className="flex-1 py-2.5 text-xs font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Importing...
              </>
            ) : (
              'Confirm Import'
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImportGISModal
