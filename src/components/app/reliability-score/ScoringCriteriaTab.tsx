import React, { useState } from 'react'
import { Criterion } from './ReliabilityScorePage'
import { Check, X, Pencil, Save } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CriteriaTabProps {
  criteria: Criterion[];
  onUpdateCriterion: (updated: Criterion) => void;
}

const ScoringCriteriaTab = ({ criteria, onUpdateCriterion }: CriteriaTabProps) => {
  // Pre-select 'c1' (Title Deed Present) to be in edit mode by default to match the first mockup screenshot.
  const [editingId, setEditingId] = useState<string | null>('c1')
  const [editName, setEditName] = useState('Title Deed Present')
  const [editDesc, setEditDesc] = useState('Original title deed or legal document present and verified')
  const [editWeight, setEditWeight] = useState<number>(25)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const startEditing = (criterion: Criterion) => {
    setEditingId(criterion.id)
    setEditName(criterion.name)
    setEditDesc(criterion.description)
    setEditWeight(criterion.weight)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const saveEditing = (id: string) => {
    const original = criteria.find((c) => c.id === id)
    if (original) {
      onUpdateCriterion({
        ...original,
        name: editName,
        description: editDesc,
        weight: Number(editWeight) || 0,
      })
    }
    setEditingId(null)
    showToast('Criterion updated locally!')
  }

  const handleGlobalSave = () => {
    showToast('Reliability scoring configuration saved successfully!')
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const categories: ('Documents' | 'GIS / GPS' | 'Legal' | 'History')[] = [
    'Documents',
    'GIS / GPS',
    'Legal',
    'History',
  ]

  // Category badge styles lookup
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Documents':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-100',
          progressBar: 'bg-blue-500',
          text: 'text-blue-700',
        }
      case 'GIS / GPS':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          progressBar: 'bg-emerald-600',
          text: 'text-emerald-700',
        }
      case 'Legal':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-100',
          progressBar: 'bg-purple-600',
          text: 'text-purple-700',
        }
      case 'History':
        return {
          badge: 'bg-orange-50 text-orange-700 border-orange-100',
          progressBar: 'bg-orange-500',
          text: 'text-orange-700',
        }
      default:
        return {
          badge: 'bg-gray-50 text-gray-700 border-gray-100',
          progressBar: 'bg-gray-500',
          text: 'text-gray-700',
        }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-md z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">Scoring Criteria Configuration</h2>
          <p className="text-[11px] text-gray-500 mt-1 font-light">
            Weights must sum to 100%. Click the edit icon to adjust.
          </p>
        </div>
        <Button
          onClick={handleGlobalSave}
          className='w-auto py-2'
        >
          <Save size={14} />
          Save
        </Button>
      </div>

      {/* Categories and List */}
      <div className="divide-y divide-gray-50">
        {categories.map((category) => {
          const catCriteria = criteria.filter((c) => c.category === category)
          const catWeightSum = catCriteria.reduce((sum, c) => sum + c.weight, 0)
          const styles = getCategoryStyles(category)

          return (
            <div key={category} className="p-5">
              {/* Category Header */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${styles.badge}`}>
                  {catWeightSum}%
                </span>
              </div>

              {/* Criteria List */}
              <div className="space-y-4">
                {catCriteria.map((criterion) => {
                  const isEditing = editingId === criterion.id

                  if (isEditing) {
                    return (
                      <div
                        key={criterion.id}
                        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 py-2 animate-fade-in"
                      >
                        {/* Name Input */}
                        <div className="w-full md:w-1/4">
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                          />
                        </div>

                        {/* Description Input */}
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Description"
                          />
                        </div>

                        {/* Weight & Action Panel */}
                        <div className="flex items-center space-x-3 self-end md:self-auto min-w-[120px] justify-end">
                          <div className="flex items-center space-x-1">
                            <Input
                              type="number"
                              value={editWeight}
                              onChange={(e) => setEditWeight(Number(e.target.value) || 0)}
                            />
                            <span className="text-xs text-gray-500 font-medium">%</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => saveEditing(criterion.id)}
                              className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-50 rounded transition-colors"
                              title="Confirm"
                            >
                              <Check size={16} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Cancel"
                            >
                              <X size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={criterion.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-50 last:border-0 gap-3"
                    >
                      {/* Left: Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-semibold text-gray-800">{criterion.name}</h4>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-semibold tracking-wide border uppercase ${styles.badge}`}>
                            {criterion.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-light mt-0.5">{criterion.description}</p>
                      </div>

                      {/* Right: Progress bar & edit button */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4 min-w-[150px]">
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-2 flex-1 sm:flex-none">
                          <div className="w-20 md:w-28 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${styles.progressBar} rounded-full transition-all duration-500`}
                              style={{ width: `${criterion.weight}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8 text-right">
                            {criterion.weight}%
                          </span>
                        </div>

                        {/* Pencil Edit button */}
                        <button
                          onClick={() => startEditing(criterion)}
                          className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScoringCriteriaTab