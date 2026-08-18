import { MapPin } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
import {
  useRetrieveParcelsQuery,
  type ParcelListItem,
} from '@/redux/features/parcel/parcel.api';
import React, { useState, useRef, useEffect } from 'react';

interface ParcelPickerProps {
  value?: ParcelListItem[];
  onChange: (parcels: ParcelListItem[]) => void;
  placeholder?: string;
  type?: 'checkbox' | 'radio';
}

export const getParcelLabel = (parcel: ParcelListItem): string =>
  parcel.slug || parcel.parcelCode || (parcel.id != null ? `Parcel ${parcel.id}` : '');

const getParcelSub = (parcel: ParcelListItem): string => {
  const city = parcel.location?.city;
  const state = parcel.location?.state;
  if (city) return state ? `${city}, ${state}` : city;
  if (parcel.parcelCode) return parcel.parcelCode;
  return parcel.id != null ? `Parcel #${parcel.id}` : '';
};

export const ParcelPicker: React.FC<ParcelPickerProps> = ({
  value = [],
  onChange,
  placeholder = 'Select parcels...',
  type = 'checkbox',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: parcelResponse, isFetching, isError } = useRetrieveParcelsQuery(
    {
      page: 1,
      limit: 20,
      search: debouncedSearch,
    },
    {
      skip: !isOpen,
    }
  );

  // Close dropdown ONLY when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (parcel: ParcelListItem) => {
    const exists = value.some((p) => p.id === parcel.id);

    if (type === 'radio') {
      // Single select behavior if radio
      onChange(exists ? [] : [parcel]);
      setIsOpen(false);
    } else {
      // Multi-select behavior: add/remove from array & stay open
      if (exists) {
        onChange(value.filter((p) => p.id !== parcel.id));
      } else {
        onChange([...value, parcel]);
      }
    }
  };

  const handleRemoveBadge = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    onChange(value.filter((p) => p.id !== id));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  // Parcels not yet selected — these are the only ones shown in the dropdown
  const availableParcels =
    parcelResponse?.data?.filter((parcel) => !value.some((v) => v.id === parcel.id)) ?? [];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selector Display Field */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between min-h-10.5 w-full px-3 py-1.5 border rounded-lg shadow-sm bg-white cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500"
      >
        {/* Selected Items / Badges inside Picker Bar */}
        <div className="flex flex-wrap gap-1 items-center max-w-[80%] overflow-hidden">
          {value.length > 0 ? (
            value.map((parcel) => (
              <span
                key={parcel.id}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200"
              >
                <span className="truncate max-w-40">{getParcelLabel(parcel)}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveBadge(e, parcel.id)}
                  className="hover:text-blue-900 font-bold ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-gray-400 hover:text-gray-600 text-sm px-1"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400 text-xs">▼</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
          {/* Search Input inside Dropdown */}
          <div className="p-2 border-b bg-gray-50">
            <input
              type="text"
              autoFocus
              className="w-full px-2 py-1.5 text-sm border rounded outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              placeholder="Search parcels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Parcel List Container */}
          <div className="overflow-y-auto max-h-48">
            {isFetching ? (
              <div className="p-3 text-xs text-center text-gray-500">Loading parcels...</div>
            ) : isError ? (
              <div className="p-3 text-xs text-center text-red-500">Failed to load parcels</div>
            ) : availableParcels.length === 0 ? (
              <div className="p-3 text-xs text-center text-gray-500">
                {value.length > 0 ? 'No more parcels found' : 'No parcels found'}
              </div>
            ) : (
              <ul className="py-1">
                {availableParcels.map((parcel) => (
                  <li
                    key={parcel.id}
                    onClick={() => handleSelect(parcel)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {/* Parcel chip */}
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{getParcelLabel(parcel)}</span>
                      <span className="text-xs text-gray-400 truncate">
                        {getParcelSub(parcel)}
                        {parcel.areaSqm ? ` · ${parcel.areaSqm.toLocaleString()} m²` : ''}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
