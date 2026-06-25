"use client"
import React, { useState } from 'react'
import { Database, Upload, Download, RotateCcw, Trash2, Calendar, FileType } from 'lucide-react'

interface BackupLog {
  id: string;
  filename: string;
  size: string;
  date: string;
}

const initialBackups: BackupLog[] = [
  {
    id: 'b1',
    filename: 'db_backup_20260625.json',
    size: '4.8 MB',
    date: '25 Jun 2026 09:30',
  },
  {
    id: 'b2',
    filename: 'db_backup_20260618.json',
    size: '4.7 MB',
    date: '18 Jun 2026 14:15',
  },
  {
    id: 'b3',
    filename: 'db_backup_20260611.json',
    size: '4.5 MB',
    date: '11 Jun 2026 11:45',
  },
]

const BackupRestorePage = () => {
  const [backups, setBackups] = useState<BackupLog[]>(initialBackups)
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
    const month = pad(now.getMonth() + 1)
    const day = pad(now.getDate())
    const hour = pad(now.getHours())
    const min = pad(now.getMinutes())
    
    // Formatting date string: e.g. "25 Jun 2026 09:35"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${day} ${months[now.getMonth()]} ${year} ${hour}:${min}`
    
    const newBackup: BackupLog = {
      id: `b-${Date.now()}`,
      filename: `db_backup_${year}${month}${day}_${hour}${min}.json`,
      size: '4.8 MB',
      date: dateStr,
    }

    setBackups((prev) => [newBackup, ...prev])
    showToast('Database backup file created successfully!')
  }

  const handleRestore = (filename: string) => {
    if (confirm(`Are you sure you want to restore the system databases to "${filename}"? All current data will be overwritten.`)) {
      showToast(`System databases restored to "${filename}" successfully!`)
    }
  }

  const handleDelete = (id: string, filename: string) => {
    if (confirm(`Are you sure you want to delete the backup file "${filename}"?`)) {
      setBackups((prev) => prev.filter((b) => b.id !== id))
      showToast('Backup file deleted.')
    }
  }

  const handleUploadRestore = () => {
    showToast('Upload dialog opened. Please select a valid .sql or .json backup file.')
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create Backup */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-none">Create Backup</h3>
            <p className="text-[10px] text-gray-400 font-light mt-1.5 leading-normal">
              Back up GIS maps, parcels database, user listings, and system configurations.
            </p>
          </div>
          <button
            onClick={handleCreateBackup}
            className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start"
          >
            <Database size={13} />
            Create New Backup
          </button>
        </div>

        {/* Restore System */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-none">Restore System</h3>
            <p className="text-[10px] text-gray-400 font-light mt-1.5 leading-normal">
              Restore database from a previous backup file (.sql or .json).
            </p>
          </div>
          <button
            onClick={handleUploadRestore}
            className="border border-gray-200 hover:bg-gray-55 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start bg-white"
          >
            <Upload size={13} />
            Restore from File
          </button>
        </div>
      </div>

      {/* Backup History Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 leading-none">Backup History</h3>

        <div className="divide-y divide-gray-50 pt-1">
          {backups.length > 0 ? (
            backups.map((log) => (
              <div key={log.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-xl shrink-0 text-gray-400">
                    <FileType size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{log.filename}</span>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-light mt-0.5">
                      <span>{log.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Calendar size={10} />
                        {log.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Download */}
                  <button
                    onClick={() => showToast(`Downloading "${log.filename}"...`)}
                    className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors cursor-pointer"
                    title="Download Backup"
                  >
                    <Download size={14} />
                  </button>

                  {/* Restore */}
                  <button
                    onClick={() => handleRestore(log.filename)}
                    className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors cursor-pointer"
                    title="Restore System to this Backup"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(log.id, log.filename)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                    title="Delete Backup File"
                  >
                    <Trash2 size={14} />
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