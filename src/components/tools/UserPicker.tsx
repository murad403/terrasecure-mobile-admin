import useDebounce from '@/hooks/useDebounce';
import type { User } from '@/interfaces/user.interface';
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api';
import React, { useState, useRef, useEffect } from 'react';

interface UserPickerProps {
  value?: User | null;
  onChange: (user: User | null) => void;
  placeholder?: string;
}

export const UserPicker: React.FC<UserPickerProps> = ({
  value = null,
  onChange,
  placeholder = 'Search users...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: userResponse, isFetching, isError } = useRetrieveUsersQuery({
    page: 1,
    limit: 20,
    search: debouncedSearch,
  }, {
    skip: !isOpen,
  });

  //? Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: User) => {
    onChange(user);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative w-72">
      {/* Input / Display Field */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full px-3 py-2 border rounded-lg shadow-sm bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      >
        {value ? (
          <div className="flex items-center gap-2 overflow-hidden">
            {value.profilePicture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.profilePicture.url} alt={`Profile picture of ${value.name}`} className="w-6 h-6 rounded-full" />
            )}
            <span className="text-sm text-gray-800 truncate">{value.name}</span>
          </div>
        ) : (
          <input
            type="text"
            className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
            placeholder={placeholder}
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search input inside dropdown when a value is already selected */}
          {value && (
            <div className="p-2 border-b">
              <input
                type="text"
                autoFocus
                className="w-full px-2 py-1 text-sm border rounded outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search to change..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* Dynamic Content */}
          {isFetching ? (
            <div className="p-3 text-xs text-center text-gray-500">Loading users...</div>
          ) : isError ? (
            <div className="p-3 text-xs text-center text-red-500">Failed to load users</div>
          ) : userResponse?.data?.length === 0 ? (
            <div className="p-3 text-xs text-center text-gray-500">No users found</div>
          ) : (
            <ul className="py-1">
              {userResponse?.data?.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {user.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.profilePicture.url} alt={`Profile picture of ${user.name}`} className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                      {user.name?.charAt(0) ?? '@'}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate">{user.name}</span>
                    <span className="text-xs text-gray-400 truncate">{user.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};