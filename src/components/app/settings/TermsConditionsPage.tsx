"use client"
import React, { useState } from 'react'
import { Pencil, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

const defaultContent = `1. Agreement to Terms
By accessing or using the LandSecure platform, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.

2. User Registration & Accounts
You must provide accurate, complete, and current information when creating an account. Failure to do so constitutes a breach of the terms. You are responsible for safeguarding your password.

3. Use of Services
Our services must be used only for lawful land administration and GIS tracking purposes. You may not upload fraudulent land titles or survey plans.

4. Fees and Payments
Certain services (e.g. consultations, surveyor assignments) require payment. All fees are in XAF unless stated otherwise. Payments are final and non-refundable unless required by Cameroon law.

5. Intellectual Property
The LandSecure platform, logo, mapping code, and branding elements are the exclusive property of Terrasecure. User-uploaded deeds and coordinates remain the property of their respective owners.

6. Limitation of Liability
Terrasecure will not be liable for any indirect, incidental, or special damages arising out of your use of or inability to use the land registry dashboard services.

7. Governing Law
These terms shall be governed by and construed in accordance with the laws of the Republic of Cameroon, without regard to its conflict of law provisions.

8. Changes to Terms
We reserve the right, at our sole discretion, to modify or replace these terms at any time. We will provide at least 30 days notice prior to any new terms taking effect.`

const TermsConditionsPage = () => {
  const [content, setContent] = useState(defaultContent)
  const [isEditing, setIsEditing] = useState(false)
  const [tempContent, setTempContent] = useState(defaultContent)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const startEditing = () => {
    setTempContent(content)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    setContent(tempContent)
    setIsEditing(false)
    showToast('Terms & Conditions saved successfully!')
  }

  const renderFormattedContent = (text: string) => {
    const sections = text.split('\n\n')
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const lines = section.split('\n')
          const firstLine = lines[0]
          const remainingText = lines.slice(1).join('\n')

          // Check if first line starts with digits followed by dot (e.g. "1. Agreement to Terms")
          const isHeader = /^\d+\.\s*\w+/.test(firstLine)

          if (isHeader) {
            return (
              <div key={idx} className="space-y-1.5">
                <h3 className="font-bold text-gray-900 text-sm">{firstLine}</h3>
                {remainingText && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
                    {remainingText}
                  </p>
                )}
              </div>
            )
          } else {
            return (
              <p key={idx} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
                {section}
              </p>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header and edit actions */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">Terms & Conditions</h2>
          <p className="text-xs text-gray-500 font-light">
            Last updated: 10 Jun 2025 · Version 1.8
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className='w-auto py-2'
              >
                <Save size={13} />
                Save
              </Button>
              <button
                onClick={handleCancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-3 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={startEditing}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Pencil size={12} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Container containing list of items */}
      <div className="border border-gray-200 rounded-xl p-5 max-h-[550px] overflow-y-auto bg-white">
        {isEditing ? (
          <div className="min-h-[400px]">
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className="w-full min-h-[400px] bg-slate-50/20 border border-slate-200 rounded-xl p-4 text-xs text-slate-750 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors leading-relaxed font-normal resize-y"
              placeholder="Write terms and conditions content here..."
            />
          </div>
        ) : (
          renderFormattedContent(content)
        )}
      </div>
    </div>
  )
}

export default TermsConditionsPage