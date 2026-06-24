"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import 'leaflet/dist/leaflet.css';

interface LatLng { lat: number; lng: number }
interface Parcel { id: string; coords: LatLng[] }

interface EditPolygonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (parcelId: string, coords: LatLng[]) => void;
}

const MOCK_PARCELS: Parcel[] = [
  { id: 'CM-2847', coords: [{ lat: 5.85, lng: 12.10 }, { lat: 5.95, lng: 12.30 }, { lat: 5.85, lng: 12.55 }, { lat: 5.65, lng: 12.60 }, { lat: 5.50, lng: 12.45 }, { lat: 5.52, lng: 12.20 }, { lat: 5.65, lng: 12.05 }] },
  { id: 'CM-2848', coords: [{ lat: 5.20, lng: 12.80 }, { lat: 5.30, lng: 13.00 }, { lat: 5.15, lng: 13.10 }, { lat: 5.00, lng: 12.90 }] },
  { id: 'CM-2849', coords: [{ lat: 6.10, lng: 11.80 }, { lat: 6.20, lng: 12.10 }, { lat: 6.05, lng: 12.30 }, { lat: 5.90, lng: 12.10 }, { lat: 5.95, lng: 11.85 }] },
];

const EditPolygonModal = ({ isOpen, onClose, onSave }: EditPolygonModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonRef = useRef<any>(null);

  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [area, setArea] = useState<number>(0);

  // এরিয়া ক্যালকুলেশন
  const calculateArea = (latlngs: any[]) => {
    const L = require('leaflet');
    const areaMeters = L.GeometryUtil.geodesicArea(latlngs);
    return (areaMeters / 1000000).toFixed(2);
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

      const map = L.map(mapRef.current!).setView([5.65, 12.35], 8);
      
      if (!isMounted) {
        map.remove();
        return;
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
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

  const drawParcel = useCallback((parcel: Parcel) => {
    const map = leafletMapRef.current;
    if (!map) return;
    const L = require('leaflet');

    markersRef.current.forEach(m => map.removeLayer(m));
    if (polygonRef.current) map.removeLayer(polygonRef.current);

    const currentCoords = [...parcel.coords];
    setCoords(currentCoords);
    setArea(Number(calculateArea(currentCoords.map(c => L.latLng(c.lat, c.lng)))));

    const poly = L.polygon(currentCoords.map(c => [c.lat, c.lng]), {
      color: '#f59e0b', fillColor: '#fde68a', fillOpacity: 0.5, weight: 2
    }).addTo(map);
    polygonRef.current = poly;
    map.fitBounds(poly.getBounds(), { padding: [40, 40] });

    currentCoords.forEach((c, index) => {
      const marker = L.circleMarker([c.lat, c.lng], { radius: 8, color: '#fff', fillColor: '#f59e0b', fillOpacity: 1, weight: 2 }).addTo(map);

      marker.on('mousedown', () => {
        map.dragging.disable();
        const onMouseMove = (e: any) => {
          const newCoords = [...currentCoords];
          newCoords[index] = { lat: e.latlng.lat, lng: e.latlng.lng };
          poly.setLatLngs(newCoords.map(p => [p.lat, p.lng]));
          setCoords(newCoords);
          setArea(Number(calculateArea(poly.getLatLngs()[0])));
        };
        map.on('mousemove', onMouseMove);
        map.on('mouseup', () => {
          map.dragging.enable();
          map.off('mousemove', onMouseMove);
        }, { once: true });
      });
      markersRef.current.push(marker);
    });
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">

        <div className="px-6 pt-5 pb-4 border-b">
          <h2 className="text-[18px] font-bold text-slate-900">Edit Polygon</h2>
          <p className="text-sm text-slate-500 mt-1">Select parcel then drag vertices to adjust the boundary</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-semibold">Parcel:</span>
            {MOCK_PARCELS.map(p => (
              <button key={p.id} onClick={() => { setSelectedParcelId(p.id); drawParcel(p); }}
                className={`px-3 py-1 rounded text-xs font-bold border ${selectedParcelId === p.id ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {p.id}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-6 my-4 h-[350px] bg-green-50 rounded-lg border border-green-200 overflow-hidden">
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded shadow text-xs font-bold z-1000">
            Area: {area} sq km
          </div>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="px-6 py-4 flex justify-between border-t">
          <button onClick={() => selectedParcelId && drawParcel(MOCK_PARCELS.find(p => p.id === selectedParcelId)!)} className="px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 rounded-lg">Reset</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button onClick={() => { onSave(selectedParcelId!, coords); onClose(); }} disabled={!selectedParcelId}
              className="px-6 py-2 text-sm font-bold bg-orange-500 text-white rounded-lg disabled:bg-slate-300">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditPolygonModal;