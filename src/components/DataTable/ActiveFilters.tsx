'use client'

import { useOrganisation } from '@/context/OrganisationContext'
import type { Components } from '@/types/openapi'
import { formatDate, formatTitleString } from '@/utility/utility'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { useRef } from 'react'
import type { DataTypes, EntityFilterValue, FilterField, FilterState, FilterValue, SortState } from './types'

type TimeTagRead = Components.Schemas.TimeTagRead

interface ActiveFiltersProps {
  activeFilters: FilterState[]
  sortState: SortState
  onClearSort: () => void
  onRemoveFilter: (index: number) => void
  onRemoveSearchTerm: (filterIndex: number, searchIndex: number) => void
  onClearAllFilters: () => void
  timeTagDefinitions?: Record<string, TimeTagRead>
}

const formatValue = (
  value: FilterValue,
  field: FilterField,
  type: DataTypes,
  timeTagDefinitions?: Record<string, TimeTagRead>
): string | React.ReactNode => {
  if (field === 'id') {
    return value.toString()
  }

  if (type === 'date' && Array.isArray(value) && typeof value[0] === 'string') {
    // Date filters have format: [operator, date1, date2?]
    const [operator, date1, date2] = value as string[]
    const operatorLabels: Record<string, string> = {
      '=': '=',
      '<': '<',
      '>': '>',
      Range: 'Range',
    }
    const operatorLabel = operatorLabels[operator] || operator

    if (operator === 'Range' && date1 && date2) {
      return `${operatorLabel} ${formatDate(date1)} - ${formatDate(date2)}`
    } else if (date1) {
      return `${operatorLabel} ${formatDate(date1)}`
    } else {
      return operatorLabel
    }
  }

  // Handle entity type with new format (EntityFilterValue[])
  if (
    type === 'entity' &&
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    'type' in value[0] &&
    'value' in value[0]
  ) {
    const entityValues = value as EntityFilterValue[]
    return entityValues.map((item) => (item.type === 'id' ? `ID: ${item.value}` : item.value)).join(', ')
  }

  if (Array.isArray(value)) {
    // Check if it's EntityFilterValue array
    if (value.length > 0 && typeof value[0] === 'object' && 'type' in value[0] && 'value' in value[0]) {
      // Already handled above for entity type
      return '' // Should not reach here
    }
    // Check if it's time_tag field and we have timeTagDefinitions
    if (field === 'time_tag' && type === 'tags' && timeTagDefinitions) {
      return (
        <span className="flex items-center gap-1">
          {(value as string[]).map((tagName, idx) => {
            const timeTag = timeTagDefinitions[tagName]
            return (
              <span key={idx} className="flex items-center gap-1">
                {timeTag ? timeTag.name : formatTitleString(String(tagName))}
                {idx < (value as string[]).length - 1 && <span>,</span>}
              </span>
            )
          })}
        </span>
      )
    }
    return (value as string[]).map((v) => formatTitleString(String(v))).join(', ')
  } else {
    // Check if it's time_tag field and we have timeTagDefinitions
    if (field === 'time_tag' && type === 'tags' && timeTagDefinitions) {
      const timeTag = timeTagDefinitions[String(value)]
      return timeTag ? timeTag.name : formatTitleString(String(value))
    }
    return formatTitleString(String(value))
  }
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeFilters,
  sortState,
  onClearSort,
  onRemoveFilter,
  onRemoveSearchTerm,
  onClearAllFilters,
  timeTagDefinitions,
}) => {
  const { getOrganisationById } = useOrganisation()

  const containerRef = useRef<HTMLDivElement>(null)
  const componentIdRef = useRef<string>(`active-filters-${Math.random().toString(36).substr(2, 9)}`)

  // Helper to get organisation name from ID
  const getOrgName = (orgId: string): string => {
    const org = getOrganisationById(orgId)
    return org?.name || orgId
  }

  // Always render container to maintain consistent spacing, even when empty
  const hasFilters = activeFilters.length > 0 || sortState.field

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-2">
      {hasFilters && <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>}
      {sortState.field && (
        <button
          onClick={onClearSort}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
        >
          <span>{`Sorting ${formatTitleString(sortState.field)}: ${sortState.direction.toUpperCase()}`}</span>
          <span className="hover:text-primary/70">
            <XMarkIcon className="h-3 w-3" />
          </span>
        </button>
      )}
      {activeFilters.map((filter, index) => {
        if (filter.field === 'search' && Array.isArray(filter.value)) {
          // Render each search term separately
          return filter.value.map((searchTerm, searchIndex) => (
            <button
              key={`search-${index}-${searchIndex}`}
              onClick={() => onRemoveSearchTerm(index, searchIndex)}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
            >
              <span>{`Search: ${searchTerm}`}</span>
              <span className="hover:text-primary/70">
                <XMarkIcon className="h-3 w-3" />
              </span>
            </button>
          ))
        } else {
          // For entity type with new format, handle ID lookup for display
          let displayValue = formatValue(filter.value, filter.field, filter.type, timeTagDefinitions)

          // If using new format with EntityFilterValue[], look up names for ID values
          if (
            filter.type === 'entity' &&
            filter.field === 'organisation' &&
            Array.isArray(filter.value) &&
            filter.value.length > 0 &&
            typeof filter.value[0] === 'object' &&
            'type' in filter.value[0] &&
            'value' in filter.value[0]
          ) {
            const entityValues = filter.value as EntityFilterValue[]
            const displayParts = entityValues.map((item) => {
              if (item.type === 'id') {
                const orgName = getOrgName(item.value)
                return `${orgName}`
              }
              return item.value
            })
            displayValue = displayParts.join(', ')
          }

          // Check if displayValue is a React node (for time tags with icons)
          const isReactNode = typeof displayValue !== 'string'

          // Render other filters normally
          return (
            <button
              key={index}
              onClick={() => onRemoveFilter(index)}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
            >
              <span className="flex items-center gap-1">
                <span>{formatTitleString(filter.field)}:</span>
                {isReactNode ? displayValue : <span>{displayValue}</span>}
              </span>
              <span className="hover:text-primary/70">
                <XMarkIcon className="h-3 w-3" />
              </span>
            </button>
          )
        }
      })}
      {hasFilters && (
        <button
          onClick={onClearAllFilters}
          className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
