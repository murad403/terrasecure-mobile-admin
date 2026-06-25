"use client"
import React, { useState } from 'react'
import { Laptop, Smartphone, Monitor, LogOut } from 'lucide-react'

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
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Password inputs
  const [passwords, setPasswords] = useState({
    current: 'password123',
    new: 'newpass123',
    confirm: 'newpass123',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Password updated successfully!')
  }

  const handleRevoke = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    showToast(`Session on "${name}" has been revoked.`)
  }

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out of all other sessions?')) {
      setSessions((prev) => prev.filter((s) => s.isCurrent))
      showToast('Logged out of all other active sessions.')
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Change Password</h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
          <div className="space-y-3 max-w-sm">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                New Password
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Update Password
          </button>
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