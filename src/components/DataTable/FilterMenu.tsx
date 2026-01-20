'use client'

import { useIsMobile } from '@/hooks/useIsMobile'
import { formatTitleString } from '@/utility/utility'
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { MenuOpen } from './DataTable'
import { FilterSubmenu } from './FilterSubmenu'
import type { Column, FilterState, SortState } from './types'

interface FilterMenuProps {
  menuOpen: MenuOpen | null
  onCloseMenu: () => void
  columns: Column[]
  activeFilters: FilterState[]
  sortState: SortState
  onAddFilter: (filters: FilterState[], replaceAll?: boolean, append?: boolean) => void
  onRemoveFilter: (index: number) => void
  onSetActiveSubmenu: (submenu: string | null) => void
  activeSubmenu: string | null
  onHandleSort: (field: string) => void
  onSetSortState: (state: SortState | ((prev: SortState) => SortState)) => void
  timeTagDefinitions?: Record<string, any>
  title: string
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  menuOpen,
  onCloseMenu,
  columns,
  activeFilters,
  sortState,
  onAddFilter,
  onRemoveFilter,
  onSetActiveSubmenu,
  activeSubmenu,
  onHandleSort,
  onSetSortState,
  timeTagDefinitions,
  title,
}) => {
  const isMobile = useIsMobile()
  const filterMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuOpen === 'filter' && filterMenuRef.current && !filterMenuRef.current.contains(target)) {
        onCloseMenu()
      }
    }

    if (menuOpen === 'filter') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen, onCloseMenu])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen === 'filter') {
        onCloseMenu()
      }
    }

    if (menuOpen === 'filter') {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, onCloseMenu])

  if (menuOpen !== 'filter') return null

  // Mobile: full-screen slide-in from left
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
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter Options</h3>
              <button
                onClick={onCloseMenu}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-56px)] overflow-y-auto">
              {/* Sort Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onSetActiveSubmenu(activeSubmenu === 'sort' ? null : 'sort')}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <span className="font-medium">Sort By</span>
                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform ${activeSubmenu === 'sort' ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeSubmenu === 'sort' && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                    <div className="flex flex-col gap-2">
                      <select
                        name={`sort-${title}`}
                        value={sortState.field || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            onHandleSort(e.target.value)
                          } else {
                            onSetSortState({ field: null, direction: 'asc' })
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
                      >
                        <option value="">Select field to sort</option>
                        {columns.map((col) => (
                          <option key={col.field} value={col.field}>
                            {formatTitleString(col.field)}
                          </option>
                        ))}
                      </select>
                      {sortState.field && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSetSortState((prev) => ({ ...prev, direction: 'asc' }))}
                            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                              sortState.direction === 'asc'
                                ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            Ascending
                          </button>
                          <button
                            onClick={() => onSetSortState((prev) => ({ ...prev, direction: 'desc' }))}
                            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                              sortState.direction === 'desc'
                                ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            Descending
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter by Column Section */}
              <div className="flex flex-col">
                {columns.map((column) => {
                  if (column.disableFilter) return null
                  const columnFilter = activeFilters.find((f) => f.field === column.field)
                  const hasActiveFilter = !!columnFilter

                  return (
                    <div key={column.field} className="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
                      <button
                        onClick={() => onSetActiveSubmenu(activeSubmenu === column.field ? null : column.field)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <span>{formatTitleString(column.field)}</span>
                          {hasActiveFilter && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                              {Array.isArray(columnFilter.value) ? columnFilter.value.length : '1'}
                            </span>
                          )}
                        </div>
                        <ChevronRightIcon
                          className={`h-4 w-4 transition-transform ${activeSubmenu === column.field ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {activeSubmenu === column.field && (
                        <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                          <FilterSubmenu
                            column={column}
                            activeFilters={activeFilters}
                            onAddFilter={onAddFilter}
                            onRemoveFilter={onRemoveFilter}
                            timeTagDefinitions={timeTagDefinitions}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Desktop floating menu
  return (
    <div
      ref={filterMenuRef}
      className="absolute left-0 top-full z-50 mt-2 w-80 origin-top-left rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter Options</h3>
        <button
          onClick={onCloseMenu}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Sort Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onSetActiveSubmenu(activeSubmenu === 'sort' ? null : 'sort')}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
          >
            <span className="font-medium">Sort By</span>
            <ChevronRightIcon
              className={`h-4 w-4 transition-transform ${activeSubmenu === 'sort' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeSubmenu === 'sort' && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex flex-col gap-2">
                <select
                  name={`sort-${title}`}
                  value={sortState.field || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      onHandleSort(e.target.value)
                    } else {
                      onSetSortState({ field: null, direction: 'asc' })
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
                >
                  <option value="">Select field to sort</option>
                  {columns.map((col) => {
                    if (col.disableFilter) return null
                    return (
                      <option key={col.field} value={col.field}>
                        {formatTitleString(col.field)}
                      </option>
                    )
                  })}
                </select>
                {sortState.field && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSetSortState((prev) => ({ ...prev, direction: 'asc' }))}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                        sortState.direction === 'asc'
                          ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => onSetSortState((prev) => ({ ...prev, direction: 'desc' }))}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-all ${
                        sortState.direction === 'desc'
                          ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      Descending
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter by Column Section */}
        <div className="flex flex-col">
          {columns.map((column) => {
            if (column.disableFilter) return null
            const columnFilter = activeFilters.find((f) => f.field === column.field)
            const hasActiveFilter = !!columnFilter

            return (
              <div key={column.field} className="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
                <button
                  onClick={() => onSetActiveSubmenu(activeSubmenu === column.field ? null : column.field)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-2">
                    <span>{formatTitleString(column.field)}</span>
                    {hasActiveFilter && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                        {Array.isArray(columnFilter.value) ? columnFilter.value.length : '1'}
                      </span>
                    )}
                  </div>
                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform ${activeSubmenu === column.field ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeSubmenu === column.field && (
                  <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                    <FilterSubmenu
                      column={column}
                      activeFilters={activeFilters}
                      onAddFilter={onAddFilter}
                      onRemoveFilter={onRemoveFilter}
                      timeTagDefinitions={timeTagDefinitions}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
