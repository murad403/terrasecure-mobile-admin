"use client"
import React from 'react'
import { X, Loader2, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SiteVisitDetailsProps {
  isOpen: boolean
  onClose: () => void
  visit: any
  isLoading: boolean
  onComplete?: (id: number) => void
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  actionLoading?: boolean
}

const getVisitStatus = (visit: any) => {
  if (visit?.cancelledAt) return 'CANCELLED'
  if (visit?.completedAt) return 'COMPLETED'
  return 'SCHEDULED'
}

const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      'px-3 py-1 rounded-full text-xs font-semibold block w-fit whitespace-nowrap',
      status === 'SCHEDULED' && 'bg-indigo-50 text-indigo-600',
      status === 'COMPLETED' && 'bg-emerald-50 text-emerald-600',
      status === 'CANCELLED' && 'bg-rose-50 text-rose-600'
    )}
  >
    {status}
  </span>
)

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
    <p className="font-semibold text-slate-800">{children}</p>
  </div>
)

const SiteVisitDetails = ({
  isOpen,
  onClose,
  visit,
  isLoading,
  onComplete,
  onCancel,
  onDelete,
  actionLoading,
}: SiteVisitDetailsProps) => {
  if (!isOpen) return null

  const status = getVisitStatus(visit)

  return (
    <div
      className="fixed inset-0 z-55 flex justify-end bg-slate-950/60 backdrop-blur-[1.5px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-l border-slate-200 w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-slate-900 leading-none">
              {visit?.slug || 'Site Visit Details'}
            </h2>
            {!isLoading && visit && <StatusBadge status={status} />}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-sm font-semibold text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-button-color" />
              <span>Loading visit details...</span>
            </div>
          ) : visit ? (
            <div className="space-y-4 text-sm">
              <DetailRow label="Surveyor">
                {visit.surveyor?.name || 'N/A'}
              </DetailRow>

              <DetailRow label="Contact Phone">
                {visit.phone || 'N/A'}
              </DetailRow>

              <DetailRow label="Visit Type">
                {visit.kind ? visit.kind.replaceAll('_', ' ') : 'N/A'}
              </DetailRow>

              {visit.parcel && (
                <DetailRow label="Parcel">
                  {visit.parcel.slug}
                </DetailRow>
              )}

              {visit.registration && (
                <DetailRow label="Registration">
                  {visit.registration.slug}
                </DetailRow>
              )}

              <DetailRow label="Scheduled At">
                {formatDateTime(visit.scheduledAt)}
              </DetailRow>

              {visit.completedAt && (
                <DetailRow label="Completed At">
                  {formatDateTime(visit.completedAt)}
                </DetailRow>
              )}

              {visit.cancelledAt && (
                <DetailRow label="Cancelled At">
                  {formatDateTime(visit.cancelledAt)}
                </DetailRow>
              )}

              <DetailRow label="Created At">
                {formatDateTime(visit.createdAt)}
              </DetailRow>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-400">No details found.</p>
          )}
        </div>

        {/* Footer actions */}
        {!isLoading && visit && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center gap-3 shrink-0 select-none">
            {status === 'SCHEDULED' && onComplete && (
              <Button
                type="button"
                onClick={() => onComplete(visit.id)}
                disabled={actionLoading}
                className="flex-1 py-3 text-xs"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Complete
              </Button>
            )}

            {status === 'SCHEDULED' && onCancel && (
              <button
                type="button"
                onClick={() => onCancel(visit.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}

            {onDelete &&
              (status === 'SCHEDULED' ? (
                <button
                  type="button"
                  onClick={() => onDelete(visit.id)}
                  disabled={actionLoading}
                  title="Delete visit"
                  className="p-3 text-rose-500 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onDelete(visit.id)}
                  disabled={actionLoading}
                  className="flex-1 py-3 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Visit
                </Button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SiteVisitDetails
