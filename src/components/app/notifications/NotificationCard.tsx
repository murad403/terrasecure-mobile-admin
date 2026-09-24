import type { NotificationItem } from '@/redux/features/notifications/notifications.type'
import { ShieldAlert, AlertTriangle, FileCheck, Info, ArrowUpRight, Trash2, Check } from 'lucide-react'

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  isMarkingRead,
  isDeleting,
}) => {
  const getTypeStyles = (type?: string) => {
    const size = 18
    switch (type?.toUpperCase()) {
      case 'WARNING':
        return {
          icon: <AlertTriangle size={size} className="text-amber-600" />,
          wrapperClass: 'bg-amber-50 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 border border-amber-200/80 shadow-xs',
        }
      case 'ERROR':
      case 'DANGER':
        return {
          icon: <ShieldAlert size={size} className="text-rose-600" />,
          wrapperClass: 'bg-rose-50 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 border border-rose-200/80 shadow-xs',
        }
      case 'SUCCESS':
        return {
          icon: <FileCheck size={size} className="text-emerald-600" />,
          wrapperClass: 'bg-emerald-50 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-xs',
        }
      case 'INFO':
      default:
        return {
          icon: <Info size={size} className="text-blue-600" />,
          wrapperClass: 'bg-blue-50 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 border border-blue-200/80 shadow-xs',
        }
    }
  }

  const styles = getTypeStyles(notification.type)

  const formattedDate = new Date(notification.createdAt).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 shadow-sm ${!notification.isRead
          ? 'bg-emerald-50/10 border-emerald-200/80'
          : 'bg-white border-gray-100'
        }`}
    >
      {/* Left Content Column */}
      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
        {/* Category / Type Icon */}
        <div className={styles.wrapperClass}>{styles.icon}</div>

        {/* Text Area */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Unread" />
            )}
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {notification.type}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed max-w-3xl">
            {notification.message}
          </p>

          <span className="text-[10px] text-slate-400 mt-1.5 leading-none block font-semibold">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Right Controls Column */}
      <div className="flex items-center justify-end space-x-2 shrink-0 self-end md:self-auto">
        {/* Mark Read Button */}
        {!notification.isRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            disabled={isMarkingRead}
            className="text-button-color hover:bg-emerald-50 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
            Mark read
          </button>
        )}

        {/* Action Link Button if actionUrl is available */}
        {notification.actionUrl && (
          <a
            href={notification.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            title="Open Link"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Action
          </a>
        )}

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          disabled={isDeleting}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-100 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
          title="Delete Notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default NotificationCard