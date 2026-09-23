"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { useUpdateParcelBoundaryMutation } from '@/redux/features/parcel/parcel.api';
import type { ParcelListItem, GeoJsonPolygon } from '@/redux/features/parcel/parcel.type';
import { toast } from 'sonner';

interface LatLng { lat: number; lng: number }

interface EditPolygonModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels?: ParcelListItem[];
  selectedParcelId?: number | string | null;
  onSaveSuccess?: () => void;
}

const EditPolygonModal = ({
  isOpen,
  onClose,
  parcels = [],
  selectedParcelId: initialSelectedParcelId = null,
  onSaveSuccess
}: EditPolygonModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonRef = useRef<any>(null);
  const coordsRef = useRef<LatLng[]>([]);

  const [updateParcelBoundary, { isLoading: isSaving }] = useUpdateParcelBoundaryMutation();

  const [activeParcelId, setActiveParcelId] = useState<number | string | null>(initialSelectedParcelId);
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [areaDisplay, setAreaDisplay] = useState<string>('0 m²');

  useEffect(() => {
    if (initialSelectedParcelId) {
      setActiveParcelId(initialSelectedParcelId);
    } else if (parcels.length > 0 && !activeParcelId) {
      setActiveParcelId(parcels[0].id);
    }
  }, [initialSelectedParcelId, parcels]);

  // Area calculation helper
  const calculateArea = (latlngs: any[]) => {
    try {
      const L = require('leaflet');
      const areaSqm = L.GeometryUtil.geodesicArea(latlngs);
      if (areaSqm >= 10000) {
        return `${(areaSqm / 10000).toFixed(2)} ha (${Math.round(areaSqm).toLocaleString()} m²)`;
      }
      return `${areaSqm.toLocaleString('en-US', { maximumFractionDigits: 2 })} m²`;
    } catch {
      return '0 m²';
    }
  };

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;
    let isMounted = true;

    const initMap = async () => {
      const L = await import('leaflet');
      if (!isMounted) return;

      if (leafletMapRef.current || (mapRef.current && (mapRef.current as any)._leaflet_id)) {
        return;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!).setView([5.6, 12.3], 9);
      
      if (!isMounted) {
        map.remove();
        return;
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      leafletMapRef.current = map;
    };

    initMap();
    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen]);

  const drawParcel = useCallback((parcel: ParcelListItem) => {
    const map = leafletMapRef.current;
    if (!map) return;
    const L = require('leaflet');

    // Remove existing markers & polygon
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (polygonRef.current) map.removeLayer(polygonRef.current);

    let currentCoords: LatLng[] = [];

    if (parcel.boundary?.coordinates?.[0]?.length) {
      // GeoJSON is [lng, lat] -> convert to { lat, lng }
      const rawRing = parcel.boundary.coordinates[0];
      // remove duplicate closing point if present for editing vertices
      const ringToUse = (rawRing.length > 3 && rawRing[0][0] === rawRing[rawRing.length - 1][0] && rawRing[0][1] === rawRing[rawRing.length - 1][1])
        ? rawRing.slice(0, rawRing.length - 1)
        : rawRing;

      currentCoords = ringToUse.map(([lng, lat]) => ({ lat, lng }));
    } else if (parcel.location?.latitude && parcel.location?.longitude) {
      const lat = parcel.location.latitude;
      const lng = parcel.location.longitude;
      const d = 0.005;
      currentCoords = [
        { lat: lat + d, lng: lng - d },
        { lat: lat + d, lng: lng + d },
        { lat: lat - d, lng: lng + d },
        { lat: lat - d, lng: lng - d },
      ];
    } else {
      currentCoords = [
        { lat: 5.85, lng: 12.10 },
        { lat: 5.95, lng: 12.30 },
        { lat: 5.85, lng: 12.55 },
        { lat: 5.65, lng: 12.60 },
      ];
    }

    coordsRef.current = currentCoords;
    setCoords(currentCoords);
    setAreaDisplay(calculateArea(currentCoords.map(c => L.latLng(c.lat, c.lng))));

    const poly = L.polygon(currentCoords.map(c => [c.lat, c.lng]), {
      color: '#f59e0b',
      fillColor: '#fde68a',
      fillOpacity: 0.45,
      weight: 2
    }).addTo(map);

    polygonRef.current = poly;
    map.fitBounds(poly.getBounds(), { padding: [40, 40] });

    // Custom Draggable Icon Handle for Vertices
    const handleIcon = L.divIcon({
      className: 'custom-vertex-marker',
      html: `<div style="background-color: #f59e0b; width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); cursor: grab;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    currentCoords.forEach((c, index) => {
      const marker = L.marker([c.lat, c.lng], {
        draggable: true,
        icon: handleIcon
      }).addTo(map);

      marker.on('drag', (e: any) => {
        const newPos = e.target.getLatLng();
        coordsRef.current[index] = { lat: newPos.lat, lng: newPos.lng };
        poly.setLatLngs(coordsRef.current.map(p => [p.lat, p.lng]));
        setCoords([...coordsRef.current]);
        try {
          setAreaDisplay(calculateArea(coordsRef.current.map(p => L.latLng(p.lat, p.lng))));
        } catch {}
      });

      markersRef.current.push(marker);
    });
  }, []);

  // When activeParcelId or open changes, draw active parcel
  useEffect(() => {
    if (isOpen && activeParcelId && parcels.length) {
      const p = parcels.find(item => String(item.id) === String(activeParcelId) || item.slug === String(activeParcelId));
      if (p) {
        setTimeout(() => drawParcel(p), 150);
      }
    }
  }, [isOpen, activeParcelId, parcels, drawParcel]);

  const handleSaveBoundary = async () => {
    if (!activeParcelId || coordsRef.current.length < 3) {
      toast.error('Please select a parcel and ensure boundary has at least 3 vertices.');
      return;
    }

    // Build closed GeoJSON Polygon ring: [ [lng, lat], ..., [lng0, lat0] ]
    const rawRing: [number, number][] = coordsRef.current.map(c => [
      Number(c.lng.toFixed(6)),
      Number(c.lat.toFixed(6))
    ]);

    const first = rawRing[0];
    const last = rawRing[rawRing.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      rawRing.push([first[0], first[1]]);
    }

    if (rawRing.length < 4) {
      toast.error('A closed linear ring needs at least 4 coordinate positions.');
      return;
    }

    const payload: GeoJsonPolygon = {
      type: 'Polygon',
      coordinates: [rawRing]
    };

    try {
      const res = await updateParcelBoundary({
        id: activeParcelId,
        data: { boundary: payload }
      }).unwrap();

      if (res.success) {
        toast.success(res.message || 'Parcel boundary updated successfully!');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to update boundary.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error saving parcel boundary.');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 select-none">
      <div className="bg-white rounded-[20px] w-full max-w-160 shadow-2xl flex flex-col overflow-hidden border border-slate-200">

        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Edit Parcel Boundary</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Select a parcel then drag orange handles to adjust boundary vertices</p>
          
          {/* Parcel Selection List */}
          <div className="mt-3 flex items-center gap-2 flex-wrap max-h-24 overflow-y-auto py-1">
            <span className="text-xs font-semibold text-slate-600">Select Parcel:</span>
            {parcels.map(p => {
              const isSelected = String(activeParcelId) === String(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setActiveParcelId(p.id); drawParcel(p); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isSelected ? 'bg-button-color text-white border-transparent shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.parcelCode || p.slug || `#${p.id}`}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative mx-6 my-4 h-87.5 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold z-1000 border border-slate-200 text-slate-800">
            Area: {areaDisplay} ({coords.length} vertices)
          </div>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="px-6 py-4 flex justify-between border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              if (activeParcelId) {
                const p = parcels.find(item => String(item.id) === String(activeParcelId) || item.slug === String(activeParcelId));
                if (p) drawParcel(p);
              }
            }}
            className="px-4 py-2.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer"
          >
            Reset Vertices
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <Button
              onClick={handleSaveBoundary}
              disabled={!activeParcelId || isSaving}
              className="w-auto flex items-center gap-1.5"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Boundary
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditPolygonModal;