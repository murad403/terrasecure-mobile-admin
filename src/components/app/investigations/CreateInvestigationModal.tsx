"use client"
import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, Loader2, Trash2, CheckCircle, FileText } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ParcelPicker } from '@/components/tools/ParcelPicker'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'
import { useUploadFileMutation } from '@/redux/features/profile/profile.api'
import { useCreateLandInvestigationMutation } from '@/redux/features/investigations/investigations.api'
import {
  createInvestigationSchema,
  type CreateInvestigationFormValues,
} from '@/validation/investigation.validation'
import { LandInvestigationKind, LandInvestigationPriorityLevel } from '@/enum'

interface CreateInvestigationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UploadedEvidence {
  id: string
  url: string
  name: string
}

const KIND_OPTIONS = (
  Object.keys(LandInvestigationKind) as LandInvestigationKind[]
).map((key) => ({
  label: key.replace(/_/g, ' '),
  value: LandInvestigationKind[key],
}))

const PRIORITY_OPTIONS = (
  Object.keys(LandInvestigationPriorityLevel) as LandInvestigationPriorityLevel[]
).map((key) => ({
  label: `${key} Priority`,
  value: LandInvestigationPriorityLevel[key],
}))


const CreateInvestigationModal = ({ isOpen, onClose }: CreateInvestigationModalProps) => {
  const [selectedParcels, setSelectedParcels] = useState<ParcelListItem[]>([])
  const [evidences, setEvidences] = useState<UploadedEvidence[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadFile] = useUploadFileMutation()
  const [createInvestigation, { isLoading: isCreating }] =
    useCreateLandInvestigationMutation()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateInvestigationFormValues>({
    resolver: zodResolver(createInvestigationSchema),
    defaultValues: {
      title: '',
      parcelSlug: '',
      kind: 'BOUNDARY_OVERLAP',
      priorityLevel: 'HIGH',
      description: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      reset({
        title: '',
        parcelSlug: '',
        kind: 'BOUNDARY_OVERLAP',
        priorityLevel: 'HIGH',
        description: '',
      })
      setSelectedParcels([])
      setEvidences([])
      setIsUploading(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, reset])

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadFile(formData).unwrap()
        if (res.data) {
          const mediaItem = res.data
          setEvidences((prev) => [
            ...prev,
            {
              id: mediaItem.id,
              url: mediaItem.url,
              name: file.name,
            },
          ])
        }
      }
      toast.success('Evidence file(s) uploaded successfully!')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload evidence file.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveEvidence = (id: string) => {
    setEvidences((prev) => prev.filter((item) => item.id !== id))
  }

  const onSubmit = async (values: CreateInvestigationFormValues) => {
    try {
      const payload = {
        title: values.title?.trim() || undefined,
        parcelSlug: values.parcelSlug.trim(),
        kind: values.kind,
        priorityLevel: values.priorityLevel,
        description: values.description?.trim() ? `<p>${values.description.trim()}</p>` : undefined,
        evidenceMediaIds: evidences.map((item) => item.id),
      }

      const res = await createInvestigation(payload).unwrap()
      toast.success(res.message || 'Land investigation created successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create land investigation.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="space-y-0.5 select-none">
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              Create Land Investigation
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              Open a new land dispute investigation case
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Wrapper */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4 select-none">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="caseTitle" className="text-xs font-bold text-slate-700">
              Investigation Title
            </Label>
            <Input
              id="caseTitle"
              placeholder="e.g. Boundary dispute on Parcel A-123"
              {...register('title')}
              className="font-semibold text-xs md:text-sm text-slate-900"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.title.message}</p>
            )}
          </div>

          {/* Parcel Selection using ParcelPicker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Select Related Parcel <span className="text-rose-500">*</span>
            </Label>
            <ParcelPicker
              value={selectedParcels}
              onChange={(parcels) => {
                setSelectedParcels(parcels)
                if (parcels.length > 0) {
                  const slug = parcels[0].slug || parcels[0].parcelCode || ''
                  setValue('parcelSlug', slug, { shouldValidate: true })
                } else {
                  setValue('parcelSlug', '', { shouldValidate: true })
                }
              }}
              type="radio"
              placeholder="Search and select parcel..."
            />
            {errors.parcelSlug && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.parcelSlug.message}</p>
            )}
          </div>

          {/* Two-Column Selects: Kind & Priority */}
          <div className="grid grid-cols-2 gap-3">
            {/* Kind */}
            <div className="space-y-1.5">
              <Label htmlFor="investigationKind" className="text-xs font-bold text-slate-700">
                Dispute Kind <span className="text-rose-500">*</span>
              </Label>
              <select
                id="investigationKind"
                {...register('kind')}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color transition-none leading-relaxed cursor-pointer"
              >
                {KIND_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.kind && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.kind.message}</p>
              )}
            </div>

            {/* Priority Level */}
            <div className="space-y-1.5">
              <Label htmlFor="priorityLevel" className="text-xs font-bold text-slate-700">
                Priority Level
              </Label>
              <select
                id="priorityLevel"
                {...register('priorityLevel')}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color transition-none leading-relaxed cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.priorityLevel && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.priorityLevel.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-bold text-slate-700">
              Description & Findings Context
            </Label>
            <textarea
              id="description"
              placeholder="Provide investigation details regarding overlapping boundaries, coordinate disputes..."
              {...register('description')}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-22.5 leading-relaxed resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.description.message}</p>
            )}
          </div>

          {/* Attach Evidence Files */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 block">
              Attach Evidence Media / Documents
            </Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer transition-colors text-center select-none"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-button-color animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              )}
              <span className="text-xs font-bold text-slate-600">
                {isUploading ? 'Uploading evidence...' : 'Click or drag files to attach evidence'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Images (PNG, JPG) or official evidence documents
              </span>
            </div>

            {/* List of uploaded evidence badges */}
            {evidences.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {evidences.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-medium"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={14} className="text-button-color shrink-0" />
                      <span className="truncate text-slate-800 font-semibold">{ev.name}</span>
                      <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(ev.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 w-1/2 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUploading}
              className="w-1/2 cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Investigation'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvestigationModal