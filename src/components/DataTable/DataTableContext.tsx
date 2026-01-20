'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { EntityFilterValue, FilterState, SortState } from './types'

interface DataTableContextValue {
  getTableState: (title: string) => {
    activeFilters: FilterState[]
    sortState: SortState
  }
  setTableState: (
    title: string,
    updates: {
      activeFilters?: FilterState[]
      sortState?: SortState | ((prev: SortState) => SortState)
    }
  ) => void
  addFilter: (title: string, filters: FilterState[], replaceAll?: boolean, append?: boolean) => void
  removeFilter: (title: string, index: number) => void
  removeSearchTerm: (title: string, filterIndex: number, searchTermIndex: number) => void
  clearAllFilters: (title: string) => void
  handleSort: (title: string, field: string) => void
}

const DataTableContext = createContext<DataTableContextValue | null>(null)

interface DataTableProviderProps {
  children: React.ReactNode
}

// Helper to encode filters to query string
export const encodeFilters = (filters: FilterState[]): string => {
  if (filters.length === 0) return ''
  try {
    return encodeURIComponent(JSON.stringify(filters))
  } catch {
    return ''
  }
}

// Helper to decode filters from query string
const decodeFilters = (encoded: string | null): FilterState[] => {
  if (!encoded) return []
  try {
    return JSON.parse(decodeURIComponent(encoded))
  } catch {
    return []
  }
}

// Helper to encode sort state to query string
const encodeSortState = (sortState: SortState): string => {
  if (!sortState.field) return ''
  try {
    return encodeURIComponent(JSON.stringify(sortState))
  } catch {
    return ''
  }
}

// Helper to decode sort state from query string
const decodeSortState = (encoded: string | null): SortState => {
  if (!encoded) return { field: null, direction: 'asc' }
  try {
    return JSON.parse(decodeURIComponent(encoded))
  } catch {
    return { field: null, direction: 'asc' }
  }
}

const DataTableProviderInner: React.FC<DataTableProviderProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Store state for all tables in memory (keyed by pathname + organisationId)
  const [tableStates, setTableStates] = useState<
    Record<string, { activeFilters: FilterState[]; sortState: SortState }>
  >({})

  // Track if we've loaded from query params to avoid overwriting with empty state
  const [hasLoadedFromParams, setHasLoadedFromParams] = useState(false)

  // Get current table key (pathname + organisationId)
  const tableKey = useMemo(() => {
    return `${pathname}`
  }, [pathname])

  // Helper to get localStorage key for a pathname and organisation
  const getStorageKey = useCallback((path: string) => `dataLayout_state_${path}`, [])

  // Load initial state from query params or localStorage on mount or when pathname/organisation changes
  useEffect(() => {
    const filtersParam = searchParams.get('filters')
    const sortParam = searchParams.get('sort')
    const storageKey = getStorageKey(pathname)

    // Priority 1: Load from query params if they exist
    if (filtersParam || sortParam) {
      const filters = decodeFilters(filtersParam)
      const sortState = decodeSortState(sortParam)

      setTableStates((prev) => ({
        ...prev,
        [tableKey]: {
          activeFilters: filters,
          sortState,
        },
      }))
      setHasLoadedFromParams(true)

      // Also save to localStorage when loading from query params
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            activeFilters: filters,
            sortState,
          })
        )
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    } else {
      // Priority 2: Try loading from localStorage
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          setTableStates((prev) => ({
            ...prev,
            [tableKey]: {
              activeFilters: parsed.activeFilters || [],
              sortState: parsed.sortState || { field: null, direction: 'asc' },
            },
          }))
          setHasLoadedFromParams(true)
          return
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }

      // Priority 3: No query params or localStorage, initialize empty state
      setTableStates((prev) => {
        return {
          ...prev,
          [tableKey]: {
            activeFilters: [],
            sortState: { field: null, direction: 'asc' },
          },
        }
      })
      setHasLoadedFromParams(true)
    }
  }, [pathname, tableKey, getStorageKey, searchParams]) // Re-run when pathname or organisation changes

  // Sync state to query params and localStorage when state changes (but only after initial load)
  useEffect(() => {
    if (!hasLoadedFromParams) return

    const currentState = tableStates[tableKey]
    if (!currentState) return

    const storageKey = getStorageKey(pathname)

    // Save to localStorage whenever state changes
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          activeFilters: currentState.activeFilters,
          sortState: currentState.sortState,
        })
      )
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }

    // Update query params
    const params = new URLSearchParams(searchParams.toString())

    // Update filters param
    const encodedFilters = encodeFilters(currentState.activeFilters)
    if (encodedFilters) {
      params.set('filters', encodedFilters)
    } else {
      params.delete('filters')
    }

    // Update sort param
    const encodedSort = encodeSortState(currentState.sortState)
    if (encodedSort) {
      params.set('sort', encodedSort)
    } else {
      params.delete('sort')
    }

    // Build new URL
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    // Only update if URL actually changed to avoid unnecessary updates
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [tableStates, tableKey, pathname, router, searchParams, hasLoadedFromParams, getStorageKey])

  const getTableState = useCallback(
    (title: string) => {
      // Use tableKey (pathname + organisationId) as the key
      return (
        tableStates[tableKey] || {
          activeFilters: [],
          sortState: { field: null, direction: 'asc' },
        }
      )
    },
    [tableStates, tableKey]
  )

  const setTableState = useCallback(
    (
      title: string,
      updates: {
        activeFilters?: FilterState[]
        sortState?: SortState | ((prev: SortState) => SortState)
      }
    ) => {
      setTableStates((prev) => {
        const current = prev[tableKey] || {
          activeFilters: [],
          sortState: { field: null, direction: 'asc' },
        }

        const newState = { ...current }

        if (updates.activeFilters !== undefined) {
          newState.activeFilters = updates.activeFilters
        }

        if (updates.sortState !== undefined) {
          if (typeof updates.sortState === 'function') {
            newState.sortState = updates.sortState(current.sortState)
          } else {
            newState.sortState = updates.sortState
          }
        }

        return {
          ...prev,
          [tableKey]: newState,
        }
      })
    },
    [tableKey]
  )

  const addFilter = useCallback(
    (title: string, filters: FilterState[], replaceAll?: boolean, append?: boolean) => {
      setTableStates((prev) => {
        const current = prev[tableKey] || {
          activeFilters: [],
          sortState: { field: null, direction: 'asc' },
        }

        if (replaceAll) {
          return {
            ...prev,
            [tableKey]: {
              ...current,
              activeFilters: filters,
            },
          }
        }

        let updatedFilters = [...current.activeFilters]

        filters.forEach((newFilter) => {
          const processedFilter = { ...newFilter }

          if (processedFilter.field === 'search' && !Array.isArray(processedFilter.value)) {
            processedFilter.value = [String(processedFilter.value)]
          }

          if (processedFilter.field === 'search') {
            const searchTerms = Array.isArray(processedFilter.value)
              ? processedFilter.value
              : [String(processedFilter.value)]
            const nonEmptyTerms = (searchTerms as string[]).filter(
              (term) => typeof term === 'string' && term.trim() !== ''
            )
            if (nonEmptyTerms.length === 0) {
              return
            }
            processedFilter.value = nonEmptyTerms
          }

          const existingIndex = updatedFilters.findIndex((f) => f.field === processedFilter.field)

          if (existingIndex !== -1) {
            if (append && processedFilter.type === 'entity') {
              // Special handling for entity type: merge EntityFilterValue arrays
              let currentValue = updatedFilters[existingIndex].value
              const newValue = processedFilter.value

              if (Array.isArray(currentValue) && Array.isArray(newValue)) {
                // Check if both are EntityFilterValue arrays
                const isEntityFormat = (v: any): v is EntityFilterValue[] =>
                  Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && 'type' in v[0] && 'value' in v[0]

                if (isEntityFormat(currentValue) && isEntityFormat(newValue)) {
                  // Merge EntityFilterValue arrays, avoiding duplicates
                  const existingValues = new Set(currentValue.map((v) => `${v.type}:${v.value}`))
                  const uniqueNewValues = newValue.filter((v) => !existingValues.has(`${v.type}:${v.value}`))
                  updatedFilters[existingIndex].value = [...currentValue, ...uniqueNewValues]
                } else {
                  updatedFilters[existingIndex] = processedFilter
                }
              } else {
                updatedFilters[existingIndex] = processedFilter
              }
            } else if (append) {
              // Handle other filter types (string arrays)
              let currentValue = updatedFilters[existingIndex].value
              if (Array.isArray(currentValue) && typeof currentValue[0] === 'string') {
                const stringCurrentValue = currentValue as string[]
                const newValues = Array.isArray(processedFilter.value)
                  ? (processedFilter.value as string[]).filter((val: string) => !stringCurrentValue.includes(val))
                  : [String(processedFilter.value)].filter((val: string) => !stringCurrentValue.includes(val))
                updatedFilters[existingIndex].value = [...stringCurrentValue, ...newValues]
              } else if (typeof currentValue === 'string') {
                const newValues = Array.isArray(processedFilter.value)
                  ? (processedFilter.value as string[]).filter((val: string) => val !== currentValue)
                  : [String(processedFilter.value)].filter((val: string) => val !== currentValue)
                updatedFilters[existingIndex].value = [currentValue, ...newValues]
              } else {
                updatedFilters[existingIndex] = processedFilter
              }
            } else {
              updatedFilters[existingIndex] = processedFilter
            }
          } else {
            updatedFilters.push(processedFilter)
          }
        })

        return {
          ...prev,
          [tableKey]: {
            ...current,
            activeFilters: updatedFilters,
          },
        }
      })
    },
    [tableKey]
  )

  const removeFilter = useCallback(
    (title: string, index: number) => {
      setTableStates((prev) => {
        const current = prev[tableKey]
        if (!current) return prev

        return {
          ...prev,
          [tableKey]: {
            ...current,
            activeFilters: current.activeFilters.filter((_, i) => i !== index),
          },
        }
      })
    },
    [tableKey]
  )

  const removeSearchTerm = useCallback(
    (title: string, filterIndex: number, searchTermIndex: number) => {
      setTableStates((prev) => {
        const current = prev[tableKey]
        if (!current) return prev

        const updatedFilters = [...current.activeFilters]
        const filter = updatedFilters[filterIndex]

        if (filter.field === 'search' && Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
          const newSearchTerms = (filter.value as string[]).filter((_, i) => i !== searchTermIndex)

          if (newSearchTerms.length === 0) {
            updatedFilters.splice(filterIndex, 1)
          } else {
            updatedFilters[filterIndex] = { ...filter, value: newSearchTerms }
          }
        }

        return {
          ...prev,
          [tableKey]: {
            ...current,
            activeFilters: updatedFilters,
          },
        }
      })
    },
    [tableKey]
  )

  const clearAllFilters = useCallback(
    (title: string) => {
      setTableState(title, {
        activeFilters: [],
        sortState: { field: null, direction: 'asc' },
      })
    },
    [setTableState]
  )

  const handleSort = useCallback(
    (title: string, field: string) => {
      setTableStates((prev) => {
        const current = prev[tableKey] || {
          activeFilters: [],
          sortState: { field: null, direction: 'asc' },
        }

        return {
          ...prev,
          [tableKey]: {
            ...current,
            sortState: {
              field,
              direction: current.sortState.field === field && current.sortState.direction === 'asc' ? 'desc' : 'asc',
            },
          },
        }
      })
    },
    [tableKey]
  )

  const value: DataTableContextValue = {
    getTableState,
    setTableState,
    addFilter,
    removeFilter,
    removeSearchTerm,
    clearAllFilters,
    handleSort,
  }

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
}

// Wrapper component that provides Suspense boundary
export const DataTableProvider: React.FC<DataTableProviderProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <DataTableProviderInner>{children}</DataTableProviderInner>
    </Suspense>
  )
}

export const useDataTableContext = (): DataTableContextValue => {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider')
  }
  return context
}

// Hook to get table-specific state (convenience hook)
export const useTableState = (title: string) => {
  const context = useDataTableContext()
  const { getTableState, setTableState, addFilter, removeFilter, removeSearchTerm, clearAllFilters, handleSort } =
    context

  const state = useMemo(() => getTableState(title), [getTableState, title])

  return {
    activeFilters: state.activeFilters,
    sortState: state.sortState,
    setActiveFilters: useCallback(
      (filters: FilterState[]) => setTableState(title, { activeFilters: filters }),
      [setTableState, title]
    ),
    setSortState: useCallback(
      (sortState: SortState | ((prev: SortState) => SortState)) => setTableState(title, { sortState }),
      [setTableState, title]
    ),
    addFilter: useCallback(
      (filters: FilterState[], replaceAll?: boolean, append?: boolean) => addFilter(title, filters, replaceAll, append),
      [addFilter, title]
    ),
    removeFilter: useCallback((index: number) => removeFilter(title, index), [removeFilter, title]),
    removeSearchTerm: useCallback(
      (filterIndex: number, searchTermIndex: number) => removeSearchTerm(title, filterIndex, searchTermIndex),
      [removeSearchTerm, title]
    ),
    clearAllFilters: useCallback(() => clearAllFilters(title), [clearAllFilters, title]),
    handleSort: useCallback((field: string) => handleSort(title, field), [handleSort, title]),
  }
}
