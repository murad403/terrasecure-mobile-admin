import React from 'react'
import { Pencil } from 'lucide-react'

const PrivacyPolicyPage = () => {
  const policyItems = [
    {
      num: 1,
      title: 'Introduction',
      text: 'LandSecure is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.',
    },
    {
      num: 2,
      title: 'Data We Collect',
      text: 'We collect personal identification information (name, national ID, phone number, email), land parcel data (GPS coordinates, area size, ownership history), transaction data (payments, registrations), and device and usage data.',
    },
    {
      num: 3,
      title: 'How We Use Your Data',
      text: 'Your data is used to process land registration requests, verify ownership and identity, communicate with you about your requests, generate reports for government agencies, and improve our platform services.',
    },
    {
      num: 4,
      title: 'Data Sharing',
      text: 'We share data only with authorized government agencies (Ministry of Land Affairs, Local Government), certified surveyors assigned to your parcels, and legal authorities when required by law.',
    },
    {
      num: 5,
      title: 'Data Retention',
      text: 'Personal data is retained for a minimum of 10 years in compliance with Cameroon land registry regulations. You may request data deletion for non-regulatory data by contacting our support team.',
    },
    {
      num: 6,
      title: 'Your Rights',
      text: 'You have the right to access, correct, or request deletion of your personal data. Contact us at privacy@landsecure.cm.',
    },
    {
      num: 7,
      title: 'Security',
      text: 'We use industry-standard encryption (AES-256) and access controls to protect your data. All data is stored on secure servers within Cameroon.',
    },
    {
      num: 8,
      title: 'Contact',
      text: 'For privacy-related inquiries: privacy@landsecure.cm',
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
      {/* Header and edit actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">Privacy Policy</h2>
          <p className="text-[10px] text-gray-400 font-light mt-1">
            Last updated: 1 Jun 2025 · Version 2.1
          </p>
        </div>
        <button className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* Main numbered list */}
      <div className="space-y-4 pt-4 border-t border-gray-50">
        {policyItems.map((item) => (
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

export default PrivacyPolicyPage