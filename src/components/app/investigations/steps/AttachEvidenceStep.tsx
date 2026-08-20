"use client"
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, Loader2, FileText, CheckCircle2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useUploadFileMutation } from '@/redux/features/profile/profile.api'
import { useAttachEvidenceMutation } from '@/redux/features/investigations/investigations.api'
import {
  attachEvidenceSchema,
  type AttachEvidenceFormValues,
} from '@/validation/investigation.validation'

interface AttachEvidenceStepProps {
  investigationId: number | string
  onSuccess?: () => void
}

export const AttachEvidenceStep = ({
  investigationId,
  onSuccess,
}: AttachEvidenceStepProps) => {
  const [uploadedFile, setUploadedFile] = useState<{ id: string; name: string; url?: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadFile] = useUploadFileMutation()
  const [attachEvidence, { isLoading }] = useAttachEvidenceMutation()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AttachEvidenceFormValues>({
    resolver: zodResolver(attachEvidenceSchema),
    defaultValues: {
      mediaId: '',
      description: '',
    },
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadFile(formData).unwrap()
      if (res.data) {
        setUploadedFile({ id: res.data.id, name: file.name, url: res.data.url })
        setValue('mediaId', res.data.id, { shouldValidate: true })
        toast.success('File uploaded! Click Attach Evidence to complete.')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload evidence file.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null)
    setValue('mediaId', '', { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: AttachEvidenceFormValues) => {
    try {
      const res = await attachEvidence({
        investigationId,
        data: {
          mediaId: values.mediaId,
          description: values.description?.trim() || undefined,
        },
      }).unwrap()

      toast.success(res.message || 'Evidence attached successfully!')
      setUploadedFile(null)
      reset({ mediaId: '', description: '' })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to attach evidence.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4 text-button-color" />
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Step 3: Attach Evidence Media / Document
        </h4>
      </div>

      {/* File Upload Trigger */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-700 block">
          Upload Evidence File <span className="text-rose-500">*</span>
        </Label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 cursor-pointer transition-colors text-center select-none"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-button-color animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <span className="text-xs font-bold text-slate-700">
            {uploadedFile ? 'Change evidence file' : 'Click to browse & upload evidence'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Images (JPG, PNG) or document files
          </span>
        </div>

        {/* Uploaded File Preview Badge */}
        {uploadedFile && (
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {uploadedFile.url && (uploadedFile.url.match(/\.(jpeg|jpg|png|webp|gif)$/i) || uploadedFile.url.includes('/images/')) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={uploadedFile.url}
                  alt={uploadedFile.name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-button-color flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-900 truncate max-w-60">
                  {uploadedFile.name}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Ready to attach
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveUploadedFile}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {errors.mediaId && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.mediaId.message}</p>
        )}
      </div>


      {/* Optional Description */}
      <div className="space-y-1.5">
        <Label htmlFor="evidenceDesc" className="text-xs font-bold text-slate-700 block">
          Evidence Remarks / Description (Optional)
        </Label>
        <textarea
          id="evidenceDesc"
          placeholder="e.g. Official survey report or photograph of disputed boundary"
          {...register('description')}
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-17.5 leading-relaxed resize-none"
        />
        {errors.description && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || isUploading || !uploadedFile}
        className="w-full text-xs font-bold py-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Attaching Evidence...</span>
          </div>
        ) : (
          'Attach Evidence'
        )}
      </Button>
    </form>
  )
}

export default AttachEvidenceStep
