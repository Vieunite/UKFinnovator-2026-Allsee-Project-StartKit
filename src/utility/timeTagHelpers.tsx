import type { TimeTag, TimeTagCondition } from '@/data'
import type { Components } from '@/types/openapi'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const getPrimaryTimeTagCondition = (tag?: TimeTag | null): TimeTagCondition | null => {
  if (!tag || !Array.isArray(tag.conditions) || tag.conditions.length === 0) {
    return null
  }
  return tag.conditions[0]
}

export const getTimeTagType = (tag?: TimeTag | null): 'include' | 'exclude' => {
  return getPrimaryTimeTagCondition(tag)?.type ?? 'include'
}

export const getTimeTagSymbol = (tag?: TimeTag | null): React.ReactNode => {
  return getTimeTagType(tag) === 'include' ? (
    <PlusCircleIcon className="h-4 w-4 stroke-2" />
  ) : (
    <MinusCircleIcon className="h-4 w-4 stroke-2" />
  )
}

export const getTimeTagIdentifier = (tag: TimeTag | string): string => {
  if (typeof tag === 'string') return tag
  return tag.name
}

export const formatTimeTagLabel = (tag: TimeTag | string, className?: string): React.ReactNode => {
  if (!tag) return ''
  if (typeof tag === 'string') {
    return tag
  }
  const symbol = getTimeTagSymbol(tag)
  return (
    <span className="flex items-center gap-1">
      {symbol}
      <span className={`text-xs ${className}`}>{tag.name}</span>
    </span>
  )
}

export const formatTimeRange = (time?: { start?: string; end?: string } | null, fallback = 'All day'): string => {
  if (!time) return fallback
  const { start, end } = time
  if (start && end) return `${start} - ${end}`
  if (start && !end) return `${start} onwards`
  if (!start && end) return `Until ${end}`
  return fallback
}

export const formatTimeTagDays = (days?: number[] | null, fallback = 'All days'): string => {
  if (!days || days.length === 0) return fallback
  if (days.length === 7) return 'Every day'
  return days
    .sort((a, b) => a - b)
    .map((day) => DAY_LABELS[day] ?? String(day))
    .join(', ')
}

export const getTimeTagDescription = (
  tag: TimeTag,
  options: { showType?: boolean } = {}
): { summary: string; details: Array<{ label: string; value: string }> } => {
  const { showType = true } = options
  const condition = getPrimaryTimeTagCondition(tag)
  const typeLabel = condition?.type === 'exclude' ? 'Exclude' : 'Include'

  const summaryParts = [
    showType ? typeLabel : null,
    formatTimeTagDays(condition?.days),
    formatTimeRange(condition?.time),
  ].filter(Boolean)
  const summary = summaryParts.join(' • ')

  const details: Array<{ label: string; value: string }> = []
  if (showType) {
    details.push({ label: 'Type', value: condition?.type === 'exclude' ? 'Exclude (-)' : 'Include (+)' })
  }
  details.push({ label: 'Days', value: formatTimeTagDays(condition?.days) })
  details.push({ label: 'Time', value: formatTimeRange(condition?.time) })

  return {
    summary,
    details,
  }
}

export const createTimeTagObject = (
  tag: TimeTag | string,
  fallbackType: 'include' | 'exclude' = 'include'
): TimeTag => {
  if (typeof tag !== 'string') return tag
  return {
    name: tag,
    conditions: [
      {
        type: fallbackType,
      },
    ],
  }
}

// Helper functions for TimeTagRead (new API structure)
export const formatTimeTagWindowDays = (days: number[]): string => {
  if (!days || days.length === 0) return 'All days'
  if (days.length === 7) return 'Every day'
  // Note: API uses 0=Monday, 1=Tuesday, etc. (ISO 8601)
  return days
    .sort((a, b) => a - b)
    .map((day) => DAY_LABELS[day] ?? String(day))
    .join(', ')
}

export const formatTimeTagWindowTime = (startTime: string, endTime: string): string => {
  if (!startTime && !endTime) return 'All day'
  if (startTime && endTime) return `${startTime} - ${endTime}`
  if (startTime && !endTime) return `${startTime} onwards`
  if (!startTime && endTime) return `Until ${endTime}`
  return 'All day'
}

export const formatTimeTagWindowSummary = (window: Components.Schemas.TimeTagWindowRead): string => {
  const days = formatTimeTagWindowDays(window.days_of_week)
  const time = formatTimeTagWindowTime(window.start_time, window.end_time)
  return `${days} • ${time}`
}

export const getTimeTagReadSummary = (
  tag: Components.Schemas.TimeTagRead,
  options: { showMultipleWindows?: boolean } = {}
): string => {
  const { showMultipleWindows = true } = options
  const windows = tag.windows || []

  if (windows.length === 0) {
    return 'No windows defined'
  }

  if (windows.length === 1) {
    return formatTimeTagWindowSummary(windows[0])
  }

  // Multiple windows: show first window + count
  if (showMultipleWindows) {
    const firstWindow = formatTimeTagWindowSummary(windows[0])
    const remainingCount = windows.length - 1
    return `${firstWindow}, +${remainingCount} window${remainingCount !== 1 ? 's' : ''}`
  }

  return formatTimeTagWindowSummary(windows[0])
}

export const getTimeTagReadDetails = (tag: Components.Schemas.TimeTagRead): Array<{ label: string; value: string }> => {
  const details: Array<{ label: string; value: string }> = []
  const windows = tag.windows || []

  if (windows.length === 0) {
    details.push({ label: 'Windows', value: 'No windows defined' })
  } else if (windows.length === 1) {
    const window = windows[0]
    details.push({ label: 'Days', value: formatTimeTagWindowDays(window.days_of_week) })
    details.push({ label: 'Time', value: formatTimeTagWindowTime(window.start_time, window.end_time) })
  } else {
    // Show all windows
    windows.forEach((window, index) => {
      details.push({
        label: `Window ${index + 1}`,
        value: formatTimeTagWindowSummary(window),
      })
    })
  }

  return details
}
