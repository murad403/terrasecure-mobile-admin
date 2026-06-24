"use client"
import React, { useEffect } from 'react'
import { X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  description: string
  ipAddress: string
  target?: string
}

interface AuditLogDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  log: AuditLog | null
}

const AuditLogDetailsModal = ({ isOpen, onClose, log }: AuditLogDetailsModalProps) => {
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

  if (!isOpen || !log) return null

  // Get color for action badge
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'Publication':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'Status Change':
        return 'bg-amber-50 text-amber-600 border border-amber-100'
      case 'Document Approval':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'Login':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'User Change':
        return 'bg-purple-50 text-purple-600 border border-purple-100'
      case 'Parcel Update':
        return 'bg-teal-50 text-teal-600 border border-teal-100'
      case 'Deletion':
        return 'bg-rose-50 text-rose-600 border border-rose-100'
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100'
    }
  }

  // Format actor username/role
  const formatActor = (user: string, role: string) => {
    const roleSlug = role.toLowerCase().replace(' ', '_')
    return `${user} (${roleSlug})`
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[420px] md:w-[460px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <h2 className="text-md font-extrabold text-slate-900">
            Audit Log Detail
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* Action Badge */}
          <div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap block w-fit shadow-sm uppercase tracking-wide",
              getActionBadgeColor(log.action)
            )}>
              {log.action}
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-4 font-semibold text-xs text-slate-700">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Log ID</span>
              <span className="text-slate-800 font-extrabold font-mono">{log.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Timestamp</span>
              <span className="text-slate-800 font-bold">{log.timestamp}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Actor</span>
              <span className="text-slate-800 font-bold">{formatActor(log.user, log.role)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-450 font-medium">IP Address</span>
              <span className="text-slate-800 font-bold font-mono">{log.ipAddress}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Target</span>
              <span className="text-blue-600 hover:underline cursor-pointer font-bold">{log.target || 'N/A'}</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed shadow-sm">
              {log.description}
            </div>
          </div>
        </div>

        {/* Footer Alert Banner */}
        <div className="shrink-0 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[10px] md:text-[11px] font-bold text-emerald-700 leading-normal">
            This entry is immutable and cryptographically signed. It cannot be edited or deleted by any admin.
          </span>
        </div>

      </div>
    </div>
  )
}

export default AuditLogDetailsModal