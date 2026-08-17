"use client"
import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import 'leaflet/dist/leaflet.css'

export interface LocationValue {
  remarks?: string
  latitude?: number
  longitude?: number
  addressLine1?: string
  addressLine2?: string
  country?: string
  state?: string
  city?: string
  zipCode?: string
  note?: string
}

interface LocationPickerProps {
  value?: LocationValue
  onChange: (val: LocationValue) => void
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isDetecting, setIsDetecting] = useState<boolean>(false)

  const currentValue: LocationValue = {
    addressLine1: value?.addressLine1 || '',
    addressLine2: value?.addressLine2 || '',
    city: value?.city || '',
    state: value?.state || '',
    country: value?.country || '',
    zipCode: value?.zipCode || '',
    latitude: value?.latitude,
    longitude: value?.longitude,
    remarks: value?.remarks || '',
    note: value?.note || '',
  }

  // Keep refs up-to-date for Leaflet event handlers
  const valueRef = useRef(currentValue)
  useEffect(() => {
    valueRef.current = currentValue
  }, [currentValue])

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Fetch current IP location from https://ipwho.is/ on initial load if location fields are empty
  useEffect(() => {
    let isSubscribed = true

    const fetchIpLocation = async () => {
      if (value?.country || value?.city || value?.latitude) {
        return
      }

      try {
        setIsDetecting(true)
        const res = await fetch('https://ipwho.is/')
        const data = await res.json()

        if (isSubscribed && data && data.success) {
          const detectedLoc: LocationValue = {
            ...valueRef.current,
            country: data.country || '',
            state: data.region || '',
            city: data.city || '',
            zipCode: data.postal || '',
            latitude: data.latitude,
            longitude: data.longitude,
          }
          if (onChangeRef.current) {
            onChangeRef.current(detectedLoc)
          }
        }
      } catch (err) {
        console.error('Failed to fetch IP location:', err)
      } finally {
        if (isSubscribed) setIsDetecting(false)
      }
    }

    fetchIpLocation()

    return () => {
      isSubscribed = false
    }
  }, [])

  const detectLocationManually = async () => {
    try {
      setIsDetecting(true)
      const res = await fetch('https://ipwho.is/')
      const data = await res.json()

      if (data && data.success) {
        const detectedLoc: LocationValue = {
          ...currentValue,
          country: data.country || '',
          state: data.region || '',
          city: data.city || '',
          zipCode: data.postal || '',
          latitude: data.latitude,
          longitude: data.longitude,
        }
        onChange(detectedLoc)
      }
    } catch (err) {
      console.error('Error detecting location:', err)
    } finally {
      setIsDetecting(false)
    }
  }

  const updateField = (field: keyof LocationValue, val: any) => {
    onChange({
      ...currentValue,
      [field]: val,
    })
  }

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return

    let isMounted = true

    const initMap = async () => {
      const L = await import('leaflet')
      if (!isMounted || !mapContainerRef.current) return

      if (leafletMapRef.current || (mapContainerRef.current as any)._leaflet_id) {
        return
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const initLat = valueRef.current.latitude ?? 0
      const initLng = valueRef.current.longitude ?? 0
      const zoomLevel = valueRef.current.latitude ? 13 : 2

      const map = L.map(mapContainerRef.current).setView([initLat, initLng], zoomLevel)

      if (!isMounted) {
        map.remove()
        return
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      if (valueRef.current.latitude !== undefined && valueRef.current.longitude !== undefined) {
        const marker = L.marker([initLat, initLng], { draggable: true }).addTo(map)
        markerRef.current = marker

        marker.on('dragend', () => {
          const position = marker.getLatLng()
          const lat = Number(position.lat.toFixed(6))
          const lng = Number(position.lng.toFixed(6))
          if (onChangeRef.current) {
            onChangeRef.current({
              ...valueRef.current,
              latitude: lat,
              longitude: lng,
            })
          }
        })
      }

      // Map click event
      map.on('click', (e: any) => {
        const lat = Number(e.latlng.lat.toFixed(6))
        const lng = Number(e.latlng.lng.toFixed(6))

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map)
          newMarker.on('dragend', () => {
            const position = newMarker.getLatLng()
            if (onChangeRef.current) {
              onChangeRef.current({
                ...valueRef.current,
                latitude: Number(position.lat.toFixed(6)),
                longitude: Number(position.lng.toFixed(6)),
              })
            }
          })
          markerRef.current = newMarker
        }

        if (onChangeRef.current) {
          onChangeRef.current({
            ...valueRef.current,
            latitude: lat,
            longitude: lng,
          })
        }
      })

      leafletMapRef.current = map
    }

    initMap()

    return () => {
      isMounted = false
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  // Update marker position on manual lat/lng changes
  useEffect(() => {
    if (leafletMapRef.current) {
      const lat = Number(currentValue.latitude)
      const lng = Number(currentValue.longitude)
      if (!isNaN(lat) && !isNaN(lng) && currentValue.latitude !== undefined && currentValue.longitude !== undefined) {
        const L = (window as any).L
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else if (L) {
          const marker = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current)
          markerRef.current = marker
        }
        leafletMapRef.current.panTo([lat, lng])
      }
    }
  }, [currentValue.latitude, currentValue.longitude])

  return (
    <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-slate-50/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Parcel Location Picker
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Click map or detect location below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={detectLocationManually}
            disabled={isDetecting}
            className="flex items-center gap-1 px-2.5 py-1 text-[10.5px] font-bold rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            {isDetecting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Navigation className="w-3 h-3" />
            )}
            <span>{isDetecting ? 'Detecting...' : 'Detect IP Location'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 h-52 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
        {currentValue.latitude !== undefined && currentValue.longitude !== undefined && (
          <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-[2px] px-2.5 py-1 rounded text-[10px] font-mono font-bold text-slate-700 border border-slate-200 shadow-sm pointer-events-none">
            📍 Lat: {currentValue.latitude} | Lng: {currentValue.longitude}
          </div>
        )}
      </div>

      {/* Location Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Address Line 1</Label>
          <Input
            type="text"
            placeholder="Address Line 1"
            value={currentValue.addressLine1}
            onChange={(e) => updateField('addressLine1', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Address Line 2</Label>
          <Input
            type="text"
            placeholder="Address Line 2"
            value={currentValue.addressLine2}
            onChange={(e) => updateField('addressLine2', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">City</Label>
          <Input
            type="text"
            placeholder="City"
            value={currentValue.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">State / Region</Label>
          <Input
            type="text"
            placeholder="State"
            value={currentValue.state}
            onChange={(e) => updateField('state', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Country</Label>
          <Input
            type="text"
            placeholder="Country"
            value={currentValue.country}
            onChange={(e) => updateField('country', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Zip Code</Label>
          <Input
            type="text"
            placeholder="Zip Code"
            value={currentValue.zipCode}
            onChange={(e) => updateField('zipCode', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Latitude</Label>
          <Input
            type="number"
            step="0.000001"
            placeholder="Latitude"
            value={currentValue.latitude ?? ''}
            onChange={(e) => updateField('latitude', e.target.value === '' ? undefined : Number(e.target.value))}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Longitude</Label>
          <Input
            type="number"
            step="0.000001"
            placeholder="Longitude"
            value={currentValue.longitude ?? ''}
            onChange={(e) => updateField('longitude', e.target.value === '' ? undefined : Number(e.target.value))}
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Remarks</Label>
          <Input
            type="text"
            placeholder="Remarks"
            value={currentValue.remarks}
            onChange={(e) => updateField('remarks', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-600">Note</Label>
          <Input
            type="text"
            placeholder="Note"
            value={currentValue.note}
            onChange={(e) => updateField('note', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>
    </div>
  )
}

export default LocationPicker