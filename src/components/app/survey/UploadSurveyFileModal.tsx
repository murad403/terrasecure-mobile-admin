"use client"
import React, { useState } from 'react'
import { X, UploadCloud, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSurveyUploadFileMutation } from '@/redux/features/survey/survey.api'

interface UploadSurveyFileModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: number | string | null
}

const UploadSurveyFileModal: React.FC<UploadSurveyFileModalProps> = ({
  isOpen,
  onClose,
  surveyId,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploadFile, { isLoading }] = useSurveyUploadFileMutation()

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyId) {
      toast.error('Survey ID is required.')
      return
    }
    if (!file) {
      toast.warning('Please select a GIS or survey file to upload.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadFile({
        surveyId,
        data: formData,
      }).unwrap()

      toast.success(res.message || 'Survey file uploaded successfully!')
      setFile(null)
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload survey file.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-button-color/10 flex items-center justify-center text-button-color font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Upload GIS / Survey File</h2>
              <p className="text-[11px] text-slate-500">Attach GeoJSON or SHP survey file to Survey #{surveyId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select File</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-button-color/60 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center transition-all cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".geojson,.json,.shp,.zip,.kml"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <UploadCloud className="w-8 h-8 text-slate-400" />
                {file ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-button-color bg-button-color/10 px-3 py-1.5 rounded-lg">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-52">{file.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-slate-400">GeoJSON, Shapefile (.shp / .zip), KML</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload File</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadSurveyFileModal
