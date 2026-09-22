"use client";
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin } from 'lucide-react';
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

      const defaultLat = conflict.location?.latitude || 6.9271;
      const defaultLng = conflict.location?.longitude || 79.8612;
      const center: [number, number] = [defaultLat, defaultLng];

      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(center, 14);

      if (!active) {
        map.remove();
        return;
      }

      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenTopoMap contributors',
      }).addTo(map);

      const allLatLngs: [number, number][] = [];

      // 1. Draw Primary Parcel Boundary
      if (conflict.boundary && conflict.boundary.coordinates) {
        try {
          const rawCoords = conflict.boundary.coordinates[0];
          const latLngs: [number, number][] = rawCoords.map((c: [number, number]) => [c[1], c[0]]);
          latLngs.forEach((pt) => allLatLngs.push(pt));

          const poly = L.polygon(latLngs, {
            color: '#15803d',
            fillColor: '#86efac',
            fillOpacity: 0.45,
            weight: 2.5,
          }).addTo(map);

          poly.bindTooltip(`${conflict.slug} (${conflict.parcelCode})`, {
            permanent: true,
            direction: 'center',
            className: 'bg-white/90 border border-emerald-300 text-emerald-900 font-extrabold text-xs px-2 py-1 rounded shadow-sm',
          });
        } catch (e) {
          console.error("Error drawing primary parcel boundary", e);
        }
      }

      // 2. Draw Conflicting Parcels Boundaries
      if (conflict.conflicts && conflict.conflicts.length > 0) {
        conflict.conflicts.forEach((cItem) => {
          const conflicting = cItem.conflictingParcel;
          if (conflicting && conflicting.boundary && conflicting.boundary.coordinates) {
            try {
              const rawCoords = conflicting.boundary.coordinates[0];
              const latLngs: [number, number][] = rawCoords.map((c: [number, number]) => [c[1], c[0]]);
              latLngs.forEach((pt) => allLatLngs.push(pt));

              const poly = L.polygon(latLngs, {
                color: '#b91c1c',
                fillColor: '#fca5a5',
                fillOpacity: 0.45,
                weight: 2.5,
                dashArray: '5, 5',
              }).addTo(map);

              poly.bindTooltip(`${conflicting.slug} (${conflicting.parcelCode})`, {
                permanent: true,
                direction: 'center',
                className: 'bg-white/90 border border-rose-300 text-rose-900 font-extrabold text-xs px-2 py-1 rounded shadow-sm',
              });
            } catch (e) {
              console.error("Error drawing conflicting parcel boundary", e);
            }
          }
        });
      }

      // 3. Auto-fit Map Viewport to cover all parcel geometries
      if (allLatLngs.length > 0) {
        const bounds = L.latLngBounds(allLatLngs);
        map.fitBounds(bounds, { padding: [40, 40] });
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
      <div className="bg-white rounded-[24px] w-full max-w-200 shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 leading-none">
                Map Review — {conflict.slug}
              </h2>
              <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded leading-none uppercase">
                {conflict.parcelCode}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2">
              Status: <span className="font-bold text-slate-700">{conflict.status}</span> · Conflicting Parcel(s):{" "}
              <span className="font-bold text-rose-700">{conflictingSlugs.join(", ") || "None"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative mx-6 my-4 h-100 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shrink-0">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-lg z-1000 space-y-1.5 text-xs font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-emerald-100 border border-emerald-600 rounded" />
              <span>Primary: {conflict.slug}</span>
            </div>
            {conflictingSlugs.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-rose-100 border border-rose-600 border-dashed rounded" />
                <span>Conflicting: {conflictingSlugs.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-1000 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold hover:bg-slate-50 shadow-md cursor-pointer text-base"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold hover:bg-slate-50 shadow-md cursor-pointer text-base"
            >
              -
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 shrink-0 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onBlock();
                onClose();
              }}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-bold py-2 px-4 shadow-sm cursor-pointer transition-colors"
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
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold py-2 px-6 shadow-sm cursor-pointer transition-colors"
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