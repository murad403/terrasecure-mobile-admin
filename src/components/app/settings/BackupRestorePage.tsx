"use client"
import React, { useState } from 'react'
import { Database, Download, Check, X, ChevronDown } from 'lucide-react'

interface BackupLog {
  id: string;
  date: string;
  type: 'Automatic' | 'Manual';
  size: string;
  status: 'Success' | 'Failed';
}

const initialBackups: BackupLog[] = [
  {
    id: 'b1',
    date: '11 Jun 2025 03:00 AM',
    type: 'Automatic',
    size: '2.4 GB',
    status: 'Success',
  },
  {
    id: 'b2',
    date: '10 Jun 2025 03:00 AM',
    type: 'Automatic',
    size: '2.3 GB',
    status: 'Success',
  },
  {
    id: 'b3',
    date: '8 Jun 2025 11:30 AM',
    type: 'Manual',
    size: '2.3 GB',
    status: 'Success',
  },
  {
    id: 'b4',
    date: '9 Jun 2025 03:00 AM',
    type: 'Automatic',
    size: '2.2 GB',
    status: 'Success',
  },
  {
    id: 'b5',
    date: '7 Jun 2025 03:00 AM',
    type: 'Automatic',
    size: '2.1 GB',
    status: 'Failed',
  },
]

const BackupRestorePage = () => {
  const [backups, setBackups] = useState<BackupLog[]>(initialBackups)
  const [schedule, setSchedule] = useState('Daily')
  const [retention, setRetention] = useState('30 days')
  const [autoEnabled, setAutoEnabled] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleCreateBackup = () => {
    const now = new Date()
    const pad = (num: number) => String(num).padStart(2, '0')
    
    const year = now.getFullYear()
    const day = pad(now.getDate())
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthStr = months[now.getMonth()]
    
    let hours = now.getHours()
    const minutes = pad(now.getMinutes())
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const hourStr = pad(hours)
    
    const dateStr = `${day} ${monthStr} ${year} ${hourStr}:${minutes} ${ampm}`
    
    const newBackup: BackupLog = {
      id: `b-${Date.now()}`,
      date: dateStr,
      type: 'Manual',
      size: '2.4 GB',
      status: 'Success',
    }

    setBackups((prev) => [newBackup, ...prev])
    showToast('Manual database backup triggered successfully!')
  }

  const handleRestore = (dateStr: string) => {
    if (confirm(`Are you sure you want to restore the system databases to backup from "${dateStr}"? All current data will be overwritten.`)) {
      showToast(`System databases restored to backup from "${dateStr}" successfully!`)
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

      {/* Backup Status Outer Container */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight">Backup Status</h3>
        </div>

        {/* Horizontal Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Last Backup */}
          <div className="bg-[#ebfbf3] border border-[#d3f9e8] rounded-xl p-4.5 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="text-xs font-bold text-[#1b4332]">
              11 Jun 2025 03:00 AM
            </div>
            <div>
              <p className="text-[9px] text-[#4d9a74] font-bold uppercase tracking-wider leading-none">Last Backup</p>
              <p className="text-[10px] text-slate-650 font-medium mt-1 leading-none">Successful automatic backup</p>
            </div>
          </div>

          {/* Card 2: Total Backups */}
          <div className="bg-[#eef5fc] border border-[#d2e5f9] rounded-xl p-4.5 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="text-xs font-bold text-blue-800">
              47
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Total Backups</p>
              <p className="text-[10px] text-slate-650 font-medium mt-1 leading-none">43 automatic - 4 manual</p>
            </div>
          </div>

          {/* Card 3: Total Size */}
          <div className="bg-[#f7f3fd] border border-[#eeddf9] rounded-xl p-4.5 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="text-xs font-bold text-purple-800">
              98.2 GB
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Total Size</p>
              <p className="text-[10px] text-slate-655 font-medium mt-1 leading-none">across all backups</p>
            </div>
          </div>
        </div>

        {/* Schedule & Retention Controls */}
        <div className="space-y-4">
          {/* Automatic Backup Schedule */}
          <div className="border border-slate-100 bg-slate-50/20 hover:bg-slate-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">Automatic Backup Schedule</h4>
              <p className="text-[10px] text-slate-450">Daily at 03:00 AM WAT (Africa/Douala)</p>
            </div>
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <div className="relative">
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 pr-8 rounded-lg font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown size={12} />
                </div>
              </div>

              {/* Switch Toggle */}
              <button
                type="button"
                onClick={() => setAutoEnabled(!autoEnabled)}
                className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer flex items-center ${
                  autoEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                    autoEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Retention Policy */}
          <div className="border border-slate-100 bg-slate-50/20 hover:bg-slate-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">Retention Policy</h4>
              <p className="text-[10px] text-slate-450">Keep backups for 90 days, then auto-delete</p>
            </div>
            <div className="relative self-end sm:self-auto">
              <select
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 pr-8 rounded-lg font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="180 days">180 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <div>
          <button
            onClick={handleCreateBackup}
            className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border border-transparent"
          >
            <Database size={13} />
            Trigger Manual Backup
          </button>
        </div>
      </div>

      {/* Backup History Container */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 leading-none">Backup History</h3>
          <button
            onClick={() => showToast('Exporting backup logs...')}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm bg-white"
          >
            <Download size={13} />
            Export Log
          </button>
        </div>

        {/* Backups List */}
        <div className="divide-y divide-slate-50 pt-1">
          {backups.length > 0 ? (
            backups.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  {/* Status Indicator Icon */}
                  {log.status === 'Success' ? (
                    <div className="p-1 bg-[#10b981] text-white rounded shrink-0 flex items-center justify-center w-5 h-5 shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="p-1 bg-[#f43f5e] text-white rounded shrink-0 flex items-center justify-center w-5 h-5 shadow-sm">
                      <X size={12} strokeWidth={3} />
                    </div>
                  )}
                  
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {log.date}
                    </span>
                    <span className="text-[10px] text-slate-400 font-light mt-0.5 block">
                      {log.type} · {log.size}
                    </span>
                  </div>
                </div>

                {/* Actions/States */}
                <div className="flex items-center space-x-3 shrink-0">
                  {/* Status badge */}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                      log.status === 'Success'
                        ? 'bg-emerald-50 text-[#10b981] border-[#d1fae5]'
                        : 'bg-red-50 text-[#f43f5e] border-[#ffe4e6]'
                    }`}
                  >
                    {log.status}
                  </span>

                  {/* Restore Button (only if success) */}
                  {log.status === 'Success' && (
                    <button
                      onClick={() => handleRestore(log.date)}
                      className="bg-[#eff6ff] hover:bg-[#dbeafe] text-blue-600 border border-[#dbeafe] text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Restore
                    </button>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={() => showToast(`Downloading backup from ${log.date}...`)}
                    className="text-slate-400 hover:text-slate-650 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                    title="Download Backup"
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-gray-400 font-light">No backup files found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BackupRestorePage