"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addRegistrationSchema, type AddRegistrationFormValues } from '@/validation/registration.validation'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddRegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (data: AddRegistrationFormValues) => void
}

const AddRegistrationModal = ({ isOpen, onClose, onAdd }: AddRegistrationModalProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset
    } = useForm<AddRegistrationFormValues>({
        resolver: zodResolver(addRegistrationSchema) as any,
        defaultValues: {
            ownerName: '',
            nationalId: '',
            phone: '',
            city: 'Yaoundé',
            district: '',
            area: '' as any,
            submissionDate: new Date().toISOString().split('T')[0],
            notes: ''
        }
    })

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

    if (!isOpen) return null

    const onSubmit = (data: AddRegistrationFormValues) => {
        onAdd(data)
        reset()
        setSelectedFiles([])
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Dialog Card */}
            <div
                className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-base font-bold text-title">New Registration</h2>
                        <p className="text-xs font-semibold text-subtitle mt-0.5">Submit a new land registration request</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                        {/* Auto-assigned Banner */}
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs font-semibold text-emerald-700 leading-relaxed">
                            A new Registration ID will be auto-assigned upon submission.
                        </div>

                        {/* Applicant Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ownerName">Applicant Full Name</Label>
                            <Input
                                id="ownerName"
                                placeholder="e.g. Pierre Mballa"
                                {...register('ownerName')}
                            />
                            {errors.ownerName && (
                                <p className="text-xs text-destructive font-semibold mt-1">{errors.ownerName.message}</p>
                            )}
                        </div>

                        {/* Applicant National ID */}
                        <div className="space-y-1.5">
                            <Label htmlFor="nationalId">Applicant National ID</Label>
                            <Input
                                id="nationalId"
                                placeholder="e.g. NI-12847291"
                                {...register('nationalId')}
                            />
                            {errors.nationalId && (
                                <p className="text-xs text-destructive font-semibold mt-1">{errors.nationalId.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                placeholder="+237 6XX XXX XXX"
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive font-semibold mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* City / District row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="city">City</Label>
                                <select
                                    id="city"
                                    {...register('city')}
                                    className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 font-semibold cursor-pointer outline-none"
                                >
                                    <option value="Yaoundé">Yaoundé</option>
                                    <option value="Douala">Douala</option>
                                    <option value="Bamenda">Bamenda</option>
                                    <option value="Bafoussam">Bafoussam</option>
                                    <option value="Garoua">Garoua</option>
                                    <option value="Maroua">Maroua</option>
                                </select>
                                {errors.city && (
                                    <p className="text-xs text-destructive font-semibold mt-1">{errors.city.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="district">District</Label>
                                <Input
                                    id="district"
                                    placeholder="e.g. Bastos"
                                    {...register('district')}
                                />
                                {errors.district && (
                                    <p className="text-xs text-destructive font-semibold mt-1">{errors.district.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Area / Submission Date row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="area">Declared Area (m²)</Label>
                                <Input
                                    id="area"
                                    type="number"
                                    placeholder="e.g. 1240"
                                    {...register('area')}
                                />
                                {errors.area && (
                                    <p className="text-xs text-destructive font-semibold mt-1">{errors.area.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="submissionDate">Submission Date</Label>
                                <Input
                                    id="submissionDate"
                                    type="date"
                                    {...register('submissionDate')}
                                    className="transition-none"
                                />
                                {errors.submissionDate && (
                                    <p className="text-xs text-destructive font-semibold mt-1">{errors.submissionDate.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Real Document Uploader */}
                        <div className="space-y-1.5">
                            <Label>Upload Documents</Label>
                            <input
                                type="file"
                                id="modal-file-upload"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor="modal-file-upload"
                                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-slate-50/30 flex flex-col items-center justify-center ${
                                    selectedFiles.length > 0 ? 'border-emerald-200 bg-emerald-50/5' : 'border-slate-200 bg-slate-50/10'
                                }`}
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-650 text-slate-600">Drop files here or click to browse</p>
                                    <p className="text-[10px] font-semibold text-slate-400">PDF, JPG, PNG — max 10MB each</p>
                                </div>
                            </label>

                            {/* Render File list if selected */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2 mt-2 max-h-32 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                                    {selectedFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs font-semibold text-title"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <FileText className="w-4 h-4 text-button-color shrink-0" />
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedFiles(prev => prev.filter((_, i) => i !== idx))
                                                }}
                                                className="text-slate-400 hover:text-rose-600 font-bold text-sm leading-none p-1 hover:bg-slate-100 rounded cursor-pointer"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notes textarea */}
                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                rows={3}
                                placeholder="Additional notes..."
                                {...register('notes')}
                                className="w-full p-3 border border-slate-200 bg-slate-50/40 rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none transition-all resize-none font-medium"
                            />
                            {errors.notes && (
                                <p className="text-xs text-destructive font-semibold mt-1">{errors.notes.message}</p>
                            )}
                        </div>

                    </div>

                    {/* Action Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 select-none">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-[#1b5e20] hover:bg-[#144718] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                            <span>+</span>
                            <span>Submit Registration</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddRegistrationModal