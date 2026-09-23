"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Search, Download, Upload, Pencil, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ImportSHPModal from './ImportSHPModal'
import ImportGeoJSONModal from './ImportGeoJSONModal'
import DrawPolygonModal from './DrawPolygonModal'
import EditPolygonModal from './EditPolygonModal'
import AddZoneModal from './AddZoneModal'
import EditZoneModal from './EditZoneModal'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { useRetrieveParcelsQuery } from '@/redux/features/parcel/parcel.api'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'
import { toast } from 'sonner'

export interface Zone {
    id: string
    name: string
    type: 'Covered / Surveyed' | 'Uncovered / Unsurveyed' | 'Future Survey Needed'
    city: string
    district: string
    area: string
    parcelsCount?: number
    lastSurveyDate?: string
    notes?: string
}

const INITIAL_ZONES: Zone[] = [
    {
        id: 'ZN-001',
        name: 'Bastos Zone',
        type: 'Covered / Surveyed',
        city: 'All Statuses',
        district: 'Bastos',
        area: '4.2',
        parcelsCount: 312,
        lastSurveyDate: 'Feb 2024',
        notes: 'Fully surveyed. High density residential.'
    },
    {
        id: 'ZN-002',
        name: 'Melen Zone',
        type: 'Covered / Surveyed',
        city: 'All Statuses',
        district: 'Melen',
        area: '2.8',
        parcelsCount: 187,
        lastSurveyDate: 'Apr 2024',
        notes: 'Secondary survey completed April 2024.'
    }
]

const STATUS_TABS = [
    'All Statuses',
    'DRAFT',
    'VERIFICATION',
    'VALIDATED',
    'PUBLISHED',
    'RESERVED',
    'SOLD',
    'DISPUTED',
    'BLOCKED'
]

function getStatusBadgeStyle(status?: string | null) {
    switch (status?.toUpperCase()) {
        case 'PUBLISHED':
        case 'VALIDATED':
            return 'text-emerald-600 bg-emerald-50 border-emerald-200'
        case 'DISPUTED':
        case 'BLOCKED':
            return 'text-rose-600 bg-rose-50 border-rose-200'
        case 'UNDER_VERIFICATION':
        case 'VERIFICATION':
            return 'text-blue-600 bg-blue-50 border-blue-200'
        case 'RESERVED':
            return 'text-amber-600 bg-amber-50 border-amber-200'
        case 'SOLD':
            return 'text-teal-600 bg-teal-50 border-teal-200'
        case 'DRAFT':
        default:
            return 'text-slate-600 bg-slate-100 border-slate-200'
    }
}

function getStatusColor(status?: string | null) {
    switch (status?.toUpperCase()) {
        case 'PUBLISHED':
        case 'VALIDATED':
            return { color: '#16a34a', fillColor: '#86efac' }
        case 'DISPUTED':
        case 'BLOCKED':
            return { color: '#dc2626', fillColor: '#fca5a5' }
        case 'UNDER_VERIFICATION':
        case 'VERIFICATION':
            return { color: '#2563eb', fillColor: '#93c5fd' }
        case 'RESERVED':
            return { color: '#ea580c', fillColor: '#fdba74' }
        case 'SOLD':
            return { color: '#0d9488', fillColor: '#5eead4' }
        case 'DRAFT':
        default:
            return { color: '#6b7280', fillColor: '#e5e7eb' }
    }
}

const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/* ── Main page ── */
const GisMapPage = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMapRef = useRef<import('leaflet').Map | null>(null)
    const polygonLayersRef = useRef<Record<string, import('leaflet').Polygon>>({})

    const [parcelSearch, setParcelSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')
    const [selectedParcel, setSelectedParcel] = useState<ParcelListItem | null>(null)

    // Fetch live parcels from backend API passing search and status filter
    const { data: parcelsResponse, isLoading: isParcelsLoading, refetch: refetchParcels } = useRetrieveParcelsQuery({
        limit: 100,
        search: parcelSearch || undefined,
        status: statusFilter !== 'All Statuses' ? statusFilter : undefined
    })

    const parcels: ParcelListItem[] = parcelsResponse?.data || []

    /* ── Modals ── */
    const [importSHPOpen, setImportSHPOpen] = useState(false)
    const [importGeoJSONOpen, setImportGeoJSONOpen] = useState(false)
    const [drawPolygonOpen, setDrawPolygonOpen] = useState(false)
    const [editPolygonOpen, setEditPolygonOpen] = useState(false)
    const [addZoneOpen, setAddZoneOpen] = useState(false)
    const [editZoneOpen, setEditZoneOpen] = useState(false)
    const [editingZone, setEditingZone] = useState<Zone | null>(null)
    const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES)

    const handleAddZone = (newZone: Omit<Zone, 'id'>) => {
        const nextIdNumber = zones.length > 0
            ? Math.max(...zones.map(z => parseInt(z.id.split('-')[1]) || 0)) + 1
            : 1;
        const formattedId = `ZN-${String(nextIdNumber).padStart(3, '0')}`;
        const zoneWithId: Zone = {
            ...newZone,
            id: formattedId,
        };
        setZones(prev => [...prev, zoneWithId]);
    };

    const handleUpdateZone = (updatedZone: Zone) => {
        setZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
    };

    /* ── Helper to retrieve valid GeoJSON Polygon geometry ── */
    const getParcelGeometry = (p: ParcelListItem) => {
        if (p.boundary?.coordinates?.[0]?.length) {
            const ring = p.boundary.coordinates[0].map(([lng, lat]) => [lng, lat]);
            // Ensure closed ring (first position === last position)
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
                ring.push([first[0], first[1]]);
            }
            return {
                type: 'Polygon' as const,
                coordinates: [ring],
            };
        }
        if (p.location?.latitude && p.location?.longitude) {
            const lat = p.location.latitude;
            const lng = p.location.longitude;
            const d = 0.003;
            return {
                type: 'Polygon' as const,
                coordinates: [[
                    [lng - d, lat + d],
                    [lng + d, lat + d],
                    [lng + d, lat - d],
                    [lng - d, lat - d],
                    [lng - d, lat + d],
                ]],
            };
        }
        return null;
    };

    /* ── Export Handlers ── */
    const handleExportGeoJSON = () => {
        const targetParcels = selectedParcel ? [selectedParcel] : parcels;

        if (targetParcels.length === 0) {
            toast.error('No parcels available to export.');
            return;
        }

        const features = targetParcels
            .map((p) => {
                const geom = getParcelGeometry(p);
                if (!geom) return null;
                return {
                    type: 'Feature',
                    id: p.id,
                    properties: {
                        id: p.id,
                        parcelCode: p.parcelCode || p.slug || `#${p.id}`,
                        slug: p.slug,
                        status: p.status,
                        areaSqm: p.areaSqm,
                        location: p.location ? `${p.location.addressLine1 || ''} ${p.location.city || ''} ${p.location.country || ''}`.trim() : null,
                    },
                    geometry: geom,
                };
            })
            .filter(Boolean);

        if (features.length === 0) {
            toast.error('Selected parcel(s) do not have valid boundary geometry set.');
            return;
        }

        const geoJsonData = {
            type: 'FeatureCollection',
            features,
        };

        const fileName = selectedParcel
            ? `${selectedParcel.parcelCode || selectedParcel.slug || `parcel_${selectedParcel.id}`}_boundary.geojson`
            : 'land_parcels_export.geojson';

        downloadFile(JSON.stringify(geoJsonData, null, 2), fileName, 'application/geo+json');
        toast.success(`Exported GeoJSON for ${selectedParcel ? selectedParcel.parcelCode || `#${selectedParcel.id}` : `${features.length} parcel(s)`}`);
    };

    const handleExportSHP = () => {
        const targetParcels = selectedParcel ? [selectedParcel] : parcels;

        if (targetParcels.length === 0) {
            toast.error('No parcels available to export.');
            return;
        }

        const features = targetParcels
            .map((p) => {
                const geom = getParcelGeometry(p);
                if (!geom) return null;
                return {
                    type: 'Feature',
                    id: p.id,
                    properties: {
                        FID: p.id,
                        PARCEL_ID: p.id,
                        CODE: p.parcelCode || p.slug || `#${p.id}`,
                        STATUS: p.status || 'DRAFT',
                        AREA_SQM: p.areaSqm || 0,
                        CITY: p.location?.city || '',
                        ADDRESS: p.location?.addressLine1 || '',
                    },
                    geometry: geom,
                };
            })
            .filter(Boolean);

        if (features.length === 0) {
            toast.error('Selected parcel(s) do not have valid boundary geometry set.');
            return;
        }

        const shpSchemaData = {
            format: 'ESRI Shapefile GeoJSON Schema',
            exportedAt: new Date().toISOString(),
            type: 'FeatureCollection',
            features,
        };

        const fileName = selectedParcel
            ? `${selectedParcel.parcelCode || selectedParcel.slug || `parcel_${selectedParcel.id}`}_shp.json`
            : 'land_parcels_shp_export.json';

        downloadFile(JSON.stringify(shpSchemaData, null, 2), fileName, 'application/json');
        toast.success(`Exported SHP data for ${selectedParcel ? selectedParcel.parcelCode || `#${selectedParcel.id}` : `${features.length} parcel(s)`}`);
    };

    /* ── Init Leaflet map and render live parcels ── */
    useEffect(() => {
        if (!mapRef.current) return

        let isMounted = true

        const init = async () => {
            const { default: L } = await import('leaflet')

            if (!isMounted) return

            // Avoid re-initializing Leaflet on existing container
            if (leafletMapRef.current || (mapRef.current && (mapRef.current as any)._leaflet_id)) {
                return
            }

            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            })

            const map = L.map(mapRef.current!, { zoomControl: false })

            if (!isMounted) {
                map.remove()
                return
            }

            leafletMapRef.current = map

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map)

            map.setView([5.6, 12.3], 9)
        }

        init()

        return () => {
            isMounted = false
            if (leafletMapRef.current) {
                leafletMapRef.current.remove()
                leafletMapRef.current = null
            }
        }
    }, [])

    /* ── Render live parcel polygons & markers on map ── */
    useEffect(() => {
        const map = leafletMapRef.current
        if (!map || isParcelsLoading) return

        const renderPolygons = async () => {
            const L = await import('leaflet')

            // Clear previous polygon layers
            Object.values(polygonLayersRef.current).forEach(layer => {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer)
                }
            })
            polygonLayersRef.current = {}

            if (!parcels.length) return

            const boundsGroup: import('leaflet').LatLngBounds[] = []

            parcels.forEach((p) => {
                const code = p.parcelCode || p.slug || `#${p.id}`
                const styles = getStatusColor(p.status)
                const isSelected = selectedParcel?.id === p.id

                let latlngs: [number, number][] = []

                if (p.boundary?.coordinates?.[0]?.length) {
                  // GeoJSON coordinates: [lng, lat] -> convert to Leaflet [lat, lng]
                  latlngs = p.boundary.coordinates[0].map(([lng, lat]) => [lat, lng])
                } else if (p.location?.latitude && p.location?.longitude) {
                  // Default square polygon if boundary geometry is missing
                  const lat = p.location.latitude
                  const lng = p.location.longitude
                  const d = 0.005
                  latlngs = [
                    [lat + d, lng - d],
                    [lat + d, lng + d],
                    [lat - d, lng + d],
                    [lat - d, lng - d]
                  ]
                }

                if (latlngs.length > 0) {
                  const poly = L.polygon(latlngs, {
                    color: isSelected ? '#2563eb' : styles.color,
                    fillColor: isSelected ? '#3b82f6' : styles.fillColor,
                    weight: isSelected ? 4 : 2,
                    fillOpacity: isSelected ? 0.6 : 0.4
                  }).addTo(map)

                  poly.on('click', () => setSelectedParcel(p))
                  poly.bindTooltip(code, {
                    permanent: false,
                    direction: 'center',
                    className: 'text-xs font-bold'
                  })

                  polygonLayersRef.current[String(p.id)] = poly as any
                  boundsGroup.push(poly.getBounds())
                }
            })

            // Fit map view to bounds if parcels exist and no parcel is currently selected
            if (boundsGroup.length > 0 && !selectedParcel) {
                const featureGroup = L.featureGroup(Object.values(polygonLayersRef.current))
                map.fitBounds(featureGroup.getBounds(), { padding: [40, 40], maxZoom: 14 })
            }
        }

        renderPolygons()
    }, [parcels, isParcelsLoading, selectedParcel?.id])

    /* ── Zoom controls ── */
    const zoomIn = () => leafletMapRef.current?.zoomIn()
    const zoomOut = () => leafletMapRef.current?.zoomOut()

    return (
        <DashboardChildrenLayout title="GIS / Map" subtitle="Interactive land parcel mapping and spatial management">
            {/* Search & Status Tabs bar */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        value={parcelSearch}
                        onChange={(e) => setParcelSearch(e.target.value)}
                        placeholder="Search parcels..."
                        className="pl-8 pr-3 h-9 w-44 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 bg-white"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {STATUS_TABS.map((status) => {
                        const isSelected = statusFilter === status

                        return (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                                    isSelected
                                        ? 'bg-button-color text-white border-transparent shadow-xs'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                )}
                            >
                                {status.replace(/_/g, ' ')}
                            </button>
                        )
                    })}
                </div>

                {isParcelsLoading && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-button-color ml-auto">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading Map Data...
                    </div>
                )}
            </div>

            {/* 3-column layout */}
            <div
                className="flex gap-0 overflow-hidden rounded-xl"
                style={{ height: 'calc(100vh - 260px)', minHeight: '420px' }}
            >
                {/* ── Map area ── */}
                <div className="flex-1 flex flex-col border-t border-b border-slate-100 min-w-0">
                    {/* Map toolbar */}
                    <div className="bg-white border-b border-slate-100 px-3 py-2 flex items-center gap-2 flex-wrap shrink-0">
                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <ActionBtn icon={<Upload className="w-3 h-3" />} label="Import GeoJSON" onClick={() => setImportGeoJSONOpen(true)} />
                            <ActionBtn icon={<Upload className="w-3 h-3" />} label="Import SHP" onClick={() => setImportSHPOpen(true)} />
                            <ActionBtn icon={<Download className="w-3 h-3" />} label="Export GeoJSON" onClick={handleExportGeoJSON} />
                            <ActionBtn icon={<Download className="w-3 h-3" />} label="Export SHP" onClick={handleExportSHP} />
                            <ActionBtn icon={<Pencil className="w-3 h-3" />} label="Draw Polygon" onClick={() => setDrawPolygonOpen(true)} accent />
                            <ActionBtn icon={<Pencil className="w-3 h-3" />} label="Edit Polygon" onClick={() => setEditPolygonOpen(true)} accent />
                        </div>
                    </div>

                    {/* Map + zoom controls */}
                    <div className="relative flex-1 min-h-0 overflow-hidden">
                        <div ref={mapRef} className="w-full h-full" />

                        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1">
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
                            <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xs border-t border-slate-200 px-4 py-2 flex items-center gap-3 shadow-lg">
                                <span className="text-xs font-extrabold text-slate-900">
                                    {selectedParcel.parcelCode || selectedParcel.slug || `#${selectedParcel.id}`}
                                </span>
                                <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', getStatusBadgeStyle(selectedParcel.status))}>
                                    {selectedParcel.status || 'DRAFT'}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                    {selectedParcel.areaSqm ? `${selectedParcel.areaSqm} m²` : 'N/A Area'}
                                </span>
                                {selectedParcel.location?.city && (
                                    <span className="text-xs text-slate-400 font-medium">
                                        📍 {selectedParcel.location.city}
                                    </span>
                                )}
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleExportGeoJSON}
                                        className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                                    >
                                        <Download className="w-3 h-3 text-slate-500" />
                                        Export GeoJSON
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExportSHP}
                                        className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                                    >
                                        <Download className="w-3 h-3 text-slate-500" />
                                        Export SHP
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedParcel(null)}
                                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md hover:bg-slate-100 transition-colors ml-1"
                                        title="Deselect boundary"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Parcels on Map panel ── */}
                <div className="w-48 shrink-0 bg-white border border-slate-100 rounded-r-xl p-3 flex flex-col overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-700 mb-2 shrink-0">
                        Parcels on Map ({parcels.length})
                    </h3>
                    <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                        {parcels.map((p) => {
                            const code = p.parcelCode || p.slug || `#${p.id}`
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedParcel(p)
                                        const poly = polygonLayersRef.current[String(p.id)]
                                        if (poly && leafletMapRef.current) {
                                            leafletMapRef.current.fitBounds(poly.getBounds(), { padding: [20, 20] })
                                        }
                                    }}
                                    className={cn(
                                        'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer border',
                                        selectedParcel?.id === p.id ? 'bg-slate-100 border-slate-300' : 'hover:bg-slate-50 border-transparent'
                                    )}
                                >
                                    <span className="text-[11px] font-bold text-slate-800 truncate">{code}</span>
                                    <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0', getStatusBadgeStyle(p.status))}>
                                        {p.status || 'DRAFT'}
                                    </span>
                                </button>
                            )
                        })}
                        {parcels.length === 0 && !isParcelsLoading && (
                            <p className="text-[10px] text-slate-400 font-medium px-2 pt-2">No parcels found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <ImportSHPModal
                isOpen={importSHPOpen}
                onClose={() => setImportSHPOpen(false)}
                parcels={parcels}
                selectedParcelId={selectedParcel?.id}
                onSaveSuccess={() => refetchParcels()}
            />
            <ImportGeoJSONModal
                isOpen={importGeoJSONOpen}
                onClose={() => setImportGeoJSONOpen(false)}
                parcels={parcels}
                selectedParcelId={selectedParcel?.id}
                onSaveSuccess={() => refetchParcels()}
            />
            <DrawPolygonModal
                isOpen={drawPolygonOpen}
                onClose={() => setDrawPolygonOpen(false)}
                parcels={parcels}
                selectedParcelId={selectedParcel?.id}
                onSaveSuccess={() => refetchParcels()}
            />
            <EditPolygonModal
                isOpen={editPolygonOpen}
                onClose={() => setEditPolygonOpen(false)}
                parcels={parcels}
                selectedParcelId={selectedParcel?.id}
                onSaveSuccess={() => refetchParcels()}
            />

            <AddZoneModal
                isOpen={addZoneOpen}
                onClose={() => setAddZoneOpen(false)}
                onAdd={handleAddZone}
            />

            {editingZone && (
                <EditZoneModal
                    isOpen={editZoneOpen}
                    onClose={() => {
                        setEditZoneOpen(false);
                        setEditingZone(null);
                    }}
                    zone={editingZone}
                    onSave={handleUpdateZone}
                />
            )}
        </DashboardChildrenLayout>
    )
}

/* ── Action button component ── */
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