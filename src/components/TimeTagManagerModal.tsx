'use client'

import { useConfirm } from '@/context/ConfirmContext'
import { TagColors } from '@/data'
import { useCreateTimeTag } from '@/hooks/api/tags/useCreateTimeTag'
import { useTimeTags } from '@/hooks/api/tags/useTimeTags'
import { useUpdateTimeTag } from '@/hooks/api/tags/useUpdateTimeTag'
import type { Components } from '@/types/openapi'
import { getTimeTagReadDetails, getTimeTagReadSummary } from '@/utility/timeTagHelpers'
import { removeBodyOverflow, resetBodyOverflow } from '@/utility/utility'
import {
  CheckIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { TimeTagEditorModal } from './TimeTagEditorModal'

type TimeTagRead = Components.Schemas.TimeTagRead
type TimeTagCreate = Components.Schemas.TimeTagCreate
type TimeTagUpdate = Components.Schemas.TimeTagUpdate

type TimeTagManagerModalProps = {
  open: boolean
  onClose: () => void
  itemName: string
  currentTags: TimeTagRead[]
  availableTags?: TimeTagRead[] // Made optional since we'll fetch from API
  // New callback: called with final tag list when user saves changes
  onSaveTags?: (tagIds: string[]) => Promise<void>
  // Legacy callbacks: kept for backward compatibility
  onToggleTag?: (tag: TimeTagRead, nextSelected: boolean) => void
  onSaveDefinition?: (tag: TimeTagRead, originalName?: string) => void
}

export const TimeTagManagerModal: React.FC<TimeTagManagerModalProps> = ({
  open,
  onClose,
  itemName,
  currentTags,
  availableTags: propAvailableTags,
  onSaveTags,
  onToggleTag,
  onSaveDefinition,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [infoTag, setInfoTag] = useState<TimeTagRead | null>(null)
  const [modeSelectionTag, setModeSelectionTag] = useState<TimeTagRead | null>(null)
  const [editorState, setEditorState] = useState<{ mode: 'create' | 'edit'; tag?: TimeTagRead } | null>(null)
  const [timeTagColor, setTimeTagColor] = useState<string>(TagColors[Math.floor(Math.random() * TagColors.length)])
  // Local state for tags (working copy)
  const [localTags, setLocalTags] = useState<TimeTagRead[]>(currentTags)
  const [isSaving, setIsSaving] = useState(false)
  const confirm = useConfirm()

  // Fetch time tags when modal opens
  const { data: timeTagsData, isLoading: isLoadingTags } = useTimeTags({}, { enabled: open })

  // Create and update mutation hooks
  const createTimeTagMutation = useCreateTimeTag()
  const updateTimeTagMutation = useUpdateTimeTag()

  // Build availableTags from API data or use prop
  const availableTags = useMemo(() => {
    if (timeTagsData?.items) {
      return timeTagsData.items
    }
    return propAvailableTags || []
  }, [timeTagsData, propAvailableTags])

  // Sync localTags with currentTags when modal opens or currentTags change
  useEffect(() => {
    if (open) {
      setLocalTags(currentTags)
    }
  }, [open, currentTags])

  // Helper to normalize tags for comparison
  const normalizeTags = useCallback((tags: TimeTagRead[]): string[] => {
    return tags
      .map((t) => t.id)
      .filter(Boolean)
      .sort()
  }, [])

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const normalizedCurrent = normalizeTags(currentTags)
    const normalizedLocal = normalizeTags(localTags)
    return JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedLocal)
  }, [currentTags, localTags, normalizeTags])

  const selectedTagMap = useMemo(() => {
    const map = new Map<string, TimeTagRead>()
    localTags.forEach((tag) => {
      map.set(tag.id, tag)
    })
    return map
  }, [localTags])

  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return availableTags
    return availableTags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [availableTags, searchTerm])

  const searchMatchesExisting = useMemo(() => {
    if (!searchTerm.trim()) return false
    return availableTags.some((tag) => tag.name.toLowerCase() === searchTerm.trim().toLowerCase())
  }, [availableTags, searchTerm])

  useEffect(() => {
    removeBodyOverflow()
    return () => {
      resetBodyOverflow()
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setModeSelectionTag(null)
    }
  }, [open])

  if (typeof window === 'undefined') return null

  const handleEditorSave = async (tag: TimeTagCreate | TimeTagUpdate, originalName?: string) => {
    try {
      if (originalName && editorState?.tag?.id) {
        // Edit mode: use the tag ID from editorState
        const updatedTag = await updateTimeTagMutation.mutateAsync({
          tagId: editorState.tag.id,
          data: tag as TimeTagUpdate,
        })
        // Legacy callback support
        if (onSaveDefinition) {
          onSaveDefinition(updatedTag, originalName)
        }
      } else {
        // Create mode
        const createdTag = await createTimeTagMutation.mutateAsync(tag as TimeTagCreate)
        // Add the newly created tag to local tags if not already present
        if (!localTags.some((t) => t.id === createdTag.id)) {
          setLocalTags([...localTags, createdTag])
        }
        setModeSelectionTag(createdTag)
        setSearchTerm('')
        // Legacy callback support
        if (onSaveDefinition) {
          onSaveDefinition(createdTag)
        }
      }
      setEditorState(null)
    } catch (error) {
      console.error('Error saving time tag:', error)
      // Don't close on error so user can retry
    }
  }

  const handleCreateNew = () => {
    const trimmedName = searchTerm.trim()
    if (!trimmedName) return
    // Set a random color when creating a new tag
    setTimeTagColor(TagColors[Math.floor(Math.random() * TagColors.length)])
    setEditorState({
      mode: 'create',
      tag: {
        id: '',
        name: trimmedName,
        description: null,
        is_active: true,
        organisation_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        windows: [],
        color: timeTagColor,
      },
    })
  }

  const handleEdit = (tag: TimeTagRead) => {
    // When editing, use the tag's color if it exists
    if (tag.color) {
      setTimeTagColor(tag.color)
    } else {
      setTimeTagColor(TagColors[Math.floor(Math.random() * TagColors.length)])
    }
    setEditorState({ mode: 'edit', tag })
  }

  const handleToggleTag = (tag: TimeTagRead, nextSelected: boolean) => {
    if (onSaveTags) {
      // New mode: update local state
      const next = [...localTags]
      const idx = next.findIndex((t) => t.id === tag.id)
      if (nextSelected) {
        if (idx === -1) {
          next.push(tag)
        }
      } else {
        if (idx > -1) {
          next.splice(idx, 1)
        }
      }
      setLocalTags(next)
    } else {
      // Legacy mode: use callback
      if (onToggleTag) {
        onToggleTag(tag, nextSelected)
      }
    }
  }

  const handleSave = async () => {
    if (onSaveTags) {
      setIsSaving(true)
      try {
        const tagIds = localTags.map((t) => t.id).filter(Boolean)
        await onSaveTags(tagIds)
        onClose()
      } catch (error) {
        console.error('Error saving time tags:', error)
        // Don't close on error so user can retry
      } finally {
        setIsSaving(false)
      }
    } else {
      // Legacy mode: just close
      onClose()
    }
  }

  const handleClose = async () => {
    // Check for unsaved changes
    if (hasUnsavedChanges && onSaveTags) {
      const shouldClose = await confirm({
        title: 'Unsaved Changes',
        description: 'You have unsaved changes. Are you sure you want to close without saving?',
        confirmText: 'Discard Changes',
        cancelText: 'Cancel',
      })
      if (!shouldClose) {
        return // User cancelled, don't close
      }
    }

    // Reset local state when closing
    setLocalTags(currentTags)
    setSearchTerm('')
    setInfoTag(null)
    setModeSelectionTag(null)
    setEditorState(null)
    onClose()
  }

  const handleInfo = (tag: TimeTagRead) => {
    setInfoTag(tag)
  }

  const handleModeSelection = (mode: 'include' | 'exclude') => {
    if (!modeSelectionTag) return
    // For TimeTagRead, we don't have include/exclude mode in the API structure
    // This might need to be handled differently - for now, just toggle the tag
    handleToggleTag(modeSelectionTag, true)
    setModeSelectionTag(null)
  }

  const handleModeSelectionCancel = () => {
    setModeSelectionTag(null)
  }

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Manage Time Tags</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{itemName}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search or create a time tag..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                    />
                  </div>
                  {searchTerm.trim() && !searchMatchesExisting && (
                    <button
                      onClick={handleCreateNew}
                      className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Create
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
                {isLoadingTags ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading time tags...</p>
                ) : filteredTags.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No time tags found.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredTags.map((tag) => {
                      const selectedTag = selectedTagMap.get(tag.id)
                      const isSelected = !!selectedTag
                      const displayTag = selectedTag || tag
                      // Use new API structure summary
                      const summary = getTimeTagReadSummary(displayTag, { showMultipleWindows: true })
                      const label = displayTag.name

                      return (
                        <div
                          key={tag.id || tag.name}
                          className="flex flex-col rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 dark:border-gray-700"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => {
                                if (isSelected && selectedTag) {
                                  handleToggleTag(selectedTag, false)
                                } else {
                                  setModeSelectionTag(tag)
                                }
                              }}
                              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'border-green-300 bg-green-50 text-green-600 hover:border-green-400 dark:border-green-500/40 dark:bg-green-900/20 dark:text-green-300 dark:hover:border-green-500/50'
                                  : 'border-gray-300 text-gray-700 hover:border-primary/40 dark:border-gray-600 dark:text-gray-200'
                              }`}
                            >
                              {isSelected ? <CheckIcon className="h-4 w-4 stroke-2" /> : <span className="h-4 w-4" />}
                              {label}
                            </button>
                            <div className="ml-auto flex items-center gap-1">
                              <button
                                onClick={() => handleInfo(tag)}
                                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                aria-label="View tag details"
                              >
                                <QuestionMarkCircleIcon className="h-5 w-5 stroke-2" />
                              </button>
                              <button
                                onClick={() => handleEdit(tag)}
                                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                aria-label="Edit tag"
                              >
                                <PencilSquareIcon className="h-5 w-5 stroke-2" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{summary}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {onSaveTags && (
                <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleClose}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <TimeTagEditorModal
        open={!!editorState}
        mode={editorState?.mode || 'create'}
        initialTag={editorState?.tag}
        color={timeTagColor}
        onColorChange={setTimeTagColor}
        onClose={() => setEditorState(null)}
        onSave={handleEditorSave}
      />
      <AnimatePresence>
        {modeSelectionTag && (
          <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30"
              onClick={handleModeSelectionCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  How should “{modeSelectionTag.name}” behave?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose whether to include or exclude this tag for {itemName}.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => handleModeSelection('include')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-green-300 px-4 py-3 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50 dark:border-green-500/40 dark:text-green-300 dark:hover:bg-green-900/20"
                >
                  <PlusCircleIcon className="h-5 w-5 stroke-2" />
                  <span>Include</span>
                </button>
                <button
                  onClick={() => handleModeSelection('exclude')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  <MinusCircleIcon className="h-5 w-5 stroke-2" />
                  <span>Exclude</span>
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleModeSelectionCancel}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {infoTag && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30"
              onClick={() => setInfoTag(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{infoTag.name}</p>
                <button
                  onClick={() => setInfoTag(null)}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              {infoTag.description && (
                <div className="mb-3 border-b border-gray-100 pb-2 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
                  {infoTag.description}
                </div>
              )}
              {getTimeTagReadDetails(infoTag).map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between border-b border-gray-100 py-1 text-xs last:border-b-0 dark:border-gray-800"
                >
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{detail.label}</span>
                  <span className="text-gray-800 dark:text-gray-200">{detail.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>,
    document.body
  )
}
