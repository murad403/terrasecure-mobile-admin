"use client"
import React from 'react'
import { Map as MapIcon } from 'lucide-react'

const GISCoverageMap = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[210px] w-full">
            {/* Title */}
            <div className="border-b border-slate-50 pb-2 mb-2">
                <span className="font-semibold text-title text-sm">GIS Coverage</span>
            </div>

            {/* Map Illustration area */}
            <div className="relative flex-1 bg-[#E6F4EA]/80 rounded-xl overflow-hidden border border-emerald-50 flex items-center justify-center h-[90px]">
                {/* Abstract Map Roads / Paths SVG */}
                <svg className="absolute inset-0 w-full h-full text-white/50 stroke-current stroke-2" fill="none">
                    <path d="M-10,20 C30,40 50,-10 90,30 C120,60 160,20 210,50 C240,70 280,30 320,60" />
                    <path d="M40,-20 L40,120" />
                    <path d="M180,-20 L180,120" />
                    <path d="M-20,60 H350" />
                    <path d="M-10,90 C80,70 120,110 200,80 C260,60 290,100 320,70" />
                </svg>

                {/* Floating Map Pin Icon in Center */}
                <MapIcon className="w-8 h-8 text-emerald-600/30 absolute" />

                {/* Coverage Blue Nodes */}
                <div className="absolute top-3 right-[45%] w-5 h-5 rounded-full bg-blue-500/40 border border-blue-400/80 animate-pulse" />
                <div className="absolute bottom-5 left-10 w-4 h-4 rounded-full bg-blue-400/40 border border-blue-300/80" />
                <div className="absolute top-8 left-16 w-3 h-3 rounded-full bg-blue-400/30 border border-blue-300/60" />
                <div className="absolute bottom-4 right-[15%] w-7 h-7 rounded-full bg-blue-500/40 border border-blue-400/80 animate-pulse" />
                <div className="absolute top-5 right-6 w-4 h-4 rounded-full bg-blue-400/30 border border-blue-300/60" />

                {/* Floating Percentage Badge */}
                <div className="absolute bottom-2 right-2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-blue-600 tracking-wide select-none">
                        54.7% mapped
                    </span>
                </div>
            </div>

            {/* Footer Link */}
            <div className="text-center pt-2.5">
                <button
                    onClick={() => alert('Open full map view')}
                    className="text-xs text-button-color hover:underline font-semibold"
                >
                    Open Full Map →
                </button>
            </div>
        </div>
    )
}

export default GISCoverageMap