'use client'

import { removeUpload, type UploadItem } from '@/utility/uploadStorage'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { createPortal } from 'react-dom'

type UploadDetailModalProps = {
  open: boolean
  onClose: () => void
  uploads: UploadItem[] // Uploads passed from sidebar (with status updates)
  onUploadRemoved?: () => void // Callback when an upload is removed
}

export const UploadDetailModal: React.FC<UploadDetailModalProps> = ({ open, onClose, uploads, onUploadRemoved }) => {
  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
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
            className="relative z-10 flex max-h-[80vh] w-full max-w-3xl flex-col overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {uploads.length} file{uploads.length !== 1 ? 's' : ''} being uploaded
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

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {uploads.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No active uploads</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <UploadDetailItem
                      key={upload.id}
                      upload={upload}
                      onRemove={() => {
                        removeUpload(upload.id)
                        onUploadRemoved?.() // Notify parent to refresh
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

const UploadDetailItem: React.FC<{ upload: UploadItem; onRemove: () => void }> = ({ upload, onRemove }) => {
  // Status is already updated from the sidebar's polling, just use the upload's status
  const currentStatus = upload.status || 'pending'
  const getProgressPercentage = (status?: string) => {
    if (status === 'completed') return 100
    if (status === 'failed') return 0
    if (status === 'processing') return 50
    return 25 // pending
  }
  const progress = getProgressPercentage(currentStatus)
  const isCompleted = currentStatus === 'completed'
  const isFailed = currentStatus === 'failed'

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'processing':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const canDismiss = currentStatus === 'completed' || currentStatus === 'failed'

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{upload.fileName}</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(upload.size_bytes)}</p>
            <span className={`text-xs font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </span>
          </div>
        </div>
        {canDismiss && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="Remove upload"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className={`h-full ${
            isCompleted
              ? 'bg-green-500'
              : isFailed
                ? 'bg-red-500'
                : currentStatus === 'processing'
                  ? 'bg-yellow-500'
                  : 'bg-primary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {upload.error && (
        <div className="mt-2">
          {Array.isArray(upload.error) ? (
            <ul className="list-disc space-y-1 pl-5">
              {upload.error.map((err: any, idx) => (
                <li key={idx} className="text-xs text-red-600 dark:text-red-400">
                  {err.msg}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-red-600 dark:text-red-400">{upload.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
