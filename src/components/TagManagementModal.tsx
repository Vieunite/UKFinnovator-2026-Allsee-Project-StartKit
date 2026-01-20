'use client'

import { useConfirm } from '@/context/ConfirmContext'
import { getAllTags, getTagColor } from '@/data'
import { formatTitleString, removeBodyOverflow, resetBodyOverflow } from '@/utility/utility'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type TagManagementModalProps = {
  open: boolean
  onClose: () => void
  name: string
  fieldName?: string
  title?: string
  availableTags?: Record<string, string> // Optional - if not provided, will use fake data from data.tsx
  currentTags: string[]
  // New callback: called with final tag list when user saves changes
  onSaveTags?: (tagNames: string[]) => Promise<void>
  // Legacy callbacks: kept for backward compatibility
  onToggleTag?: (tagName: string) => void
  onAddTag?: (tagName: string) => void
}

export const TagManagementModal: React.FC<TagManagementModalProps> = ({
  open,
  onClose,
  name,
  fieldName,
  title,
  availableTags: propAvailableTags,
  currentTags,
  onSaveTags,
  onToggleTag,
  onAddTag,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagDescription, setNewTagDescription] = useState('')
  // Local state for tags (working copy)
  const [localTags, setLocalTags] = useState<string[]>(currentTags)
  const [isSaving, setIsSaving] = useState(false)
  const confirm = useConfirm()

  // Build base availableTags from fake data or use prop
  const baseAvailableTags = useMemo(() => {
    if (propAvailableTags) {
      return propAvailableTags
    }
    // Use fake data from data.tsx
    const allTags = getAllTags()
    const tagsMap: Record<string, string> = {}
    allTags.forEach((tag) => {
      tagsMap[tag.name] = tag.color || '#D1D5DB'
    })
    return tagsMap
  }, [propAvailableTags])

  // Local state for availableTags that can be extended with newly created tags
  const [availableTags, setAvailableTags] = useState<Record<string, string>>(baseAvailableTags)

  // Sync availableTags with baseAvailableTags when it changes
  useEffect(() => {
    setAvailableTags(baseAvailableTags)
  }, [baseAvailableTags])

  // Helper to normalize tags for comparison (handle both string and object formats)
  const normalizeTags = useCallback((tags: string[]): string[] => {
    const getTagName = (t: string | { name?: string }) => {
      if (typeof t === 'string') return t.toLowerCase().trim()
      return (t.name || '').toLowerCase().trim()
    }
    return tags.map(getTagName).filter(Boolean).sort()
  }, [])

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const normalizedCurrent = normalizeTags(currentTags)
    const normalizedLocal = normalizeTags(localTags)
    return JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedLocal)
  }, [currentTags, localTags, normalizeTags])

  // Sync localTags with currentTags when modal opens or currentTags change
  useEffect(() => {
    if (open) {
      setLocalTags(currentTags)
    }
  }, [open, currentTags])

  const filteredTags = useMemo(() => {
    const all = Object.keys(availableTags)
    if (!searchTerm.trim()) return all
    return all.filter((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [availableTags, searchTerm])

  // Check if tag exists
  const tagExists = useMemo(() => {
    if (!searchTerm.trim()) return false
    const tagLower = searchTerm.trim().toLowerCase()
    return Object.keys(availableTags).some((t) => t.toLowerCase() === tagLower)
  }, [searchTerm, availableTags])

  const handleToggleTag = (tagName: string) => {
    // Helper to extract tag name (handle both string and object formats)
    const getTagName = (t: string | { name?: string }) => {
      if (typeof t === 'string') return t
      return t.name || ''
    }

    const tagLower = tagName.toLowerCase()
    const idx = localTags.findIndex((t) => {
      const tName = getTagName(t)
      return tName.toLowerCase() === tagLower
    })
    const next = [...localTags]
    if (idx > -1) {
      next.splice(idx, 1)
    } else {
      next.push(tagName)
    }
    setLocalTags(next)

    // Legacy callback support
    if (onToggleTag) {
      onToggleTag(tagName)
    }
  }

  const handleAdd = () => {
    const tagName = searchTerm.trim()
    if (!tagName) return

    // Helper to extract tag name (handle both string and object formats)
    const getTagName = (t: string | { name?: string }) => {
      if (typeof t === 'string') return t
      return t.name || ''
    }

    const tagLower = tagName.toLowerCase()
    const existsOnItem = localTags.some((t) => {
      const tName = getTagName(t)
      return tName.toLowerCase() === tagLower
    })
    if (existsOnItem) {
      setSearchTerm('')
      return
    }

    // If tag exists in available tags, add it directly
    const match = Object.keys(availableTags).find((t) => t.toLowerCase() === tagLower)
    if (match) {
      const finalTag = match
      // Add to local tags
      setLocalTags([...localTags, finalTag])
      setSearchTerm('')

      // Legacy callback support
      if (onAddTag) {
        onAddTag(finalTag)
      }
    } else {
      // If tag doesn't exist in available tags, show create tag UI
      // Don't add the tag yet - wait for user to click "Create Tag" button
      setNewTagName(tagName)
      setShowCreateTag(true)
      // Don't clear search term yet - let them see what they typed
    }
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) return

    // Helper to extract tag name (handle both string and object formats)
    const getTagName = (t: string | { name?: string }) => {
      if (typeof t === 'string') return t
      return t.name || ''
    }
    const tagLower = newTagName.trim().toLowerCase()
    const newTagNameTrimmed = newTagName.trim()

    // Check if tag already exists in local tags
    if (
      !localTags.some((t) => {
        const tName = getTagName(t)
        return tName.toLowerCase() === tagLower
      })
    ) {
      // Add the newly created tag to local tags
      setLocalTags([...localTags, newTagNameTrimmed])
    }

    // Add the new tag to availableTags with color from getTagColor
    const tagColor = getTagColor(newTagNameTrimmed) || '#D1D5DB'
    if (!availableTags[newTagNameTrimmed]) {
      setAvailableTags((prev) => ({
        ...prev,
        [newTagNameTrimmed]: tagColor,
      }))
    } else {
      // If tag already exists, update its color
      setAvailableTags((prev) => ({
        ...prev,
        [newTagNameTrimmed]: tagColor,
      }))
    }

    // Reset form
    setShowCreateTag(false)
    setNewTagName('')
    setNewTagDescription('')
    setSearchTerm('')

    // Legacy callback support
    if (onAddTag) {
      onAddTag(newTagNameTrimmed)
    }
  }

  const handleSave = async () => {
    if (onSaveTags) {
      setIsSaving(true)
      try {
        await onSaveTags(localTags)
        onClose()
      } catch (error) {
        console.error('Error saving tags:', error)
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
    setShowCreateTag(false)
    setSearchTerm('')
    onClose()
  }

  const handleCancelCreate = () => {
    setShowCreateTag(false)
    setNewTagName('')
    setNewTagDescription('')
  }

  useEffect(() => {
    removeBodyOverflow()
    return () => {
      resetBodyOverflow()
    }
  }, [])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              className="border-b border-gray-200 px-4 py-3 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {title ? title : `Manage ${formatTitleString(fieldName ?? 'Tags')}`}
                  </h3>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">{name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {onSaveTags && !showCreateTag && (
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {!showCreateTag ? (
              <div className="border-b border-gray-200 p-4 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="searchTags"
                      id="searchTags"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAdd()
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                    />
                  </div>
                  {searchTerm.trim() &&
                    (() => {
                      // Helper to extract tag name (handle both string and object formats)
                      const getTagName = (t: string | { name?: string }) => {
                        if (typeof t === 'string') return t
                        return t.name || ''
                      }
                      return !localTags.some((t) => {
                        const tName = getTagName(t)
                        return tName.toLowerCase() === searchTerm.trim().toLowerCase()
                      })
                    })() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdd()
                        }}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                      >
                        {tagExists ? 'Add Tag' : 'Create Tag'}
                      </motion.button>
                    )}
                </div>
              </div>
            ) : (
              <div className="border-b border-gray-200 p-4 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="newTagName"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      Tag Name
                    </label>
                    <input
                      type="text"
                      id="newTagName"
                      name="newTagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newTagDescription"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="newTagDescription"
                      name="newTagDescription"
                      value={newTagDescription}
                      onChange={(e) => setNewTagDescription(e.target.value)}
                      placeholder="Enter description"
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelCreate}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                      className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Create Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showCreateTag && (
              <div className="max-h-64 overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                {filteredTags.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">No tags found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredTags.map((tag) => {
                      // Safely extract tag name for comparison (handle both string and object formats)
                      const getTagName = (t: string | { name?: string }) => {
                        if (typeof t === 'string') return t
                        return t.name || ''
                      }
                      const isSelected = localTags.some((t) => {
                        const tagName = getTagName(t)
                        return tagName.toLowerCase() === tag.toLowerCase()
                      })
                      // Get tag color from availableTags or use getTagColor as fallback
                      const tagColor = availableTags[tag] || getTagColor(tag) || '#D1D5DB'
                      return (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleToggleTag(tag)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span
                            className="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: tagColor, color: '#000' }}
                          >
                            {formatTitleString(tag)}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
