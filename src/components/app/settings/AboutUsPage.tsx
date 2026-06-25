import React from 'react'
import { Info, Globe, Shield, Users } from 'lucide-react'

const AboutUsPage = () => {
  return (
    <div className="space-y-6">
      {/* Platform Description Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#1b4332] rounded-xl flex items-center justify-center font-black text-lg border border-emerald-100">
            LS
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">LandSecure Platform</h2>
            <p className="text-[10px] text-gray-400 font-light mt-0.5">
              Cameroon GIS Land Tenure & Registration Management System
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-50">
          LandSecure is a state-of-the-art geographical information system (GIS) and land registration portal designed for Cameroonian land registrars, supervisors, surveyors, and clients. It provides reliable boundary check validations, automated title deed authentication, consultation requests tracking, and custom security workflows to secure land property ownership across regions.
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Version Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between min-h-[90px]">
          <div className="text-gray-400">
            <Info size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">App Version</p>
            <p className="text-xs font-semibold text-gray-900 mt-0.5">v2.4.1 (Stable Build)</p>
          </div>
        </div>

        {/* Secured Coverage */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between min-h-[90px]">
          <div className="text-emerald-600">
            <Shield size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Encryption Security</p>
            <p className="text-xs font-semibold text-gray-900 mt-0.5">AES-256 Protected</p>
          </div>
        </div>

        {/* Global GIS Sync */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between min-h-[90px]">
          <div className="text-blue-500">
            <Globe size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Map Service</p>
            <p className="text-xs font-semibold text-gray-900 mt-0.5">QField & Leaflet Connected</p>
          </div>
        </div>
      </div>

      {/* Developer & Legal Details */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-800 leading-none">Developer & License</h3>
        <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
          <p>
            Developed by the <span className="font-semibold text-gray-850">Terrasecure Development Team</span> in collaboration with local Cameroon municipal land registration authorities.
          </p>
          <p>
            © 2026 Terrasecure Cameroon Admin. All rights reserved. Registered under Cameroonian land policy codes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage