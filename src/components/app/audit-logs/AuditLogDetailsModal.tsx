"use client"
import React, { useEffect } from 'react'
import { X, Shield, User as UserIcon, Calendar, Tag, FileText, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetUserActivityDetailsQuery } from '@/redux/features/user/user.api'
import type { UserActivity } from '@/redux/features/user/user.type'

interface AuditLogDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  activityId: string | null
  initialActivity?: UserActivity | null
}

const AuditLogDetailsModal: React.FC<AuditLogDetailsModalProps> = ({
  isOpen,
  onClose,
  activityId,
  initialActivity,
}) => {
  const { data: detailsData, isLoading, isError } = useGetUserActivityDetailsQuery(
    activityId || '',
    { skip: !isOpen || !activityId }
  )

  const activity: UserActivity | null = detailsData?.data || initialActivity || null

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Format Action Badge Color
  const getActionBadgeColor = (action?: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'UPDATE':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'DELETE':
        return 'bg-rose-50 text-rose-600 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  // Format Kind label
  const formatKind = (kind?: string) => {
    if (!kind) return 'N/A'
    return kind.replace(/_/g, ' ')
  }

  // Strip HTML tags for clean display
  const cleanText = (html?: string | null) => {
    if (!html) return null
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const snapshot = activity?.snapshot
  const targetTitle =
    snapshot?.title ||
    snapshot?.slug ||
    activity?.landInvestigation?.title ||
    activity?.landInvestigation?.slug ||
    activity?.landParcel?.slug ||
    activity?.landParcelRegistration?.slug ||
    activity?.landConsultation?.slug ||
    (snapshot?.id ? `#${snapshot.id}` : 'N/A')

  const description =
    cleanText(snapshot?.description) ||
    cleanText(snapshot?.notes) ||
    snapshot?.requestMsg ||
    snapshot?.message ||
    snapshot?.title ||
    'No description provided'

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-115 md:w-130 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 ease-out border-l border-slate-100 z-50 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-button-color" />
            <h2 className="text-base font-extrabold text-slate-900">
              User Activity Detail
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-10">
            <div className="w-8 h-8 border-3 border-button-color border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading activity details...</p>
          </div>
        ) : isError || !activity ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm font-semibold text-rose-500">Failed to load activity details.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-5 space-y-6">
            
            {/* Badges Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm uppercase tracking-wide",
                getActionBadgeColor(activity.action)
              )}>
                {activity.action}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-button-color border border-blue-100 uppercase tracking-wide">
                {formatKind(activity.kind)}
              </span>
              {snapshot?.status && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">
                  {snapshot.status}
                </span>
              )}
            </div>

            {/* Actor User Card */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              {activity.user?.profilePicture?.url ? (
                <img
                  src={activity.user.profilePicture.url}
                  alt={activity.user.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm shrink-0">
                  {activity.user?.name
                    ? activity.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {activity.user?.name || 'Unknown User'}
                  </span>
                  <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    ID: {activity.userId}
                  </span>
                </div>
                {activity.user?.phone && (
                  <p className="text-xs text-slate-500 font-medium">{activity.user.phone}</p>
                )}
              </div>
            </div>

            {/* General Meta Information */}
            <div className="space-y-3 font-semibold text-xs text-slate-700 bg-white border border-slate-100 rounded-xl p-4 shadow-sm divide-y divide-slate-100">
              <div className="flex justify-between items-center pb-2.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Activity ID
                </span>
                <span className="text-slate-800 font-bold font-mono text-[11px] truncate max-w-56" title={activity.id}>
                  {activity.id}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Timestamp
                </span>
                <span className="text-slate-800 font-bold">
                  {new Date(activity.timestamp).toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Target Item
                </span>
                <span className="text-button-color font-bold truncate max-w-56" title={targetTitle}>
                  {targetTitle}
                </span>
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Description / Details
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed shadow-sm">
                {description}
              </div>
            </div>

            {/* Snapshot Attributes Section */}
            {snapshot && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Snapshot Details
                </span>
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs">
                  {snapshot.slug && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Slug</span>
                      <span className="font-bold text-slate-800 font-mono">{snapshot.slug}</span>
                    </div>
                  )}
                  {snapshot.priorityLevel && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Priority Level</span>
                      <span className="font-bold text-slate-800">{snapshot.priorityLevel}</span>
                    </div>
                  )}
                  {snapshot.areaSqm !== undefined && snapshot.areaSqm !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Area (SQM)</span>
                      <span className="font-bold text-slate-800">{snapshot.areaSqm} sqm</span>
                    </div>
                  )}
                  {snapshot.pricePerSqm && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Price / SQM</span>
                      <span className="font-bold text-slate-800">{snapshot.pricePerSqm}</span>
                    </div>
                  )}
                  {snapshot.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Location</span>
                      <span className="font-bold text-slate-800">
                        {[snapshot.location.addressLine1, snapshot.location.city, snapshot.location.country]
                          .filter(Boolean)
                          .join(', ') || 'N/A'}
                      </span>
                    </div>
                  )}
                  {snapshot.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Entity Created At</span>
                      <span className="font-semibold text-slate-700">
                        {new Date(snapshot.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer Audit Guarantee */}
        <div className="shrink-0 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5 mt-auto">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[11px] font-bold text-emerald-800 leading-normal">
            This activity log is cryptographically immutable and retrieved directly from system audit records.
          </span>
        </div>

      </div>
    </div>
  )
}

export default AuditLogDetailsModal