'use client'

import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import React, { useCallback, useRef, useState } from 'react'
import { ColumnsMenu } from './ColumnsMenu'
import { MenuOpen } from './DataTable'
import { FilterMenu } from './FilterMenu'
import { PresetsMenu, PresetType } from './PresetsMenu'
import type { Column, FilterState, SortState } from './types'

interface TableOptionsProps {
  title: string
  menuOpen: MenuOpen | null
  activeFiltersCount: number
  handleRefetch?: () => Promise<void>
  onToggleMenu: (menuType: MenuOpen) => void
  onCloseMenu: () => void
  BeforeOptions?: React.ComponentType
  AfterOptions?: React.ComponentType
  // For filter menu
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
  // For presets menu
  presetFilters: PresetType[]
  setPresetFilters: React.Dispatch<React.SetStateAction<PresetType[]>>
  // For columns menu
  onToggleColumnVisibility: (field: string) => void
  hideFilter?: boolean
  hideSearch?: boolean
  hideColumns?: boolean
  hideRefresh?: boolean
  hidePresets?: boolean
}

export const TableOptions: React.FC<TableOptionsProps> = ({
  title,
  menuOpen,
  activeFiltersCount,
  handleRefetch,
  onToggleMenu,
  onCloseMenu,
  BeforeOptions,
  AfterOptions,
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
  presetFilters,
  setPresetFilters,
  onToggleColumnVisibility,
  hideFilter = false,
  hideSearch = false,
  hideColumns = false,
  hideRefresh = false,
  hidePresets = false,
}) => {
  // Internal state for search
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Search handlers
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true)
  }, [])

  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node | null

    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return
    }

    setTimeout(() => {
      setIsSearchFocused(false)
    }, 150)
  }, [])

  const handleSearchSubmit = useCallback(() => {
    if (searchTerm.trim()) {
      onAddFilter([{ field: 'search', value: searchTerm.trim(), type: 'text' }], false, true)
      setSearchTerm('')
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 0)
    }
  }, [searchTerm, onAddFilter])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearchSubmit()
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false)
        setSearchTerm('')
        if (searchInputRef.current) {
          searchInputRef.current.blur()
        }
      }
    },
    [handleSearchSubmit]
  )

  const handleSearchContainerClick = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
      setTimeout(() => {
        setIsSearchFocused(true)
      }, 200)
    }
  }, [])

  return (
    <div className="flex min-h-12 w-full flex-wrap items-center gap-3 rounded-t-xl border border-b bg-white p-2 dark:border-gray-700 dark:bg-gray-800 lg:pl-12">
      {BeforeOptions && <BeforeOptions />}
      {!hideSearch && (
        <div
          onClick={handleSearchContainerClick}
          className={`flex w-fit cursor-pointer items-center gap-2 rounded border px-2 py-1 transition-all duration-300 ease-in-out ${
            isSearchFocused
              ? 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
              : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'
          }`}
        >
          <MagnifyingGlassIcon
            className={`h-5 w-5 stroke-2 transition-colors duration-300 ${isSearchFocused ? 'text-gray-400' : ''}`}
          />
          <input
            name={`search-${title}`}
            ref={searchInputRef}
            type="text"
            placeholder={isSearchFocused ? `Search ${title}...` : 'Search'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className={`border-none bg-transparent text-sm outline-none transition-all duration-100 ${
              isSearchFocused
                ? 'w-44 placeholder:text-gray-400 dark:text-textDarkMode'
                : 'w-14 cursor-pointer placeholder:text-gray-600 dark:text-textDarkMode dark:placeholder:text-gray-400'
            }`}
          />
        </div>
      )}

      {!hideFilter && (
        <div className="relative">
          <button
            onClick={() => onToggleMenu('filter')}
            className={`flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
              menuOpen === 'filter' ? 'bg-gray-100 dark:bg-gray-700/50' : ''
            }`}
          >
            <FunnelIcon className="h-5 w-5 stroke-2 transition-colors duration-300" />
            <span className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Filter
            </span>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{activeFiltersCount}</span>
            )}
          </button>
          <FilterMenu
            menuOpen={menuOpen}
            onCloseMenu={onCloseMenu}
            columns={columns}
            activeFilters={activeFilters}
            sortState={sortState}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter}
            onSetActiveSubmenu={onSetActiveSubmenu}
            activeSubmenu={activeSubmenu}
            onHandleSort={onHandleSort}
            onSetSortState={onSetSortState}
            timeTagDefinitions={timeTagDefinitions}
            title={title}
          />
        </div>
      )}

      {!hideColumns && (
        <div className="relative">
          <button
            onClick={() => onToggleMenu('columns')}
            className={`flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
              menuOpen === 'columns' ? 'bg-gray-100 dark:bg-gray-700/50' : ''
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5 stroke-2 transition-colors duration-300" />
            <span className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Columns
            </span>
          </button>
          <ColumnsMenu
            menuOpen={menuOpen}
            onCloseMenu={onCloseMenu}
            columns={columns}
            onToggleColumnVisibility={onToggleColumnVisibility}
          />
        </div>
      )}

      {!hidePresets && (
        <div className="relative">
          <button
            onClick={() => onToggleMenu('presets')}
            className={`flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
              menuOpen === 'presets' ? 'bg-gray-100 dark:bg-gray-700/50' : ''
            }`}
          >
            <ClipboardDocumentIcon className="h-5 w-5 stroke-2 transition-colors duration-300" />
            <span className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Presets
            </span>
          </button>
          <PresetsMenu
            menuOpen={menuOpen}
            onCloseMenu={onCloseMenu}
            presetsFilters={presetFilters}
            setPresetFilters={setPresetFilters}
            activeFilters={activeFilters}
            sortState={sortState}
          />
        </div>
      )}

      {!hideRefresh && handleRefetch && (
        <button
          onClick={handleRefetch}
          className="flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <ArrowPathIcon className="h-5 w-5 stroke-2 transition-colors duration-300" />
          <span className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Refresh
          </span>
        </button>
      )}

      {AfterOptions && <AfterOptions />}
    </div>
  )
}
