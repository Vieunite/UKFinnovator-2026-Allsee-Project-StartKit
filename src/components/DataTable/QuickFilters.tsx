'use client'

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import React, { useMemo, useState } from 'react'
import type { FilterState, QuickFilters as QuickFiltersType, SortState } from './types'

interface QuickFiltersProps {
  label?: string
  quickFilters: QuickFiltersType[]
  activeFilters: FilterState[]
  sortState?: SortState
  onAddFilter: (filters: FilterState[], replaceAll?: boolean) => void
  onApplySort?: (sortState?: SortState) => void
  onApplyItem?: (item: QuickFiltersType) => void
  defaultOpen?: boolean
}

const filtersMatch = (filters: FilterState[], activeFilters: FilterState[]) => {
  if (filters.length === 0 && activeFilters.length === 0) return true
  if (filters.length !== activeFilters.length) return false
  return filters.every((filter) =>
    activeFilters.some(
      (af) =>
        af.field === filter.field &&
        af.type === filter.type &&
        JSON.stringify(af.value) === JSON.stringify(filter.value)
    )
  )
}

const sortMatches = (currentSort: SortState | undefined, filterSort?: SortState) => {
  if (!filterSort || !filterSort.field) {
    return !filterSort
  }
  if (!currentSort || !currentSort.field) return false
  return currentSort.field === filterSort.field && currentSort.direction === filterSort.direction
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  label = 'Quick Filters',
  quickFilters,
  activeFilters,
  sortState,
  onAddFilter,
  onApplySort,
  onApplyItem,
  defaultOpen = true,
}) => {
  // Internal state for open/close
  const [quickFiltersOpen, setQuickFiltersOpen] = useState<boolean>(defaultOpen)

  const renderedFilters = useMemo(() => quickFilters, [quickFilters])

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setQuickFiltersOpen(!quickFiltersOpen)}
        className="flex w-fit items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center">
          <p className="text-gray-900 dark:text-gray-100">{label}</p>
          <div className="flex h-8 w-8 items-center justify-center">
            {quickFiltersOpen ? (
              <ChevronDownIcon className="h-4 w-4 stroke-[2.5] text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 stroke-[2.5] text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          quickFiltersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex w-full flex-wrap items-center gap-3">
          {renderedFilters.map((filter) => {
            const isActive = filtersMatch(filter.filters, activeFilters) && sortMatches(sortState, filter.sortState)

            const handleClick = () => {
              if (onApplyItem) {
                onApplyItem(filter)
                return
              }
              onAddFilter(filter.filters, true)
              if (filter.sortState && onApplySort) {
                onApplySort(filter.sortState)
              }
            }

            return (
              <button
                key={filter.id || filter.title}
                onClick={handleClick}
                className={`rounded border px-3.5 py-0.5 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 border-primary text-primary dark:text-primary'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {filter.title}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
