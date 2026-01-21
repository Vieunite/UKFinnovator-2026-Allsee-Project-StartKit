'use client'

import { useUploadMedia } from '@/hooks/api/media/useUploadMedia'
import { saveUpload, type UploadItem } from '@/utility/uploadStorage'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropzone } from 'react-dropzone'

type UploadMediaModalProps = {
  open: boolean
  onClose: () => void
  folderId?: number | null
  onUploadStart?: (uploadId: string) => void
  onUploadSuccess?: (fileCount: number) => void // Callback with number of files being uploaded
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  open,
  onClose,
  folderId,
  onUploadStart,
  onUploadSuccess,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const uploadMutation = useUploadMedia()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isUploading) return // Don't allow adding files while uploading
      setFiles((prev) => [...prev, ...acceptedFiles])
      setUploadError(null) // Clear any previous errors when new files are added
    },
    [isUploading]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    multiple: true,
    disabled: isUploading, // Disable dropzone while uploading
  })

  const removeFile = useCallback(
    (index: number) => {
      if (isUploading) return // Don't allow removing files while uploading
      setFiles((prev) => prev.filter((_, i) => i !== index))
    },
    [isUploading]
  )

  const handleUpload = useCallback(async () => {
    if (files.length === 0 || isUploading) return

    setIsUploading(true)
    setUploadError(null)

    // Create a copy of files before clearing state
    const filesToUpload = [...files]

    // Close modal immediately and show success message
    const fileCount = filesToUpload.length
    setFiles([])
    setIsUploading(false)
    onClose()
    onUploadSuccess?.(fileCount)

    // Upload files in the background sequentially
    // Only save to localStorage after we get the real upload_id from API response
    // This ensures status polling works correctly with the real upload_id
    ;(async () => {
      for (const file of filesToUpload) {
        try {
          const response = await uploadMutation.mutateAsync({
            file,
            folder_id: folderId,
          })

          // Save the upload with real API response data (including real upload_id)
          // This allows status polling to work correctly
          const uploadItem: UploadItem = {
            ...response,
            fileName: file.name,
            createdAt: new Date().toISOString(),
          }
          saveUpload(uploadItem)
          onUploadStart?.(response.id)
        } catch (error: any) {
          console.error('Error uploading file:', file.name, error)
          // Save failed upload with a temporary ID (we won't be able to poll status for failed uploads anyway)
          const errorUpload: UploadItem = {
            id: `failed-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            bucket: '',
            key: '',
            size_bytes: file.size,
            content_type: file.type || 'unknown',
            status: 'failed' as const,
            fileName: file.name,
            folder_id: folderId ?? null,
            createdAt: new Date().toISOString(),
            error: error?.response?.data?.detail || error?.message || 'Upload failed',
            upload_type: file.type?.startsWith('image/')
              ? 'image'
              : file.type?.startsWith('video/')
                ? 'video'
                : 'unknown',
          }
          saveUpload(errorUpload)
        }
      }
    })()
  }, [files, folderId, uploadMutation, onClose, onUploadStart, onUploadSuccess, isUploading])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Media</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload images or videos to your media library
                  </p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div
                {...getRootProps()}
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isUploading
                    ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50 dark:border-gray-600 dark:bg-gray-800'
                    : isDragActive
                      ? 'bg-primary/5 cursor-pointer border-primary dark:bg-primary/10'
                      : 'cursor-pointer border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-900/50 dark:hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  or click to select files (images and videos)
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Files ({files.length})
                  </p>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-md bg-white px-3 py-2 dark:bg-gray-800"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="ml-2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/30 dark:bg-red-900/20">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Upload Error</p>
                  <p className="mt-1 whitespace-pre-line text-xs text-red-600 dark:text-red-300">{uploadError}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {isUploading ? 'Cancel' : 'Cancel'}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
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
