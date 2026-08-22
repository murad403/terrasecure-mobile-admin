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

  const isAlreadyPublished =
    registration.status === 'CONVERTED' ||
    registration.status === 'PUBLISHED'

  const isStepCompleted = isAlreadyPublished || (registration.step || 1) >= 7

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAlreadyPublished) return

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
            {isAlreadyPublished
              ? 'Already Converted & Published to Platform'
              : isStepCompleted
              ? 'Completed'
              : 'Final Step: Publish parcel to public registry'}
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
          {isAlreadyPublished ? 'CONVERTED' : isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Info Banner Card */}
      <div
        className={cn(
          'p-4 rounded-xl flex items-start gap-3 border',
          isAlreadyPublished
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-emerald-50/40 border-emerald-100'
        )}
      >
        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-extrabold text-emerald-900 block">
            {isAlreadyPublished
              ? 'Registration Already Converted & Published'
              : 'Registration ready to publish'}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            Slug: {registration.slug || `REG-${registration.id}`} · Linked Parcel ID: #{registration.parcelId || registration.id}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading || isAlreadyPublished}
          className={cn(
            'w-auto px-6 font-bold text-xs gap-1.5',
            isAlreadyPublished && 'bg-slate-200 text-slate-500 hover:bg-slate-200 cursor-not-allowed border-slate-300 shadow-none'
          )}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>
            {isAlreadyPublished
              ? 'Already Published'
              : isLoading
              ? 'Publishing...'
              : 'Publish Parcel to Platform'}
          </span>
        </Button>
      </div>
    </form>
  )
}

export default PublishParcelStep