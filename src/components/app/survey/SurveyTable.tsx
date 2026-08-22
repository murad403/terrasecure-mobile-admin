"use client"
import React, { useState } from 'react'
import { Search, Eye, Loader2, RotateCcw, Compass, UploadCloud, UserCheck, ShieldCheck, Edit3, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'
import CustomFilterDropdown from '@/components/dropdown/CustomFilterDropdown'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/SearchInput'
import formatDate from '@/utils/formatDate'
import { LandParcelSurveySource, LandParcelSurveyStatus } from '@/enum'
import { useRetrieveSurveyQuery } from '@/redux/features/survey/survey.api'
import { ISurveyItem } from '@/redux/features/survey/survey.type'
import { UserPicker } from '@/components/tools/UserPicker'
import type { User } from '@/interfaces/user.interface'

interface SurveyTableProps {
  onViewDetails: (id: number) => void
  onOpenCreateModal?: () => void
  onUploadFile?: (id: number) => void
  onAssignSurveyor?: (item: ISurveyItem) => void
  onVerifyGis?: (item: ISurveyItem) => void
  onEditSurvey?: (item: ISurveyItem) => void
  onDeleteSurvey?: (id: number) => void
}

const getInitials = (name?: string) => {
  if (!name) return 'SV'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getStatusBadge = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'VALIDATED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'VALIDATING':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'SYNCED':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'DRAFT':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

const SurveyTable: React.FC<SurveyTableProps> = ({
  onViewDetails,
  onOpenCreateModal,
  onUploadFile,
  onAssignSurveyor,
  onVerifyGis,
  onEditSurvey,
  onDeleteSurvey,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [sourceFilter, setSourceFilter] = useState<string>('All')
  const [selectedSurveyor, setSelectedSurveyor] = useState<User[]>([])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setSourceFilter('All')
    setSelectedSurveyor([])
    setCurrentPage(1)
  }

  const { data, isLoading, isFetching } = useRetrieveSurveyQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    source: sourceFilter !== 'All' ? sourceFilter : undefined,
    surveyorId: selectedSurveyor.length > 0 ? selectedSurveyor[0].id : undefined,
  })

  const surveyList: ISurveyItem[] = data?.data || []
  const pagination = data?.pagination

  const statusOptions = Object.values(LandParcelSurveyStatus) as string[]
  const sourceOptions = Object.values(LandParcelSurveySource) as string[]

  const totalEntries = pagination?.total || surveyList.length
  const totalPages = pagination?.totalPages || 1

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 min-h-[calc(100vh-12rem)] flex flex-col justify-between">
      <div>
        {/* Search & Filters Header */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <SearchInput
                type="text"
                placeholder="Search surveys..."
                value={searchQuery}
                onDebounceSearch={(value) => {
                  setSearchQuery(value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all font-semibold leading-relaxed"
              />
            </div>

            {/* Status Filter */}
            <CustomFilterDropdown
              type="checkbox"
              label="All Statuses"
              header="Filter Status"
              options={statusOptions}
              selected={statusFilter}
              onSelect={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* Source Filter */}
            <CustomFilterDropdown
              type="checkbox"
              label="All Sources"
              header="Filter Source"
              options={sourceOptions}
              selected={sourceFilter}
              onSelect={(val) => {
                setSourceFilter(val)
                setCurrentPage(1)
              }}
            />

            {/* Surveyor Filter */}
            <div className="w-full sm:w-60">
              <UserPicker
                value={selectedSurveyor}
                onChange={(users) => {
                  setSelectedSurveyor(users)
                  setCurrentPage(1)
                }}
                type="radio"
                placeholder="Filter by surveyor..."
              />
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== 'All' || sourceFilter !== 'All' || selectedSurveyor.length > 0) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="w-fit inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border-slate-200 px-4 py-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>

          {/* Action Button */}
          {onOpenCreateModal && (
            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
              <Button className="w-auto gap-2" type="button" onClick={onOpenCreateModal}>
                <Plus className="w-4.5 h-4.5" />
                <span>New Survey</span>
              </Button>
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  SURVEY ID
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  REGISTRATION
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  SURVEYOR
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  SOURCE
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  COMPUTED AREA
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  RELIABILITY
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  STATUS
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase">
                  DATE
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 tracking-wider uppercase text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-button-color" />
                      <span className="text-xs font-semibold">Loading surveys...</span>
                    </div>
                  </td>
                </tr>
              ) : surveyList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Compass className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No surveys found.</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filter options.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                surveyList.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Survey ID */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-900 text-xs">
                        #{String(item.id).padStart(5, '0')}
                      </td>

                      {/* Registration Column */}
                      <td className="py-4 px-5">
                        {item.registration ? (
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {item.registration.slug || `REG-${item.registration.id}`}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {item.registration.areaSqm ? `${item.registration.areaSqm} m²` : 'Land Registration'}
                            </span>
                          </div>
                        ) : item.surveyor ? (
                          /* fallback when registration is null: show surveyor */
                          <div className="flex items-center gap-2">
                            {item.surveyor.profilePicture?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.surveyor.profilePicture.url}
                                alt={item.surveyor.name}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-button-color/10 text-button-color font-bold text-[10px] flex items-center justify-center">
                                {getInitials(item.surveyor.name)}
                              </div>
                            )}
                            <span className="font-medium text-slate-700 text-xs">
                              {item.surveyor.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>

                      {/* Surveyor Column */}
                      <td className="py-4 px-5">
                        {item.surveyor ? (
                          <div className="flex items-center gap-2">
                            {item.surveyor.profilePicture?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.surveyor.profilePicture.url}
                                alt={item.surveyor.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-button-color/10 text-button-color font-bold text-xs flex items-center justify-center border border-button-color/20">
                                {getInitials(item.surveyor.name)}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-slate-800 text-xs truncate">
                                {item.surveyor.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ID: #{item.surveyor.id}
                              </span>
                            </div>
                          </div>
                        ) : item.registration ? (
                          /* fallback when surveyor is not available: show registration */
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-slate-700 text-xs">
                              {item.registration.slug || `REG-${item.registration.id}`}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Registration Info
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Unassigned</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-5">
                        {item.source ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 font-mono">
                            {item.source}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Computed Area */}
                      <td className="py-4 px-5 font-medium text-slate-700 text-xs">
                        {item.computedAreaSqm != null
                          ? `${item.computedAreaSqm.toLocaleString()} m²`
                          : '-'}
                      </td>

                      {/* Reliability Score */}
                      <td className="py-4 px-5">
                        {item.reliabilityScore != null ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {item.reliabilityScore} / 10
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-1 rounded-full text-xs font-bold border',
                            getStatusBadge(item.status)
                          )}
                        >
                          {item.status || 'N/A'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {formatDate(item.capturedAt || item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Details */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetails(item.id)}
                            className="h-8 w-8 text-slate-500 hover:text-button-color hover:bg-button-color/10 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* Upload File */}
                          {onUploadFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onUploadFile(item.id)}
                              className="h-8 w-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                              title="Upload GIS File"
                            >
                              <UploadCloud className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Assign Surveyor */}
                          {onAssignSurveyor && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onAssignSurveyor(item)}
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Assign Surveyor"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Verify GIS Data */}
                          {onVerifyGis && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onVerifyGis(item)}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Verify GIS Data"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Edit Survey */}
                          {onEditSurvey && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onEditSurvey(item)}
                              className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Survey"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Delete Survey */}
                          {onDeleteSurvey && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteSurvey(item.id)}
                              className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Survey"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totalEntries={totalEntries}
        pageSize={pagination?.limit || 20}
        isLoading={isFetching}
      />
    </div>
  )
}

export default SurveyTable
