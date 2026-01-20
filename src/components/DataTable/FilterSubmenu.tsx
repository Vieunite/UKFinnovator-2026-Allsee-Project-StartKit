'use client'

import type { TimeTag } from '@/data'
import { formatTitleString } from '@/utility/utility'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import type { Column, EntityFilterValue, FilterState } from './types'

interface FilterSubmenuProps {
  column: Column
  activeFilters: FilterState[]
  onAddFilter: (filters: FilterState[], replaceAll?: boolean, append?: boolean) => void
  onRemoveFilter: (index: number) => void
  timeTagDefinitions?: Record<string, any>
}

export const FilterSubmenu: React.FC<FilterSubmenuProps> = ({
  column,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  timeTagDefinitions,
}) => {
  const currentFilter = activeFilters.find((f) => f.field === column.field)
  const [filterInputValues, setFilterInputValues] = useState<Record<string, string>>({})

  // Type guard: check if value is EntityFilterValue array (only for entity type)
  const isEntityFilterValue = (value: any): value is EntityFilterValue[] => {
    return (
      column.type === 'entity' &&
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === 'object' &&
      'type' in value[0] &&
      'value' in value[0]
    )
  }

  // Helper to get string array from filter value (for non-entity types)
  const getStringArrayValue = (value: any): string[] => {
    if (isEntityFilterValue(value)) {
      return []
    }
    if (Array.isArray(value)) {
      return value as string[]
    }
    return value ? [String(value)] : []
  }

  // If column has filterOptions, render them as buttons (similar to status type)
  if (column.filterOptions && column.filterOptions.length > 0) {
    return (
      <div className="flex flex-col gap-1 p-2">
        {column.filterOptions.map((option) => {
          const stringValues = getStringArrayValue(currentFilter?.value)
          const isSelected = stringValues.includes(option)

          return (
            <button
              key={option}
              onClick={() => {
                const currentValues = getStringArrayValue(currentFilter?.value)

                if (isSelected) {
                  const newValues = currentValues.filter((v) => v !== option)
                  const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                  if (newValues.length === 0 && filterIndex !== -1) {
                    onRemoveFilter(filterIndex)
                  } else if (newValues.length > 0) {
                    onAddFilter(
                      [{ field: column.field, value: newValues, type: column.type, exact: true }],
                      false,
                      false
                    )
                  }
                } else {
                  onAddFilter(
                    [
                      {
                        field: column.field,
                        value: [...currentValues, option],
                        type: column.type,
                        exact: true,
                      },
                    ],
                    false,
                    false
                  )
                }
              }}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-all ${
                isSelected
                  ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {formatTitleString(option)}
            </button>
          )
        })}
      </div>
    )
  }

  switch (column.type) {
    case 'text': {
      const textFilterValues = getStringArrayValue(currentFilter?.value)
      const textInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {textFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {textFilterValues.map((value, index) => (
                <button
                  onClick={() => {
                    const newValues = textFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'text' }], false, false)
                    }
                  }}
                  key={`${value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`text-${column.field}`}
            type="text"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={textInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && textInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = textInputValue.trim()
                const valueExists = textFilterValues.some((v) => String(v).toLowerCase() === trimmedValue.toLowerCase())
                if (!valueExists) {
                  const newValues = [...textFilterValues, trimmedValue]
                  onAddFilter([{ field: column.field, value: newValues, type: 'text' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'status':
    case 'tag_type': {
      const statusOptions =
        column.type === 'tag_type'
          ? column.filterOptions || ['content', 'time']
          : ['online', 'offline', 'error', 'asleep']
      const statusFilterValues = getStringArrayValue(currentFilter?.value)
      const isTagType = column.type === 'tag_type'

      return (
        <div className="flex flex-col gap-1 p-2">
          {statusOptions.map((status) => {
            const isSelected = statusFilterValues.includes(status)
            const label =
              isTagType && status === 'time'
                ? 'Time Tags'
                : isTagType && status === 'content'
                  ? 'Content Tags'
                  : formatTitleString(status)

            return (
              <button
                key={status}
                onClick={() => {
                  const currentValues = getStringArrayValue(currentFilter?.value)

                  if (isSelected) {
                    const newValues = currentValues.filter((v) => v !== status)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: column.type }], false, false)
                    }
                  } else {
                    onAddFilter(
                      [
                        {
                          field: column.field,
                          value: currentFilter ? [...currentValues, status] : [status],
                          type: column.type,
                        },
                      ],
                      false,
                      false
                    )
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-all ${
                  isSelected
                    ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )
    }

    case 'media_type': {
      const mediaTypeOptions = ['image', 'video', 'folder']
      const mediaTypeFilterValues = getStringArrayValue(currentFilter?.value)
      return (
        <div className="flex flex-col gap-1 p-2">
          {mediaTypeOptions.map((mediaType) => {
            const isSelected = mediaTypeFilterValues.includes(mediaType)

            return (
              <button
                key={mediaType}
                onClick={() => {
                  const currentValues = getStringArrayValue(currentFilter?.value)

                  if (isSelected) {
                    const newValues = currentValues.filter((v) => v !== mediaType)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'media_type' }], false, false)
                    }
                  } else {
                    onAddFilter(
                      [
                        {
                          field: column.field,
                          value: currentFilter ? [...currentValues, mediaType] : [mediaType],
                          type: 'media_type',
                        },
                      ],
                      false,
                      false
                    )
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-all ${
                  isSelected
                    ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {formatTitleString(mediaType)}
              </button>
            )
          })}
        </div>
      )
    }

    case 'date':
    case 'active_between': {
      const dateOperators = [
        { value: '=', label: 'Equal to' },
        { value: '<', label: 'Before' },
        { value: '>', label: 'After' },
        { value: 'Range', label: 'Range' },
      ]
      // Date filters use string[] format: [operator, date1, date2?]
      const dateFilterValue =
        Array.isArray(currentFilter?.value) && typeof currentFilter.value[0] === 'string'
          ? (currentFilter.value as string[])
          : []
      const operator = dateFilterValue[0] || null
      const dateValue = dateFilterValue[1] || null
      const endDate = dateFilterValue[2] || null

      return (
        <div className="flex flex-col gap-2 p-2">
          <div className="flex flex-col gap-1">
            {dateOperators.map((op) => (
              <button
                key={op.value}
                onClick={() => {
                  const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                  if (operator === op.value && filterIndex !== -1) {
                    onRemoveFilter(filterIndex)
                  } else {
                    onAddFilter([{ field: column.field, value: [op.value], type: column.type }], false, false)
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-all ${
                  operator === op.value
                    ? 'border-primary text-primary bg-primary/10 dark:border-primary dark:bg-primary/20'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>

          {operator && (
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-2 dark:border-gray-700">
              <input
                name={`date-${column.field}`}
                type="date"
                value={dateValue || ''}
                onChange={(e) => {
                  const newValue = e.target.value
                  if (operator === 'Range') {
                    onAddFilter(
                      [
                        {
                          field: column.field,
                          value: newValue ? [operator, newValue, endDate || ''] : [operator],
                          type: column.type,
                        },
                      ],
                      false,
                      false
                    )
                  } else {
                    onAddFilter(
                      [{ field: column.field, value: newValue ? [operator, newValue] : [operator], type: column.type }],
                      false,
                      false
                    )
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
              />
              {operator === 'Range' && dateValue && (
                <input
                  name={`date-end-${column.field}`}
                  type="date"
                  value={endDate || ''}
                  min={dateValue || undefined}
                  onChange={(e) => {
                    onAddFilter(
                      [
                        {
                          field: column.field,
                          value: [operator, dateValue, e.target.value],
                          type: column.type,
                        },
                      ],
                      false,
                      false
                    )
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
                />
              )}
            </div>
          )}
        </div>
      )
    }

    case 'number': {
      const numberFilterValues = getStringArrayValue(currentFilter?.value)
      const numberInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {numberFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {numberFilterValues.map((value, index) => (
                <button
                  onClick={() => {
                    const newValues = numberFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'number' }], false, false)
                    }
                  }}
                  key={`${value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`number-${column.field}`}
            type="number"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={numberInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && numberInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = numberInputValue.trim()
                const valueExists = numberFilterValues.some((v) => String(v) === trimmedValue)
                if (!valueExists) {
                  const newValues = [...numberFilterValues, trimmedValue]
                  onAddFilter([{ field: column.field, value: newValues, type: 'number' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'duration': {
      const durationFilterValues = getStringArrayValue(currentFilter?.value)
      const durationInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {durationFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {durationFilterValues.map((value, index) => (
                <button
                  onClick={() => {
                    const newValues = durationFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'duration' }], false, false)
                    }
                  }}
                  key={`${value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`duration-${column.field}`}
            type="number"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={durationInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && durationInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = durationInputValue.trim()
                const valueExists = durationFilterValues.some((v) => String(v) === trimmedValue)
                if (!valueExists) {
                  const newValues = [...durationFilterValues, trimmedValue]
                  onAddFilter([{ field: column.field, value: newValues, type: 'duration' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'now_playing': {
      // Filter by playlist name (same as text filter)
      const playlistFilterValues = getStringArrayValue(currentFilter?.value)
      const playlistInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {playlistFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {playlistFilterValues.map((value, index) => (
                <button
                  onClick={() => {
                    const newValues = playlistFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'now_playing' }], false, false)
                    }
                  }}
                  key={`${value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`now_playing-${column.field}`}
            type="text"
            placeholder={`Filter by ${formatTitleString(column.field)} name... (Press Enter)`}
            value={playlistInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && playlistInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = playlistInputValue.trim()
                const valueExists = playlistFilterValues.some(
                  (v) => String(v).toLowerCase() === trimmedValue.toLowerCase()
                )
                if (!valueExists) {
                  const newValues = [...playlistFilterValues, trimmedValue]
                  onAddFilter([{ field: column.field, value: newValues, type: 'now_playing' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'entity': {
      // Entity type uses EntityFilterValue[] structure where each value has its own type
      // Handle backward compatibility: convert old format to new format
      const normalizeEntityValues = (value: any): Array<EntityFilterValue> => {
        if (!value) return []

        // If it's already the new format (array of objects with type and value)
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === 'object' &&
          'type' in value[0] &&
          'value' in value[0]
        ) {
          return value as Array<EntityFilterValue>
        }

        const stringValues = Array.isArray(value) ? value : [String(value)]
        return stringValues.map((v) => ({ type: 'name', value: String(v) }))
      }

      const entityFilterValues = normalizeEntityValues(currentFilter?.value)
      const entityInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {entityFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entityFilterValues.map((item, index) => (
                <button
                  onClick={() => {
                    const newValues = entityFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter(
                        [
                          {
                            field: column.field,
                            value: newValues,
                            type: 'entity',
                          },
                        ],
                        false,
                        false
                      )
                    }
                  }}
                  key={`${item.type}-${item.value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{item.type === 'id' ? `ID: ${item.value}` : item.value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`entity-${column.field}`}
            type="text"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={entityInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && entityInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = entityInputValue.trim()
                const valueExists = entityFilterValues.some((v) => v.value.toLowerCase() === trimmedValue.toLowerCase())
                if (!valueExists) {
                  // Always add as 'name' type when adding through UI
                  const newValues = [...entityFilterValues, { type: 'name' as const, value: trimmedValue }]
                  onAddFilter(
                    [
                      {
                        field: column.field,
                        value: newValues,
                        type: 'entity',
                      },
                    ],
                    false,
                    false
                  )
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'licence': {
      // Filter by licence code (same as text filter)
      const licenceFilterValues = getStringArrayValue(currentFilter?.value)
      const licenceInputValue = filterInputValues[column.field] || ''

      return (
        <div className="flex flex-col gap-2 p-2">
          {licenceFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {licenceFilterValues.map((value, index) => (
                <button
                  onClick={() => {
                    const newValues = licenceFilterValues.filter((_, i) => i !== index)
                    const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                    if (newValues.length === 0 && filterIndex !== -1) {
                      onRemoveFilter(filterIndex)
                    } else if (newValues.length > 0) {
                      onAddFilter([{ field: column.field, value: newValues, type: 'licence' }], false, false)
                    }
                  }}
                  key={`${value}-${index}`}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  <span>{value}</span>
                  <span className="hover:text-primary/70">
                    <XMarkIcon className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <input
            name={`licence-${column.field}`}
            type="text"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={licenceInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && licenceInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = licenceInputValue.trim()
                const valueExists = licenceFilterValues.some(
                  (v) => String(v).toLowerCase() === trimmedValue.toLowerCase()
                )
                if (!valueExists) {
                  const newValues = [...licenceFilterValues, trimmedValue]
                  onAddFilter([{ field: column.field, value: newValues, type: 'licence' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />
        </div>
      )
    }

    case 'tags': {
      const tagsFilterValues = getStringArrayValue(currentFilter?.value)
      const tagsInputValue = filterInputValues[column.field] || ''
      // Tags are now fetched from API, so we can't get all available tags here
      // This filter will need to be updated to fetch tags from API if needed
      const allAvailableTags: string[] = []
      const isTimeTagField = column.field === 'time_tag'

      // Helper to get TimeTag object for a tag name
      const getTimeTagForName = (tagName: string): TimeTag | null => {
        if (!isTimeTagField || !timeTagDefinitions) return null
        return timeTagDefinitions[tagName] || null
      }

      return (
        <div className="flex flex-col gap-2 p-2">
          {tagsFilterValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagsFilterValues.map((value, index) => {
                const timeTag = getTimeTagForName(value)
                const displayLabel = isTimeTagField && timeTag ? timeTag.name : formatTitleString(value)
                return (
                  <button
                    onClick={() => {
                      const newValues = tagsFilterValues.filter((_, i) => i !== index)
                      const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                      if (newValues.length === 0 && filterIndex !== -1) {
                        onRemoveFilter(filterIndex)
                      } else if (newValues.length > 0) {
                        onAddFilter([{ field: column.field, value: newValues, type: 'tags' }], false, false)
                      }
                    }}
                    key={`${value}-${index}`}
                    className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-primary transition-all duration-200 bg-primary/10 hover:bg-primary/20 dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                    style={{ backgroundColor: undefined }}
                  >
                    <span className="flex items-center gap-1">{displayLabel}</span>
                    <span className="hover:text-primary/70">
                      <XMarkIcon className="h-3 w-3" />
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          <input
            name={`tags-${column.field}`}
            type="text"
            placeholder={`Filter by ${formatTitleString(column.field)}... (Press Enter)`}
            value={tagsInputValue}
            onChange={(e) => {
              setFilterInputValues((prev) => ({ ...prev, [column.field]: e.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tagsInputValue.trim()) {
                e.preventDefault()
                const trimmedValue = tagsInputValue.trim()
                const valueExists = tagsFilterValues.some((v) => String(v).toLowerCase() === trimmedValue.toLowerCase())
                if (!valueExists) {
                  const matchingTag = allAvailableTags.find((tag) => tag.toLowerCase() === trimmedValue.toLowerCase())
                  const finalTagName = matchingTag || trimmedValue
                  const newValues = [...tagsFilterValues, finalTagName]
                  onAddFilter([{ field: column.field, value: newValues, type: 'tags' }], false, false)
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                } else {
                  setFilterInputValues((prev) => ({ ...prev, [column.field]: '' }))
                }
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-textDarkMode"
          />

          {allAvailableTags.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Available Tags</div>
              <div className="flex flex-wrap gap-2 p-2">
                {allAvailableTags.map((tag) => {
                  const isSelected = tagsFilterValues.some((v) => String(v).toLowerCase() === tag.toLowerCase())
                  const timeTag = getTimeTagForName(tag)
                  const displayLabel = isTimeTagField && timeTag ? timeTag.name : formatTitleString(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        if (isSelected) {
                          const newValues = tagsFilterValues.filter(
                            (v) => String(v).toLowerCase() !== tag.toLowerCase()
                          )
                          const filterIndex = activeFilters.findIndex((f) => f.field === column.field)
                          if (newValues.length === 0 && filterIndex !== -1) {
                            onRemoveFilter(filterIndex)
                          } else if (newValues.length > 0) {
                            onAddFilter([{ field: column.field, value: newValues, type: 'tags' }], false, false)
                          }
                        } else {
                          const newValues = [...tagsFilterValues, tag]
                          onAddFilter([{ field: column.field, value: newValues, type: 'tags' }], false, false)
                        }
                      }}
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                      }`}
                      style={{
                        backgroundColor: '#D1D5DB',
                        color: '#000',
                      }}
                    >
                      {displayLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}
