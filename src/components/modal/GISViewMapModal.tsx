"use client"
import React, { useEffect, useRef } from 'react'
import { X, MapPin, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RegistrationItem, RegistrationSurvey } from '@/redux/features/registrations/registration.type'
import 'leaflet/dist/leaflet.css'

interface GISViewMapModalProps {
  isOpen: boolean
  onClose: () => void
  registration?: RegistrationItem
  survey?: RegistrationSurvey
  latitude?: number
  longitude?: number
  parcelName?: string
  area?: number
  registrationId?: string | number
  onConfirm?: () => void
}

const GISViewMapModal: React.FC<GISViewMapModalProps> = ({
  isOpen,
  onClose,
  registration,
  survey,
  latitude,
  longitude,
  parcelName,
  area,
  registrationId,
  onConfirm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Extract points
  const points = survey?.points || []
  const pointsCount = points.length || (latitude && longitude ? 1 : 0)
  const computedArea = survey?.computedAreaSqm || registration?.areaSqm || area || 0
  const registrationIdStr =
    registrationId || registration?.slug || (registration?.id ? `REG-${registration.id}` : '') || parcelName || 'GIS Submission'

  const defaultCenter: [number, number] = [
    latitude || registration?.location?.latitude || 48.01027,
    longitude || registration?.location?.longitude || -89.5994,
  ]

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return

    let isMounted = true

    const initMap = async () => {
      const L = await import('leaflet')
      if (!isMounted || !mapContainerRef.current) return

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const latLngs: [number, number][] = points
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => [p.lat, p.lng])

      const initialCenter: [number, number] = latLngs.length > 0 ? latLngs[0] : defaultCenter

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(initialCenter, 14)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      if (latLngs.length > 1) {
        const polygon = L.polygon(latLngs, {
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          weight: 3,
        }).addTo(map)

        // Add markers for each vertex
        latLngs.forEach((pt, idx) => {
          L.circleMarker(pt, {
            radius: 5,
            color: '#1d4ed8',
            fillColor: '#ffffff',
            fillOpacity: 1,
            weight: 2,
          })
            .bindTooltip(`Pt #${idx + 1}`)
            .addTo(map)
        })

        map.fitBounds(polygon.getBounds(), { padding: [30, 30] })
      } else if (latLngs.length === 1) {
        L.marker(latLngs[0]).bindTooltip('Survey Point').addTo(map)
      } else if (latitude && longitude) {
        L.marker([latitude, longitude]).bindTooltip(parcelName || 'Parcel Location').addTo(map)
      }

      leafletMapRef.current = map
    }

    const timer = setTimeout(() => {
      initMap()
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timer)
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isOpen, survey?.points, latitude, longitude])

  if (!isOpen) return null

  const firstPoint = points[0] || {
    lat: defaultCenter[0],
    lng: defaultCenter[1],
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              GIS View – {registrationIdStr}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-sans flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-button-color" />
              <span>
                Source: {survey?.source || 'QFIELD'} · {pointsCount} GPS points collected
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="relative flex-1 bg-slate-100 min-h-96 w-full overflow-hidden select-none">
          <div ref={mapContainerRef} className="w-full h-96 z-0" />

          {/* Floating Location Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2 rounded-xl shadow-md text-slate-800 pointer-events-none select-none">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-button-color shrink-0" />
              <span>
                {registration?.location?.city || registration?.location?.addressLine1 || parcelName || 'Parcel Location'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 font-mono block mt-0.5 ml-5">
              Lat: {firstPoint.lat}°, Lng: {firstPoint.lng}°
            </span>
          </div>

          {/* Floating Area & Points Badge */}
          <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2 rounded-xl shadow-md text-right text-slate-800 pointer-events-none select-none">
            <div className="text-[11px] font-extrabold text-slate-800">
              Area: {Number(computedArea).toLocaleString()} m²
            </div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">
              {pointsCount} GPS points mapped
            </div>
          </div>
        </div>

        {/* GPS Points Log Table */}
        {points.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 max-h-36 overflow-y-auto">
            <h4 className="text-[11px] font-bold text-slate-700 mb-2">Captured GPS Points ({points.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {points.map((pt, idx) => (
                <div key={idx} className="p-1.5 bg-white rounded-lg border border-slate-200 text-[10px] font-mono shadow-2xs">
                  <span className="font-bold text-button-color">Pt #{idx + 1}:</span> {pt.lat.toFixed(5)}, {pt.lng.toFixed(5)}
                  {pt.accuracy && <span className="text-slate-400 block text-[9px]">±{pt.accuracy}m</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between font-semibold">
          <div className="text-[11px] text-slate-500 font-mono">
            Status: <strong className="text-slate-800">{survey?.status || 'VALIDATED'}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-auto px-4">
              Close
            </Button>
            {onConfirm && (
              <Button type="button" onClick={onConfirm} className="w-auto px-5 bg-emerald-600 hover:bg-emerald-700 text-white">
                Confirm & Import GIS Data
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GISViewMapModal