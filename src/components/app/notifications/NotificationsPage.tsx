"use client"
import { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import NotificationCard from './NotificationCard'
import CustomPagination from '@/components/shared/CustomPagination'
import { Trash2, BellOff, Loader2 } from 'lucide-react'
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation
} from '@/redux/features/notifications/notifications.api'
import { toast } from 'sonner'

const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { data: responseData, isLoading, isError, refetch } = useGetNotificationsQuery({
    page: currentPage,
    limit: pageSize,
  })

  const [markRead, { isLoading: isMarkingRead }] = useMarkNotificationAsReadMutation()
  const [deleteNotification, { isLoading: isDeletingSingle }] = useDeleteNotificationMutation()
  const [deleteAllNotifications, { isLoading: isDeletingAll }] = useDeleteAllNotificationsMutation()

  const notifications = responseData?.data || []
  const pagination = responseData?.pagination || {
    limit: pageSize,
    page: 1,
    total: 0,
    totalPages: 1,
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Handlers
  const handleMarkRead = async (id: string) => {
    try {
      const res = await markRead(id).unwrap()
      if (res.success) {
        toast.success(res.message || 'Notification marked as read')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to mark notification as read')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteNotification(id).unwrap()
      if (res.success) {
        toast.success(res.message || 'Notification deleted')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete notification')
    }
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      try {
        const res = await deleteAllNotifications().unwrap()
        if (res.success) {
          toast.success(res.message || 'All notifications cleared')
        }
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to clear notifications')
      }
    }
  }

  return (
    <DashboardChildrenLayout
      title="Notification Center"
      subtitle="All platform alerts and system notifications"
    >
      <div className="space-y-6">
        
        {/* Header Summary and Action Buttons Row */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System Notifications ({pagination.total})
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold text-emerald-600">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Clear All Action Button */}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isDeletingAll}
              className="bg-rose-50 text-rose-700 border border-rose-200/70 hover:bg-rose-100/60 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeletingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Clear All
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-button-color animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-rose-500">Failed to load notifications.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-bold text-button-color hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                isMarkingRead={isMarkingRead}
                isDeleting={isDeletingSingle}
              />
            ))}

            {/* Pagination Component */}
            <div className="pt-4">
              <CustomPagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
                totalEntries={pagination.total}
                pageSize={pagination.limit}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400">
              <BellOff size={36} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No notifications found</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                You currently have no platform notifications.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardChildrenLayout>
  )
}

export default NotificationsPage;