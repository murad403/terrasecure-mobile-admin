"use client"
import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateRegistrationMutation } from '@/redux/features/registrations/registration.api'
import { useUploadFileMutation } from '@/redux/features/profile/profile.api'
import { toast } from 'sonner'
import formatFileSize from '@/utils/formatFileSize'
import LocationPicker, { type LocationValue } from '@/components/shared/LocationPicker'
import type {
  LandParcelOwnershipType,
  LandParcelOwnershipStatus,
  LandParcelDocumentType,
} from '@/redux/features/registrations/registration.type'

interface RegistrantInput {
  ownerName: string
  ownerPhone: string
  sharePercentage: number | string
  ownershipType: LandParcelOwnershipType
  status: LandParcelOwnershipStatus
}

interface UploadedDocument {
  mediaId: string
  name: string
  size?: number
  docType: LandParcelDocumentType
  file?: File
}

interface AddRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const documentTypeOptions: { label: string; value: LandParcelDocumentType }[] = [
  { label: 'Title Deed', value: 'TITLE_DEED' },
  { label: 'Survey Plan', value: 'SURVEY_PLAN' },
  { label: 'National ID', value: 'NATIONAL_ID' },
  { label: 'Tax Receipt', value: 'TAX_RECEIPT' },
  { label: 'Court Order', value: 'COURT_ORDER' },
  { label: 'Consent Letter', value: 'CONSENT_LETTER' },
  { label: 'Sale Agreement', value: 'SALE_AGREEMENT' },
  { label: 'Other', value: 'OTHER' },
]

const AddRegistrationModal: React.FC<AddRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [createRegistration, { isLoading }] = useCreateRegistrationMutation()
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()

  const [location, setLocation] = useState<LocationValue>({})

  const [areaSqm, setAreaSqm] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [submittedAt, setSubmittedAt] = useState<string>(new Date().toISOString().slice(0, 16))
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([])

  const [registrants, setRegistrants] = useState<RegistrantInput[]>([
    {
      ownerName: '',
      ownerPhone: '',
      sharePercentage: 100,
      ownershipType: 'PRIMARY',
      status: 'DRAFT',
    },
  ])

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

  if (!isOpen) return null

  const handleAddRegistrant = () => {
    const currentTotal = registrants.reduce(
      (sum, reg) => sum + (Number(reg.sharePercentage) || 0),
      0
    )
    const remaining = Math.max(0, 100 - currentTotal)

    setRegistrants((prev) => [
      ...prev,
      {
        ownerName: '',
        ownerPhone: '',
        sharePercentage: remaining > 0 ? remaining : '',
        ownershipType: 'CO_OWNER',
        status: 'DRAFT',
      },
    ])
  }

  const handleRemoveRegistrant = (index: number) => {
    if (registrants.length === 1) {
      toast.error('At least one registrant is required.')
      return
    }
    setRegistrants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegistrantChange = <K extends keyof RegistrantInput>(
    index: number,
    field: K,
    value: RegistrantInput[K]
  ) => {
    setRegistrants((prev) =>
      prev.map((reg, i) => (i === index ? { ...reg, [field]: value } : reg))
    )
  }

  const totalSharePercentage = registrants.reduce(
    (sum, reg) => sum + (Number(reg.sharePercentage) || 0),
    0
  )

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileList = Array.from(files)
    const toastId = toast.loading(`Uploading ${fileList.length} file(s)...`)

    try {
      const uploaded: UploadedDocument[] = []
      for (const file of fileList) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await uploadFile(formData).unwrap()
        if (res.data?.id) {
          uploaded.push({
            mediaId: res.data.id,
            name: file.name,
            size: file.size,
            docType: 'OTHER',
            file,
          })
        }
      }

      if (uploaded.length > 0) {
        setUploadedDocs((prev) => [...prev, ...uploaded])
        toast.success(`${uploaded.length} file(s) uploaded successfully.`, { id: toastId })
      } else {
        toast.error('Failed to upload file(s).', { id: toastId })
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload file(s).', { id: toastId })
    } finally {
      e.target.value = ''
    }
  }

  const handleDocTypeChange = (index: number, docType: LandParcelDocumentType) => {
    setUploadedDocs((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, docType } : doc))
    )
  }

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (totalSharePercentage > 100) {
      toast.error(`Total share percentage across all registrants combined (${totalSharePercentage}%) cannot exceed 100%.`)
      return
    }

    for (let i = 0; i < registrants.length; i++) {
      const reg = registrants[i]
      if (!reg.ownerName.trim()) {
        toast.error(`Registrant #${i + 1} owner name is required.`)
        return
      }
      if (!reg.ownerPhone.trim()) {
        toast.error(`Registrant #${i + 1} phone number is required.`)
        return
      }
    }

    try {
      const documentsList = uploadedDocs.map((doc) => ({
        mediaId: doc.mediaId,
        docType: doc.docType,
      }))

      const hasLocationData = Boolean(
        location && (
          location.addressLine1 ||
          location.addressLine2 ||
          location.city ||
          location.state ||
          location.country ||
          location.zipCode ||
          location.latitude !== undefined ||
          location.longitude !== undefined ||
          location.remarks ||
          location.note
        )
      )

      const payload = {
        location: hasLocationData ? {
          remarks: location?.remarks || undefined,
          latitude: location?.latitude,
          longitude: location?.longitude,
          addressLine1: location?.addressLine1 || undefined,
          addressLine2: location?.addressLine2 || undefined,
          country: location?.country || undefined,
          state: location?.state || undefined,
          city: location?.city || undefined,
          zipCode: location?.zipCode || undefined,
          note: location?.note || undefined,
        } : undefined,
        areaSqm: areaSqm ? Number(areaSqm) : undefined,
        notes: notes ? `<p>${notes}</p>` : undefined,
        submittedAt: new Date(submittedAt).toISOString(),
        registrants: registrants.map((r) => ({
          ownerName: r.ownerName,
          ownerPhone: r.ownerPhone,
          sharePercentage: r.sharePercentage === '' ? 0 : Number(r.sharePercentage),
          ownershipType: r.ownershipType,
          status: r.status,
        })),
        documents: documentsList.length > 0 ? documentsList : undefined,
      }

      await createRegistration(payload).unwrap()
      toast.success('Land parcel registration created successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create registration.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">New Registration</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Submit a new land parcel registration with location, registrants & documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Location Picker Section at the top */}
          <LocationPicker value={location} onChange={setLocation} />

          {/* General Information Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              Parcel Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="areaSqm" className="text-xs font-bold text-slate-700">
                  Area (sqm)
                </Label>
                <Input
                  id="areaSqm"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500.5"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="submittedAt" className="text-xs font-bold text-slate-700">
                  Submission Date & Time
                </Label>
                <Input
                  id="submittedAt"
                  type="datetime-local"
                  value={submittedAt}
                  onChange={(e) => setSubmittedAt(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
                Notes
              </Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Land parcel description or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:outline-none focus:ring-2 focus:ring-button-color/20 font-semibold"
              />
            </div>

            {/* File Upload Dropzone */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Attached Documents
              </Label>
              <input
                id="registration-file-upload"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor="registration-file-upload"
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-button-color rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center group ${isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">
                  {isUploading ? 'Uploading files...' : 'Click to upload documents'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">
                  Supports PDF, PNG, JPG, DOC (Max 10MB each)
                </span>
              </label>

              {/* Uploaded File List with Document Type Selector */}
              {uploadedDocs.length > 0 && (
                <div className="space-y-2 pt-2">
                  {uploadedDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs gap-3"
                    >
                      <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                        {doc.size && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            ({formatFileSize(doc.size)})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <Select
                          value={doc.docType}
                          onValueChange={(val: LandParcelDocumentType) =>
                            handleDocTypeChange(idx, val)
                          }
                        >
                          <SelectTrigger className="w-36 bg-white text-xs h-8">
                            <SelectValue placeholder="Doc Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors shrink-0"
                          title="Remove Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Registrants Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  Registrants / Owners
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total share percentage: {' '}
                  <span
                    className={
                      totalSharePercentage > 100
                        ? 'text-red-600 font-bold'
                        : 'text-emerald-600 font-bold'
                    }
                  >
                    {totalSharePercentage}% / 100%
                  </span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRegistrant}
                className="w-auto flex items-center gap-1.5 text-xs font-bold text-button-color border-button-color/30 hover:bg-button-color/5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Registrant</span>
              </Button>
            </div>

            <div className="space-y-4">
              {registrants.map((reg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-bold text-slate-700">
                      Registrant #{idx + 1}
                    </span>
                    {registrants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRegistrant(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove Registrant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Owner Name *</Label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={reg.ownerName}
                        onChange={(e) =>
                          handleRegistrantChange(idx, 'ownerName', e.target.value)
                        }
                        className="text-xs font-semibold bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Owner Phone (E.164) *</Label>
                      <Input
                        type="text"
                        placeholder="+1234567890"
                        value={reg.ownerPhone}
                        onChange={(e) =>
                          handleRegistrantChange(idx, 'ownerPhone', e.target.value)
                        }
                        className="text-xs font-semibold bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Share %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="50"
                        value={reg.sharePercentage}
                        onChange={(e) => {
                          const val = e.target.value
                          handleRegistrantChange(
                            idx,
                            'sharePercentage',
                            val === '' ? '' : Number(val)
                          )
                        }}
                        className="text-xs font-semibold bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Ownership Type</Label>
                      <Select
                        value={reg.ownershipType}
                        onValueChange={(val: LandParcelOwnershipType) =>
                          handleRegistrantChange(idx, 'ownershipType', val)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIMARY">PRIMARY</SelectItem>
                          <SelectItem value="CO_OWNER">CO_OWNER</SelectItem>
                          <SelectItem value="HEIR">HEIR</SelectItem>
                          <SelectItem value="LEGAL_REPRESENTATIVE">LEGAL_REPRESENTATIVE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Status</Label>
                      <Select
                        value={reg.status}
                        onValueChange={(val: LandParcelOwnershipStatus) =>
                          handleRegistrantChange(idx, 'status', val)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="UNDER_VERIFICATION">UNDER_VERIFICATION</SelectItem>
                          <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                          <SelectItem value="RESERVED">RESERVED</SelectItem>
                          <SelectItem value="CLOSED">CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-auto px-5 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-auto px-6 text-xs font-bold"
            >
              {isLoading ? 'Creating...' : isUploading ? 'Uploading...' : 'Create Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRegistrationModal