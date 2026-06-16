import React from 'react'
import { Map } from 'lucide-react'
import Image from 'next/image'
import logo from "@/assets/logo/logo.png";


const AuthBanner = () => {
    return (
        <div className='min-h-screen w-full bg-linear-to-tl from-[#121A26] via-[#1A2332] to-[#215C9E] text-white flex justify-center items-center flex-col'>
            <div className='space-y-6'>
                {/* Top Logo Section */}
                <div className='flex items-center justify-start gap-4'>
                    <div className='bg-button-color/15 border border-button-color/30 p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-black/10'>
                        <Image width={50} height={50} src={logo} alt='logo'/>
                    </div>
                    <div>
                        <h2 className='font-bold text-lg leading-none tracking-wide text-white'>LandSecure</h2>
                        <p className='text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-semibold'>Admin Platform</p>
                    </div>
                </div>

                {/* Middle Feature Highlights */}
                <div>
                    <h1 className='text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white'>
                        Land Monitoring<br />& Security Platform
                    </h1>
                    <p className='text-slate-300 text-sm lg:text-base mb-8 leading-relaxed font-light'>
                        Manage land parcels, registrations, disputes and GIS data across all cities in Cameroon.
                    </p>

                    {/* Features List */}
                    <div className='space-y-5'>
                        <div className='flex items-center gap-4 group'>
                            <div className='flex items-center justify-center text-lg w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform'>
                                🗺️
                            </div>
                            <span className='text-sm text-slate-200 font-medium group-hover:text-white transition-colors'>
                                GIS-powered parcel mapping
                            </span>
                        </div>
                        <div className='flex items-center gap-4 group'>
                            <div className='flex items-center justify-center text-lg w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform'>
                                🔑
                            </div>
                            <span className='text-sm text-slate-200 font-medium group-hover:text-white transition-colors'>
                                7-step registration workflow
                            </span>
                        </div>
                        <div className='flex items-center gap-4 group'>
                            <div className='flex items-center justify-center text-lg w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform'>
                                ⚠️
                            </div>
                            <span className='text-sm text-slate-200 font-medium group-hover:text-white transition-colors'>
                                Real-time conflict detection
                            </span>
                        </div>
                        <div className='flex items-center gap-4 group'>
                            <div className='flex items-center justify-center text-lg w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform'>
                                📊
                            </div>
                            <span className='text-sm text-slate-200 font-medium group-hover:text-white transition-colors'>
                                Full audit trail & reporting
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthBanner