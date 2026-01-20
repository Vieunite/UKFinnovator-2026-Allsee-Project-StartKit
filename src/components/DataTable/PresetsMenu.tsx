'use client'

import PrimaryButton from '@/components/PrimaryButton'
import { useConfirm } from '@/context/ConfirmContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { formatTitleString } from '@/utility/utility'
import { QuestionMarkCircleIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import OutlinedWhiteButton from '../OutlinedWhiteButton'
import { MenuOpen } from './DataTable'
import type { FilterState, QuickFilters, SortState } from './types'

export interface PresetType extends QuickFilters {
  id: string
  enabled: boolean
  sortState?: SortState
  description?: string
}

interface PresetsMenuProps {
  menuOpen: MenuOpen | null
  onCloseMenu: () => void
  presetsFilters: PresetType[]
  setPresetFilters: React.Dispatch<React.SetStateAction<PresetType[]>>
  activeFilters: FilterState[]
  sortState: SortState
}

const cloneFilters = (filters: FilterState[]) =>
  filters.map((filter) => {
    const value = filter.value
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { ...filter, value: [] }
      }
      if (typeof value[0] === 'object') {
        return {
          ...filter,
          value: (value as { type: 'id' | 'name'; value: string }[]).map((val) => ({ ...val })),
        }
      }
      return { ...filter, value: [...(value as string[])] }
    }
    return { ...filter }
  })

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const PresetsMenu: React.FC<PresetsMenuProps> = ({
  menuOpen,
  onCloseMenu,
  presetsFilters,
  setPresetFilters,
  activeFilters,
  sortState,
}) => {
  const isMobile = useIsMobile()
  const presetsMenuRef = useRef<HTMLDivElement>(null)
  const confirm = useConfirm()
  const [infoPreset, setInfoPreset] = useState<PresetType | null>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')

  const hasFiltersToSave = activeFilters.length > 0 || Boolean(sortState.field)

  const handleToggleEnabled = useCallback(
    (presetId: string, enabled: boolean) => {
      setPresetFilters((prev) => prev.map((preset) => (preset.id === presetId ? { ...preset, enabled } : preset)))
    },
    [setPresetFilters]
  )

  const handleDeletePreset = useCallback(
    async (preset: PresetType) => {
      const confirmed = await confirm({
        title: 'Delete preset',
        description: `Are you sure you want to delete the preset <strong>${preset.title}</strong>`,
        confirmText: 'Delete',
      })
      if (confirmed) {
        setPresetFilters((prev) => prev.filter((p) => p.id !== preset.id))
      }
    },
    [confirm, setPresetFilters]
  )

  const handleSavePreset = useCallback(() => {
    const trimmedName = newPresetName.trim()
    if (!trimmedName) return
    const newPreset: PresetType = {
      id: generateId(),
      title: trimmedName,
      filters: cloneFilters(activeFilters),
      sortState: sortState.field ? { ...sortState } : undefined,
      enabled: true,
    }
    setPresetFilters((prev) => [...prev, newPreset])
    setNewPresetName('')
    setIsSaveModalOpen(false)
  }, [activeFilters, sortState, newPresetName, setPresetFilters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuOpen === 'presets' && presetsMenuRef.current && !presetsMenuRef.current.contains(target)) {
        if (!infoPreset && !isSaveModalOpen) {
          onCloseMenu()
        }
      }
    }

    if (menuOpen === 'presets') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen, onCloseMenu, infoPreset, isSaveModalOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen === 'presets') {
        if (infoPreset) return setInfoPreset(null)
        if (isSaveModalOpen) return setIsSaveModalOpen(false)
        onCloseMenu()
      }
    }

    if (menuOpen === 'presets') {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, onCloseMenu, infoPreset, isSaveModalOpen])

  useEffect(() => {
    if (menuOpen !== 'presets') {
      setInfoPreset(null)
      setIsSaveModalOpen(false)
      setNewPresetName('')
    }
  }, [menuOpen, infoPreset])

  const renderPresetList = () => (
    <div className="flex flex-col gap-3 p-3">
      {presetsFilters.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No presets yet. To create a preset, begin by applying some filters and save them here.
        </p>
      )}
      {presetsFilters.map((preset) => (
        <div
          key={preset.id}
          className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-900/30"
        >
          <input
            id={`preset-${preset.id}`}
            type="checkbox"
            checked={preset.enabled}
            onChange={(e) => handleToggleEnabled(preset.id, e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={`preset-${preset.id}`} className="font-semibold text-gray-900 dark:text-gray-100">
                {preset.title}
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setInfoPreset(preset)}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  aria-label="View preset details"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 stroke-2" />
                </button>
                <button
                  onClick={() => handleDeletePreset(preset)}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                  aria-label="Delete preset"
                >
                  <TrashIcon className="h-4 w-4 stroke-2" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {preset.filters.length} filters{preset.sortState?.field ? ' • Sort applied' : ''}
            </p>
          </div>
        </div>
      ))}

      {hasFiltersToSave && (
        <PrimaryButton onClick={() => setIsSaveModalOpen(true)} className="mt-2 w-full justify-center">
          Save filters as preset
        </PrimaryButton>
      )}
    </div>
  )

  if (menuOpen !== 'presets') return null

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30"
          onClick={onCloseMenu}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed left-0 top-0 z-50 h-full w-[85vw] max-w-xs overflow-y-auto bg-white shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Manage Presets</h3>
              <button
                onClick={onCloseMenu}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-56px)] overflow-y-auto">{renderPresetList()}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <>
      <div
        ref={presetsMenuRef}
        className="absolute left-0 top-full z-50 mt-2 w-80 origin-top-left rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Manage Presets</h3>
          <button
            onClick={onCloseMenu}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">{renderPresetList()}</div>
      </div>

      {/* Info Modal */}
      {infoPreset && (
        <div
          onClick={() => setInfoPreset(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{infoPreset.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Preset details</p>
              </div>
              <button
                onClick={() => setInfoPreset(null)}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Filters</p>
                {infoPreset.filters.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No filters</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {infoPreset.filters.map((filter, idx) => (
                      <li key={`${filter.field}-${idx}`}>
                        <span className="font-semibold">{formatTitleString(String(filter.field))}</span>:{' '}
                        <span>{JSON.stringify(filter.value)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Sort</p>
                {infoPreset.sortState?.field ? (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {formatTitleString(String(infoPreset.sortState.field))} (
                    {infoPreset.sortState.direction.toUpperCase()})
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No sort applied</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <OutlinedWhiteButton onClick={() => setInfoPreset(null)}>Close</OutlinedWhiteButton>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {isSaveModalOpen && (
        <div
          onClick={() => setIsSaveModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Save filters as preset</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will capture the current filters and sorting for quick access later.
            </p>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Preset name</label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="dark:text-textDarkMode mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <OutlinedWhiteButton onClick={() => setIsSaveModalOpen(false)}>Cancel</OutlinedWhiteButton>
              <PrimaryButton onClick={handleSavePreset} disabled={!newPresetName.trim()}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
