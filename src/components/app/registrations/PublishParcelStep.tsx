"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePublishRegistrationMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface PublishParcelStepProps {
  registration: RegistrationItem
  onCloseDrawer: () => void
}

const PublishParcelStep: React.FC<PublishParcelStepProps> = ({
  registration,
  onCloseDrawer,
}) => {
  const [publishRegistration, { isLoading }] = usePublishRegistrationMutation()

  const isStepCompleted =
    registration.status === 'PUBLISHED' ||
    registration.status === 'CONVERTED' ||
    (registration.step || 1) >= 7

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await publishRegistration(registration.id).unwrap()
      toast.success('Land parcel registration published successfully!')
      onCloseDrawer()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to publish land parcel registration.')
    }
  }

  return (
    <form onSubmit={handlePublish} className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 7: Publish Parcel</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Final Step: Publish parcel to public registry'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-200'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Info Banner Card */}
      <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-extrabold text-emerald-800 block">
            Registration ready to publish
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            Slug: {registration.slug || `REG-${registration.id}`} · Parcel ID: #{registration.parcelId || registration.id}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className="w-auto px-6 font-bold text-xs">
          <Globe className="w-4 h-4 shrink-0 mr-1.5" />
          <span>{isLoading ? 'Publishing...' : 'Publish Parcel to Platform'}</span>
        </Button>
      </div>
    </form>
  )
}

export default PublishParcelStep