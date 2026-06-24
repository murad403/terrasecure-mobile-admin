"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface LatLng { lat: number; lng: number }

interface DrawPolygonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (coords: LatLng[]) => void
}

/* ── Cameroon-centered default view ── */
const DEFAULT_CENTER: [number, number] = [5.5, 12.35]
const DEFAULT_ZOOM = 8

const DrawPolygonModal = ({ isOpen, onClose, onSave }: DrawPolygonModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<import('leaflet').CircleMarker[]>([])
  const polylinesRef = useRef<import('leaflet').Polyline[]>([])
  const closingLineRef = useRef<import('leaflet').Polyline | null>(null)
  const previewLineRef = useRef<import('leaflet').Polyline | null>(null)

  const [mounted, setMounted] = useState(false)
  const [points, setPoints] = useState<LatLng[]>([])
  const [closed, setClosed] = useState(false)
  const [polygonLayer, setPolygonLayer] = useState<import('leaflet').Polygon | null>(null)

  /* ── Draw state in refs so Leaflet event handlers are always fresh ── */
  const pointsRef = useRef<LatLng[]>([])
  const closedRef = useRef(false)
  const LRef = useRef<typeof import('leaflet').default | null>(null)

  const syncPoints = useCallback((pts: LatLng[]) => {
    pointsRef.current = pts
    setPoints([...pts])
  }, [])

  useEffect(() => { setMounted(true) }, [])

  /* ── Initialise map on open (depends on both isOpen AND mounted) ── */
  useEffect(() => {
    // Wait for both the modal to be open AND the component to be mounted
    // so that the portal <div> actually exists in the DOM before Leaflet touches it
    if (!isOpen || !mounted) return

    let frameId: number

    const tryInit = () => {
      // If mapRef is still null (portal not yet flushed), try next frame
      if (!mapRef.current) {
        frameId = requestAnimationFrame(tryInit)
        return
      }
      // Prevent double-init
      if (leafletMapRef.current) return
      init()
    }

    const init = async () => {
      const L = (await import('leaflet')).default
      LRef.current = L

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        // Disable left-click context/drag for a cleaner drawing UX
        doubleClickZoom: false,
      })
      leafletMapRef.current = map

      /* ── Custom green grid tile layer (matches mockup screenshot) ── */
      const GridTile = L.GridLayer.extend({
        createTile(coords: { x: number; y: number; z: number }) {
          const tile = document.createElement('canvas') as HTMLCanvasElement
          const size = 256
          tile.width = size
          tile.height = size
          const ctx = tile.getContext('2d')!

          // Background: light green
          ctx.fillStyle = '#d9eed9'
          ctx.fillRect(0, 0, size, size)

          // Grid lines: slightly darker green
          ctx.strokeStyle = '#b8dfc0'
          ctx.lineWidth = 1
          const step = Math.max(16, 32 - coords.z)
          for (let i = 0; i <= size; i += step) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
          }
          return tile
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (GridTile as any)({ attribution: '' }).addTo(map)

      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)

      /* ── RIGHT-CLICK to place vertex ── */
      map.on('contextmenu', (e: import('leaflet').LeafletMouseEvent) => {
        // Prevent browser context menu
        e.originalEvent?.preventDefault()
        if (closedRef.current) return

        const { lat, lng } = e.latlng
        const newPts = [...pointsRef.current, { lat, lng }]

        // Add dark green filled circle marker
        const marker = L.circleMarker([lat, lng], {
          radius: 7,
          color: '#1a5e1a',
          weight: 2,
          fillColor: '#2e7d32',
          fillOpacity: 1,
        }).addTo(map)
        markersRef.current.push(marker)

        // Draw dashed segment from previous point to new
        if (newPts.length > 1) {
          const prev = newPts[newPts.length - 2]
          const line = L.polyline([[prev.lat, prev.lng], [lat, lng]], {
            color: '#2e7d32',
            weight: 2,
            dashArray: '10 7',
          }).addTo(map)
          polylinesRef.current.push(line)
        }

        // Update the "closing" ghost line back to first point
        if (closingLineRef.current) {
          map.removeLayer(closingLineRef.current)
          closingLineRef.current = null
        }
        if (newPts.length >= 2) {
          closingLineRef.current = L.polyline(
            [[lat, lng], [newPts[0].lat, newPts[0].lng]],
            { color: '#2e7d32', weight: 2, dashArray: '10 7', opacity: 0.35 }
          ).addTo(map)
        }

        // Remove live preview line (it will be re-drawn on mousemove)
        if (previewLineRef.current) {
          map.removeLayer(previewLineRef.current)
          previewLineRef.current = null
        }

        syncPoints(newPts)
      })

      /* ── MOUSEMOVE: live preview line from last placed point to cursor ── */
      map.on('mousemove', (e: import('leaflet').LeafletMouseEvent) => {
        if (closedRef.current || pointsRef.current.length === 0) return
        const last = pointsRef.current[pointsRef.current.length - 1]
        if (previewLineRef.current) {
          map.removeLayer(previewLineRef.current)
        }
        previewLineRef.current = L.polyline(
          [[last.lat, last.lng], [e.latlng.lat, e.latlng.lng]],
          { color: '#2e7d32', weight: 1.5, dashArray: '6 5', opacity: 0.5 }
        ).addTo(map)
      })
    }

    frameId = requestAnimationFrame(tryInit)

    return () => {
      cancelAnimationFrame(frameId)
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mounted])

  /* ── Close polygon ── */
  const handleClosePolygon = async () => {
    if (pointsRef.current.length < 3 || closedRef.current) return
    const L = LRef.current!
    const map = leafletMapRef.current
    if (!map) return

    // Remove helper lines
    polylinesRef.current.forEach((l) => map.removeLayer(l))
    polylinesRef.current = []
    if (closingLineRef.current) { map.removeLayer(closingLineRef.current); closingLineRef.current = null }
    if (previewLineRef.current) { map.removeLayer(previewLineRef.current); previewLineRef.current = null }

    const latlngs = pointsRef.current.map((p) => [p.lat, p.lng] as [number, number])
    const poly = L.polygon(latlngs, {
      color: '#2e7d32',
      weight: 2,
      dashArray: '10 7',
      fillColor: '#4caf50',
      fillOpacity: 0.12,
    }).addTo(map)
    setPolygonLayer(poly)
    closedRef.current = true
    setClosed(true)
  }

  /* ── Reset ── */
  const handleReset = () => {
    const map = leafletMapRef.current
    if (!map) return
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []
    polylinesRef.current.forEach((l) => map.removeLayer(l))
    polylinesRef.current = []
    if (closingLineRef.current) { map.removeLayer(closingLineRef.current); closingLineRef.current = null }
    if (previewLineRef.current) { map.removeLayer(previewLineRef.current); previewLineRef.current = null }
    if (polygonLayer) { map.removeLayer(polygonLayer); setPolygonLayer(null) }
    closedRef.current = false
    setClosed(false)
    syncPoints([])
  }

  /* ── Save ── */
  const handleSave = () => {
    onSave(pointsRef.current)
    handleReset()
    onClose()
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  if (!isOpen || !mounted) return null

  const statusText = (() => {
    if (closed) return '✓ Polygon closed — ready to save'
    if (points.length === 0) return 'Right-click on the map to start placing vertices'
    if (points.length === 1) return '1 point placed — right-click to add more'
    if (points.length === 2) return '2 point(s) placed'
    return `${points.length} point(s) placed — close when ready`
  })()

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[720px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Draw Polygon</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on the map to place vertices
              {points.length >= 3 && !closed
                ? <span className="text-blue-500 font-semibold"> · 3+ points needed to close</span>
                : null}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map */}
        <div className="relative mx-4 rounded-xl overflow-hidden flex-1 min-h-0" style={{ height: '440px' }}>
          {/* Status badge */}
          <div className="absolute top-3 left-3 z-9999 bg-white/95 shadow-md rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 pointer-events-none">
            {statusText}
          </div>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleClosePolygon}
              disabled={points.length < 3 || closed}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                points.length >= 3 && !closed
                  ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Close Polygon
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!closed}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                closed
                  ? 'bg-slate-800 text-white hover:bg-slate-900 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Save Polygon
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DrawPolygonModal