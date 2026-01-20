'use client'

import { TagManagementModal } from '@/components/TagManagementModal'
import { ActiveBetween, Entity, getAllTags } from '@/data'
import type { Components } from '@/types/openapi'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TimeTagManagerModal } from '../TimeTagManagerModal'
import { ActiveFilters } from './ActiveFilters'
import { useTableState } from './DataTableContext'
import { Pagination } from './Pagination'
import { PresetType } from './PresetsMenu'
import { QuickFilters as QuickFiltersComponent } from './QuickFilters'
import { ResultsCount } from './ResultsCount'
import { TableComponent } from './Table'
import { TableOptions } from './TableOptions'
import type { Column, QuickFilters as QuickFiltersType, SortState } from './types'

type TimeTagRead = Components.Schemas.TimeTagRead

type ActionItem = {
  label: string
  onClick: (item: any) => void
  condition?: (item: any) => boolean // Optional function to determine if action should be shown
}

type ActionsProp = ActionItem[] | React.ComponentType<{ item: any }>

export type MenuOpen = 'filter' | 'columns' | 'presets'

interface DataTableProps {
  title: string
  data: any[]
  setData: React.Dispatch<React.SetStateAction<any>>
  columns: Column[]
  quickFilters?: QuickFiltersType[]
  handleRefetch?: () => Promise<void>
  perPage?: number
  merge?: boolean
  pagination?: boolean
  checkboxes?: boolean
  BeforeOptions?: React.ComponentType
  AfterOptions?: React.ComponentType
  enableFolders?: boolean
  onFolderClick?: (folderId: string) => void
  disableSorting?: boolean
  hidePresets?: boolean
  hideFilter?: boolean
  hideSearch?: boolean
  hideColumns?: boolean
  hideRefresh?: boolean
  hideResultsCount?: boolean // If true, ResultsCount won't be shown
  hideActiveFilters?: boolean // If true, ActiveFilters won't be rendered (useful for extracting it to place elsewhere)
  className?: string
  actions?: ActionsProp
  disableFiltering?: boolean // If true, table won't use filters from context (useful for tables that shouldn't be affected by other tables' filters)
  useCompactPagination?: boolean // If true, pagination will be compact (no item count, only page info)
  minimiseTags?: boolean // If true, tags will be minimised
  // Callback for updating tags via API (takes itemId, fieldName, tagNames array)
  // If provided, will be used instead of local state updates
  onUpdateTags?: (itemId: string, fieldName: string, tagNames: string[]) => Promise<void>
  // Pagination callbacks for syncing with API
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  // External pagination control (if provided, DataTable won't manage pagination internally)
  externalPagination?: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
  }
  // Callback when selected items change (for bulk operations)
  onSelectedItemsChange?: (selectedIds: string[]) => void
  // External selected items to sync with (for clearing selection from parent)
  selectedItems?: string[]
}

const DataTableContent: React.FC<DataTableProps> = ({
  title,
  data,
  setData,
  columns: initialColumns,
  quickFilters = [],
  handleRefetch,
  perPage,
  merge = false,
  pagination = true,
  checkboxes = false,
  BeforeOptions,
  AfterOptions,
  enableFolders = false,
  onFolderClick,
  disableSorting = false,
  hidePresets = false,
  onUpdateTags,
  hideFilter = false,
  hideSearch = false,
  hideColumns = false,
  hideRefresh = false,
  hideResultsCount = false,
  className,
  actions,
  disableFiltering = false,
  useCompactPagination = false,
  minimiseTags = false,
  hideActiveFilters = false,
  onPageChange,
  onItemsPerPageChange: onExternalItemsPerPageChange,
  externalPagination,
  onSelectedItemsChange,
  selectedItems,
}) => {
  // Generate localStorage keys for this table's column visibility and presets
  const columnStorageKey = `dataLayout_columns_${title}`
  const presetStorageKey = `dataLayout_presets_${title}`

  // Initialize columns with localStorage data on mount only
  const [columns, setColumns] = useState<Column[]>(() => {
    try {
      const stored = localStorage.getItem(columnStorageKey)
      if (stored) {
        const storedVisibility: Record<string, boolean> = JSON.parse(stored)
        return initialColumns.map((col) => ({
          ...col,
          visible: storedVisibility[col.field] !== undefined ? storedVisibility[col.field] : col.visible,
        }))
      }
    } catch (error) {
      console.error('Error loading column visibility from localStorage:', error)
    }
    return initialColumns
  })

  const [presetFilters, setPresetFilters] = useState<PresetType[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(presetStorageKey)
      if (stored) {
        const parsed: PresetType[] = JSON.parse(stored)
        return parsed.map((preset) => ({
          ...preset,
          enabled: preset.enabled ?? true,
        }))
      }
    } catch (error) {
      console.error('Error loading presets from localStorage:', error)
    }
    return []
  })

  // Get filter and sort state from context (or use empty state if filtering is disabled)
  const contextState = useTableState(title)
  const {
    activeFilters: contextActiveFilters,
    sortState: contextSortState,
    addFilter: contextAddFilter,
    removeFilter: contextRemoveFilter,
    removeSearchTerm: contextRemoveSearchTerm,
    clearAllFilters: contextClearAllFilters,
    handleSort: contextHandleSort,
    setSortState: contextSetSortState,
  } = contextState

  // Use empty filter state if filtering is disabled
  const activeFilters = useMemo(
    () => (disableFiltering ? [] : contextActiveFilters),
    [disableFiltering, contextActiveFilters]
  )
  const sortState = useMemo(
    () => (disableFiltering ? { field: null, direction: 'asc' as const } : contextSortState),
    [disableFiltering, contextSortState]
  )
  const addFilter = useMemo(
    () => (disableFiltering ? () => {} : contextAddFilter),
    [disableFiltering, contextAddFilter]
  )
  const removeFilter = useMemo(
    () => (disableFiltering ? () => {} : contextRemoveFilter),
    [disableFiltering, contextRemoveFilter]
  )
  const removeSearchTerm = useMemo(
    () => (disableFiltering ? () => {} : contextRemoveSearchTerm),
    [disableFiltering, contextRemoveSearchTerm]
  )
  const clearAllFilters = useMemo(
    () => (disableFiltering ? () => {} : contextClearAllFilters),
    [disableFiltering, contextClearAllFilters]
  )
  const handleSort = useMemo(
    () => (disableFiltering ? () => {} : contextHandleSort),
    [disableFiltering, contextHandleSort]
  )
  const setSortState = useMemo(
    () => (disableFiltering ? () => {} : contextSetSortState),
    [disableFiltering, contextSetSortState]
  )
  const [selectedData, setSelectedData] = useState<Set<string>>(new Set())
  const [timeTagModalOpen, setTimeTagModalOpen] = useState<{ itemId: string; itemName: string } | null>(null)
  const [timeTagDefinitions, setTimeTagDefinitions] = useState<Record<string, TimeTagRead>>({})
  const isInternalUpdateRef = useRef(false)

  // Sync selectedData with external selectedItems prop (for clearing selection from parent)
  // Only sync if the change came from outside (not from internal checkbox clicks)
  useEffect(() => {
    if (selectedItems !== undefined && !isInternalUpdateRef.current) {
      setSelectedData(new Set(selectedItems))
    }
    // Reset the flag after processing
    isInternalUpdateRef.current = false
  }, [selectedItems])

  const prevDataRef = useRef<any[]>([])
  const tagFields = useMemo(() => columns.filter((col) => col.type === 'tags').map((col) => col.field), [columns])

  // Check if columns exist for conditional modal rendering
  const hasTagsColumn = useMemo(() => columns.some((col) => col.field === 'tags'), [columns])
  const hasTimeTagColumn = useMemo(() => columns.some((col) => col.field === 'time_tag'), [columns])
  const enabledPresets = useMemo(() => presetFilters.filter((preset) => preset.enabled), [presetFilters])

  const hasQuickFilters = quickFilters.length > 0
  const hasEnabledPresets = enabledPresets.length > 0

  const applyPreset = useCallback(
    (preset: QuickFiltersType) => {
      if (preset.filters.length > 0) {
        addFilter(preset.filters, true)
      } else {
        clearAllFilters()
      }
      if (preset.sortState && preset.sortState.field) {
        setSortState(preset.sortState)
      }
    },
    [addFilter, clearAllFilters, setSortState]
  )

  // Menu state
  const [menuOpen, setMenuOpen] = useState<MenuOpen | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  // Tag management modal state
  const [tagModalOpen, setTagModalOpen] = useState<{
    itemId: string
    itemName: string
    fieldName: string
  } | null>(null)

  // Pagination state - use external if provided, otherwise internal
  const [currentPage, setCurrentPage] = useState<number>(externalPagination?.currentPage || 1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(externalPagination?.itemsPerPage || perPage || 25)

  // Sync with external pagination if provided
  useEffect(() => {
    if (externalPagination) {
      setCurrentPage(externalPagination.currentPage)
      setItemsPerPage(externalPagination.itemsPerPage)
    }
  }, [externalPagination])

  // Load tags from data - recalculate when data changes significantly (e.g., organization switch)
  // Also recalculate when tags change within items
  useEffect(() => {
    // Create a set of current item IDs for comparison
    const currentItemIds = new Set(data.map((item: any) => item.id))
    const prevItemIds = new Set(prevDataRef.current.map((item: any) => item.id))

    // Check if data has changed significantly (different items, not just filtered/sorted)
    // Compare by checking if the sets of IDs are different
    const itemsChanged =
      prevDataRef.current.length === 0 ||
      currentItemIds.size !== prevItemIds.size ||
      Array.from(currentItemIds).some((id) => !prevItemIds.has(id)) ||
      Array.from(prevItemIds).some((id) => !currentItemIds.has(id))

    // Check if tags have changed within items by comparing tag arrays
    let tagsChanged = false
    if (!itemsChanged && prevDataRef.current.length > 0) {
      for (const field of tagFields) {
        const prevTags = new Set<string>()
        prevDataRef.current.forEach((item: any) => {
          const values = item[field]
          if (Array.isArray(values)) {
            values.forEach((tag) => {
              if (tag) {
                const tagKey = typeof tag === 'string' ? tag : tag.name
                if (tagKey) prevTags.add(tagKey)
              }
            })
          }
        })

        const currentTags = new Set<string>()
        data.forEach((item: any) => {
          const values = item[field]
          if (Array.isArray(values)) {
            values.forEach((tag) => {
              if (tag) {
                const tagKey = typeof tag === 'string' ? tag : tag.name
                if (tagKey) currentTags.add(tagKey)
              }
            })
          }
        })

        // Check if tag sets are different
        if (
          prevTags.size !== currentTags.size ||
          Array.from(prevTags).some((tag) => !currentTags.has(tag)) ||
          Array.from(currentTags).some((tag) => !prevTags.has(tag))
        ) {
          tagsChanged = true
          break
        }
      }
    }

    if (itemsChanged || tagsChanged) {
      const collectedTimeTagDefinitions: Record<string, TimeTagRead> = {}

      tagFields.forEach((field) => {
        data.forEach((item: any) => {
          const values = item[field]
          if (Array.isArray(values)) {
            values.forEach((tag) => {
              if (!tag) return
              // Only collect time tag definitions - expect TimeTagRead objects from API
              if (field === 'time_tag') {
                if (typeof tag === 'object' && 'id' in tag && 'windows' in tag) {
                  // It's a TimeTagRead object
                  collectedTimeTagDefinitions[tag.name] = tag as TimeTagRead
                }
                // String tags are no longer supported - time tags come from API
              }
            })
          }
        })
      })

      if (Object.keys(collectedTimeTagDefinitions).length > 0) {
        setTimeTagDefinitions((prev) => ({ ...prev, ...collectedTimeTagDefinitions }))
      }
      prevDataRef.current = data
    }
  }, [data, tagFields])

  // Generic handler to update a field for a specific item
  const handleFieldUpdate = useCallback(
    (itemId: string, fieldName: string, value: any) => {
      setData((prevData: any[]) => {
        return prevData.map((item) => {
          if (item.id === itemId) {
            return { ...item, [fieldName]: value }
          }
          return item
        })
      })
    },
    [setData]
  )

  // Handler to update tags for a specific item
  const handleTagsUpdate = useCallback(
    (itemId: string, fieldName: string, newTags: (string | TimeTagRead)[]) => {
      handleFieldUpdate(itemId, fieldName, newTags)
    },
    [handleFieldUpdate]
  )

  // Build availableTags from fake data for TagManagementModal
  const availableTags = useMemo(() => {
    const allTags = getAllTags()
    const tagsMap: Record<string, string> = {}
    allTags.forEach((tag) => {
      tagsMap[tag.name] = tag.color || '#D1D5DB'
    })
    return tagsMap
  }, [])

  // Save column visibility to localStorage
  const saveColumnsToStorage = useCallback(
    (columnsToSave: Column[]) => {
      try {
        const visibilityMap: Record<string, boolean> = {}
        columnsToSave.forEach((col) => {
          visibilityMap[col.field] = col.visible
        })
        localStorage.setItem(columnStorageKey, JSON.stringify(visibilityMap))
      } catch (error) {
        console.error('Error saving column visibility to localStorage:', error)
      }
    },
    [columnStorageKey]
  )

  useEffect(() => {
    try {
      localStorage.setItem(presetStorageKey, JSON.stringify(presetFilters))
    } catch (error) {
      console.error('Error saving presets to localStorage:', error)
    }
  }, [presetFilters, presetStorageKey])

  const toggleColumnVisibility = useCallback(
    (field: string) => {
      setColumns((prev) => {
        const updated = prev.map((col) => (col.field === field ? { ...col, visible: !col.visible } : col))
        saveColumnsToStorage(updated)
        return updated
      })
    },
    [saveColumnsToStorage]
  )

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((column) => column.visible)
  }, [columns])

  // Apply filters and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data]

    const matchesDateFilter = (
      dataDate: Date | null,
      operator: string,
      compareDate: Date | null,
      compareDate2: Date | null
    ) => {
      if (!dataDate) return false
      switch (operator) {
        case '=':
          return compareDate ? dataDate.toDateString() === compareDate.toDateString() : true
        case '<':
          return compareDate ? dataDate < compareDate : true
        case '>':
          return compareDate ? dataDate > compareDate : true
        case 'Range':
          return compareDate && compareDate2 ? dataDate >= compareDate && dataDate <= compareDate2 : true
        default:
          return true
      }
    }

    activeFilters.forEach((filter) => {
      filtered = filtered.filter((item) => {
        if (filter.field === 'search') {
          const searchTerms = Array.isArray(filter.value) ? (filter.value as string[]) : [String(filter.value)]
          return searchTerms.some((searchTerm) =>
            Object.values(item).some((value) => String(value).toLowerCase().includes(String(searchTerm).toLowerCase()))
          )
        }

        // Special handling for ID field - exact match
        if (filter.field === 'id') {
          const filterValue = Array.isArray(filter.value) ? (filter.value as string[])[0] : (filter.value as string)
          return String(item.id) === String(filterValue)
        }

        const fieldValue = item[filter.field as keyof typeof item]

        switch (filter.type) {
          case 'status': {
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).includes(String(fieldValue))
            } else if (typeof filter.value === 'string') {
              return String(fieldValue).toLowerCase() === filter.value.toLowerCase()
            }
            return false
          }
          case 'tag_type': {
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).some(
                (filterValue) => String(fieldValue).toLowerCase() === String(filterValue).toLowerCase()
              )
            } else if (typeof filter.value === 'string') {
              return String(fieldValue).toLowerCase() === filter.value.toLowerCase()
            }
            return false
          }
          case 'date': {
            if (Array.isArray(filter.value)) {
              const [operator, date1, date2] = filter.value as string[]
              const dataDate = fieldValue ? new Date(fieldValue as string | Date) : null
              const compareDate = date1 ? new Date(date1) : null
              const compareDate2 = date2 ? new Date(date2) : null

              if (compareDate) compareDate.setHours(0, 0, 0, 0)
              if (compareDate2) compareDate2.setHours(23, 59, 59, 999)

              return matchesDateFilter(dataDate, operator, compareDate, compareDate2)
            }
            return true
          }
          case 'active_between': {
            if (!fieldValue || typeof fieldValue !== 'object') return false
            if (!Array.isArray(filter.value)) return true

            const [operator, date1, date2] = filter.value as string[]
            const compareDate = date1 ? new Date(date1) : null
            const compareDate2 = date2 ? new Date(date2) : null
            if (compareDate) compareDate.setHours(0, 0, 0, 0)
            if (compareDate2) compareDate2.setHours(23, 59, 59, 999)

            const activeBetween = fieldValue as ActiveBetween | null
            if (!activeBetween) return false

            const fromDate = activeBetween.from_date ? new Date(activeBetween.from_date) : null
            const toDate = activeBetween.to_date ? new Date(activeBetween.to_date) : null

            // Parse time strings and apply to dates
            if (fromDate) {
              if (activeBetween.from_time) {
                const [hours, minutes] = activeBetween.from_time.split(':').map(Number)
                fromDate.setHours(hours || 0, minutes || 0, 0, 0)
              } else {
                fromDate.setHours(0, 0, 0, 0) // Default to start of day
              }
            }
            if (toDate) {
              if (activeBetween.to_time) {
                const [hours, minutes] = activeBetween.to_time.split(':').map(Number)
                toDate.setHours(hours || 0, minutes || 0, 0, 0)
              } else {
                toDate.setHours(23, 59, 59, 999) // Default to end of day
              }
            }

            // If no dates are set in active_between, it's not active
            if (!fromDate && !toDate) return false

            // Handle Range operator: check if the active_between range overlaps with the filter range
            if (operator === 'Range' && compareDate && compareDate2) {
              // If only from_date is set, check if filter range starts after from_date
              if (fromDate && !toDate) {
                return compareDate2 >= fromDate
              }
              // If only to_date is set, check if filter range ends before to_date
              if (!fromDate && toDate) {
                return compareDate <= toDate
              }
              // If both are set, check if ranges overlap
              if (fromDate && toDate) {
                return fromDate <= compareDate2 && toDate >= compareDate
              }
            }

            // For other operators, check if any date in the active_between range matches
            // We need to check if the filter date falls within the active_between range
            if (operator === '=' && compareDate) {
              if (fromDate && toDate) {
                return compareDate >= fromDate && compareDate <= toDate
              }
              if (fromDate && !toDate) {
                return compareDate >= fromDate
              }
              if (!fromDate && toDate) {
                return compareDate <= toDate
              }
            }

            if (operator === '<' && compareDate) {
              // Check if the active_between range starts before compareDate
              if (fromDate) {
                return fromDate < compareDate
              }
              if (toDate) {
                return toDate < compareDate
              }
            }

            if (operator === '>' && compareDate) {
              // Check if the active_between range ends after compareDate
              if (toDate) {
                return toDate > compareDate
              }
              if (fromDate) {
                return fromDate > compareDate
              }
            }

            // Fallback: check individual dates
            const candidateDates = [fromDate, toDate].filter(Boolean) as Date[]
            if (candidateDates.length === 0) return false

            return candidateDates.some((candidate) => matchesDateFilter(candidate, operator, compareDate, compareDate2))
          }
          case 'number':
          case 'duration': {
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).includes(String(fieldValue))
            } else if (typeof filter.value === 'string') {
              return String(fieldValue).toLowerCase().includes(filter.value.toLowerCase())
            }
            return false
          }
          case 'tags': {
            const itemTags = Array.isArray(fieldValue) ? fieldValue : []
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).some((filterTag) =>
                itemTags.some((itemTag) => {
                  const itemTagName = typeof itemTag === 'string' ? itemTag : itemTag.name
                  return String(itemTagName).toLowerCase() === String(filterTag).toLowerCase()
                })
              )
            } else if (typeof filter.value === 'string') {
              return itemTags.some((itemTag) => {
                const itemTagName = typeof itemTag === 'string' ? itemTag : itemTag.name
                return String(itemTagName).toLowerCase() === String(filter.value).toLowerCase()
              })
            }
            return false
          }
          case 'now_playing': {
            // Filter by playlist name
            const playlistName =
              typeof fieldValue === 'object' && fieldValue !== null && 'name' in fieldValue
                ? String((fieldValue as { name: string }).name)
                : ''
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).some((filterValue) =>
                playlistName.toLowerCase().includes(String(filterValue).toLowerCase())
              )
            } else if (typeof filter.value === 'string') {
              return playlistName.toLowerCase().includes(String(filter.value).toLowerCase())
            }
            return false
          }
          case 'licence': {
            // Filter by licence (string)
            const licenceCode = String(fieldValue || '')
            if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
              return (filter.value as string[]).some((filterValue) =>
                licenceCode.toLowerCase().includes(String(filterValue).toLowerCase())
              )
            } else if (typeof filter.value === 'string') {
              return licenceCode.toLowerCase().includes(String(filter.value).toLowerCase())
            }
            return false
          }
          case 'entity': {
            // Filter by entity - each filter value has its own type (id or name)
            const entity =
              typeof fieldValue === 'object' && fieldValue !== null && 'id' in fieldValue && 'name' in fieldValue
                ? (fieldValue as Entity)
                : null

            if (!entity) return false

            // Handle new format: EntityFilterValue[] (array of {type, value})
            if (
              Array.isArray(filter.value) &&
              filter.value.length > 0 &&
              typeof filter.value[0] === 'object' &&
              'type' in filter.value[0] &&
              'value' in filter.value[0]
            ) {
              const entityFilterValues = filter.value as Array<{ type: 'id' | 'name'; value: string }>
              return entityFilterValues.some((filterItem) => {
                if (filterItem.type === 'id') {
                  return entity.id === filterItem.value
                } else {
                  return entity.name.toLowerCase().includes(filterItem.value.toLowerCase())
                }
              })
            }

            // Backward compatibility: handle old format (string or string[] with filterBy)
            const entityName = entity.name.toLowerCase()

            // Default to name filtering for old format
            if (Array.isArray(filter.value)) {
              return filter.value.some((filterValue) => entityName.includes(String(filterValue).toLowerCase()))
            } else {
              const filterValueStr = String(filter.value)
              return entityName.includes(filterValueStr.toLowerCase())
            }
          }
          case 'text':
          default: {
            if (filter.exact) {
              if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
                return (filter.value as string[]).some(
                  (filterValue) => String(fieldValue).toLowerCase() === String(filterValue).toLowerCase()
                )
              } else if (typeof filter.value === 'string') {
                return String(fieldValue).toLowerCase() === String(filter.value).toLowerCase()
              }
              return false
            } else {
              if (Array.isArray(filter.value) && typeof filter.value[0] === 'string') {
                return (filter.value as string[]).some((filterValue) =>
                  String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase())
                )
              } else if (typeof filter.value === 'string') {
                return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())
              }
              return false
            }
          }
        }
      })
    })

    // Separate folders from non-folders (only for media tables)
    const isMediaTable = data.length > 0 && data.some((item) => item.media_type !== undefined)
    let folders: any[] = []
    let nonFolders: any[] = []

    if (isMediaTable) {
      folders = filtered.filter((item) => item.media_type === 'folder')
      nonFolders = filtered.filter((item) => item.media_type !== 'folder')
    } else {
      nonFolders = filtered
    }

    // Sort function for both groups
    const sortItems = (items: any[]) => {
      if (!sortState.field) return items
      return [...items].sort((a, b) => {
        let aValue = a[sortState.field!]
        let bValue = b[sortState.field!]

        // Handle nested properties for now_playing and licence
        if (sortState.field === 'now_playing') {
          aValue =
            typeof aValue === 'object' && aValue !== null && 'name' in aValue ? (aValue as { name: string }).name : ''
          bValue =
            typeof bValue === 'object' && bValue !== null && 'name' in bValue ? (bValue as { name: string }).name : ''
        } else if (sortState.field === 'organisation') {
          // Sort by organisation name
          aValue =
            typeof aValue === 'object' && aValue !== null && 'name' in aValue ? (aValue as { name: string }).name : ''
          bValue =
            typeof bValue === 'object' && bValue !== null && 'name' in bValue ? (bValue as { name: string }).name : ''
        }
        // licence is now a string, so no special handling needed

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1
        return sortState.direction === 'asc' ? comparison : -comparison
      })
    }

    // Sort both groups independently
    const sortedFolders = sortItems(folders)
    const sortedNonFolders = sortItems(nonFolders)

    // Combine: folders first, then non-folders
    return [...sortedFolders, ...sortedNonFolders]
  }, [data, activeFilters, sortState])

  // Calculate pagination
  // If external pagination is provided, use its totalItems; otherwise calculate from filtered data
  const totalItems = filteredAndSortedData.length
  const effectiveTotalItems = externalPagination?.totalItems ?? totalItems
  const totalPages = perPage ? Math.ceil(effectiveTotalItems / itemsPerPage) : 1
  const startIndex = perPage ? (currentPage - 1) * itemsPerPage : 0
  const endIndex = perPage ? Math.min(startIndex + itemsPerPage, effectiveTotalItems) : effectiveTotalItems
  // If external pagination, don't slice data (API handles it); otherwise slice client-side
  const paginatedData =
    externalPagination || !perPage ? filteredAndSortedData : filteredAndSortedData.slice(startIndex, endIndex)

  // Reset to page 1 when itemsPerPage changes or filters change
  useEffect(() => {
    if (perPage && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [itemsPerPage, totalPages, perPage, currentPage])

  useEffect(() => {
    if (perPage) {
      setCurrentPage(1)
    }
  }, [activeFilters, sortState, perPage])

  // Pagination handlers
  const goToFirstPage = useCallback(() => {
    if (perPage && currentPage > 1) {
      const newPage = 1
      setCurrentPage(newPage)
      onPageChange?.(newPage)
    }
  }, [perPage, currentPage, onPageChange])

  const goToPreviousPage = useCallback(() => {
    if (perPage && currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      onPageChange?.(newPage)
    }
  }, [perPage, currentPage, onPageChange])

  const goToNextPage = useCallback(() => {
    if (perPage && currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      onPageChange?.(newPage)
    }
  }, [perPage, currentPage, totalPages, onPageChange])

  const goToLastPage = useCallback(() => {
    if (perPage && currentPage < totalPages) {
      setCurrentPage(totalPages)
      onPageChange?.(totalPages)
    }
  }, [perPage, currentPage, totalPages, onPageChange])

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage)
      setCurrentPage(1)
      onExternalItemsPerPageChange?.(newItemsPerPage)
      onPageChange?.(1)
    },
    [onExternalItemsPerPageChange, onPageChange]
  )

  // Checkbox handlers
  const handleSelectAll = useCallback(() => {
    const dataToCheck = perPage ? paginatedData : filteredAndSortedData
    const allIds = new Set(dataToCheck.map((item) => item.id))
    const allSelected = dataToCheck.every((item) => selectedData.has(item.id))

    isInternalUpdateRef.current = true

    if (allSelected) {
      setSelectedData((prev) => {
        const newSet = new Set(prev)
        allIds.forEach((id) => newSet.delete(id))
        // Notify parent of selected items change (use setTimeout to avoid render warning)
        if (onSelectedItemsChange) {
          setTimeout(() => {
            onSelectedItemsChange(Array.from(newSet))
          }, 0)
        }
        return newSet
      })
    } else {
      setSelectedData((prev) => {
        const newSet = new Set(prev)
        allIds.forEach((id) => newSet.add(id))
        // Notify parent of selected items change (use setTimeout to avoid render warning)
        if (onSelectedItemsChange) {
          setTimeout(() => {
            onSelectedItemsChange(Array.from(newSet))
          }, 0)
        }
        return newSet
      })
    }
  }, [perPage, paginatedData, filteredAndSortedData, selectedData, onSelectedItemsChange])

  const handleSelectItem = useCallback(
    (itemId: string) => {
      isInternalUpdateRef.current = true
      setSelectedData((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(itemId)) {
          newSet.delete(itemId)
        } else {
          newSet.add(itemId)
        }
        // Notify parent of selected items change (use setTimeout to avoid render warning)
        if (onSelectedItemsChange) {
          setTimeout(() => {
            onSelectedItemsChange(Array.from(newSet))
          }, 0)
        }
        return newSet
      })
    },
    [onSelectedItemsChange]
  )

  // Menu handlers
  const toggleMenu = useCallback((menuType: MenuOpen) => {
    setMenuOpen((prev) => (prev === menuType ? null : menuType))
    setActiveSubmenu(null)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(null)
    setActiveSubmenu(null)
  }, [])

  // Tag modal handlers
  const handleOpenTagModal = useCallback((itemId: string, itemName: string, fieldName: string) => {
    if (fieldName === 'time_tag') {
      setTimeTagModalOpen({ itemId, itemName })
      return
    }
    setTagModalOpen({ itemId, itemName, fieldName })
  }, [])

  const getCurrentModalTags = useCallback((): string[] => {
    if (!tagModalOpen) return []
    const item = data.find((i: any) => i.id === tagModalOpen.itemId)
    if (!item) return []

    const tags = item[tagModalOpen.fieldName]
    if (!tags) return []

    // Handle TagSummary objects (from API) - extract names
    if (Array.isArray(tags) && tags.length > 0 && typeof tags[0] === 'object' && 'name' in tags[0]) {
      return tags.map((tag: any) => tag.name)
    }

    // Handle string array (legacy)
    return (tags as string[]) || []
  }, [tagModalOpen, data])

  const toggleModalTag = useCallback(
    (tagName: string) => {
      if (!tagModalOpen) return
      const current = getCurrentModalTags()
      const idx = current.findIndex((t) => t === tagName)
      const next = [...current]
      if (idx > -1) next.splice(idx, 1)
      else next.push(tagName)
      handleTagsUpdate(tagModalOpen.itemId, tagModalOpen.fieldName, next)
    },
    [tagModalOpen, getCurrentModalTags, handleTagsUpdate]
  )

  const addModalTag = useCallback(
    (tagName: string) => {
      if (!tagModalOpen) return
      const current = getCurrentModalTags()
      const lower = tagName.toLowerCase()
      // getCurrentModalTags already returns string[], so we can safely compare
      if (current.some((t) => t.toLowerCase() === lower)) return
      // Tags come from API now, no need to match from availableTags
      const match = undefined
      const finalTag = match || tagName
      handleTagsUpdate(tagModalOpen.itemId, tagModalOpen.fieldName, [...current, finalTag])
    },
    [tagModalOpen, getCurrentModalTags, handleTagsUpdate]
  )

  const getItemTimeTags = useCallback(
    (itemId: string): TimeTagRead[] => {
      const item = data.find((i: any) => i.id === itemId)
      if (!item || !Array.isArray(item.time_tag)) return []
      return item.time_tag
        .map((tag: string | TimeTagRead): TimeTagRead | undefined => {
          if (typeof tag === 'string') {
            // String tags are no longer supported - time tags come from API as TimeTagRead
            return timeTagDefinitions[tag]
          }
          return tag as TimeTagRead
        })
        .filter((tag: TimeTagRead | undefined): tag is TimeTagRead => tag !== undefined)
    },
    [data, timeTagDefinitions]
  )

  const handleTimeTagToggle = useCallback(
    (itemId: string, tag: TimeTagRead, nextSelected: boolean) => {
      const currentTags = getItemTimeTags(itemId)
      const findTagIndex = currentTags.findIndex((t) => t.id === tag.id || t.name === tag.name)
      let updatedTags: TimeTagRead[]

      if (nextSelected) {
        if (findTagIndex >= 0) {
          updatedTags = currentTags.map((t, idx) => (idx === findTagIndex ? tag : t))
        } else {
          updatedTags = [...currentTags, tag]
        }
      } else if (findTagIndex >= 0) {
        updatedTags = currentTags.filter((_, idx) => idx !== findTagIndex)
      } else {
        updatedTags = currentTags
      }

      handleFieldUpdate(itemId, 'time_tag', updatedTags)
    },
    [getItemTimeTags, handleFieldUpdate]
  )

  const handleTimeTagDefinitionSave = useCallback(
    (updatedTag: TimeTagRead, originalName?: string) => {
      setTimeTagDefinitions((prev) => {
        const next = { ...prev }
        if (originalName && originalName !== updatedTag.name) {
          delete next[originalName]
        }
        next[updatedTag.name] = updatedTag
        return next
      })

      setData((prevData: any[]) =>
        prevData.map((item) => {
          if (!Array.isArray(item.time_tag)) return item
          let changed = false
          const updatedTags = item.time_tag.map((tag: string | TimeTagRead) => {
            const tagName = typeof tag === 'string' ? tag : tag.name
            if (tagName === (originalName || updatedTag.name)) {
              changed = true
              return updatedTag
            }
            return tag
          })
          return changed ? { ...item, time_tag: updatedTags } : item
        })
      )
    },
    [setData]
  )

  const currentTimeTags = useMemo(() => {
    if (!timeTagModalOpen) return []
    return getItemTimeTags(timeTagModalOpen.itemId)
  }, [getItemTimeTags, timeTagModalOpen])

  const combinedTimeTagDefinitions = useMemo(() => {
    const map: Record<string, TimeTagRead> = { ...timeTagDefinitions }
    currentTimeTags.forEach((tag) => {
      map[tag.name] = tag
    })
    return Object.values(map)
  }, [currentTimeTags, timeTagDefinitions])

  const handleRemoveTag = useCallback(
    (itemId: string, fieldName: string, tagToRemove: string) => {
      if (fieldName === 'time_tag') {
        const remaining = getItemTimeTags(itemId).filter((tag) => tag.name !== tagToRemove)
        handleFieldUpdate(itemId, fieldName, remaining)
        return
      }

      handleTagsUpdate(
        itemId,
        fieldName,
        ((data.find((item: any) => item.id === itemId)?.[fieldName] as string[]) || []).filter(
          (tag) => tag !== tagToRemove
        )
      )
    },
    [data, getItemTimeTags, handleFieldUpdate, handleTagsUpdate]
  )

  const isFullHeight = className?.includes('h-full')

  return (
    <div
      className={`flex flex-col gap-4 ${className || ''} ${isFullHeight ? 'h-full min-h-0' : ''} text-textLightMode dark:text-textDarkMode`}
    >
      {(hasQuickFilters || hasEnabledPresets) && (
        <div className={`flex w-full flex-col gap-4 ${hasQuickFilters && hasEnabledPresets ? 'lg:flex-row' : ''}`}>
          {hasQuickFilters && (
            <div className={`${hasEnabledPresets ? 'w-full lg:w-1/2' : 'w-full'}`}>
              <QuickFiltersComponent
                label="Quick Filters"
                quickFilters={quickFilters}
                activeFilters={activeFilters}
                sortState={sortState}
                onAddFilter={addFilter}
              />
            </div>
          )}
          {hasEnabledPresets && (
            <div className={`${hasQuickFilters ? 'w-full lg:w-1/2' : 'w-full'}`}>
              <QuickFiltersComponent
                label="Presets"
                quickFilters={enabledPresets}
                activeFilters={activeFilters}
                sortState={sortState}
                onAddFilter={(filters) => {
                  if (filters.length > 0) {
                    addFilter(filters, true)
                  } else {
                    clearAllFilters()
                  }
                }}
                onApplyItem={applyPreset}
                defaultOpen
              />
            </div>
          )}
        </div>
      )}
      {!hideActiveFilters && (
        <ActiveFilters
          activeFilters={activeFilters}
          sortState={sortState}
          onClearSort={() => setSortState({ field: null, direction: 'asc' } as SortState)}
          onRemoveFilter={removeFilter}
          onRemoveSearchTerm={removeSearchTerm}
          onClearAllFilters={clearAllFilters}
          timeTagDefinitions={timeTagDefinitions}
        />
      )}
      {!hideResultsCount && (
        <ResultsCount filteredCount={filteredAndSortedData.length} totalCount={data.length} title={title} />
      )}
      <div className={`flex flex-col ${isFullHeight ? 'min-h-0 flex-1' : ''}`}>
        <TableOptions
          title={title}
          menuOpen={menuOpen}
          activeFiltersCount={activeFilters.length}
          handleRefetch={handleRefetch}
          onToggleMenu={toggleMenu}
          onCloseMenu={closeMenu}
          columns={columns}
          activeFilters={activeFilters}
          sortState={sortState}
          onAddFilter={addFilter}
          onRemoveFilter={removeFilter}
          onSetActiveSubmenu={setActiveSubmenu}
          activeSubmenu={activeSubmenu}
          onHandleSort={handleSort}
          onSetSortState={setSortState}
          timeTagDefinitions={timeTagDefinitions}
          presetFilters={presetFilters}
          setPresetFilters={setPresetFilters}
          onToggleColumnVisibility={toggleColumnVisibility}
          BeforeOptions={BeforeOptions}
          AfterOptions={AfterOptions}
          hideFilter={hideFilter}
          hideSearch={hideSearch}
          hideColumns={hideColumns}
          hidePresets={hidePresets}
          hideRefresh={hideRefresh}
        />
        <div className={isFullHeight ? 'min-h-0 flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-800' : ''}>
          <TableComponent
            title={title}
            data={paginatedData}
            columns={visibleColumns}
            sortState={sortState}
            selectedData={selectedData}
            onUpdateField={handleFieldUpdate}
            onHandleSort={handleSort}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onOpenTagModal={handleOpenTagModal}
            onRemoveTag={handleRemoveTag}
            merge={merge}
            pagination={pagination}
            checkboxes={checkboxes}
            enableFolders={enableFolders}
            onFolderClick={onFolderClick}
            disableSorting={disableSorting}
            actions={actions}
            minimiseTags={minimiseTags}
          />
        </div>
        {perPage && pagination && (
          <Pagination
            title={title}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            onGoToFirstPage={goToFirstPage}
            onGoToPreviousPage={goToPreviousPage}
            onGoToNextPage={goToNextPage}
            onGoToLastPage={goToLastPage}
            merge={merge}
            useCompactLayout={useCompactPagination}
          />
        )}
      </div>
      {hasTagsColumn && (
        <TagManagementModal
          open={!!tagModalOpen}
          onClose={() => setTagModalOpen(null)}
          fieldName={tagModalOpen?.fieldName ?? ''}
          name={tagModalOpen?.itemName ?? ''}
          availableTags={availableTags}
          currentTags={getCurrentModalTags()}
          onSaveTags={
            onUpdateTags && tagModalOpen
              ? async (tagNames: string[]) => {
                  await onUpdateTags(tagModalOpen.itemId, tagModalOpen.fieldName, tagNames)
                }
              : undefined
          }
          // Legacy callbacks for backward compatibility
          onToggleTag={onUpdateTags ? undefined : toggleModalTag}
          onAddTag={onUpdateTags ? undefined : addModalTag}
        />
      )}
      {hasTimeTagColumn && (
        <TimeTagManagerModal
          open={!!timeTagModalOpen}
          onClose={() => setTimeTagModalOpen(null)}
          itemName={timeTagModalOpen?.itemName ?? ''}
          currentTags={currentTimeTags}
          availableTags={combinedTimeTagDefinitions}
          onToggleTag={(tag: TimeTagRead, nextSelected: boolean) => {
            if (!timeTagModalOpen) return
            handleTimeTagToggle(timeTagModalOpen.itemId, tag, nextSelected)
          }}
          onSaveDefinition={handleTimeTagDefinitionSave}
        />
      )}
    </div>
  )
}

export const DataTable: React.FC<DataTableProps> = (props) => {
  return <DataTableContent {...props} />
}
