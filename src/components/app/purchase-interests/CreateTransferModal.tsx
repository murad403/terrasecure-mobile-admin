"use client"
import { useEffect, useState } from 'react'
import { X, ArrowRightLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useLandParcelTransfersMutation } from '@/redux/features/purchase-interests/purchase-interests.api'
import {
  createTransferSchema,
  type CreateTransferFormValues,
} from '@/validation/purchase-interest.validation'

interface CreateTransferModalProps {
  isOpen: boolean
  onClose: () => void
  initialParcelSlug?: string
  purchaseInterestId?: number
  defaultOfferAmount?: number | string
  sellerName?: string
  sellerPhone?: string
  buyerName?: string
  buyerPhone?: string
}

export const CreateTransferModal = ({
  isOpen,
  onClose,
  initialParcelSlug = '',
  purchaseInterestId,
  defaultOfferAmount,
  sellerName = 'John Smith',
  sellerPhone = '+1234567890',
  buyerName = 'Alice Johnson',
  buyerPhone = '+1987654321',
}: CreateTransferModalProps) => {
  const [createTransfer, { isLoading }] = useLandParcelTransfersMutation()

  const [parties, setParties] = useState<
    { name: string; phone: string; role: 'FROM' | 'TO'; sharePercentage: number }[]
  >([
    { name: sellerName, phone: sellerPhone, role: 'FROM', sharePercentage: 100 },
    { name: buyerName, phone: buyerPhone, role: 'TO', sharePercentage: 100 },
  ])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      parcelSlug: initialParcelSlug,
      transferType: 'SALE',
      considerationAmount: defaultOfferAmount ? Number(defaultOfferAmount) : undefined,
      currency: 'USD',
      effectiveDate: new Date().toISOString().substring(0, 10),
      notes: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      reset({
        parcelSlug: initialParcelSlug,
        transferType: 'SALE',
        considerationAmount: defaultOfferAmount ? Number(defaultOfferAmount) : undefined,
        currency: 'USD',
        effectiveDate: new Date().toISOString().substring(0, 10),
        notes: '',
      })
      setParties([
        { name: sellerName, phone: sellerPhone, role: 'FROM', sharePercentage: 100 },
        { name: buyerName, phone: buyerPhone, role: 'TO', sharePercentage: 100 },
      ])
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [
    isOpen,
    initialParcelSlug,
    defaultOfferAmount,
    sellerName,
    sellerPhone,
    buyerName,
    buyerPhone,
    reset,
  ])

  if (!isOpen) return null

  const handlePartyChange = (
    index: number,
    field: 'name' | 'phone' | 'role' | 'sharePercentage',
    value: any
  ) => {
    setParties((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const onSubmit = async (values: CreateTransferFormValues) => {
    try {
      const payload = {
        parcelSlug: values.parcelSlug.trim(),
        transferType: values.transferType,
        considerationAmount: values.considerationAmount ? Number(values.considerationAmount) : undefined,
        currency: values.currency?.trim() || 'USD',
        effectiveDate: values.effectiveDate
          ? new Date(values.effectiveDate).toISOString()
          : undefined,
        notes: values.notes?.trim() || undefined,
        purchaseInterestId: purchaseInterestId ? Number(purchaseInterestId) : undefined,
        parties: parties.map((p) => ({
          name: p.name.trim() || undefined,
          phone: p.phone.trim() || undefined,
          role: p.role,
          sharePercentage: Number(p.sharePercentage) || 100,
        })),
      }

      const res = await createTransfer(payload).unwrap()
      toast.success(res.message || 'Land parcel transfer created successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create land transfer.')
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
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-button-color" />
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                Initiate Land Parcel Transfer
              </h2>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              Create an official land ownership transfer agreement
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4 select-none">
          {/* Target Parcel Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="transferParcelSlug" className="text-xs font-bold text-slate-700">
              Parcel Code or Slug <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="transferParcelSlug"
              placeholder="e.g. NEW-DR5REG-0001M"
              {...register('parcelSlug')}
              className="font-semibold text-xs text-slate-900"
            />
            {errors.parcelSlug && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.parcelSlug.message}</p>
            )}
          </div>

          {/* Two-Column: Transfer Type & Consideration Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="transferType" className="text-xs font-bold text-slate-700">
                Transfer Type <span className="text-rose-500">*</span>
              </Label>
              <select
                id="transferType"
                {...register('transferType')}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color cursor-pointer"
              >
                <option value="SALE">SALE</option>
                <option value="INHERITANCE">INHERITANCE</option>
                <option value="GIFT">GIFT</option>
                <option value="COURT_ORDER">COURT ORDER</option>
                <option value="GOVERNMENT_ACQUISITION">GOVERNMENT ACQUISITION</option>
                <option value="PARTITION">PARTITION</option>
                <option value="FORECLOSURE">FORECLOSURE</option>
              </select>
              {errors.transferType && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.transferType.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="considerationAmount" className="text-xs font-bold text-slate-700">
                Consideration Amount
              </Label>
              <Input
                id="considerationAmount"
                type="number"
                placeholder="e.g. 300000"
                {...register('considerationAmount', { valueAsNumber: true })}
                className="font-semibold text-xs text-slate-900"
              />

              {errors.considerationAmount && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.considerationAmount.message}</p>
              )}
            </div>
          </div>

          {/* Two-Column: Currency & Effective Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs font-bold text-slate-700">
                Currency
              </Label>
              <Input
                id="currency"
                placeholder="USD"
                {...register('currency')}
                className="font-semibold text-xs text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="effectiveDate" className="text-xs font-bold text-slate-700">
                Effective Date
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                {...register('effectiveDate')}
                className="font-semibold text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Transfer Parties Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Transfer Parties (Sellers & Buyers)
              </Label>
            </div>

            {parties.map((party, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-600">
                    Party #{idx + 1} ({party.role === 'FROM' ? 'Seller / Transferor' : 'Buyer / Transferee'})
                  </span>
                  <select
                    value={party.role}
                    onChange={(e) => handlePartyChange(idx, 'role', e.target.value as any)}
                    className="text-[10px] font-bold px-2 py-1 border border-slate-200 bg-white rounded-lg cursor-pointer"
                  >
                    <option value="FROM">FROM (Seller)</option>
                    <option value="TO">TO (Buyer)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Party Name"
                    value={party.name}
                    onChange={(e) => handlePartyChange(idx, 'name', e.target.value)}
                    className="font-semibold text-xs text-slate-900 bg-white"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={party.phone}
                    onChange={(e) => handlePartyChange(idx, 'phone', e.target.value)}
                    className="font-semibold text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="transferNotes" className="text-xs font-bold text-slate-700">
              Transfer Notes / Terms (Optional)
            </Label>
            <textarea
              id="transferNotes"
              placeholder="Provide agreement terms or transfer details..."
              {...register('notes')}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-17.5 leading-relaxed resize-none"
            />
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
              disabled={isLoading}
              className="w-1/2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating Transfer...</span>
                </div>
              ) : (
                'Create Transfer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTransferModal
