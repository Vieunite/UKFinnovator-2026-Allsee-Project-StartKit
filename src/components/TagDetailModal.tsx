'use client'

import { useContentTagDetail } from '@/hooks/api/tags/useContentTagDetail'
import { useTimeTagDetail } from '@/hooks/api/tags/useTimeTagDetail'
import type { Components } from '@/types/openapi'
import { formatTimeTagWindowDays, formatTimeTagWindowTime } from '@/utility/timeTagHelpers'
import { formatTitleString } from '@/utility/utility'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { createPortal } from 'react-dom'

type TagDetailModalProps = {
  open: boolean
  onClose: () => void
  tagType: 'content' | 'time'
  tagId: number | string | null
}

export const TagDetailModal: React.FC<TagDetailModalProps> = ({ open, onClose, tagType, tagId }) => {
  const {
    data: contentTagDetail,
    isLoading: contentTagLoading,
    error: contentTagError,
  } = useContentTagDetail(tagType === 'content' ? (tagId as number) : 0, {
    enabled: open && tagType === 'content' && tagId !== null,
  })

  const {
    data: timeTagDetail,
    isLoading: timeTagLoading,
    error: timeTagError,
  } = useTimeTagDetail(tagType === 'time' ? (tagId as string) : '', {
    enabled: open && tagType === 'time' && tagId !== null,
  })

  const isLoading = tagType === 'content' ? contentTagLoading : timeTagLoading
  const error = tagType === 'content' ? contentTagError : timeTagError
  const tagDetail = tagType === 'content' ? contentTagDetail : timeTagDetail

  if (typeof window === 'undefined') return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tag Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tagType === 'content' ? 'Content Tag' : 'Time Tag'} Information
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Loading tag details...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-red-500 dark:text-red-400">
                    Failed to load tag details. Please try again.
                  </div>
                </div>
              ) : tagDetail ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Basic Information
                    </h3>
                    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</span>
                        <div className="flex items-center gap-2">
                          {tagDetail.color && (
                            <div
                              className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: tagDetail.color }}
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {tagType === 'content'
                              ? (tagDetail as Components.Schemas.TagDetailResponse).name
                              : (tagDetail as Components.Schemas.TimeTagRead).name}
                          </span>
                        </div>
                      </div>
                      {(tagType === 'content'
                        ? (tagDetail as Components.Schemas.TagDetailResponse).description
                        : (tagDetail as Components.Schemas.TimeTagRead).description) && (
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</span>
                          <span className="max-w-[60%] text-right text-sm text-gray-900 dark:text-gray-100">
                            {tagType === 'content'
                              ? (tagDetail as Components.Schemas.TagDetailResponse).description
                              : (tagDetail as Components.Schemas.TimeTagRead).description}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tag ID</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {tagType === 'content'
                            ? (tagDetail as Components.Schemas.TagDetailResponse).id
                            : (tagDetail as Components.Schemas.TimeTagRead).id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</span>
                        <span className="rounded-full px-2 py-1 text-xs font-medium text-primary bg-primary/10 dark:bg-primary/20">
                          {tagType === 'content'
                            ? formatTitleString((tagDetail as Components.Schemas.TagDetailResponse).tag_type)
                            : 'Time'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Counts - Only for content tags with TagDetailResponse */}
                  {tagType === 'content' && (tagDetail as Components.Schemas.TagDetailResponse).usage_counts && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Usage Statistics
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-900/20">
                          <div className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                            Media Items
                          </div>
                          <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {(tagDetail as Components.Schemas.TagDetailResponse).usage_counts.media}
                          </div>
                          <div className="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80">
                            media items using this tag
                          </div>
                        </div>
                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-500/30 dark:bg-purple-900/20">
                          <div className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400">
                            Playlists
                          </div>
                          <div className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {(tagDetail as Components.Schemas.TagDetailResponse).usage_counts.playlists}
                          </div>
                          <div className="mt-1 text-xs text-purple-600/80 dark:text-purple-400/80">
                            playlists using this tag
                          </div>
                        </div>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-500/30 dark:bg-green-900/20">
                          <div className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                            Devices
                          </div>
                          <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                            {(tagDetail as Components.Schemas.TagDetailResponse).usage_counts.devices}
                          </div>
                          <div className="mt-1 text-xs text-green-600/80 dark:text-green-400/80">
                            devices using this tag
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Time Tag Windows - Only for time tags */}
                  {tagType === 'time' && (tagDetail as Components.Schemas.TimeTagRead).windows && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Time Windows
                      </h3>
                      <div className="space-y-3">
                        {(tagDetail as Components.Schemas.TimeTagRead).windows.length === 0 ? (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No windows defined</p>
                          </div>
                        ) : (
                          (tagDetail as Components.Schemas.TimeTagRead).windows.map((window, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  Window {idx + 1}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Days</span>
                                  <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {formatTimeTagWindowDays(window.days_of_week)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</span>
                                  <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {formatTimeTagWindowTime(window.start_time, window.end_time)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Metadata
                    </h3>
                    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created At</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(
                            tagType === 'content'
                              ? (tagDetail as Components.Schemas.TagDetailResponse).created_at
                              : (tagDetail as Components.Schemas.TimeTagRead).created_at
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated At</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(
                            tagType === 'content'
                              ? (tagDetail as Components.Schemas.TagDetailResponse).updated_at
                              : (tagDetail as Components.Schemas.TimeTagRead).updated_at
                          )}
                        </span>
                      </div>
                      {tagType === 'content' && (tagDetail as Components.Schemas.TagDetailResponse).organisation_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Organisation ID</span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {(tagDetail as Components.Schemas.TagDetailResponse).organisation_id}
                          </span>
                        </div>
                      )}
                      {tagType === 'content' && (tagDetail as Components.Schemas.TagDetailResponse).deleted_at && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">Deleted At</span>
                          <span className="text-sm text-red-600 dark:text-red-400">
                            {formatDate((tagDetail as Components.Schemas.TagDetailResponse).deleted_at!)}
                          </span>
                        </div>
                      )}
                      {tagType === 'time' && (tagDetail as Components.Schemas.TimeTagRead).is_active !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              (tagDetail as Components.Schemas.TimeTagRead).is_active
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {(tagDetail as Components.Schemas.TimeTagRead).is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
