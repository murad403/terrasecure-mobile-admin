"use client"
import React from 'react'
import { FileText, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useVerifyDocumentMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { RegistrationItem, LandParcelDocumentStatus } from '@/redux/features/registrations/registration.type'

interface VerifyDocumentsStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const VerifyDocumentsStep: React.FC<VerifyDocumentsStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [verifyDocument, { isLoading }] = useVerifyDocumentMutation()
  const isStepCompleted = (registration.step || 1) > 2

  const handleVerify = async (documentId: string, status: LandParcelDocumentStatus) => {
    try {
      await verifyDocument({
        id: registration.id,
        documentId,
        data: { status },
      }).unwrap()
      toast.success(`Document status updated to ${status}!`)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update document status.')
    }
  }

  const documentsList = registration.documents || []

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 2: Verify Documents</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Review & Verify Documents'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Documents List */}
      <div className="border border-slate-100 rounded-xl bg-white overflow-hidden divide-y divide-slate-100">
        {documentsList.length > 0 ? (
          documentsList.map((doc) => {
            const status = doc.status || 'PENDING'
            const mediaUrl = doc.media?.url
            const originalName = doc.media?.metadata?.originalName || doc.docType || 'Registration Document'

            return (
              <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white hover:bg-slate-50/20 transition-all gap-4">
                {/* Info & Media Link */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{originalName}</span>
                      {mediaUrl && (
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-0.5"
                          title="Open Document"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                      Type: {doc.docType || 'OTHER'} · Access: {doc.accessLevel || 'PUBLIC'}
                    </span>
                  </div>
                </div>

                {/* Status Badges & Actions */}
                <div className="flex items-center gap-3 select-none shrink-0 self-end sm:self-center">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap block w-fit',
                      status === 'VERIFIED' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                      status === 'PENDING' && 'bg-amber-50 text-amber-600 border-amber-100',
                      status === 'REJECTED' && 'bg-rose-50 text-rose-600 border-rose-100'
                    )}
                  >
                    {status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleVerify(doc.id, 'VERIFIED')}
                      className={cn(
                        'px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1',
                        status === 'VERIFIED'
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          : 'border-slate-200 text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-600'
                      )}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleVerify(doc.id, 'REJECTED')}
                      className={cn(
                        'px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1',
                        status === 'REJECTED'
                          ? 'border-rose-200 text-rose-700 bg-rose-50'
                          : 'border-slate-200 text-slate-600 hover:bg-rose-50/50 hover:text-rose-600'
                      )}
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 font-semibold">
            No attached documents found for this registration.
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className="pt-2">
        <Button type="button" onClick={onNextStep} className="w-auto px-6">
          Continue to Next Step
        </Button>
      </div>
    </div>
  )
}

export default VerifyDocumentsStep