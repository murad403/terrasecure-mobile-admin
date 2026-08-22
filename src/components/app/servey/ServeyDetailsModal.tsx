"use client"
import React, { useEffect, useRef } from 'react'
import { X, Loader2, MapPin, User, CheckCircle, FileText, Compass, Calendar, Layers, ShieldCheck } from 'lucide-react'
import { useRetrieveServeyDetailsQuery } from '@/redux/features/servey/servey.api'
import { ISurveyItem } from '@/redux/features/servey/servey.type'
import formatDate from '@/utils/formatDate'
import { cn } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

interface ServeyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
}

const getInitials = (name?: string) => {
  if (!name) return 'SV'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getStatusBadge = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'VALIDATED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'VALIDATING':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'SYNCED':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'DRAFT':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

const ServeyDetailsModal: React.FC<ServeyDetailsModalProps> = ({
  isOpen,
  onClose,
  surveyId,
}) => {
  const { data: detailsRes, isLoading } = useRetrieveServeyDetailsQuery(
    surveyId!,
    { skip: !isOpen || !surveyId }
  )

  const survey: ISurveyItem | undefined = detailsRes?.data

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

  // Initialize interactive Leaflet map for survey points
  useEffect(() => {
    if (!isOpen || !survey?.points || survey.points.length === 0 || !mapContainerRef.current) {
      return
    }

    let isMounted = true

    const initMap = async () => {
      const L = await import('leaflet')
      if (!isMounted || !mapContainerRef.current) return

      // Cleanup existing instance if attached to element
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

      const latLngs: [number, number][] = survey.points!
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => [p.lat, p.lng])

      if (latLngs.length === 0) return

      const initialCenter = latLngs[0]
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(initialCenter, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      if (latLngs.length > 1) {
        const polygon = L.polygon(latLngs, {
          color: '#4A89F3',
          fillColor: '#4A89F3',
          fillOpacity: 0.25,
          weight: 2.5,
        }).addTo(map)

        // Fit bounds with padding
        map.fitBounds(polygon.getBounds(), { padding: [30, 30] })
      } else {
        L.marker(initialCenter).addTo(map)
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
  }, [isOpen, survey?.points])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-140 md:w-160 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-button-color/10 flex items-center justify-center text-button-color font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Survey Details
                </h2>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  #{survey?.id ? String(survey.id).padStart(5, '0') : surveyId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Land parcel survey measurement logs & GIS polygon bounds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-button-color" />
            <p className="text-xs font-semibold text-slate-500">Loading survey details...</p>
          </div>
        ) : !survey ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-2">
            <p className="text-sm font-semibold text-slate-600">No survey details found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {/* Status & Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Status</span>
                <span className={cn('inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border', getStatusBadge(survey.status))}>
                  {survey.status || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Source</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block font-mono">
                  {survey.source || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Area (sqm)</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  {survey.computedAreaSqm != null ? `${survey.computedAreaSqm.toLocaleString()} m²` : 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Reliability Score</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  {survey.reliabilityScore != null ? `${survey.reliabilityScore} / 10` : 'N/A'}
                </span>
              </div>
            </div>

            {/* GIS Map Visualization Section */}
            {survey.points && survey.points.length > 0 && (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-button-color" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      GIS Polygon Bounds Map ({survey.points.length} Points)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Source: {survey.source || 'N/A'}
                  </span>
                </div>

                <div className="relative w-full h-72 bg-slate-100">
                  <div ref={mapContainerRef} className="w-full h-full z-0" />

                  {/* Floating map info tag */}
                  <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-slate-700">
                    <span>Computed Area: </span>
                    <strong className="text-slate-900">
                      {survey.computedAreaSqm != null ? `${survey.computedAreaSqm.toLocaleString()} m²` : 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Information */}
            {survey.registration && (
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <FileText className="w-4 h-4 text-button-color" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Registration Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Registration Slug</span>
                    <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                      {survey.registration.slug || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Status</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {survey.registration.status || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Declared Area</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {survey.registration.areaSqm != null ? `${survey.registration.areaSqm} m²` : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Workflow Step</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      Step {survey.registration.step || 'N/A'}
                    </span>
                  </div>

                  {survey.registration.submittedAt && (
                    <div>
                      <span className="text-slate-400 block font-medium">Submitted At</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {formatDate(survey.registration.submittedAt)}
                      </span>
                    </div>
                  )}

                  {survey.registration.reviewedAt && (
                    <div>
                      <span className="text-slate-400 block font-medium">Reviewed At</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {formatDate(survey.registration.reviewedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {survey.registration.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] block font-medium">Registration Notes</span>
                    <div
                      className="text-xs text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                      dangerouslySetInnerHTML={{ __html: survey.registration.notes }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Surveyor Information */}
            {survey.surveyor && (
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <User className="w-4 h-4 text-button-color" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Surveyor Information
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {survey.surveyor.profilePicture?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={survey.surveyor.profilePicture.url}
                      alt={survey.surveyor.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-button-color/10 text-button-color font-bold text-xs flex items-center justify-center border border-button-color/20">
                      {getInitials(survey.surveyor.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-slate-900">{survey.surveyor.name}</p>
                    <p className="text-slate-500 mt-0.5">
                      {survey.surveyor.phone ? `Phone: ${survey.surveyor.phone}` : `Surveyor ID: #${survey.surveyor.id}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Details */}
            {(survey.validatedBy || survey.validationNotes || survey.validatedAt) && (
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Validation Details
                  </h3>
                </div>

                {survey.validatedBy && (
                  <div className="flex items-center gap-3">
                    {survey.validatedBy.profilePicture?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={survey.validatedBy.profilePicture.url}
                        alt={survey.validatedBy.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200">
                        {getInitials(survey.validatedBy.name)}
                      </div>
                    )}
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">{survey.validatedBy.name}</p>
                      <p className="text-slate-500 text-[11px]">Validated By (Validator ID: #{survey.validatedBy.id})</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {survey.validatedAt && (
                    <div>
                      <span className="text-slate-400 block font-medium">Validated At</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {formatDate(survey.validatedAt)}
                      </span>
                    </div>
                  )}
                  {survey.validationNotes && (
                    <div className="col-span-full">
                      <span className="text-slate-400 block font-medium">Validation Notes</span>
                      <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                        {survey.validationNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GPS Points Table Data */}
            {survey.points && survey.points.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-button-color" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      GPS Points Log ({survey.points.length} Points)
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-100 max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 font-bold text-slate-500 z-10">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">LATITUDE</th>
                        <th className="py-2 px-3">LONGITUDE</th>
                        <th className="py-2 px-3">ALTITUDE</th>
                        <th className="py-2 px-3">ACCURACY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                      {survey.points.map((pt, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold">{pt.lat}</td>
                          <td className="py-2 px-3 font-semibold">{pt.lng}</td>
                          <td className="py-2 px-3">{pt.alt != null ? `${pt.alt} m` : '-'}</td>
                          <td className="py-2 px-3">{pt.accuracy != null ? `±${pt.accuracy} m` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Captured At</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatDate(survey.capturedAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Synced At</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatDate(survey.syncedAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Created At</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatDate(survey.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Updated At</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatDate(survey.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServeyDetailsModal
