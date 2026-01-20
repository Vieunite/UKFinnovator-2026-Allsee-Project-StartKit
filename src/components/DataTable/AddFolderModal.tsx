'use client'

import type { Organisation } from '@/context/OrganisationContext'
import type { MediaFolder } from '@/data'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type AddFolderModalProps = {
  open: boolean
  onClose: () => void
  availableTags: Record<string, string>
  selectedOrganisation: Organisation | null
  onAddFolder: (folderName: string, tags: string[], organisationId: string) => void
  parentFolder?: MediaFolder | null
}

// Helper to flatten organisations for dropdown
const flattenOrganisations = (orgs: Organisation[]): Organisation[] => {
  const result: Organisation[] = []
  orgs.forEach((org) => {
    result.push(org)
    if (org.children) {
      result.push(...flattenOrganisations(org.children))
    }
  })
  return result
}

export const AddFolderModal: React.FC<AddFolderModalProps> = ({
  open,
  onClose,
  availableTags,
  selectedOrganisation,
  onAddFolder,
  parentFolder,
}) => {
  const [folderName, setFolderName] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  // If parent folder exists, use its organisation; otherwise use selected organisation
  const defaultOrgId = parentFolder ? parentFolder.organisation_id : selectedOrganisation?.id || ''
  const [selectedOrgId, setSelectedOrgId] = useState<string>(defaultOrgId)
  const [tagSearchTerm, setTagSearchTerm] = useState('')

  // Helper to recursively collect all descendants of an organisation
  const getAllDescendants = useCallback((org: Organisation): Organisation[] => {
    const descendants: Organisation[] = []
    if (org.children && org.children.length > 0) {
      org.children.forEach((child) => {
        descendants.push(child)
        // Recursively get descendants of children
        descendants.push(...getAllDescendants(child))
      })
    }
    return descendants
  }, [])

  // Get available organisations based on selected organisation
  // If selected org has children (at any level), show parent + all descendants
  // If selected org is a leaf (no children), only show that org
  const availableOrganisations = useMemo(() => {
    if (!selectedOrganisation) return []

    // Check if organisation has any descendants (children, grandchildren, etc.)
    const descendants = getAllDescendants(selectedOrganisation)

    // If organisation has descendants, return parent + all descendants
    if (descendants.length > 0) {
      return [selectedOrganisation, ...descendants]
    }

    // If organisation is a leaf (no descendants), only show that organisation
    return [selectedOrganisation]
  }, [selectedOrganisation, getAllDescendants])

  // If parent folder exists, organisation is locked to parent's organisation
  const isOrganisationLocked = !!parentFolder

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    const all = Object.keys(availableTags)
    if (!tagSearchTerm.trim()) return all
    return all.filter((t) => t.toLowerCase().includes(tagSearchTerm.toLowerCase()))
  }, [availableTags, tagSearchTerm])

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setFolderName('')
      setSelectedTags([])
      setSelectedOrgId(defaultOrgId)
      setTagSearchTerm('')
    }
  }, [open, defaultOrgId])

  const handleToggleTag = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName)
      }
      return [...prev, tagName]
    })
  }

  const handleAddTag = (tagName: string) => {
    const trimmedTag = tagName.trim()
    if (!trimmedTag || selectedTags.includes(trimmedTag)) return

    // Check if tag exists in available tags (case-insensitive)
    const existingTag = Object.keys(availableTags).find((t) => t.toLowerCase() === trimmedTag.toLowerCase())
    setSelectedTags((prev) => [...prev, existingTag || trimmedTag])
    setTagSearchTerm('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim() || !selectedOrgId) return

    onAddFolder(folderName.trim(), selectedTags, selectedOrgId)
    onClose()
  }

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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              className="border-b border-gray-200 px-4 py-3 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Add New Folder</h3>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
              <div className="space-y-4 p-4">
                {/* Folder Name */}
                <div>
                  <label
                    htmlFor="folder-name"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Folder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="folder-name"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    required
                    className="dark:text-textDarkMode w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>

                {/* Organisation Dropdown */}
                <div>
                  <label
                    htmlFor="organisation"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Organisation <span className="text-red-500">*</span>
                    {isOrganisationLocked && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        (locked to parent folder&apos;s organisation)
                      </span>
                    )}
                  </label>
                  <select
                    id="organisation"
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    required
                    disabled={isOrganisationLocked}
                    className="dark:text-textDarkMode w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:disabled:bg-gray-800"
                  >
                    {availableOrganisations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                  <div className="space-y-2">
                    {/* Tag Search/Add */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag(tagSearchTerm)
                          }
                        }}
                        placeholder="Search or add tag..."
                        className="dark:text-textDarkMode flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      />
                      {tagSearchTerm.trim() &&
                        !selectedTags.some((t) => t.toLowerCase() === tagSearchTerm.trim().toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => handleAddTag(tagSearchTerm)}
                            className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
                          >
                            Add
                          </button>
                        )}
                    </div>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: availableTags[tag] || '#D1D5DB', color: '#000' }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className="ml-1 rounded-full hover:bg-black/10"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Available Tags */}
                    {filteredTags.length > 0 && (
                      <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                        <div className="px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Available Tags</div>
                        {filteredTags.map((tag) => {
                          const isSelected = selectedTags.includes(tag)
                          return (
                            <label
                              key={tag}
                              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleTag(tag)}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                              />
                              <span
                                className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{ backgroundColor: availableTags[tag] || '#D1D5DB', color: '#000' }}
                              >
                                {tag}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!folderName.trim() || !selectedOrgId}
                    className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Create Folder
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
