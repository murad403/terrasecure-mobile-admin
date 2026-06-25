"use client"
import React, { useState, useRef } from 'react'
import { Camera, Save } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const GenerateSettingsPage = () => {
  const [profile, setProfile] = useState({
    fullName: 'Jean Alima',
    city: 'Jean Alima',
    timezone: 'Africa/Douala (UTC+1)',
    platformName: 'LandSecure Admin — Cameroon',
  })

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [language, setLanguage] = useState('French / English')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string)
          showToast('Profile photo updated successfully!')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Edit Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Edit Profile</h3>

        {/* Profile Avatar and Meta info */}
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0 w-14 h-14">
            <div className="w-full h-full rounded-full bg-button-color text-white flex items-center justify-center font-bold text-lg overflow-hidden border border-gray-150 shadow-inner">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                "JA"
              )}
            </div>
            <button
              type="button"
              onClick={triggerUpload}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-emerald-800 shadow transition-colors"
            >
              <Camera size={10} />
            </button>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">{profile.fullName}</h4>
            <p className="text-[10px] text-gray-400 font-light mt-0.5">Super Admin</p>
            <button
              type="button"
              onClick={triggerUpload}
              className="mt-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Change Photo
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleProfileSave} className="space-y-4 pt-2 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profile.timezone}
                onValueChange={(val) => setProfile({ ...profile, timezone: val })}
              >
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Douala (UTC+1)">Africa/Douala (UTC+1)</SelectItem>
                  <SelectItem value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</SelectItem>
                  <SelectItem value="UTC (UTC+0)">UTC (UTC+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform Name */}
            <div className="space-y-1.5">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                type="text"
                value={profile.platformName}
                onChange={(e) => setProfile({ ...profile, platformName: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-auto py-2"
          >
            <Save size={13} />
            Save Profile
          </Button>
        </form>
      </div>

      {/* Platform Settings Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Platform Settings</h3>

        <form onSubmit={handlePlatformSave} className="space-y-4 pt-1">
          {/* Default Language */}
          <div className="space-y-1.5 max-w-sm">
            <Label htmlFor="language">Default Language</Label>
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="French / English">French / English</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-auto py-2"
          >
            <Save size={13} />
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  )
}

export default GenerateSettingsPage;