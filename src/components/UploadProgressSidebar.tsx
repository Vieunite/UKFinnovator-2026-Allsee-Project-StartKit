'use client'

import { useUploadStatus } from '@/hooks/api/media/useUploadStatus'
import { getStoredUploads, markUploadAsInvalidated, updateUploadStatus, type UploadItem } from '@/utility/uploadStorage'
import { EyeIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { UploadDetailModal } from './UploadDetailModal'

export const UploadProgressSidebar: React.FC = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const completedUploadsRef = useRef<Set<string>>(new Set())

  // Load uploads from localStorage on mount and when window gains focus
  useEffect(() => {
    const loadUploads = () => {
      setUploads(getStoredUploads())
    }
    loadUploads()

    // Reload on focus to catch updates from other tabs
    window.addEventListener('focus', loadUploads)
    return () => window.removeEventListener('focus', loadUploads)
  }, [])

  // Auto-refresh uploads periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setUploads(getStoredUploads())
    }, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  // Get active uploads that need status polling
  const activeUploads = useMemo(() => {
    return uploads.filter((upload) => {
      const hasRealUploadId =
        !upload.id.startsWith('failed-') && !upload.id.startsWith('temp-') && !upload.id.startsWith('error-')
      return hasRealUploadId && (upload.status === 'pending' || upload.status === 'processing')
    })
  }, [uploads])

  // Track previous upload statuses to detect transitions to 'completed'
  const previousUploadStatusesRef = useRef<Map<string, string>>(new Map())

  // Track completed uploads and invalidate media query once per upload
  // Uses localStorage flag to persist across page refreshes
  // Only invalidates when an upload transitions TO 'completed', not on every status change
  useEffect(() => {
    // Build current status map
    const currentStatuses = new Map<string, string>()
    uploads.forEach((upload) => {
      if (upload.status) {
        currentStatuses.set(upload.id, upload.status)
      }
    })

    // Find uploads that just transitioned to 'completed'
    const uploadsToInvalidate = uploads.filter((upload) => {
      const previousStatus = previousUploadStatusesRef.current.get(upload.id) || null
      const justCompleted =
        upload.status === 'completed' &&
        previousStatus !== 'completed' &&
        !upload.hasInvalidatedMedia &&
        !completedUploadsRef.current.has(upload.id)

      return justCompleted
    })

    // Update previous statuses
    previousUploadStatusesRef.current = currentStatuses

    if (uploadsToInvalidate.length === 0) return

    // Mark all as processed in ref FIRST to prevent duplicate processing
    uploadsToInvalidate.forEach((upload) => {
      completedUploadsRef.current.add(upload.id)
    })

    // Collect unique folder_ids from completed uploads
    const folderIdsToInvalidate = new Set<number | null>()
    uploadsToInvalidate.forEach((upload) => {
      folderIdsToInvalidate.add(upload.folder_id ?? null)
    })

    // Invalidate media queries for each specific folder_id
    // This ensures only the relevant folder's media is refreshed, not all media queries
    folderIdsToInvalidate.forEach((folderId) => {
      // Invalidate queries with the specific folder_id
      // React Query will match queries that have folder_id in their params
      queryClient.invalidateQueries({
        queryKey: ['media', { folder_id: folderId }],
      })
    })

    // Mark all as invalidated in localStorage
    uploadsToInvalidate.forEach((upload) => {
      markUploadAsInvalidated(upload.id)
    })
  }, [uploads, queryClient])

  if (uploads.length === 0) return null

  // Calculate overall progress
  const completedCount = uploads.filter((u) => u.status === 'completed').length
  const totalCount = uploads.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allCompleted = completedCount === totalCount && totalCount > 0

  return (
    <>
      {/* Hidden component to poll status for active uploads */}
      {activeUploads.map((upload) => (
        <UploadStatusPoller
          key={upload.id}
          uploadId={upload.id}
          currentStatus={upload.status}
          onStatusUpdate={() => setUploads(getStoredUploads())}
        />
      ))}

      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Uploads ({uploads.length})
          </p>
          <button
            onClick={() => setShowDetailModal(true)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="View upload details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="mb-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className={`h-full ${allCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {completedCount} of {totalCount} completed
          </p>
        </div>
      </div>

      <UploadDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        uploads={uploads}
        onUploadRemoved={() => setUploads(getStoredUploads())}
      />
    </>
  )
}

// Component to poll status for a single upload
const UploadStatusPoller: React.FC<{
  uploadId: string
  currentStatus?: string
  onStatusUpdate: () => void
}> = ({ uploadId, currentStatus, onStatusUpdate }) => {
  const { data: statusData } = useUploadStatus(uploadId, {
    enabled: true,
  })

  useEffect(() => {
    if (statusData && statusData.status !== currentStatus) {
      // Update localStorage when status changes
      updateUploadStatus(uploadId, {
        status: statusData.status as UploadItem['status'],
      })
      // Notify parent to refresh
      onStatusUpdate()
    }
  }, [statusData, uploadId, currentStatus, onStatusUpdate])

  return null // This component doesn't render anything
}
