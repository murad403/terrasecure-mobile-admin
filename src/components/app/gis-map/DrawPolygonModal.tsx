"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Hexagon, Save } from 'lucide-react';
import { createPortal } from 'react-dom';
import 'leaflet/dist/leaflet.css';

interface LatLng { lat: number; lng: number }

interface DrawPolygonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coords: LatLng[]) => void;
}

const DrawPolygonModal = ({ isOpen, onClose, onSave }: DrawPolygonModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [points, setPoints] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let map: any;
    const initMap = async () => {
      const L = await import('leaflet');

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      map = L.map(mapContainerRef.current!).setView([5.6, 12.3], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      leafletMapRef.current = map;

      map.on('click', (e: any) => {
        if (closed) return;
        const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPoints(prev => [...prev, newPoint]);
        L.circleMarker([newPoint.lat, newPoint.lng], { radius: 5, color: 'green' }).addTo(map);
      });
    };

    initMap();
    return () => { if (map) map.remove(); };
  }, [isOpen, closed]);

  // পলিলাইন ড্রয়িং লজিক
  useEffect(() => {
    if (leafletMapRef.current && points.length > 1) {
      const L = require('leaflet');
      L.polyline(points.map(p => [p.lat, p.lng]), { color: 'green' }).addTo(leafletMapRef.current);
    }
  }, [points]);

  const handleClosePolygon = () => {
    if (points.length < 3) return;
    const L = require('leaflet');
    L.polygon(points.map(p => [p.lat, p.lng]), { color: 'green', fillColor: 'green', fillOpacity: 0.3 }).addTo(leafletMapRef.current);
    setClosed(true);
  };

  const handleReset = () => {
    setPoints([]);
    setClosed(false);
    if (leafletMapRef.current) {
      leafletMapRef.current.eachLayer((layer: any) => {
        if (layer instanceof require('leaflet').Marker || layer instanceof require('leaflet').Polyline || layer instanceof require('leaflet').Polygon || layer instanceof require('leaflet').CircleMarker) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
    }
  };

  const handleSave = () => {
    onSave(points);
    onClose();
    handleReset();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 pt-5 pb-4">
          <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border-2 border-green-700 bg-white" />
            Draw Polygon
          </h2>
          <p className="text-sm text-slate-500 mt-1">Click on the map to place vertices · 3+ points needed to close</p>
        </div>

        <div className="relative mx-6 mb-4 h-[350px] bg-green-50 rounded-lg border border-green-100 overflow-hidden">
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 shadow-sm border border-slate-200">
            {points.length} point(s) placed — {closed ? "Polygon closed" : "close when ready"}
          </div>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100">Reset</button>
            <button onClick={handleClosePolygon} disabled={points.length < 3 || closed} className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50">Close Polygon</button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={!closed} className={`px-6 py-2 text-sm font-semibold rounded-lg ${closed ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>Save Polygon</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DrawPolygonModal;