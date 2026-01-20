'use client'

import type { ActiveBetween } from '@/data'
import { formatDate } from '@/utility/utility'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { addMonths, format, getDate, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'

export type CellInfo = {
  date: Date
  isInCurrentMonth: boolean
  isDateSelected: boolean
  isDateToday: boolean
  isInActivePeriod: boolean
  isDisabled: boolean
}

type CalendarProps = {
  currentDate?: Date
  selectedDate?: Date | null // Single selected date for highlighting
  onDateClick?: (date: Date) => void
  renderCellContent?: (cellInfo: CellInfo) => React.ReactNode
  className?: string
  activeBetween?: ActiveBetween | null
}

const Calendar = ({
  currentDate = new Date(),
  selectedDate = null,
  onDateClick,
  renderCellContent,
  className = '',
  activeBetween = null,
}: CalendarProps) => {
  const [viewDate, setViewDate] = useState(currentDate)

  const monthStart = startOfMonth(viewDate)
  const monthStartWeek = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday as first day

  // Generate calendar days (6 weeks to ensure full month display)
  const calendarDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(monthStartWeek)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }, [monthStartWeek])

  const handlePreviousMonth = () => {
    setViewDate(subMonths(viewDate, 1))
  }

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setViewDate(today)
    onDateClick?.(today)
  }

  const isSelected = (date: Date): boolean => {
    return selectedDate ? isSameDay(selectedDate, date) : false
  }

  const isCurrentMonth = (date: Date) => {
    return isSameMonth(date, viewDate)
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  // Check if a date is within the active period
  const isDateInActivePeriod = (date: Date): boolean => {
    if (!activeBetween) return true // No active period restriction

    // Get the start and end of the day being checked
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

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

    // If only from_date is set, check if day overlaps (dayEnd >= fromDate)
    if (fromDate && !toDate) {
      return dayEnd >= fromDate
    }

    // If only to_date is set, check if day overlaps (dayStart <= toDate)
    if (!fromDate && toDate) {
      return dayStart <= toDate
    }

    // If both are set, check if day overlaps with the period
    // Day overlaps if: dayStart <= toDate AND dayEnd >= fromDate
    if (fromDate && toDate) {
      return dayStart <= toDate && dayEnd >= fromDate
    }

    // If neither is set, it's not active
    return false
  }

  // Format active between display text
  const getActiveBetweenText = (): string => {
    if (!activeBetween) return ''

    const fromDate = activeBetween.from_date
    const toDate = activeBetween.to_date
    const fromTime = activeBetween.from_time
    const toTime = activeBetween.to_time

    // Format time for display
    const formatTime = (time: string | null | undefined): string => {
      if (!time) return ''
      const parts = time.split(':')
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
      }
      return time
    }

    if (fromDate && toDate) {
      const fromTimeStr = formatTime(fromTime)
      const toTimeStr = formatTime(toTime)
      return `${formatDate(fromDate.toISOString())}${fromTimeStr ? ` ${fromTimeStr}` : ''} - ${formatDate(toDate.toISOString())}${toTimeStr ? ` ${toTimeStr}` : ''}`
    } else if (fromDate) {
      const fromTimeStr = formatTime(fromTime)
      return `From ${formatDate(fromDate.toISOString())}${fromTimeStr ? ` ${fromTimeStr}` : ''} onwards`
    } else if (toDate) {
      const toTimeStr = formatTime(toTime)
      return `Until ${formatDate(toDate.toISOString())}${toTimeStr ? ` ${toTimeStr}` : ''}`
    }

    return ''
  }

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const hasGlobalActiveBetween = !!(activeBetween?.from_date || activeBetween?.to_date)

  const isOutsideActiveBetweenNow = useMemo(() => {
    if (!hasGlobalActiveBetween || !activeBetween) return false

    const now = new Date()
    const applyTime = (date: Date, time: string | null | undefined, defaultToStartOfDay: boolean): Date => {
      const result = new Date(date)
      if (time) {
        const [hours, minutes] = time.split(':').map((part) => Number(part))
        result.setHours(hours || 0, minutes || 0, 0, 0)
      } else if (defaultToStartOfDay) {
        result.setHours(0, 0, 0, 0)
      } else {
        result.setHours(23, 59, 59, 999)
      }
      return result
    }

    if (activeBetween.from_date) {
      const fromBoundary = applyTime(new Date(activeBetween.from_date), activeBetween.from_time, true)
      if (now < fromBoundary) {
        return true
      }
    }
    if (activeBetween.to_date) {
      const toBoundary = applyTime(new Date(activeBetween.to_date), activeBetween.to_time, false)
      if (now > toBoundary) {
        return true
      }
    }

    return false
  }, [activeBetween, hasGlobalActiveBetween])

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {/* Header */}
      <div className="flex w-full flex-shrink-0 items-center justify-between p-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToday}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Active Between */}
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4">
          {activeBetween && getActiveBetweenText() && (
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${
                isOutsideActiveBetweenNow
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              }`}
            >
              <span
                className={`${
                  isOutsideActiveBetweenNow ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                Active:
              </span>
              <span>{getActiveBetweenText()}</span>
            </div>
          )}
          <h2 className="dark:text-textDarkMode text-base font-medium text-gray-900">
            {format(viewDate, 'MMMM yyyy')}
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Day Names Header */}
        <div className="grid flex-shrink-0 grid-cols-7 border-t border-gray-200 bg-[#E7ECF2] dark:border-gray-700 dark:bg-gray-900">
          {dayNames.map((day) => (
            <div
              key={day}
              className="border-gray-200 p-2 text-center text-xs font-medium text-gray-700 last:border-r-0 dark:border-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid min-h-0 flex-1 grid-cols-7" style={{ gridTemplateRows: 'repeat(6, 1fr)' }}>
          {calendarDays.map((date, index) => {
            const dayNumber = getDate(date)
            const isInCurrentMonth = isCurrentMonth(date)
            const isDateSelected = isSelected(date)
            const isDateToday = isToday(date)
            const isLastColumn = index % 7 === 6 // Last column (Sunday)
            const isInActivePeriod = isDateInActivePeriod(date)
            const isDisabled = !isInActivePeriod

            return (
              <button
                key={index}
                onClick={() => onDateClick?.(date)}
                className={`relative flex h-full flex-col border-r border-t border-gray-200 p-2 text-left transition-colors dark:border-gray-700 ${
                  isLastColumn ? 'border-r-0' : ''
                } ${!isInCurrentMonth ? 'bg-gray-50/50 text-gray-400 dark:bg-gray-900/50 dark:text-gray-600' : ''} ${
                  isDisabled
                    ? isOutsideActiveBetweenNow
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                      : 'cursor-pointer opacity-60 hover:bg-gray-100/50 hover:opacity-80 dark:hover:bg-gray-700/30'
                    : isDateSelected
                      ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/70'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {/* {isDisabled && (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 bg-red-500/50"
                    // style={{
                    //   backgroundImage: `repeating-linear-gradient(
                    //     45deg,
                    //     transparent,
                    //     transparent 12px,
                    //     rgba(0, 0, 0, 0.08) 12px,
                    //     rgba(0, 0, 0, 0.08) 24px
                    //   )`,
                    // }}
                  />
                )} */}
                <div className={`flex items-center justify-between ${!isInCurrentMonth ? 'opacity-20' : ''}`}>
                  <div className="flex min-h-6 items-center justify-center">
                    <span
                      className={`items-center justify-center text-xs font-medium ${
                        isDateToday
                          ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white'
                          : isDateSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {dayNumber}
                    </span>
                  </div>
                </div>
                {renderCellContent &&
                  renderCellContent({
                    date,
                    isInCurrentMonth,
                    isDateSelected,
                    isDateToday,
                    isInActivePeriod,
                    isDisabled,
                  })}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar
