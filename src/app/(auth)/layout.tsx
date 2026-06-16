import AuthBanner from '@/components/shared/AuthBanner'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white'>
            <div className='hidden md:block h-screen sticky top-0 overflow-hidden'>
                <AuthBanner />
            </div>
            <div className='flex justify-center items-center min-h-screen w-full'>
                <div className='max-w-lg w-full px-4 md:px-0'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout