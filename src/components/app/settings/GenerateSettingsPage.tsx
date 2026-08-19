"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Camera, Save, Loader2, CheckCircle2, Shield, Mail, Phone, Calendar, UserCheck } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import formatDate from '@/utils/formatDate'
import {
  useRetrieveProfileQuery,
  useUpdateProfileMutation,
  useUploadImageMutation,
} from '@/redux/features/profile/profile.api'
import type { UpdateProfileInput } from '@/redux/features/profile/profile.type'

const GenerateSettingsPage = () => {
  const { data: profileResponse, isLoading, isError } = useRetrieveProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()

  const profileData = profileResponse?.data

  // Form State
  const [name, setName] = useState('')
  const [publicPhone, setPublicPhone] = useState('')
  const [profilePictureId, setProfilePictureId] = useState<string | undefined>(undefined)
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync profile data when fetched
  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '')
      setPublicPhone(profileData.publicPhone || '')
      if (profileData.profilePicture) {
        setPreviewAvatarUrl(profileData.profilePicture.url)
        setProfilePictureId(profileData.profilePicture.id)
      }
    }
  }, [profileData])

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('images', file)

      const toastId = toast.loading('Uploading profile image...')
      const res = await uploadImage(formData).unwrap()

      if (res?.data && res.data.length > 0) {
        const uploadedMedia = res.data[0]
        setProfilePictureId(uploadedMedia.id)
        setPreviewAvatarUrl(uploadedMedia.url)
        toast.success('Image uploaded successfully!', { id: toastId })
      } else {
        toast.error('Failed to process uploaded image', { id: toastId })
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error uploading image')
    }
  }


  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    try {
      const payload: UpdateProfileInput = {
        name: name.trim(),
        publicPhone: publicPhone.trim() || undefined,
        phone: publicPhone.trim() || undefined,
      }

      if (profilePictureId) {
        payload.profilePictureId = profilePictureId
      }

      const res = await updateProfile(payload).unwrap()
      toast.success(res.message || 'Profile updated successfully!')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  const initials = profileData?.name
    ? profileData.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'US'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-button-color" />
          <span>Loading user profile...</span>
        </div>
      </div>
    )
  }

  if (isError || !profileData) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-semibold">
        Failed to load profile settings. Please refresh or try again later.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Page Title Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage your personal account profile details and avatar image
        </p>
      </div>

      {/* Main Profile Overview & Edit Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 leading-none">
          Personal Information
        </h3>

        {/* Profile Avatar and Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0 w-16 h-16">
              <div className="w-full h-full rounded-full bg-blue-100 text-button-color flex items-center justify-center font-extrabold text-xl overflow-hidden border-2 border-white shadow-sm">
                {previewAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                onClick={triggerUpload}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-button-color border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 shadow transition-colors disabled:opacity-50"
                title="Change Avatar"
              >
                {isUploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
              </button>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-extrabold text-slate-900 leading-none truncate">
                  {profileData.name}
                </h4>
                {profileData.isEmailVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono truncate">{profileData.email}</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={triggerUpload}
            disabled={isUploading}
            variant="outline"
            className="w-auto text-xs font-semibold shrink-0 cursor-pointer shadow-sm"
          >
            {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
            <span>Change Photo</span>
          </Button>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Editable Field: Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>Full Name</span>
                <span className="text-emerald-500 text-[10px] font-semibold">(Editable)</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="font-semibold text-slate-800"
              />
            </div>

            {/* Editable Field: Public Phone */}
            <div className="space-y-2">
              <Label htmlFor="publicPhone" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone size={12} />
                <span>Public Phone</span>
                <span className="text-emerald-500 text-[10px] font-semibold">(Editable)</span>
              </Label>
              <Input
                id="publicPhone"
                type="text"
                value={publicPhone}
                onChange={(e) => setPublicPhone(e.target.value)}
                placeholder="Enter public phone number"
                className="font-mono text-slate-800"
              />
            </div>

            {/* Read-only: User Code / Slug */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Shield size={12} />
                <span>User Code</span>
              </Label>
              <Input
                type="text"
                value={profileData.slug || 'N/A'}
                disabled
                className="bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            {/* Read-only: Email Address */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Mail size={12} />
                <span>Email Address</span>
              </Label>
              <Input
                type="email"
                value={profileData.email || 'N/A'}
                disabled
                className="bg-slate-50 text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Read-only: Roles */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <UserCheck size={12} />
                <span>Assigned Roles</span>
              </Label>
              <Input
                type="text"
                value={profileData.roles?.join(', ') || 'USER'}
                disabled
                className="bg-slate-50 text-slate-500 font-semibold uppercase cursor-not-allowed"
              />
            </div>

            {/* Read-only: Joined Date */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Calendar size={12} />
                <span>Account Created</span>
              </Label>
              <Input
                type="text"
                value={formatDate(profileData.createdAt)}
                disabled
                className="bg-slate-50 text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              disabled={isUpdating || isUploading}
              className="w-auto px-6 py-2.5 cursor-pointer"
            >
              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Profile</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GenerateSettingsPage