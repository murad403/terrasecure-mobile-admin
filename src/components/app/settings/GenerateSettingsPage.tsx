"use client"
import React, { useState } from 'react'
import { Camera, Save } from 'lucide-react'

const GenerateSettingsPage = () => {
  const [profile, setProfile] = useState({
    fullName: 'Jean Alima',
    city: 'Jean Alima',
    timezone: 'Africa/Douala (UTC+1)',
    platformName: 'LandSecure Admin — Cameroon',
  })

  const [language, setLanguage] = useState('French / English')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Profile settings saved successfully!')
  }

  const handlePlatformSave = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Platform preferences saved successfully!')
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Edit Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Edit Profile</h3>

        {/* Profile Avatar and Meta info */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-lg relative shrink-0">
            JA
            <button className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-emerald-800">
              <Camera size={10} />
            </button>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">{profile.fullName}</h4>
            <p className="text-[10px] text-gray-400 font-light mt-0.5">Super Admin</p>
            <button className="mt-2 border border-gray-200 hover:bg-gray-55 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
              Change Photo
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleProfileSave} className="space-y-4 pt-2 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">City</label>
              <select
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              >
                <option value="Jean Alima">Jean Alima</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Douala">Douala</option>
                <option value="Garoua">Garoua</option>
                <option value="Bamenda">Bamenda</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              >
                <option value="Africa/Douala (UTC+1)">Africa/Douala (UTC+1)</option>
                <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</option>
                <option value="UTC (UTC+0)">UTC (UTC+0)</option>
              </select>
            </div>

            {/* Platform Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Platform Name</label>
              <input
                type="text"
                value={profile.platformName}
                onChange={(e) => setProfile({ ...profile, platformName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save size={13} />
            Save Profile
          </button>
        </form>
      </div>

      {/* Platform Settings Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Platform Settings</h3>

        <form onSubmit={handlePlatformSave} className="space-y-4 pt-1">
          {/* Default Language */}
          <div className="space-y-1 max-w-sm">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Default Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
            >
              <option value="French / English">French / English</option>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save size={13} />
            Save Settings
          </button>
        </form>
      </div>
    </div>
  )
}

export default GenerateSettingsPage