import { UserRole } from '@/enum';
import useDebounce from '@/hooks/useDebounce';
import type { User } from '@/interfaces/user.interface';
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api';
import React, { useState, useRef, useEffect } from 'react';

interface UserPickerProps {
  value?: User[];
  onChange: (users: User[]) => void;
  placeholder?: string;
  type?: 'checkbox' | 'radio';
  role?: UserRole;
}

export const UserPicker: React.FC<UserPickerProps> = ({
  value = [],
  onChange,
  placeholder = 'Select users...',
  type = 'checkbox',
  role
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: userResponse, isFetching, isError } = useRetrieveUsersQuery(
    {
      page: 1,
      limit: 20,
      search: debouncedSearch,
      role
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

  const handleSelect = (user: User) => {
    const exists = value.some((u) => u.id === user.id);

    if (type === 'radio') {
      // Single select behavior if radio
      onChange(exists ? [] : [user]);
      setIsOpen(false);
    } else {
      // Multi-select behavior: add/remove from array & stay open
      if (exists) {
        onChange(value.filter((u) => u.id !== user.id));
      } else {
        onChange([...value, user]);
      }
    }
  };

  const handleRemoveBadge = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    onChange(value.filter((u) => u.id !== id));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  // Users not yet selected — these are the only ones shown in the dropdown
  const availableUsers =
    userResponse?.data?.filter((user) => !value.some((v) => v.id === user.id)) ?? [];

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
            value.map((user) => (
              <span
                key={user.id}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200"
              >
                <span className="truncate max-w-20">{user.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveBadge(e, user.id)}
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden flex flex-col">
          {/* Search Input inside Dropdown */}
          <div className="p-2 border-b bg-gray-50">
            <input
              type="text"
              autoFocus
              className="w-full px-2 py-1.5 text-sm border rounded outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User List Container */}
          <div className="overflow-y-auto max-h-48">
            {isFetching ? (
              <div className="p-3 text-xs text-center text-gray-500">Loading users...</div>
            ) : isError ? (
              <div className="p-3 text-xs text-center text-red-500">Failed to load users</div>
            ) : availableUsers.length === 0 ? (
              <div className="p-3 text-xs text-center text-gray-500">
                {value.length > 0 ? 'No more users found' : 'No users found'}
              </div>
            ) : (
              <ul className="py-1">
                {availableUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {/* Avatar */}
                    {user.profilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profilePicture.url}
                        alt={`Profile picture of ${user.name}`}
                        className="w-7 h-7 rounded-full shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                        {user.name?.charAt(0) ?? '@'}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{user.name}</span>
                      <span className="text-xs text-gray-400 truncate">{user.email}</span>
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