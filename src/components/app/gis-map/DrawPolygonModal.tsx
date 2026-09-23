"use client";
import { useState, useEffect, useRef } from 'react';
import { X,Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { useUpdateParcelBoundaryMutation } from '@/redux/features/parcel/parcel.api';
import type { ParcelListItem, GeoJsonPolygon } from '@/redux/features/parcel/parcel.type';
import { toast } from 'sonner';

interface LatLng { lat: number; lng: number }

interface DrawPolygonModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels?: ParcelListItem[];
  selectedParcelId?: number | string | null;
  onSaveSuccess?: () => void;
}

const DrawPolygonModal = ({
  isOpen,
  onClose,
  parcels = [],
  selectedParcelId: initialSelectedParcelId = null,
  onSaveSuccess
}: DrawPolygonModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [points, setPoints] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);
  const [targetParcelId, setTargetParcelId] = useState<number | string | null>(initialSelectedParcelId);

  const [updateParcelBoundary, { isLoading: isSaving }] = useUpdateParcelBoundaryMutation();

  useEffect(() => {
    if (initialSelectedParcelId) {
      setTargetParcelId(initialSelectedParcelId);
    } else if (parcels.length > 0 && !targetParcelId) {
      setTargetParcelId(parcels[0].id);
    }
  }, [initialSelectedParcelId, parcels]);

  const closedRef = useRef(closed);
  useEffect(() => {
    closedRef.current = closed;
  }, [closed]);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isMounted = true;
    const initMap = async () => {
      const L = await import('leaflet');
      if (!isMounted) return;

      if (leafletMapRef.current || (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id)) {
        return;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!).setView([5.6, 12.3], 9);
      
      if (!isMounted) {
        map.remove();
        return;
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      leafletMapRef.current = map;

      map.on('click', (e: any) => {
        if (closedRef.current) return;
        const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPoints(prev => [...prev, newPoint]);
        L.circleMarker([newPoint.lat, newPoint.lng], { radius: 5, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.8 }).addTo(map);
      });
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

  useEffect(() => {
    if (leafletMapRef.current && points.length > 1) {
      const L = require('leaflet');
      L.polyline(points.map(p => [p.lat, p.lng]), { color: '#16a34a', weight: 2 }).addTo(leafletMapRef.current);
    }
  }, [points]);

  const handleClosePolygon = () => {
    if (points.length < 3) return;
    const L = require('leaflet');
    L.polygon(points.map(p => [p.lat, p.lng]), { color: '#16a34a', fillColor: '#86efac', fillOpacity: 0.4, weight: 2 }).addTo(leafletMapRef.current);
    setClosed(true);
  };

  const handleReset = () => {
    setPoints([]);
    setClosed(false);
    if (leafletMapRef.current) {
      leafletMapRef.current.eachLayer((layer: any) => {
        if (
          layer instanceof require('leaflet').Marker ||
          layer instanceof require('leaflet').Polyline ||
          layer instanceof require('leaflet').Polygon ||
          layer instanceof require('leaflet').CircleMarker
        ) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
    }
  };

  const handleSavePolygon = async () => {
    if (!targetParcelId) {
      toast.error('Please select a parcel to assign this polygon boundary.');
      return;
    }
    if (points.length < 3) {
      toast.error('Draw at least 3 vertices and close the polygon.');
      return;
    }

    // Closed GeoJSON ring: [[[lng, lat], [lng, lat], ..., [lng0, lat0]]]
    const rawRing: [number, number][] = points.map(p => [p.lng, p.lat]);
    const first = rawRing[0];
    const last = rawRing[rawRing.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      rawRing.push([first[0], first[1]]);
    }

    const payload: GeoJsonPolygon = {
      type: 'Polygon',
      coordinates: [rawRing]
    };

    try {
      const res = await updateParcelBoundary({
        id: targetParcelId,
        data: { boundary: payload }
      }).unwrap();

      if (res.success) {
        toast.success(res.message || 'Parcel boundary drawn and saved successfully!');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
        handleReset();
      } else {
        toast.error(res.message || 'Failed to save boundary.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error saving drawn boundary.');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-160 shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Draw Polygon Boundary
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Click on the map to place vertices (3+ needed to close ring)</p>
          
          {/* Target Parcel Selection */}
          <div className="mt-3 flex items-center gap-2 flex-wrap max-h-20 overflow-y-auto py-1">
            <span className="text-xs font-semibold text-slate-600">Assign To Parcel:</span>
            {parcels.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTargetParcelId(p.id)}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  targetParcelId === p.id ? 'bg-button-color text-white border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.parcelCode || p.slug || `#${p.id}`}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-6 my-4 h-87.5 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 z-1000">
            {points.length} point(s) placed — {closed ? "Polygon closed" : "click points to draw"}
          </div>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer">
              Reset
            </button>
            <button onClick={handleClosePolygon} disabled={points.length < 3 || closed} className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 cursor-pointer">
              Close Ring
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
              Cancel
            </button>
            <Button
              onClick={handleSavePolygon}
              disabled={!closed || !targetParcelId || isSaving}
              className="w-auto flex items-center gap-1.5"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Polygon
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DrawPolygonModal;