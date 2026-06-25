"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import NotificationCard from './NotificationCard'
import { Check, Trash2, BellOff } from 'lucide-react'

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'Registrations' | 'Investigations' | 'Consultations' | 'Conflicts' | 'Surveys' | 'Suspicious';
  isUnread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Conflict Detected',
    description: 'Boundary overlap detected between Parcel CM-2847 and CM-2848 in Yaoundé, Bastos district.',
    time: '2 min ago',
    category: 'Conflicts',
    isUnread: true,
  },
  {
    id: 'n2',
    title: 'New Registration Submitted',
    description: 'Registration REG-1203 submitted by Pierre Mballa for parcel in Yaoundé, Bastos.',
    time: '15 min ago',
    category: 'Registrations',
    isUnread: true,
  },
  {
    id: 'n3',
    title: 'QField Submission Received',
    description: 'Surveyor Paul Biya Jr submitted GPS data for REG-1202 — 24 points recorded.',
    time: '1h ago',
    category: 'Surveys',
    isUnread: true,
  },
  {
    id: 'n4',
    title: 'Investigation Opened',
    description: 'New investigation INV-047 opened for parcel CM-2848 — Boundary Overlap.',
    time: '2h ago',
    category: 'Investigations',
    isUnread: false,
  },
  {
    id: 'n5',
    title: 'Consultation Request',
    description: 'Amina Fouda requested consultation for parcel CM-2848 in Douala, Bonanjo.',
    time: '3h ago',
    category: 'Consultations',
    isUnread: false,
  },
  {
    id: 'n6',
    title: 'Suspicious Activity Detected',
    description: 'Multiple login attempts from IP 197.155.99.142 for user account j.mballa@client.cm',
    time: '5h ago',
    category: 'Suspicious',
    isUnread: true,
  },
  {
    id: 'n7',
    title: 'Registration Approved',
    description: 'Registration REG-1201 for Grace Tanda has been approved and parcel published.',
    time: 'Yesterday',
    category: 'Registrations',
    isUnread: false,
  },
]

type FilterType = 'All' | 'Registrations' | 'Investigations' | 'Consultations' | 'Conflicts' | 'Surveys' | 'Suspicious';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')

  // Categories list matching filter pills
  const filters: FilterType[] = [
    'All',
    'Registrations',
    'Investigations',
    'Consultations',
    'Conflicts',
    'Surveys',
    'Suspicious',
  ]

  // Handlers
  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })))
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
    }
  }

  // Derived states
  const filteredNotifications = notifications.filter(
    (n) => activeFilter === 'All' || n.category === activeFilter
  )

  const unreadCount = notifications.filter((n) => n.isUnread).length

  return (
    <DashboardChildrenLayout
      title="Notification Center"
      subtitle="All platform alerts and notifications"
    >
      <div className="space-y-6">
        {/* Filter Pills and Action Buttons Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-50 pb-4">
          {/* Filters (Left) */}
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => {
              const count = filter === 'All' 
                ? notifications.length 
                : notifications.filter((n) => n.category === filter).length;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    activeFilter === filter
                      ? 'bg-[#1b4332] text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
                  }`}
                >
                  {filter} {count > 0 && <span className="opacity-70">({count})</span>}
                </button>
              )
            })}
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center space-x-2 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Check size={14} strokeWidth={3} />
                Mark all read ({unreadCount})
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-100/50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-gray-400">
              <BellOff size={36} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">No notifications found</h3>
              <p className="text-[11px] text-gray-400 font-light mt-1">
                There are no notifications matching the selected filter category.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardChildrenLayout>
  )
}

export default NotificationsPage