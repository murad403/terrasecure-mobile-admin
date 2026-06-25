"use client"
import React, { useState } from 'react'
import { Save } from 'lucide-react'

const roles = ['Super Admin', 'Admin', 'Supervisor', 'Surveyor', 'Field Agent', 'Client']

interface PermissionGroup {
  name: string;
  items: string[];
}

const permissionGroups: PermissionGroup[] = [
  {
    name: 'Parcels',
    items: ['Block Parcel', 'Create Parcel', 'Edit Parcel', 'Delete Parcel', 'Publish Parcel', 'Block Parcel '],
  },
  {
    name: 'Registrations',
    items: ['View Registration', 'Submit Registration', 'Approve Registration', 'Reject Registration'],
  },
  {
    name: 'Users & Documents',
    items: ['View Users', 'Create User', 'Edit User', 'Delete User', 'Approve Documents'],
  },
  {
    name: 'GIS & Reports',
    items: ['View GIS Map', 'Draw Polygon', 'Edit Polygon', 'View Reports', 'Export Reports'],
  },
]

// Default active permissions matrix: Super Admin has everything, others have partial.
const getInitialMatrix = () => {
  const matrix: Record<string, Record<string, boolean>> = {}
  permissionGroups.forEach((group) => {
    group.items.forEach((item) => {
      matrix[item] = {}
      roles.forEach((role) => {
        // Super Admin has all permissions enabled
        if (role === 'Super Admin') {
          matrix[item][role] = true
        } else if (role === 'Admin') {
          // Admin has almost everything except delete
          matrix[item][role] = !item.includes('Delete')
        } else if (role === 'Supervisor') {
          // Supervisor has view, edit, approve
          matrix[item][role] = item.includes('View') || item.includes('Edit') || item.includes('Approve') || item.includes('Reject')
        } else if (role === 'Surveyor') {
          // Surveyor has GIS and draw
          matrix[item][role] = item.includes('GIS') || item.includes('Polygon') || item.includes('View')
        } else if (role === 'Field Agent') {
          // Field agent has GIS and submit
          matrix[item][role] = item.includes('GIS') || item.includes('Submit') || item.includes('View')
        } else {
          // Client has basic read/submit
          matrix[item][role] = item.includes('View') || item.includes('Submit')
        }
      })
    })
  })
  return matrix
}

const RolesPermissionsPage = () => {
  const [matrix, setMatrix] = useState(getInitialMatrix())
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All Roles')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleToggle = (permission: string, role: string) => {
    setMatrix((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission]?.[role],
      },
    }))
  }

  const handleSave = () => {
    setToastMessage('Role permissions updated successfully!')
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Role column highlighter filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
          Filter by Role (click to highlight column)
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedRoleFilter('All Roles')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
              selectedRoleFilter === 'All Roles'
                ? 'bg-[#1b4332] text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
            }`}
          >
            All Roles
          </button>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                selectedRoleFilter === role
                  ? 'bg-[#1b4332] text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-55'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Groups Matrix */}
      <div className="space-y-4">
        {permissionGroups.map((group) => (
          <div key={group.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Group Header Banner */}
            <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-2.5">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{group.name}</span>
            </div>

            {/* Table Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/10">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-1/3">
                      Permission
                    </th>
                    {roles.map((role) => {
                      const isHighlighted = selectedRoleFilter === role || selectedRoleFilter === 'All Roles'
                      return (
                        <th
                          key={role}
                          className={`px-3 py-3 text-[10px] font-bold text-center uppercase tracking-wider transition-colors ${
                            isHighlighted ? 'text-gray-900 bg-emerald-50/5' : 'text-gray-400'
                          }`}
                        >
                          {role}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {group.items.map((item, rowIdx) => (
                    <tr key={`${item}-${rowIdx}`} className="hover:bg-gray-50/40">
                      <td className="px-4 py-3 text-xs font-medium text-gray-700">{item.trim()}</td>
                      {roles.map((role) => {
                        const isChecked = !!matrix[item]?.[role]
                        const isHighlighted = selectedRoleFilter === role
                        return (
                          <td
                            key={role}
                            className={`px-3 py-2 text-center transition-colors ${
                              isHighlighted ? 'bg-emerald-50/20' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(item, role)}
                              className="w-4 h-4 rounded border-slate-350 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Action Trigger */}
      <button
        onClick={handleSave}
        className="bg-[#1b4332] hover:bg-[#143426] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
      >
        <Save size={13} />
        Save Permissions
      </button>
    </div>
  )
}

export default RolesPermissionsPage