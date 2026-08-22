"use client"
import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

declare global {
  interface Window {
    google: any
  }
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API || ''

const loadGoogleMapsScript = (apiKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return
    if (window.google && window.google.maps) {
      resolve(window.google)
      return
    }
    const existingScript = document.getElementById('google-maps-js')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google))
      existingScript.addEventListener('error', (err) => reject(err))
      return
    }
    if (!apiKey) {
      reject(new Error('Google Maps API key missing'))
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-js'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}

const parseAddressComponents = (components: any[], formattedAddress?: string) => {
  let streetNumber = ''
  let route = ''
  let city = ''
  let state = ''
  let country = ''
  let zipCode = ''

  if (components) {
    for (const comp of components) {
      const types: string[] = comp.types || []
      if (types.includes('street_number')) streetNumber = comp.long_name
      if (types.includes('route')) route = comp.long_name
      if (types.includes('locality')) city = comp.long_name
      if (!city && types.includes('sublocality_level_1')) city = comp.long_name
      if (types.includes('administrative_area_level_1')) state = comp.long_name
      if (types.includes('country')) country = comp.long_name
      if (types.includes('postal_code')) zipCode = comp.long_name
    }
  }

  const addressLine1 = [streetNumber, route].filter(Boolean).join(' ') || formattedAddress || ''
  return { addressLine1, city, state, country, zipCode }
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const googleMapInstanceRef = useRef<any>(null)
  const markerInstanceRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)

  const [isApiLoaded, setIsApiLoaded] = useState<boolean>(false)
  const [isDetecting, setIsDetecting] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string | null>(null)

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

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const currentValueRef = useRef(currentValue)
  useEffect(() => {
    currentValueRef.current = currentValue
  }, [currentValue])

  // Load Google Maps Script
  useEffect(() => {
    let isMounted = true
    loadGoogleMapsScript(GOOGLE_API_KEY)
      .then((google) => {
        if (isMounted) {
          setIsApiLoaded(true)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Google Maps API failed to load:', err)
          setApiError('Google Maps API unavailable or key invalid. You can enter details manually.')
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Reverse geocode lat/lng
  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google?.maps?.Geocoder) return
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === 'OK' && results && results[0]) {
        const parsed = parseAddressComponents(results[0].address_components, results[0].formatted_address)
        onChangeRef.current({
          ...currentValueRef.current,
          latitude: lat,
          longitude: lng,
          addressLine1: parsed.addressLine1 || currentValueRef.current.addressLine1,
          city: parsed.city || currentValueRef.current.city,
          state: parsed.state || currentValueRef.current.state,
          country: parsed.country || currentValueRef.current.country,
          zipCode: parsed.zipCode || currentValueRef.current.zipCode,
        })
      } else {
        onChangeRef.current({
          ...currentValueRef.current,
          latitude: lat,
          longitude: lng,
        })
      }
    })
  }

  // Initialize Map & Autocomplete
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || !window.google?.maps) return

    const defaultLat = value?.latitude || 3.8480 // Yaounde, Cameroon default
    const defaultLng = value?.longitude || 11.5021
    const center = { lat: defaultLat, lng: defaultLng }

    if (!googleMapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: value?.latitude && value?.longitude ? 14 : 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })
      googleMapInstanceRef.current = map

      const marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
        title: 'Selected Location',
      })
      markerInstanceRef.current = marker

      // Dragend listener on marker
      marker.addListener('dragend', (e: any) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        reverseGeocode(lat, lng)
      })

      // Click listener on map
      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        marker.setPosition({ lat, lng })
        reverseGeocode(lat, lng)
      })
    }

    // Autocomplete setup
    if (searchInputRef.current && !autocompleteRef.current && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['geocode', 'establishment'],
      })
      autocompleteRef.current = autocomplete

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) return

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        if (googleMapInstanceRef.current) {
          googleMapInstanceRef.current.setCenter({ lat, lng })
          googleMapInstanceRef.current.setZoom(15)
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition({ lat, lng })
        }

        const parsed = parseAddressComponents(place.address_components, place.formatted_address)
        onChangeRef.current({
          ...currentValueRef.current,
          latitude: lat,
          longitude: lng,
          addressLine1: parsed.addressLine1,
          city: parsed.city,
          state: parsed.state,
          country: parsed.country,
          zipCode: parsed.zipCode,
        })
      })
    }
  }, [isApiLoaded])

  // Update map marker when props lat/lng change externally
  useEffect(() => {
    if (!googleMapInstanceRef.current || !markerInstanceRef.current) return
    if (typeof value?.latitude === 'number' && typeof value?.longitude === 'number') {
      const pos = { lat: value.latitude, lng: value.longitude }
      markerInstanceRef.current.setPosition(pos)
      googleMapInstanceRef.current.panTo(pos)
    }
  }, [value?.latitude, value?.longitude])

  // Geolocation detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setIsDetecting(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setIsDetecting(false)

        if (googleMapInstanceRef.current) {
          googleMapInstanceRef.current.setCenter({ lat, lng })
          googleMapInstanceRef.current.setZoom(15)
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition({ lat, lng })
        }

        if (isApiLoaded && window.google?.maps) {
          reverseGeocode(lat, lng)
        } else {
          onChangeRef.current({
            ...currentValueRef.current,
            latitude: lat,
            longitude: lng,
          })
        }
      },
      (error) => {
        setIsDetecting(false)
        console.error('Geolocation error:', error)
        alert('Could not retrieve your current position.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleInputChange = (field: keyof LocationValue, val: any) => {
    onChange({
      ...currentValue,
      [field]: val,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            Location Details
          </h3>
        </div>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
        >
          {isDetecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isDetecting ? 'Detecting...' : 'Detect Location'}</span>
        </button>
      </div>

      {/* Google Map & Places Search Container */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={isApiLoaded ? "Search address or location on Google Maps..." : "Loading Google Maps Places..."}
            className="pl-9 text-xs font-semibold bg-white border-slate-200"
            disabled={!isApiLoaded}
          />
        </div>

        <div className="relative w-full h-56 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
          <div ref={mapRef} className="w-full h-full" />
          {!isApiLoaded && !apiError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-[1px] text-xs text-slate-500 font-semibold gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Loading Google Map...
            </div>
          )}
          {apiError && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-50/90 text-amber-800 p-4 text-xs font-medium text-center">
              {apiError}
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          💡 Click on the map or drag the marker to pin the exact land parcel location.
        </p>
      </div>

      {/* Structured Address Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Address Line 1</Label>
          <Input
            type="text"
            placeholder="e.g. 123 Rue de la Reunification"
            value={currentValue.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Address Line 2</Label>
          <Input
            type="text"
            placeholder="e.g. Suite, Floor, Landmark"
            value={currentValue.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">City</Label>
          <Input
            type="text"
            placeholder="e.g. Yaounde"
            value={currentValue.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">State / Region</Label>
          <Input
            type="text"
            placeholder="e.g. Centre Region"
            value={currentValue.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Country</Label>
          <Input
            type="text"
            placeholder="e.g. Cameroon"
            value={currentValue.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Zip Code</Label>
          <Input
            type="text"
            placeholder="e.g. 00237"
            value={currentValue.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Latitude</Label>
          <Input
            type="number"
            step="any"
            placeholder="e.g. 3.8480"
            value={currentValue.latitude !== undefined ? currentValue.latitude : ''}
            onChange={(e) =>
              handleInputChange(
                'latitude',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Longitude</Label>
          <Input
            type="number"
            step="any"
            placeholder="e.g. 11.5021"
            value={currentValue.longitude !== undefined ? currentValue.longitude : ''}
            onChange={(e) =>
              handleInputChange(
                'longitude',
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Remarks</Label>
          <Input
            type="text"
            placeholder="Location remarks..."
            value={currentValue.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-slate-700">Note</Label>
          <Input
            type="text"
            placeholder="Internal note..."
            value={currentValue.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            className="text-xs font-semibold bg-white"
          />
        </div>
      </div>
    </div>
  )
}

export default LocationPicker