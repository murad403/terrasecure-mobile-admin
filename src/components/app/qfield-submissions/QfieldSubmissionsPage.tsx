"use client"
import React, { useState, useEffect } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import QfieldSubmissionsTable, { type QfieldSubmission } from './QfieldSubmissionsTable'
import GISViewMapModal from '@/components/modal/GISViewMapModal'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const initialSubmissions: QfieldSubmission[] = [
  {
    id: 'QF-087',
    surveyor: 'Paul Biya Jr',
    parcelId: 'CM-2849',
    submittedAt: '10 Jun 2025 14:32',
    gpsPoints: 24,
    syncStatus: 'Synced',
    area: 1240,
    latitude: 3.848,
    longitude: 11.502
  },
  {
    id: 'QF-086',
    surveyor: 'Martin Essono',
    parcelId: 'CM-2847',
    submittedAt: '8 Jun 2025 11:15',
    gpsPoints: 18,
    syncStatus: 'Synced',
    area: 3500,
    latitude: 3.868,
    longitude: 11.522
  },
  {
    id: 'QF-085',
    surveyor: 'Cécile Ondoua',
    parcelId: 'CM-2850',
    submittedAt: '5 Jun 2025 09:48',
    gpsPoints: 32,
    syncStatus: 'Unsynced',
    area: 2100,
    latitude: 3.828,
    longitude: 11.482
  },
  {
    id: 'QF-084',
    surveyor: 'Paul Biya Jr',
    parcelId: 'CM-2852',
    submittedAt: '1 Jun 2025 16:02',
    gpsPoints: 12,
    syncStatus: 'Synced',
    area: 750,
    latitude: 3.858,
    longitude: 11.512
  }
]

interface ToastState {
  message: string
  type: 'success' | 'info' | 'error'
}

const QfieldSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<QfieldSubmission[]>(initialSubmissions)
  const [previewSub, setPreviewSub] = useState<QfieldSubmission | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type })
  }

  const handlePreviewMap = (sub: QfieldSubmission) => {
    setPreviewSub(sub)
  }

  const handleAccept = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, syncStatus: 'Synced' } : sub))
    )
    showToast(`Submission ${id} successfully synced/accepted!`, 'success')
  }

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, syncStatus: 'Unsynced' } : sub))
    )
    showToast(`Submission ${id} marked as Unsynced.`, 'info')
  }

  const handleConfirmGIS = () => {
    if (!previewSub) return
    const subId = previewSub.id
    const parcelId = previewSub.parcelId

    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, syncStatus: 'Synced' } : sub))
    )
    setPreviewSub(null)
    showToast(
      `GIS Data for ${subId} has been successfully confirmed and linked to parcel ${parcelId}!`,
      'success'
    )
  }

  return (
    <DashboardChildrenLayout
      title="QField Submissions"
      subtitle="Manage GPS field data submissions from surveyors"
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-55 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-top-3 duration-250 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Submissions Table */}
      <QfieldSubmissionsTable
        submissions={submissions}
        onPreviewMap={handlePreviewMap}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      {/* Preview Map Modal */}
      {previewSub && (
        <GISViewMapModal
          isOpen={!!previewSub}
          onClose={() => setPreviewSub(null)}
          latitude={previewSub.latitude}
          longitude={previewSub.longitude}
          parcelName={previewSub.parcelId}
          area={previewSub.area}
          registrationId={previewSub.id}
          onConfirm={handleConfirmGIS}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default QfieldSubmissionsPage