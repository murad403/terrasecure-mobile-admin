import AuthBanner from '@/components/shared/AuthBanner'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen grid grid-cols-2 justify-center items-center gap-4'>
            <div>
                <AuthBanner />
            </div>
            <div className='flex justify-center items-center'>
                {children}
            </div>
        </div>
    )
}

export default layout