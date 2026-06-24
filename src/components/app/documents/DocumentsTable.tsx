"use client"
import React from 'react'
import { FileText, Image as ImageIcon, Check, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type DocumentRecord } from './DocumentsPage'

interface DocumentsTableProps {
  documents: DocumentRecord[]
  selectedIds: string[]
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
  onUpdateStatus: (id: string, status: 'Approved' | 'Rejected') => void
}

const getFileIcon = (name: string) => {
  if (name.toLowerCase().endsWith('.pdf')) {
    return <FileText className="w-4 h-4 text-rose-500 shrink-0" />
  }
  return <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />
}

const DocumentsTable = ({
  documents,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onUpdateStatus
}: DocumentsTableProps) => {
  const isAllSelected = documents.length > 0 && documents.every(doc => selectedIds.includes(doc.id))
  const isSomeSelected = documents.length > 0 && documents.some(doc => selectedIds.includes(doc.id)) && !isAllSelected

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white select-none">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/60 border-b border-slate-100">
            {/* Checkbox Header */}
            <th className="py-4 px-5 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isSomeSelected
                  }
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 border-slate-350 rounded text-[#1b5e20] focus:ring-[#1b5e20]/20 cursor-pointer"
              />
            </th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DOCUMENT NAME</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">TYPE</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">PARCEL</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">OWNER</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">STATUS</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">DATE</th>
            <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {documents.length > 0 ? (
            documents.map((item) => {
              const isChecked = selectedIds.includes(item.id)
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-slate-50/20 transition-colors",
                    isChecked && "bg-emerald-50/20 hover:bg-emerald-50/30"
                  )}
                >
                  {/* Checkbox */}
                  <td className="py-4 px-5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => onSelectOne(item.id, e.target.checked)}
                      className="w-4 h-4 border-slate-350 rounded text-[#1b5e20] focus:ring-[#1b5e20]/20 cursor-pointer"
                    />
                  </td>

                  {/* Document Name */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      {getFileIcon(item.name)}
                      <span className="cursor-pointer hover:text-blue-600 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-650">
                    {item.type}
                  </td>

                  {/* Parcel ID Link */}
                  <td className="py-4 px-5">
                    <span className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                      {item.parcelId}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-700">
                    {item.ownerName}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold block w-fit whitespace-nowrap",
                        item.status === 'Approved' && 'bg-emerald-50 text-emerald-600 border border-emerald-100/50',
                        item.status === 'Pending' && 'bg-amber-50 text-amber-600 border border-amber-100/50',
                        item.status === 'Rejected' && 'bg-rose-50 text-rose-600 border border-rose-100/50'
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-5 text-sm font-semibold text-slate-505">
                    {item.date}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Approve button */}
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, 'Approved')}
                        className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      {/* Reject button */}
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, 'Rejected')}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Share / Upload button */}
                      <button
                        type="button"
                        onClick={() => alert(`Sharing or viewing file: ${item.name}`)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                        title="Share / View"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-400">
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DocumentsTable