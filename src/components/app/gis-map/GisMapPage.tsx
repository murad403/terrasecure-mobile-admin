"use client"
import React, { useState, useEffect, useRef } from 'react'
import {
    Search, ChevronDown, Download, Upload, Pencil, Map, X, ZoomIn, ZoomOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ImportSHPModal from './ImportSHPModal'
import ImportGeoJSONModal from './ImportGeoJSONModal'
import DrawPolygonModal from './DrawPolygonModal'
import EditPolygonModal from './EditPolygonModal'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import Toggle from '@/components/shared/Toggle'

/* ── Types ── */
interface Parcel {
    id: string
    area: string
    status: 'Published' | 'Disputed' | 'Under Verification' | 'Reserved' | 'Sold' | 'Draft' | 'Validated'
    coords: [number, number][]
    color: string
    fillColor: string
}

/* ── Mock parcel data (matches screenshot IDs & statuses) ── */
const PARCELS: Parcel[] = [
    { id: 'CN-2847', area: '1,240 m²', status: 'Published', coords: [[5.92, 12.05], [5.96, 12.15], [5.89, 12.18], [5.85, 12.08]], color: '#16a34a', fillColor: '#86efac' },
    { id: 'CN-2848', area: '3,500 m²', status: 'Disputed', coords: [[5.72, 12.35], [5.76, 12.45], [5.69, 12.48], [5.65, 12.38]], color: '#dc2626', fillColor: '#fca5a5' },
    { id: 'CN-2849', area: '820 m²', status: 'Under Verification', coords: [[5.52, 12.12], [5.57, 12.24], [5.49, 12.27], [5.45, 12.16]], color: '#2563eb', fillColor: '#93c5fd' },
    { id: 'CN-2850', area: '2,100 m²', status: 'Reserved', coords: [[5.48, 12.52], [5.52, 12.63], [5.44, 12.65], [5.40, 12.55]], color: '#ea580c', fillColor: '#fdba74' },
    { id: 'CN-2851', area: '1,650 m²', status: 'Sold', coords: [[5.32, 12.28], [5.36, 12.38], [5.28, 12.41], [5.24, 12.30]], color: '#0d9488', fillColor: '#5eead4' },
    { id: 'CN-2852', area: '4,200 m²', status: 'Draft', coords: [[5.18, 12.08], [5.22, 12.18], [5.14, 12.21], [5.10, 12.10]], color: '#6b7280', fillColor: '#e5e7eb' },
    { id: 'CN-2853', area: '750 m²', status: 'Validated', coords: [[5.08, 12.45], [5.12, 12.55], [5.04, 12.58], [5.00, 12.47]], color: '#15803d', fillColor: '#4ade80' },
]

function statusColor(status: Parcel['status']) {
    return {
        Published: 'text-green-600',
        Disputed: 'text-red-500',
        'Under Verification': 'text-blue-500',
        Reserved: 'text-orange-500',
        Sold: 'text-teal-600',
        Draft: 'text-slate-500',
        Validated: 'text-green-700',
    }[status] ?? 'text-slate-500'
}

/* ── Layer toggle data ── */
const LAYERS = [
    { id: 'landParcels', label: 'Land Parcels', defaultOn: true, color: 'bg-emerald-500' },
    { id: 'roads', label: 'Roads', defaultOn: false, color: 'bg-red-500' },
    { id: 'districts', label: 'Districts', defaultOn: true, color: 'bg-yellow-500' },
    { id: 'coveredZones', label: 'Covered Zones', defaultOn: true, color: 'bg-fuchsia-500' },
    { id: 'periUrbanZones', label: 'Peri-urban Zones', defaultOn: false, color: 'bg-green-500' },
    { id: 'highSpecZones', label: 'High Speculation Zones', defaultOn: false, color: 'bg-purple-500' },
    { id: 'disputedZones', label: 'Disputed Zones', defaultOn: false, color: 'bg-blue-500' },
    { id: 'adminBoundaries', label: 'Administrative Boundaries', defaultOn: true, color: 'bg-violet-500' },
]

/* ── Toggle switch ── */


/* ── Main page ── */
const GisMapPage = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMapRef = useRef<import('leaflet').Map | null>(null)
    const polygonLayersRef = useRef<Record<string, import('leaflet').Polygon>>({})

    // FIX: Use a ref to track layerState to avoid stale closures in toggleLayer
    const layerStateRef = useRef<Record<string, boolean>>(
        Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultOn]))
    )
    const [layerState, setLayerState] = useState<Record<string, boolean>>(
        () => Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultOn]))
    )

    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
    const [mapSearch, setMapSearch] = useState('')
    const [parcelSearch, setParcelSearch] = useState('')

    /* ── Filter dropdowns ── */
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
        'Doc Type': 'All Types',
        'All Statuses': 'All Statuses',
        'Date Range': 'All Time',
    })
    const dropdownRef = useRef<HTMLDivElement>(null)

    const DROPDOWN_OPTIONS: Record<string, string[]> = {
        'Doc Type': ['All Types', 'Land Certificate', 'Survey Plan', 'Title Deed', 'Lease Agreement'],
        'All Statuses': ['All Statuses', 'Published', 'Disputed', 'Under Verification', 'Reserved', 'Sold', 'Draft', 'Validated'],
        'Date Range': ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'This Year'],
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    /* ── Modals ── */
    const [importSHPOpen, setImportSHPOpen] = useState(false)
    const [importGeoJSONOpen, setImportGeoJSONOpen] = useState(false)
    const [drawPolygonOpen, setDrawPolygonOpen] = useState(false)
    const [editPolygonOpen, setEditPolygonOpen] = useState(false)

    /* ── Init Leaflet map ── */
    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return

        const init = async () => {
            const { default: L } = await import('leaflet')

            // Fix default marker icons for Next.js
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            })

            const map = L.map(mapRef.current!, { zoomControl: false })
            leafletMapRef.current = map

            L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: '© OpenTopoMap contributors',
            }).addTo(map)

            map.setView([5.6, 12.3], 9)

            // Add parcel polygons
            PARCELS.forEach((parcel) => {
                const poly = L.polygon(parcel.coords, {
                    color: parcel.color,
                    weight: 2,
                    fillColor: parcel.fillColor,
                    fillOpacity: 0.4,
                }).addTo(map)

                poly.on('click', () => setSelectedParcel(parcel))
                poly.bindTooltip(parcel.id, {
                    permanent: false,
                    direction: 'center',
                    className: 'text-xs font-bold',
                })
                polygonLayersRef.current[parcel.id] = poly
            })
        }

        init()

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove()
                leafletMapRef.current = null
            }
        }
    }, [])

    /* ── Zoom controls ── */
    const zoomIn = () => leafletMapRef.current?.zoomIn()
    const zoomOut = () => leafletMapRef.current?.zoomOut()

    /* ── FIX: Toggle layer visibility — use ref to avoid stale closure ── */
    const toggleLayer = (id: string) => {
        // Read current value from ref (always fresh), not from state (stale in closure)
        const currentOn = layerStateRef.current[id]
        const newOn = !currentOn

        // Update ref immediately
        layerStateRef.current = { ...layerStateRef.current, [id]: newOn }
        // Then update state to re-render
        setLayerState({ ...layerStateRef.current })

        // Actually hide / show land parcel polygons on the map
        if (id === 'landParcels' && leafletMapRef.current) {
            PARCELS.forEach((p) => {
                const poly = polygonLayersRef.current[p.id]
                if (!poly) return
                if (newOn) {
                    poly.addTo(leafletMapRef.current!)
                } else {
                    leafletMapRef.current!.removeLayer(poly)
                }
            })
        }
    }

    /* ── FIX: Map GPS / parcel ID search — pan on Enter ── */
    const handleMapSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        const query = mapSearch.trim().toLowerCase()
        if (!query) return

        // Try to match by parcel ID
        const match = PARCELS.find((p) => p.id.toLowerCase().includes(query))
        if (match && leafletMapRef.current) {
            const poly = polygonLayersRef.current[match.id]
            if (poly) {
                leafletMapRef.current.fitBounds(poly.getBounds(), { padding: [30, 30] })
                setSelectedParcel(match)
            }
        }
    }

    /* ── Filtered parcel list (right panel) ── */
    const filteredParcels = PARCELS.filter((p) =>
        p.id.toLowerCase().includes(parcelSearch.toLowerCase())
    )

    return (
        <DashboardChildrenLayout title="GIS / Map" subtitle="Interactive land parcel mapping and spatial management">
            {/* Filter bar */}
            <div ref={dropdownRef} className="flex items-center gap-3 flex-wrap mb-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        value={parcelSearch}
                        onChange={(e) => setParcelSearch(e.target.value)}
                        placeholder="Search parcels..."
                        className="pl-8 pr-3 h-9 w-44 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 bg-white"
                    />
                </div>
                {(['Doc Type', 'All Statuses', 'Date Range'] as const).map((label) => (
                    <div key={label} className="relative">
                        <button
                            type="button"
                            onClick={() => setActiveDropdown((prev) => (prev === label ? null : label))}
                            className={cn(
                                'flex items-center gap-1.5 h-9 px-3 border rounded-lg text-xs font-medium transition-colors cursor-pointer',
                                activeDropdown === label
                                    ? 'border-slate-400 bg-slate-100 text-slate-900'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            )}
                        >
                            {selectedFilters[label] === 'All Types' || selectedFilters[label] === 'All Statuses' || selectedFilters[label] === 'All Time'
                                ? label
                                : selectedFilters[label]}
                            <ChevronDown className={cn('w-3 h-3 transition-transform', activeDropdown === label && 'rotate-180')} />
                        </button>
                        {activeDropdown === label && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[170px]" style={{ zIndex: 9999 }}>
                                {DROPDOWN_OPTIONS[label].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setSelectedFilters((prev) => ({ ...prev, [label]: option }))
                                            setActiveDropdown(null)
                                        }}
                                        className={cn(
                                            'w-full text-left px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                                            selectedFilters[label] === option
                                                ? 'bg-slate-100 text-slate-900 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* FIX: 3-column layout with explicit calculated height so map fills space */}
            <div
                className="flex gap-0 overflow-hidden rounded-xl"
                style={{ height: 'calc(100vh - 260px)', minHeight: '420px' }}
            >
                {/* ── Layer Controls ── */}
                <div className="w-52 shrink-0 bg-white border border-slate-100 rounded-l-xl p-4 space-y-3 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Map className="w-3.5 h-3.5" />
                        Layer Controls
                    </h3>
                    <div className="space-y-3">
                        {LAYERS.map((layer) => (
                            <div key={layer.id} className="flex items-center justify-between gap-2">
                                <span className={cn(
                                    'text-[11px] font-semibold',
                                    layerState[layer.id] ? 'text-slate-700' : 'text-slate-400'
                                )}>
                                    {layer.label}
                                </span>
                                <Toggle
                                    on={layerState[layer.id]}
                                    onToggle={() => toggleLayer(layer.id)}
                                    color={layer.color}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Map area ── */}
                <div className="flex-1 flex flex-col border-t border-b border-slate-100 min-w-0">
                    {/* Map toolbar */}
                    <div className="bg-white border-b border-slate-100 px-3 py-2 flex items-center gap-2 flex-wrap shrink-0">
                        {/* FIX: GPS / Parcel ID search — fires on Enter */}
                        <div className="relative flex-1 min-w-[160px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            <input
                                value={mapSearch}
                                onChange={(e) => setMapSearch(e.target.value)}
                                onKeyDown={handleMapSearchKey}
                                placeholder="Search parcel ID or GPS (3.848, 11.502)..."
                                className="pl-7 pr-3 h-8 w-full border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 bg-white"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <ActionBtn icon={<Upload className="w-3 h-3" />} label="Import GeoJSON" onClick={() => setImportGeoJSONOpen(true)} />
                            <ActionBtn icon={<Upload className="w-3 h-3" />} label="Import SHP" onClick={() => setImportSHPOpen(true)} />
                            <ActionBtn icon={<Download className="w-3 h-3" />} label="Export GeoJSON" onClick={() => { }} />
                            <ActionBtn icon={<Download className="w-3 h-3" />} label="Export SHP" onClick={() => { }} />
                            <ActionBtn icon={<Pencil className="w-3 h-3" />} label="Draw Polygon" onClick={() => setDrawPolygonOpen(true)} accent />
                            <ActionBtn icon={<Pencil className="w-3 h-3" />} label="Edit Polygon" onClick={() => setEditPolygonOpen(true)} accent />
                            <ActionBtn icon={<Map className="w-3 h-3" />} label="Manage Zones" onClick={() => { }} accent="purple" />
                        </div>
                    </div>

                    {/* Map + zoom controls */}
                    <div className="relative flex-1 min-h-0 overflow-hidden">
                        <div ref={mapRef} className="w-full h-full" />

                        {/* FIX: use z-[9999] (bracket notation) — z-9999 is not a valid Tailwind class */}
                        <div className="absolute top-3 right-3 z-9999 flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={zoomIn}
                                className="w-8 h-8 bg-white shadow-md rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer border border-slate-200"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={zoomOut}
                                className="w-8 h-8 bg-white shadow-md rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer border border-slate-200"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Selected parcel info bar */}
                        {selectedParcel && (
                            <div className="absolute bottom-0 left-0 right-0 z-9999 bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-3">
                                <span className="text-xs font-extrabold text-slate-900">{selectedParcel.id}</span>
                                <span className={cn('text-xs font-bold', statusColor(selectedParcel.status))}>
                                    {selectedParcel.status}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">{selectedParcel.area}</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedParcel(null)}
                                    className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Parcels on Map panel ── */}
                <div className="w-48 shrink-0 bg-white border border-slate-100 rounded-r-xl p-3 flex flex-col overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-700 mb-2 shrink-0">Parcels on Map</h3>
                    <div className="space-y-0.5 overflow-y-auto flex-1">
                        {filteredParcels.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                    setSelectedParcel(p)
                                    const poly = polygonLayersRef.current[p.id]
                                    if (poly && leafletMapRef.current) {
                                        leafletMapRef.current.fitBounds(poly.getBounds(), { padding: [20, 20] })
                                    }
                                }}
                                className={cn(
                                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer',
                                    selectedParcel?.id === p.id ? 'bg-slate-100' : 'hover:bg-slate-50'
                                )}
                            >
                                <span className="text-[11px] font-bold text-slate-800">{p.id}</span>
                                <span className={cn('text-[9px] font-bold', statusColor(p.status))}>{p.status}</span>
                            </button>
                        ))}
                        {filteredParcels.length === 0 && (
                            <p className="text-[10px] text-slate-400 font-medium px-2 pt-1">No results</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <ImportSHPModal isOpen={importSHPOpen} onClose={() => setImportSHPOpen(false)} />
            <ImportGeoJSONModal isOpen={importGeoJSONOpen} onClose={() => setImportGeoJSONOpen(false)} />
            <DrawPolygonModal isOpen={drawPolygonOpen} onClose={() => setDrawPolygonOpen(false)} onSave={() => setDrawPolygonOpen(false)} />
            <EditPolygonModal isOpen={editPolygonOpen} onClose={() => setEditPolygonOpen(false)} onSave={() => setEditPolygonOpen(false)} />
        </DashboardChildrenLayout>
    )
}

/* ── Tiny action button component ── */
const ActionBtn = ({
    icon, label, onClick, accent,
}: {
    icon: React.ReactNode
    label: string
    onClick: () => void
    accent?: boolean | 'purple'
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            'flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap',
            accent === 'purple'
                ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                : accent
                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        )}
    >
        {icon}
        {label}
    </button>
)

export default GisMapPage