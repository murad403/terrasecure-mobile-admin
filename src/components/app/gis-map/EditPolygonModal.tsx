"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface LatLng { lat: number; lng: number }

interface Parcel {
  id: string
  coords: LatLng[]
}

interface EditPolygonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (parcelId: string, coords: LatLng[]) => void
}

/* ── Static mock parcels centred on Cameroon ── */
const MOCK_PARCELS: Parcel[] = [
  {
    id: 'CM-2847',
    coords: [
      { lat: 5.85, lng: 12.10 }, { lat: 5.95, lng: 12.30 },
      { lat: 5.85, lng: 12.55 }, { lat: 5.65, lng: 12.60 },
      { lat: 5.50, lng: 12.45 }, { lat: 5.52, lng: 12.20 },
      { lat: 5.65, lng: 12.05 },
    ],
  },
  {
    id: 'CM-2848',
    coords: [
      { lat: 5.20, lng: 12.80 }, { lat: 5.30, lng: 13.00 },
      { lat: 5.15, lng: 13.10 }, { lat: 5.00, lng: 12.90 },
    ],
  },
  {
    id: 'CM-2849',
    coords: [
      { lat: 6.10, lng: 11.80 }, { lat: 6.20, lng: 12.10 },
      { lat: 6.05, lng: 12.30 }, { lat: 5.90, lng: 12.10 },
      { lat: 5.95, lng: 11.85 },
    ],
  },
  {
    id: 'CM-2850',
    coords: [
      { lat: 4.80, lng: 11.60 }, { lat: 4.95, lng: 11.85 },
      { lat: 4.75, lng: 12.00 }, { lat: 4.60, lng: 11.75 },
    ],
  },
]

const DEFAULT_CENTER: [number, number] = [5.65, 12.35]
const DEFAULT_ZOOM = 8

const EditPolygonModal = ({ isOpen, onClose, onSave }: EditPolygonModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<import('leaflet').CircleMarker[]>([])
  const polygonRef = useRef<import('leaflet').Polygon | null>(null)
  const LRef = useRef<typeof import('leaflet').default | null>(null)

  const [mounted, setMounted] = useState(false)
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null)
  const [coords, setCoords] = useState<LatLng[]>([])
  const coordsRef = useRef<LatLng[]>([])

  const syncCoords = useCallback((c: LatLng[]) => {
    coordsRef.current = c
    setCoords([...c])
  }, [])

  useEffect(() => { setMounted(true) }, [])

  /* ── Init map ── */
  useEffect(() => {
    if (!isOpen) return
    if (!mapRef.current) return

    const init = async () => {
      const leaflet = await import('leaflet')
      const L = leaflet.default
      LRef.current = L

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }

      const map = L.map(mapRef.current!, { zoomControl: true })
      leafletMapRef.current = map

      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap contributors',
      }).addTo(map)

      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    }

    init()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* ── Draw polygon when parcel is selected ── */
  const drawParcel = useCallback(async (parcel: Parcel) => {
    const map = leafletMapRef.current
    if (!map) return
    const L = LRef.current!

    // Clear previous
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []
    if (polygonRef.current) { map.removeLayer(polygonRef.current); polygonRef.current = null }

    const currentCoords = [...parcel.coords]
    syncCoords(currentCoords)

    // Draw filled orange polygon
    const latlngs = currentCoords.map((c) => [c.lat, c.lng] as [number, number])
    const poly = L.polygon(latlngs, {
      color: '#f97316',
      weight: 2,
      fillColor: '#fde68a',
      fillOpacity: 0.25,
    }).addTo(map)
    polygonRef.current = poly

    // Fit bounds
    map.fitBounds(poly.getBounds(), { padding: [40, 40] })

    // Draw draggable orange vertex markers
    currentCoords.forEach((c, index) => {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 8,
        color: '#fff',
        weight: 2.5,
        fillColor: '#f97316',
        fillOpacity: 1,
      }).addTo(map)

      // Make draggable by converting to marker on drag
      // We simulate drag with mousedown + mousemove on the map
      let isDragging = false
      let dragTarget: typeof marker | null = null

      marker.on('mousedown', () => {
        isDragging = true
        dragTarget = marker
        map.dragging.disable()
      })

      map.on('mousemove', (e: import('leaflet').LeafletMouseEvent) => {
        if (!isDragging || dragTarget !== marker) return
        marker.setLatLng(e.latlng)

        // Update coords
        const updated = [...coordsRef.current]
        updated[index] = { lat: e.latlng.lat, lng: e.latlng.lng }
        syncCoords(updated)

        // Update polygon
        if (polygonRef.current) {
          polygonRef.current.setLatLngs(
            updated.map((p) => [p.lat, p.lng] as [number, number])
          )
        }
      })

      map.on('mouseup', () => {
        if (isDragging) {
          isDragging = false
          dragTarget = null
          map.dragging.enable()
        }
      })

      markersRef.current.push(marker)
    })
  }, [syncCoords])

  const handleSelectParcel = (parcelId: string) => {
    const parcel = MOCK_PARCELS.find((p) => p.id === parcelId)
    if (!parcel) return
    setSelectedParcelId(parcelId)
    drawParcel(parcel)
  }

  const handleReset = () => {
    if (!selectedParcelId) return
    const parcel = MOCK_PARCELS.find((p) => p.id === selectedParcelId)
    if (parcel) drawParcel(parcel)
  }

  const handleSave = () => {
    if (!selectedParcelId) return
    onSave(selectedParcelId, coordsRef.current)
    onClose()
  }

  const handleClose = () => {
    setSelectedParcelId(null)
    syncCoords([])
    onClose()
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[860px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Edit Polygon</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a parcel then drag vertices to adjust the boundary.</p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Parcel selector */}
        <div className="px-6 pb-3 flex items-center gap-3 flex-wrap shrink-0">
          <span className="text-sm font-bold text-slate-800">Select Parcel:</span>
          {MOCK_PARCELS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectParcel(p.id)}
              className={`px-3 py-1 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                selectedParcelId === p.id
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="relative mx-4 rounded-xl overflow-hidden flex-1 min-h-0" style={{ height: '450px' }}>
          {!selectedParcelId && (
            <div className="absolute top-3 left-3 z-9999 bg-white/95 shadow-md rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 pointer-events-none">
              Select a parcel above
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedParcelId}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                selectedParcelId
                  ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

    </div>,
    document.body
  )
}

export default EditPolygonModal