"use client"
import { FileText, Check, Radio, Globe, Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecentActivitiesQuery } from '@/redux/features/profile/profile.api'
import type { IUserActivityItem } from '@/redux/features/profile/profile.type'

const getRelativeTime = (isoString?: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const getActivityDetails = (item: IUserActivityItem) => {
  const userName = item.user?.name || 'System Admin'
  const actionText = item.action ? item.action.toLowerCase() : 'updated'

  let targetName = 'entity'
  let IconComponent = FileText
  let bgClass = 'bg-purple-50'
  let colorClass = 'text-purple-600'

  switch (item.kind) {
    case 'LAND_PARCEL_SURVEY':
      targetName = item.landParcelSurveyId
        ? `Survey #${item.landParcelSurveyId}`
        : item.snapshot?.id
        ? `Survey #${item.snapshot.id}`
        : 'Land Survey'
      IconComponent = Radio
      bgClass = 'bg-sky-50'
      colorClass = 'text-sky-600'
      break

    case 'LAND_PARCEL':
      targetName = item.landParcel?.slug || item.snapshot?.slug || item.snapshot?.parcelCode || (item.landParcelId ? `Parcel #${item.landParcelId}` : 'Land Parcel')
      IconComponent = Globe
      bgClass = 'bg-emerald-50'
      colorClass = 'text-emerald-600'
      break

    case 'LAND_PARCEL_REGISTRATION':
      targetName = item.landParcelRegistration?.slug || item.snapshot?.slug || (item.landParcelRegistrationId ? `Registration #${item.landParcelRegistrationId}` : 'Registration')
      IconComponent = FileText
      bgClass = 'bg-purple-50'
      colorClass = 'text-purple-600'
      break

    case 'LAND_SITE_VISIT':
      targetName = item.landSiteVisit?.slug || item.snapshot?.slug || (item.landSiteVisitId ? `Site Visit #${item.landSiteVisitId}` : 'Site Visit')
      IconComponent = Calendar
      bgClass = 'bg-amber-50'
      colorClass = 'text-amber-600'
      break

    default:
      targetName = item.kind ? item.kind.replace(/_/g, ' ').toLowerCase() : 'activity'
      IconComponent = Check
      bgClass = 'bg-slate-100'
      colorClass = 'text-slate-600'
      break
  }

  const title = `${userName} ${actionText} ${targetName}`
  return { title, IconComponent, bgClass, colorClass }
}

const RecentActivity = () => {
  const { data, isLoading } = useRecentActivitiesQuery({ limit: 20 })

  const activitiesList: IUserActivityItem[] = data?.data || []

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-110 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
        <span className="font-semibold text-title text-sm">Recent Activity</span>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-xs font-medium">Loading activity...</span>
          </div>
        ) : activitiesList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium">
            No recent activity recorded.
          </div>
        ) : (
          activitiesList.map((item) => {
            const { title, IconComponent, bgClass, colorClass } = getActivityDetails(item)
            const timeAgo = getRelativeTime(item.timestamp)

            return (
              <div key={item.id} className="flex items-start gap-3.5">
                {/* Icon */}
                <div
                  className={cn(
                    'w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 shadow-2xs',
                    bgClass,
                    colorClass
                  )}
                >
                  <IconComponent className="w-4.5 h-4.5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 leading-tight">
                  <p className="text-xs font-semibold text-slate-700 leading-normal truncate" title={title}>
                    {title}
                  </p>
                  <span className="text-[10px] text-subtitle mt-0.5 block">
                    {timeAgo}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default RecentActivity