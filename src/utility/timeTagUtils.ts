import type { TimeTag, TimeTagCondition } from '@/data'

export type CellPlayState = 'full' | 'partial' | 'none'

export type DayTimeTagInfo = {
  state: CellPlayState
  activeTags: TimeTag[]
  timeRanges: Array<{ start: string; end: string }>
}

/**
 * Check if a date matches the day condition
 */
const matchesDayCondition = (date: Date, days?: number[]): boolean => {
  if (!days || days.length === 0) return true
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return days.includes(dayOfWeek)
}

/**
 * Check if a time condition applies to the entire day
 */
const isFullDayCondition = (condition: TimeTagCondition): boolean => {
  return !condition.time && (!condition.days || condition.days.length === 0)
}

/**
 * Check if a condition applies to a specific date
 */
const conditionAppliesToDate = (date: Date, condition: TimeTagCondition): boolean => {
  if (!matchesDayCondition(date, condition.days)) {
    return false
  }
  // If no time specified, it applies to the whole day
  return true
}

/**
 * Calculate play state and active tags for a given date
 */
export const calculateDayPlayState = (date: Date, timeTags: TimeTag[]): DayTimeTagInfo => {
  if (timeTags.length === 0) {
    return {
      state: 'full',
      activeTags: [],
      timeRanges: [],
    }
  }

  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const activeTags: TimeTag[] = []
  const includeRanges: Array<{ start: string; end: string }> = []
  const excludeRanges: Array<{ start: string; end: string }> = []
  let hasFullDayInclude = false
  let hasFullDayExclude = false
  let hasDaySpecificInclude = false
  let daySpecificIncludeDays: number[] = []

  // First pass: collect all include conditions
  for (const timeTag of timeTags) {
    for (const condition of timeTag.conditions) {
      if (condition.type === 'include') {
        if (isFullDayCondition(condition)) {
          // Full day include (no day or time restrictions)
          hasFullDayInclude = true
          if (!activeTags.find((t) => t.name === timeTag.name)) {
            activeTags.push(timeTag)
          }
        } else if (condition.days && condition.days.length > 0) {
          // Day-specific include (e.g., Half-term weekdays only)
          hasDaySpecificInclude = true
          daySpecificIncludeDays = [...new Set([...daySpecificIncludeDays, ...condition.days])]
          // Always add the tag so we can show why it's not playing on excluded days
          if (!activeTags.find((t) => t.name === timeTag.name)) {
            activeTags.push(timeTag)
          }
          if (condition.days.includes(dayOfWeek)) {
            // If it also has time, add the time range
            if (condition.time) {
              includeRanges.push(condition.time)
            }
          }
        } else if (condition.time) {
          // Time-specific include (e.g., Morning, Evening)
          includeRanges.push(condition.time)
          if (!activeTags.find((t) => t.name === timeTag.name)) {
            activeTags.push(timeTag)
          }
        }
      }
    }
  }

  // Second pass: check exclusions (exclusions take priority)
  for (const timeTag of timeTags) {
    for (const condition of timeTag.conditions) {
      if (condition.type === 'exclude') {
        if (isFullDayCondition(condition)) {
          // Full day exclude
          hasFullDayExclude = true
          // Add to active tags to show why it's excluded
          if (!activeTags.find((t) => t.name === timeTag.name)) {
            activeTags.push(timeTag)
          }
        } else if (condition.days && condition.days.length > 0) {
          // Day-specific exclude (e.g., Weekend)
          // Only add to active tags if it actually applies to this day
          if (condition.days.includes(dayOfWeek)) {
            hasFullDayExclude = true
            if (!activeTags.find((t) => t.name === timeTag.name)) {
              activeTags.push(timeTag)
            }
          }
        } else if (condition.time) {
          // Time-specific exclude
          excludeRanges.push(condition.time)
          if (!activeTags.find((t) => t.name === timeTag.name)) {
            activeTags.push(timeTag)
          }
        }
      }
    }
  }

  // Determine state based on priority: exclusions > includes
  let state: CellPlayState = 'none'

  // If excluded for full day, it's not playing
  if (hasFullDayExclude) {
    state = 'none'
  }
  // If we have day-specific includes and this day is not in the list, it's not playing
  else if (hasDaySpecificInclude && !daySpecificIncludeDays.includes(dayOfWeek)) {
    state = 'none'
  }
  // If we have full day include with no exclusions and no time restrictions
  else if (hasFullDayInclude && includeRanges.length === 0 && excludeRanges.length === 0) {
    state = 'full'
  }
  // If we have time-based includes or exclusions, it's partial
  else if (includeRanges.length > 0 || excludeRanges.length > 0) {
    state = 'partial'
  }
  // If we have day-specific includes and this day is in the list
  else if (hasDaySpecificInclude && daySpecificIncludeDays.includes(dayOfWeek)) {
    state = 'full'
  }
  // If we have exclusions but they don't apply to this day, default to playing
  // (e.g., Weekend exclusion doesn't apply to weekdays, so weekdays should play)
  else if (
    timeTags.some((tag) =>
      tag.conditions.some((c) => c.type === 'exclude' && c.days && c.days.length > 0 && !c.days.includes(dayOfWeek))
    )
  ) {
    // Has exclusions but current day is not excluded, so it should play
    state = 'full'
  }
  // Default: no conditions match, not playing
  else {
    state = 'none'
  }

  // Merge overlapping time ranges
  const mergedRanges = mergeTimeRanges(includeRanges, excludeRanges)

  return {
    state,
    activeTags,
    timeRanges: mergedRanges,
  }
}

/**
 * Merge and subtract time ranges
 */
const mergeTimeRanges = (
  includeRanges: Array<{ start: string; end: string }>,
  excludeRanges: Array<{ start: string; end: string }>
): Array<{ start: string; end: string }> => {
  if (excludeRanges.length === 0) {
    return includeRanges
  }

  // For now, return include ranges (we can enhance this later to subtract exclude ranges)
  return includeRanges
}
