import React from 'react'
import { NotificationItem } from './NotificationsPage'
import {
  ShieldAlert,
  FolderPlus,
  Compass,
  Search,
  MessageSquare,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
} from 'lucide-react'

interface CardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard = ({ notification, onMarkRead, onDelete }: CardProps) => {
  // Map category icons & style settings
  const getCategoryStyles = (category: string, isApproved: boolean = false) => {
    const size = 18
    switch (category) {
      case 'Conflicts':
        return {
          icon: <ShieldAlert size={size} className="text-white" />,
          wrapperClass: 'bg-red-500 rounded-full w-9 h-9 flex items-center justify-center shrink-0 shadow-sm border border-red-400',
        }
      case 'Registrations':
        if (isApproved) {
          return {
            icon: <FileCheck size={size} className="text-emerald-700" />,
            wrapperClass: 'bg-emerald-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-emerald-100',
          }
        }
        return {
          icon: <FolderPlus size={size} className="text-amber-700" />,
          wrapperClass: 'bg-amber-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-amber-100',
        }
      case 'Surveys':
        return {
          icon: <Compass size={size} className="text-sky-700" />,
          wrapperClass: 'bg-sky-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-sky-100',
        }
      case 'Investigations':
        return {
          icon: <Search size={size} className="text-slate-600" />,
          wrapperClass: 'bg-slate-100 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-slate-200',
        }
      case 'Consultations':
        return {
          icon: <MessageSquare size={size} className="text-indigo-700" />,
          wrapperClass: 'bg-indigo-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-indigo-100',
        }
      case 'Suspicious':
        return {
          icon: <AlertTriangle size={size} className="text-amber-800" />,
          wrapperClass: 'bg-amber-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-amber-150',
        }
      default:
        return {
          icon: <ShieldAlert size={size} className="text-gray-600" />,
          wrapperClass: 'bg-gray-50 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 border border-gray-150',
        }
    }
  }

  const isApproved = notification.title.includes('Approved')
  const styles = getCategoryStyles(notification.category, isApproved)

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 shadow-sm ${
        notification.isUnread
          ? 'bg-emerald-50/10 border-emerald-150'
          : 'bg-white border-gray-100'
      }`}
    >
      {/* Left Content Column */}
      <div className="flex items-start space-x-3.5 flex-1">
        {/* Category Icon */}
        <div className={styles.wrapperClass}>{styles.icon}</div>

        {/* Text Area */}
        <div>
          <div className="flex items-center">
            <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
              {notification.title}
            </h4>
            {notification.isUnread && (
              <span className="text-emerald-500 font-extrabold text-xs ml-1.5" title="Unread">
                •
              </span>
            )}
          </div>
          <p className="text-[10px] md:text-xs text-gray-500 font-light mt-0.5 leading-normal max-w-2xl">
            {notification.description}
          </p>
          <span className="text-[9px] md:text-[10px] text-gray-400 mt-1 leading-none block font-light">
            {notification.time}
          </span>
        </div>
      </div>

      {/* Right Controls Column */}
      <div className="flex items-center justify-end space-x-3.5 shrink-0 self-end md:self-auto min-w-[160px]">
        {/* Mark read button */}
        {notification.isUnread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Mark read
          </button>
        )}

        {/* Go to button */}
        <button
          className="border border-gray-200 hover:bg-gray-55 text-gray-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          title="Go to detail"
        >
          <ArrowUpRight size={12} />
          Go to
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(notification.id)}
          className="text-red-650 hover:text-red-700 hover:bg-red-50 text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default NotificationCard