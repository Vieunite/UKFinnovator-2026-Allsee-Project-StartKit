'use client'

import { ColorPicker } from '@/components/ColorPicker'
import { useConfirm } from '@/context/ConfirmContext'
import type { Components } from '@/types/openapi'
import { DAY_LABELS } from '@/utility/timeTagHelpers'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'

type EditorMode = 'create' | 'edit'
type TimeTagRead = Components.Schemas.TimeTagRead
type TimeTagCreate = Components.Schemas.TimeTagCreate
type TimeTagUpdate = Components.Schemas.TimeTagUpdate
type TimeTagWindowCreate = Components.Schemas.TimeTagWindowCreate

type TimeTagEditorModalProps = {
  open: boolean
  mode: EditorMode
  initialTag?: TimeTagRead
  color?: string
  onColorChange?: (color: string) => void
  onClose: () => void
  onSave: (tag: TimeTagCreate | TimeTagUpdate, originalName?: string) => void
}

export const TimeTagEditorModal: React.FC<TimeTagEditorModalProps> = ({
  open,
  mode,
  initialTag,
  color,
  onColorChange,
  onClose,
  onSave,
}) => {
  const confirm = useConfirm()
  const [name, setName] = useState(initialTag?.name || '')
  const [description, setDescription] = useState(initialTag?.description || '')
  const [windows, setWindows] = useState<TimeTagWindowCreate[]>(initialTag?.windows || [])
  const [error, setError] = useState<string | null>(null)

  // Track initial state for change detection
  const initialState = useMemo(() => {
    if (!initialTag) {
      // For create mode, initial state is empty
      return {
        name: '',
        description: '',
        windows: [] as TimeTagWindowCreate[],
        color: color || '',
      }
    }
    // For edit mode, use the initial tag values
    return {
      name: initialTag.name,
      description: initialTag.description || '',
      windows: initialTag.windows.map((w) => ({
        days_of_week: w.days_of_week,
        start_time: w.start_time,
        end_time: w.end_time,
      })),
      color: initialTag.color || color || '',
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTag, color, open]) // Include 'open' to reset when modal opens

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const currentColor = color || ''
    if (name.trim() !== initialState.name.trim()) return true
    if ((description || '').trim() !== initialState.description.trim()) return true
    if (currentColor !== initialState.color) return true
    if (windows.length !== initialState.windows.length) return true

    // Deep compare windows
    for (let i = 0; i < windows.length; i++) {
      const current = windows[i]
      const initial = initialState.windows[i]
      if (!initial) return true
      if (
        JSON.stringify(current.days_of_week.sort()) !== JSON.stringify(initial.days_of_week.sort()) ||
        current.start_time !== initial.start_time ||
        current.end_time !== initial.end_time
      ) {
        return true
      }
    }
    return false
  }, [name, description, windows, color, initialState])

  const handleClose = async () => {
    if (hasUnsavedChanges) {
      const confirmed = await confirm({
        title: 'Unsaved Changes',
        description: 'You have unsaved changes. Are you sure you want to close without saving?',
        confirmText: 'Discard',
        cancelText: 'Cancel',
      })
      if (!confirmed) return
    }
    onClose()
  }

  useEffect(() => {
    if (initialTag) {
      setName(initialTag.name)
      setDescription(initialTag.description || '')
      setWindows(
        initialTag.windows.map((w) => ({
          days_of_week: w.days_of_week,
          start_time: w.start_time,
          end_time: w.end_time,
        }))
      )
      // Update color if provided and onColorChange is available
      if (initialTag.color && onColorChange) {
        onColorChange(initialTag.color)
      }
    } else {
      setName('')
      setDescription('')
      setWindows([])
    }
    setError(null)
  }, [initialTag, mode, open, onColorChange])

  if (typeof window === 'undefined') return null

  const addWindow = () => {
    setWindows([...windows, { days_of_week: [], start_time: '', end_time: '' }])
  }

  const removeWindow = (index: number) => {
    setWindows(windows.filter((_, i) => i !== index))
  }

  const updateWindow = (index: number, updates: Partial<TimeTagWindowCreate>) => {
    setWindows(windows.map((w, i) => (i === index ? { ...w, ...updates } : w)))
  }

  const toggleDayInWindow = (windowIndex: number, dayIndex: number) => {
    const window = windows[windowIndex]
    const newDays = window.days_of_week.includes(dayIndex)
      ? window.days_of_week.filter((d) => d !== dayIndex)
      : [...window.days_of_week, dayIndex].sort((a, b) => a - b)
    updateWindow(windowIndex, { days_of_week: newDays })
  }

  const normalizeWindow = (window: TimeTagWindowCreate): TimeTagWindowCreate => {
    let normalizedDays = [...window.days_of_week]
    let normalizedStartTime = window.start_time
    let normalizedEndTime = window.end_time

    // Scenario 3: Handle partial time specifications
    if (normalizedStartTime && !normalizedEndTime) {
      normalizedEndTime = '23:59'
    } else if (!normalizedStartTime && normalizedEndTime) {
      normalizedStartTime = '00:00'
    }

    // Scenario 1: Days chosen but no time range → use selected days with 00:00 - 23:59
    if (normalizedDays.length > 0 && !normalizedStartTime && !normalizedEndTime) {
      normalizedStartTime = '00:00'
      normalizedEndTime = '23:59'
    }

    // Scenario 2: No days chosen but time specified → use all 7 days
    if (normalizedDays.length === 0 && (normalizedStartTime || normalizedEndTime)) {
      normalizedDays = [0, 1, 2, 3, 4, 5, 6]
      // Ensure we have both times
      if (!normalizedStartTime) normalizedStartTime = '00:00'
      if (!normalizedEndTime) normalizedEndTime = '23:59'
    }

    return {
      days_of_week: normalizedDays.sort((a, b) => a - b),
      start_time: normalizedStartTime || '00:00',
      end_time: normalizedEndTime || '23:59',
    }
  }

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Tag name is required')
      return false
    }
    if (windows.length === 0) {
      setError('At least one window is required')
      return false
    }
    for (let i = 0; i < windows.length; i++) {
      const window = windows[i]
      const hasDays = window.days_of_week.length > 0
      const hasStartTime = !!window.start_time
      const hasEndTime = !!window.end_time
      const hasTime = hasStartTime || hasEndTime

      // Window must have at least 1 day OR a start/end time
      if (!hasDays && !hasTime) {
        setError(`Window ${i + 1}: At least one day or a time range must be specified`)
        return false
      }

      // If both times are provided, validate they're correct
      if (hasStartTime && hasEndTime && window.start_time >= window.end_time) {
        setError(`Window ${i + 1}: Start time must be before end time`)
        return false
      }
    }
    setError(null)
    return true
  }

  const handleSave = () => {
    if (!validate()) return

    // Normalize windows according to the business rules
    const windowsPayload: TimeTagWindowCreate[] = windows.map((w) => normalizeWindow(w))

    if (mode === 'create') {
      // For create, use TimeTagCreate (name and windows are required)
      const createPayload: TimeTagCreate = {
        name: name.trim(),
        description: description.trim() || null,
        is_active: true, // Always true for create/edit modal
        windows: windowsPayload,
        color: color || null,
      }
      onSave(createPayload)
    } else {
      // For update, use TimeTagUpdate (all fields optional)
      const updatePayload: TimeTagUpdate = {
        name: name.trim(),
        description: description.trim() || null,
        is_active: true, // Always true for create/edit modal
        windows: windowsPayload,
        color: color || null,
      }
      onSave(updatePayload, initialTag?.name)
    }
    onClose() // No need to check for changes here since we're saving
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {mode === 'create' ? 'Create Time Tag' : 'Edit Time Tag'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Define when this tag should play</p>
                </div>
                <button
                  onClick={handleClose}
                  /* Likely to be changed with APIs */
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tag Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning, Weekend, Weekday"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe what this tag controls..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Windows *
                  </label>
                  <button
                    onClick={addWindow}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add Window
                  </button>
                </div>
                {windows.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No windows defined. Click &apos;Add Window&apos; to create one.
                  </p>
                ) : (
                  windows.map((window, windowIndex) => (
                    <div
                      key={windowIndex}
                      className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Window {windowIndex + 1}
                        </span>
                        {windows.length > 1 && (
                          <button
                            onClick={() => removeWindow(windowIndex)}
                            className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Remove window"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Days {window.start_time || window.end_time ? '(optional)' : '*'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DAY_LABELS.map((label, dayIndex) => (
                            <button
                              key={label}
                              onClick={() => toggleDayInWindow(windowIndex, dayIndex)}
                              className={`min-w-[48px] rounded-lg border px-2 py-1 text-xs transition-colors ${
                                window.days_of_week.includes(dayIndex)
                                  ? 'border-primary text-primary bg-primary/10'
                                  : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Time Range {window.days_of_week.length > 0 ? '(optional)' : '*'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={window.start_time}
                            onChange={(e) => updateWindow(windowIndex, { start_time: e.target.value })}
                            placeholder="00:00"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">to</span>
                          <input
                            type="time"
                            value={window.end_time}
                            onChange={(e) => updateWindow(windowIndex, { end_time: e.target.value })}
                            placeholder="23:59"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {color !== undefined && onColorChange && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tag Color
                  </label>
                  <ColorPicker value={color} onChange={onColorChange} tagName={name || 'Tag Name'} />
                </div>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Save Tag
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
