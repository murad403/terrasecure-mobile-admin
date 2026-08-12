"use client"
import React, { useState } from 'react'
import { Laptop, Smartphone, Monitor, LogOut, Eye, EyeOff } from 'lucide-react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  ip: string;
  time: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

const initialSessions: SessionItem[] = [
  {
    id: 's1',
    device: 'MacBook Pro',
    browser: 'Chrome',
    ip: '197.155.20.12',
    time: 'Active now',
    isCurrent: true,
    type: 'desktop',
  },
  {
    id: 's2',
    device: 'iPhone 14',
    browser: 'Safari',
    ip: '197.155.20.88',
    time: '2 hours ago',
    isCurrent: false,
    type: 'mobile',
  },
  {
    id: 's3',
    device: 'Windows PC',
    browser: 'Firefox',
    ip: '197.155.21.03',
    time: 'Yesterday',
    isCurrent: false,
    type: 'desktop',
  },
]

const SecurityPage = () => {
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions)
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password inputs
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.warning('Please fill in all password fields.')
      return
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New password and confirmation do not match.')
      return
    }
    toast.success('Password updated successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const handleRevoke = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast.success(`Session on "${name}" has been revoked.`)
  }

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out of all other sessions?')) {
      setSessions((prev) => prev.filter((s) => s.isCurrent))
      toast.success('Logged out of all other active sessions.')
    }
  }

  const renderDeviceIcon = (item: SessionItem) => {
    const size = 18
    const className = "text-gray-500"
    if (item.type === 'mobile') {
      return <Smartphone size={size} className={className} />
    }
    if (item.device.includes('MacBook')) {
      return <Laptop size={size} className={className} />
    }
    return <Monitor size={size} className={className} />
  }

  return (
    <div className="space-y-6 relative">
      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Change Password</h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
          <div className="space-y-3 max-w-sm">
            {/* Current Password */}
            <div className="space-y-1">
              <Label htmlFor="current-password">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwords.current}
                  placeholder="••••••••"
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <Label htmlFor="new-password">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.new}
                  placeholder="••••••••"
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <Label htmlFor="confirm-password">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirm}
                  placeholder="••••••••"
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className='w-auto'
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Active Sessions Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <h3 className="text-xs font-bold text-gray-900 leading-none">Active Sessions</h3>
          {sessions.length > 1 && (
            <button
              onClick={handleLogoutAll}
              className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-100/50 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
            >
              <LogOut size={11} />
              Logout All
            </button>
          )}
        </div>

        {/* Sessions list */}
        <div className="divide-y divide-gray-50 pt-1">
          {sessions.map((session) => (
            <div key={session.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 rounded-xl shrink-0">
                  {renderDeviceIcon(session)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-800">
                      {session.device} ({session.browser})
                    </span>
                    {session.isCurrent && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5 leading-none">
                    {session.ip} · {session.time}
                  </p>
                </div>
              </div>

              {/* Action */}
              {!session.isCurrent && (
                <button
                  onClick={() => handleRevoke(session.id, `${session.device} (${session.browser})`)}
                  className="bg-red-50 text-red-700 hover:bg-red-100/50 border border-red-100 text-[9px] font-bold px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SecurityPage