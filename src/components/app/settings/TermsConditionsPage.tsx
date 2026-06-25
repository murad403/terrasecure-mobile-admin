import React from 'react'
import { Pencil } from 'lucide-react'

const TermsConditionsPage = () => {
  const termsItems = [
    {
      num: 1,
      title: 'Agreement to Terms',
      text: 'By accessing or using the LandSecure platform, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.',
    },
    {
      num: 2,
      title: 'User Registration & Accounts',
      text: 'You must provide accurate, complete, and current information when creating an account. Failure to do so constitutes a breach of the terms. You are responsible for safeguarding your password.',
    },
    {
      num: 3,
      title: 'Use of Services',
      text: 'Our services must be used only for lawful land administration and GIS tracking purposes. You may not upload fraudulent land titles or survey plans.',
    },
    {
      num: 4,
      title: 'Fees and Payments',
      text: 'Certain services (e.g. consultations, surveyor assignments) require payment. All fees are in XAF unless stated otherwise. Payments are final and non-refundable unless required by Cameroon law.',
    },
    {
      num: 5,
      title: 'Intellectual Property',
      text: 'The LandSecure platform, logo, mapping code, and branding elements are the exclusive property of Terrasecure. User-uploaded deeds and coordinates remain the property of their respective owners.',
    },
    {
      num: 6,
      title: 'Limitation of Liability',
      text: 'Terrasecure will not be liable for any indirect, incidental, or special damages arising out of your use of or inability to use the land registry dashboard services.',
    },
    {
      num: 7,
      title: 'Governing Law',
      text: 'These terms shall be governed by and construed in accordance with the laws of the Republic of Cameroon, without regard to its conflict of law provisions.',
    },
    {
      num: 8,
      title: 'Changes to Terms',
      text: 'We reserve the right, at our sole discretion, to modify or replace these terms at any time. We will provide at least 30 days notice prior to any new terms taking effect.',
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
      {/* Header and edit actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">Terms & Conditions</h2>
          <p className="text-[10px] text-gray-400 font-light mt-1">
            Last updated: 10 Jun 2025 · Version 1.8
          </p>
        </div>
        <button className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* Main numbered list */}
      <div className="space-y-4 pt-4 border-t border-gray-50">
        {termsItems.map((item) => (
          <div key={item.num} className="text-xs leading-relaxed text-gray-600 flex items-start space-x-1.5">
            <span className="font-semibold text-gray-800 shrink-0">{item.num}.</span>
            <p>
              <strong className="font-semibold text-gray-800 mr-1">{item.title}</strong>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TermsConditionsPage