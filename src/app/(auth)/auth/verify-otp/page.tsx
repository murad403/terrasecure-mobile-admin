import VerifyOtpPage from '@/components/auth/VerifyOtpPage'
import React, { Suspense } from 'react'

const page = () => {
  return (
      <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-button-color border-t-transparent rounded-full animate-spin" /></div>}>
        <VerifyOtpPage />
      </Suspense>
  )
}

export default page