'use client'

import { useFolderTree } from '@/hooks/api/media/useFolders'
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type MoveMediaModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (folderId: number | null, folderName: string) => Promise<void> // Make async to handle loading state
  excludeFolderId?: number | null // Don't allow moving into the same folder
  currentFolderId?: number | null // Current folder context
  itemCurrentFolderId?: number | null // The folder_id of the item being moved (for showing "current" indicator)
}

export const MoveMediaModal: React.FC<MoveMediaModalProps> = ({
  open,
  onClose,
  onConfirm,
  excludeFolderId,
  currentFolderId,
  itemCurrentFolderId,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null) // Default to Root (-1)
  const [isMoving, setIsMoving] = useState<boolean>(false)
  const { data: folderTree, isLoading } = useFolderTree()

  // Flatten folder tree for display
  const flattenedFolders = useMemo(() => {
    if (!folderTree?.items) return []

    const flatten = (nodes: typeof folderTree.items, level = 0): Array<{ id: number; name: string; level: number }> => {
      const result: Array<{ id: number; name: string; level: number }> = []

      // Add "Root" option (null folder_id)
      if (level === 0) {
        result.push({ id: -1, name: 'Root (No Folder)', level: 0 })
      }

      nodes.forEach((node) => {
        // Skip the folder we're excluding (can't move into itself)
        if (excludeFolderId && node.id === excludeFolderId) return

        result.push({ id: node.id, name: node.name, level })
        if (node.children && node.children.length > 0) {
          result.push(...flatten(node.children, level + 1))
        }
      })

      return result
    }

    return flatten(folderTree.items)
  }, [folderTree, excludeFolderId])

  // Determine if we should disable the current folder (only when moving a single item)
  const shouldDisableCurrentFolder = itemCurrentFolderId !== undefined

  const handleConfirm = useCallback(async () => {
    if (isMoving || selectedFolderId === null) return

    // Convert -1 (Root) to null
    const folderId = selectedFolderId === -1 ? null : selectedFolderId
    // Get folder name from flattened folders
    const selectedFolder = flattenedFolders.find((f) => f.id === selectedFolderId)
    const folderName = selectedFolder ? selectedFolder.name : 'Root'

    setIsMoving(true)
    try {
      await onConfirm(folderId, folderName)
      // Only clear selection and close if successful (onConfirm handles closing on success)
      setSelectedFolderId(null)
    } catch (error) {
      // Re-throw error so parent can handle it
      throw error
    } finally {
      setIsMoving(false)
    }
  }, [selectedFolderId, onConfirm, flattenedFolders, isMoving])

  const handleCancel = useCallback(() => {
    setSelectedFolderId(null) // Clear selection
    onClose()
  }, [onClose])

  // Reset selection when modal opens (no default selection)
  useEffect(() => {
    if (open) {
      setSelectedFolderId(null) // No default selection - user must choose
    }
  }, [open])

  if (typeof window === 'undefined') return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30"
            onClick={handleCancel}
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
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Move to Folder</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select a destination folder</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : flattenedFolders.length === 0 ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">No folders available</div>
              ) : (
                <div className="space-y-1">
                  {flattenedFolders.map((folder) => {
                    // Check if this folder should be disabled (current folder when moving single item)
                    const isCurrentFolder =
                      (itemCurrentFolderId !== undefined &&
                        itemCurrentFolderId !== null &&
                        folder.id === itemCurrentFolderId) ||
                      (itemCurrentFolderId === null && folder.id === -1)
                    const isDisabled = shouldDisableCurrentFolder && isCurrentFolder
                    const isSelected = selectedFolderId === folder.id

                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedFolderId(folder.id === -1 ? -1 : folder.id)
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : isSelected
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{ paddingLeft: `${12 + folder.level * 20}px` }}
                      >
                        <div className="flex items-center gap-2">
                          <FolderIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{folder.name}</span>
                          {isCurrentFolder && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">(current)</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selectedFolderId === null || selectedFolderId === undefined || isMoving}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMoving ? 'Moving...' : 'Move'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
