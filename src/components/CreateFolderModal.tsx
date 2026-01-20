'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

type CreateFolderModalProps = {
  open: boolean
  onClose: () => void
  parentFolderId?: number | null
  onCreateFolder: (name: string, parentFolderId: number | null) => Promise<void>
  isCreating?: boolean
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  open,
  onClose,
  parentFolderId,
  onCreateFolder,
  isCreating = false,
}) => {
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!folderName.trim()) {
        setError('Folder name is required')
        return
      }

      try {
        await onCreateFolder(folderName.trim(), parentFolderId ?? null)
        setFolderName('')
        setError(null)
        onClose()
      } catch (err: any) {
        // Show error in modal for immediate feedback
        // Parent component will also show error in SuccessAndError
        const errorMessage =
          typeof err?.response?.data?.detail === 'string'
            ? err.response.data.detail
            : Array.isArray(err?.response?.data?.detail)
              ? err.response.data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
              : err?.response?.data?.message || err?.message || 'Failed to create folder'
        setError(errorMessage)
        // Don't close modal on error so user can see the error and retry
      }
    },
    [folderName, parentFolderId, onCreateFolder, onClose]
  )

  const handleClose = useCallback(() => {
    if (!isCreating) {
      setFolderName('')
      setError(null)
      onClose()
    }
  }, [isCreating, onClose])

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
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Folder</h2>
                <button
                  onClick={handleClose}
                  disabled={isCreating}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <label
                  htmlFor="folder-name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Folder Name
                </label>
                <input
                  id="folder-name"
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value)
                    setError(null)
                  }}
                  disabled={isCreating}
                  placeholder="Enter folder name"
                  className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>

              <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isCreating}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !folderName.trim()}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create Folder'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
