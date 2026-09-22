"use client";
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ConflictParcel } from '@/redux/features/conflicts/conflicts.type';
import 'leaflet/dist/leaflet.css';

interface ReviewOnMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: ConflictParcel;
  onBlock: () => void;
  onApproveException: () => void;
}

const ReviewOnMapModal = ({
  isOpen,
  onClose,
  conflict,
  onBlock,
  onApproveException,
}: ReviewOnMapModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const conflictingSlugs = conflict.conflicts
    ?.map((c) => c.conflictingParcel?.slug)
    .filter(Boolean) || [];

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let active = true;
    const initMap = async () => {
      const L = await import('leaflet');

      if (!active || !mapContainerRef.current) return;

      if (leafletMapRef.current || (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id)) {
        return;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const lat = conflict.location?.latitude || 40.7128;
      const lng = conflict.location?.longitude || -74.006;
      const center: [number, number] = [lat, lng];

      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(center, 13);

      if (!active) {
        map.remove();
        return;
      }

      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap contributors',
      }).addTo(map);

      // Draw primary boundary if exists
      if (conflict.boundary && conflict.boundary.coordinates) {
        try {
          const coords = conflict.boundary.coordinates[0].map((c: [number, number]) => [c[1], c[0]]);
          const poly = L.polygon(coords, {
            color: '#15803d',
            fillColor: '#86efac',
            fillOpacity: 0.3,
            weight: 2,
          }).addTo(map);

          poly.bindTooltip(conflict.slug, {
            permanent: true,
            direction: 'center',
            className: 'bg-transparent border-none shadow-none text-emerald-800 font-extrabold text-xs',
          });
        } catch (e) {
          console.error("Leaflet polygon parse error", e);
        }
      }
    };

    initMap();

    return () => {
      active = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen, conflict]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans select-none">
      <div className="bg-white rounded-[24px] w-full max-w-180 shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-extrabold text-slate-900 leading-none">
                Map Review — {conflict.slug}
              </h2>
              <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded leading-none uppercase">
                {conflict.parcelCode}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2">
              Status: {conflict.status} · Conflicting: {conflictingSlugs.join(" · ") || "None"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative mx-6 my-4 h-95 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shrink-0">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2.5 rounded-lg border border-slate-200 shadow-md z-1000 space-y-1.5 text-[10px] font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-emerald-100 border border-emerald-600 rounded" />
              <span>{conflict.slug}</span>
            </div>
            {conflictingSlugs.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-rose-100 border border-rose-600 rounded" />
                <span>{conflictingSlugs.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-1000 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold hover:bg-slate-50 shadow-md cursor-pointer text-sm"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold hover:bg-slate-50 shadow-md cursor-pointer text-sm"
            >
              -
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 shrink-0 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onBlock();
                onClose();
              }}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg text-xs font-bold py-2 px-4 shadow-sm cursor-pointer transition-colors"
            >
              Block Parcel
            </button>
            <button
              onClick={() => {
                onApproveException();
                onClose();
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold py-2 px-4 shadow-sm cursor-pointer transition-colors"
            >
              Approve Exception
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold py-2 px-6 shadow-sm cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReviewOnMapModal;