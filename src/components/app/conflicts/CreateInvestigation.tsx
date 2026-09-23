"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, ShieldAlert } from 'lucide-react'
import {
  ConflictParcel,
  LandInvestigationPriorityLevel,
  CreateInvestigationForConflictPayload,
} from '@/redux/features/conflicts/conflicts.type'
import {
  createInvestigationForConflictSchema,
  CreateInvestigationForConflictFormValues,
} from '@/validation/investigation.validation'
import { useCreateInvestigationForConflictMutation } from '@/redux/features/conflicts/conflicts.api'
import { useRetrieveUsersQuery } from '@/redux/features/user/user.api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CreateInvestigationProps {
  isOpen: boolean
  onClose: () => void
  conflict: ConflictParcel | null
  onCreateInvestigation?: (conflictId: number) => void
}

export const CreateInvestigation: React.FC<CreateInvestigationProps> = ({
  isOpen,
  onClose,
  conflict,
  onCreateInvestigation,
}) => {
  const [createInvestigation, { isLoading: isSubmitting }] = useCreateInvestigationForConflictMutation()

  // Fetch users for investigator assignment dropdown
  const { data: usersResponse } = useRetrieveUsersQuery({ limit: 100 }, { skip: !isOpen })
  const userList = usersResponse?.data || []

  const conflictingSlugs = conflict?.conflicts
    ?.map((c) => c.conflictingParcel?.slug)
    .filter(Boolean) || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateInvestigationForConflictFormValues>({
    resolver: zodResolver(createInvestigationForConflictSchema),
    defaultValues: {
      title: '',
      description: '',
      priorityLevel: 'HIGH',
      conflictKind: 'BOUNDARY_DISPUTE',
      conflictingParcelId: undefined,
      investigatorId: undefined,
      overlapAreaSqm: undefined,
    },
  })

  const currentPriority = watch('priorityLevel')

  useEffect(() => {
    if (conflict) {
      const firstConflicting = conflict.conflicts?.[0]?.conflictingParcel
      const conflictingSlug = firstConflicting?.slug || conflictingSlugs[0] || ''

      reset({
        title: conflictingSlug
          ? `Boundary dispute between ${conflict.slug} and ${conflictingSlug}`
          : `Boundary dispute for ${conflict.slug}`,
        description: `<p>The boundary of parcel ${conflict.slug} (${conflict.parcelCode}) conflicts with parcel(s): ${
          conflictingSlugs.join(', ') || 'N/A'
        }. Further field verification required.</p>`,
        priorityLevel: 'HIGH',
        conflictKind: 'BOUNDARY_DISPUTE',
        conflictingParcelId: firstConflicting?.id,
        overlapAreaSqm: conflict.areaSqm || undefined,
        investigatorId: undefined,
      })
    }
  }, [conflict, reset])

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !conflict) return null

  const onSubmit = async (values: CreateInvestigationForConflictFormValues) => {
    try {
      const payload: CreateInvestigationForConflictPayload = {
        title: values.title?.trim() || undefined,
        description: values.description?.trim() || undefined,
        priorityLevel: values.priorityLevel,
        conflictKind: values.conflictKind,
        conflictingParcelId:
          values.conflictingParcelId && !isNaN(values.conflictingParcelId)
            ? Number(values.conflictingParcelId)
            : undefined,
        investigatorId:
          values.investigatorId && !isNaN(values.investigatorId)
            ? Number(values.investigatorId)
            : undefined,
        overlapAreaSqm:
          values.overlapAreaSqm !== undefined &&
          values.overlapAreaSqm !== null &&
          !isNaN(values.overlapAreaSqm)
            ? Number(values.overlapAreaSqm)
            : undefined,
      }

      const res = await createInvestigation({
        parcelId: conflict.id,
        data: payload,
      }).unwrap()

      toast.success(res?.message || 'Investigation created successfully!')

      if (onCreateInvestigation) {
        onCreateInvestigation(conflict.id)
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create investigation for conflict.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-115 md:w-130 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Create Investigation
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Initiate formal field investigation for {conflict.slug}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Conflict Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Target Parcel Slug</span>
              <span className="text-slate-900 font-mono font-extrabold">{conflict.slug}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Parcel Code:</span>
              <span className="font-extrabold text-blue-600 font-mono">{conflict.parcelCode}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Conflicting Slug(s):</span>
              <span className="font-bold text-slate-800">{conflictingSlugs.join(', ') || 'None'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Status & Score:</span>
              <span className="font-bold text-emerald-700">
                {conflict.status} ({conflict.reliabilityScore}% reliability)
              </span>
            </div>
          </div>

          {/* Investigation Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Investigation Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Boundary dispute between Parcel A-1023 and Parcel A-1045"
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.title.message}</p>
            )}
          </div>

          {/* Conflict Kind / Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Conflict Kind</label>
            <select
              {...register('conflictKind')}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BOUNDARY_DISPUTE">Boundary Dispute</option>
              <option value="OVERLAP">Overlap</option>
              <option value="DUPLICATE">Duplicate Registration</option>
              <option value="INVALID_GEOMETRY">Invalid Geometry</option>
            </select>
            {errors.conflictKind && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.conflictKind.message}</p>
            )}
          </div>

          {/* Priority Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as LandInvestigationPriorityLevel[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setValue('priorityLevel', p, { shouldValidate: true })}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center",
                    currentPriority === p
                      ? p === 'HIGH'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 font-extrabold shadow-sm'
                        : p === 'MEDIUM'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 font-extrabold shadow-sm'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            {errors.priorityLevel && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.priorityLevel.message}</p>
            )}
          </div>

          {/* Conflicting Parcel Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Conflicting Parcel Target</label>
            <select
              {...register('conflictingParcelId', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Single-Parcel Issue)</option>
              {conflict.conflicts?.map((cItem) => {
                const cp = cItem.conflictingParcel
                if (!cp) return null
                return (
                  <option key={cItem.id} value={cp.id}>
                    {cp.slug} ({cp.parcelCode})
                  </option>
                )
              })}
            </select>
            {errors.conflictingParcelId && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.conflictingParcelId.message}</p>
            )}
          </div>

          {/* Lead Investigator Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Assigned Investigator (Optional)</label>
            <select
              {...register('investigatorId', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email} (ID: {user.id})
                </option>
              ))}
            </select>
            {errors.investigatorId && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.investigatorId.message}</p>
            )}
          </div>

          {/* Computed Overlap Area (sqm) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Overlap Area (sqm)</label>
            <input
              type="number"
              step="any"
              min={0}
              {...register('overlapAreaSqm', { valueAsNumber: true })}
              placeholder="e.g. 120.5"
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.overlapAreaSqm && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.overlapAreaSqm.message}</p>
            )}
          </div>

          {/* Description & Scope */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Description & Field Instructions</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Enter instructions for the field investigator..."
              className="w-full p-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{errors.description.message}</p>
            )}
          </div>

          {/* Submit / Cancel Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Investigation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvestigation