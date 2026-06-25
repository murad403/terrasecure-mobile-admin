"use client"
import React, { useState } from 'react'
import { Save } from 'lucide-react'

interface PreferenceItem {
  id: string;
  name: string;
  sms: boolean;
  push: boolean;
  email: boolean;
}

const initialPreferences: PreferenceItem[] = [
  { id: 'new-reg', name: 'New Registration', sms: true, push: true, email: true },
  { id: 'inv-updates', name: 'Investigation Updates', sms: true, push: true, email: true },
  { id: 'conflict', name: 'Conflict Detected', sms: true, push: true, email: true },
  { id: 'qfield', name: 'QField Submission', sms: true, push: true, email: true },
  { id: 'payment', name: 'Payment Received', sms: true, push: true, email: true },
  { id: 'doc-approved', name: 'Document Approved', sms: true, push: true, email: true },
  { id: 'suspicious', name: 'Suspicious Login', sms: true, push: true, email: true },
]

const NotificationsPage = () => {
  const [preferences, setPreferences] = useState<PreferenceItem[]>(initialPreferences)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleToggle = (id: string, channel: 'sms' | 'push' | 'email') => {
    setPreferences((prev) =>
      prev.map((pref) => {
        if (pref.id === id) {
          return {
            ...pref,
            [channel]: !pref[channel],
          }
        }
        return pref
      })
    )
  }

  const handleSave = () => {
    setToastMessage('Notification preferences updated successfully!')
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 leading-tight">Notification Preferences</h2>
      </div>

      {/* Preferences Rows */}
      <div className="divide-y divide-gray-50 pt-2 border-t border-gray-50">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
          >
            {/* Preference Name */}
            <span className="font-semibold text-gray-700">{pref.name}</span>

            {/* Checkboxes Row */}
            <div className="flex items-center space-x-5">
              {/* SMS */}
              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pref.sms}
                  onChange={() => handleToggle(pref.id, 'sms')}
                  className="w-4 h-4 rounded border-slate-350 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">SMS</span>
              </label>

              {/* Push */}
              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pref.push}
                  onChange={() => handleToggle(pref.id, 'push')}
                  className="w-4 h-4 rounded border-slate-350 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Push</span>
              </label>

              {/* Email */}
              <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pref.email}
                  onChange={() => handleToggle(pref.id, 'email')}
                  className="w-4 h-4 rounded border-slate-350 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Save size={13} />
          Save Preferences
        </button>
      </div>
    </div>
  )
}

export default NotificationsPage