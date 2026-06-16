"use client"
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalEntries: number
  pageSize: number
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalEntries,
  pageSize
}: CustomPaginationProps) => {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalEntries)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 1 // number of pages to show around current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > range + 2) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - range)
      const end = Math.min(totalPages - 1, currentPage + range)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - range - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-5 text-sm font-semibold text-slate-500">
      {/* Show entry stats */}
      <span className="text-slate-500 font-medium">
        Showing <span className="text-slate-800 font-bold">{startEntry}</span> to{' '}
        <span className="text-slate-800 font-bold">{endEntry}</span> of{' '}
        <span className="text-slate-800 font-bold">{totalEntries}</span> entries
      </span>

      {/* Pages list buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-slate-400 font-light select-none">
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = currentPage === pageNum

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                isActive
                  ? "bg-button-color border-button-color text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {pageNum}
            </button>
          )
        })}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}

export default CustomPagination