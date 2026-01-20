import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import * as React from 'react'
import SparkMD5 from 'spark-md5'

export async function generateMD5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result as ArrayBuffer | null

      if (result) {
        const hash = SparkMD5.ArrayBuffer.hash(result)
        resolve(hash)
      } else {
        reject(new Error('Failed to read file for hashing'))
      }
    }

    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsArrayBuffer(file)
  })
}

export function isSafari() {
  if (process.env.NEXT_PUBLIC_SAFARI_CHECK === 'false') return false
  const userAgent = navigator.userAgent
  return /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
}

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const checkAspectRatio = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const tolerance = 0.001

    // Check if the file is a video
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.src = url

      video.onloadedmetadata = () => {
        const width = video.videoWidth
        const height = video.videoHeight
        const aspectRatio = width / height

        //removedconsole.log(`Video aspect ratio: ${width}:${height} = ${aspectRatio}`)
        URL.revokeObjectURL(url) // Clean up

        const isValid = Math.abs(aspectRatio - 16 / 9) < tolerance || Math.abs(aspectRatio - 9 / 16) < tolerance
        resolve(isValid)
      }

      video.onerror = () => {
        console.warn('Failed to load video for aspect ratio check')
        resolve(false) // Assume invalid if the video cannot be loaded
      }
    } else {
      // Image check (same logic as before)
      const img = new Image()
      img.src = url

      img.onload = () => {
        const width = img.width
        const height = img.height
        const aspectRatio = width / height

        //removedconsole.log(`Image aspect ratio: ${width}:${height} = ${aspectRatio}`)
        URL.revokeObjectURL(url) // Clean up

        const isValid = Math.abs(aspectRatio - 16 / 9) < tolerance || Math.abs(aspectRatio - 9 / 16) < tolerance
        resolve(isValid)
      }

      img.onerror = () => {
        console.warn('Failed to load image for aspect ratio check')
        resolve(false) // Assume invalid if the image cannot be loaded
      }
    }
  })
}

export const removeBodyOverflow = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollbarWidth}px`
}

export const resetBodyOverflow = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

export const formatTitleString = (fieldName: string): string => {
  if (!fieldName) return ''
  return fieldName
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

export const prettifyKey = (key: string): string => {
  if (!key) return ''

  const firstWord = key.split('_')[0] // Take only the part before the underscore
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase()
}

export const keyboardShortcuts = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const isMacOs = navigator.userAgent.includes('Mac')

  const isWinCtrl = !isMacOs && e.ctrlKey
  const isMacCmd = isMacOs && e.metaKey

  const isZKey = e.key.toLowerCase() === 'z'
  const isYKey = e.key.toLowerCase() === 'y'

  const isWinUndo = isWinCtrl && isZKey && !e.shiftKey
  const isMacUndo = isMacCmd && isZKey && !e.shiftKey

  const isWinRedo = (isWinCtrl && isYKey) || (isWinCtrl && e.shiftKey && isZKey)
  const isMacRedo = isMacCmd && e.shiftKey && isZKey

  return {
    isUndo: isWinUndo || isMacUndo,
    isRedo: isWinRedo || isMacRedo,
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0') // Ensures 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()
  return `${day}/${month}/${year}` // 24/04/2025
}

export function formatDate2(dateString: string | number): string {
  const date = new Date(dateString)

  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'long' })
  const year = date.getFullYear()

  const getOrdinal = (num: number): string => {
    if (num > 3 && num < 21) return 'th' // Covers 11th-13th
    switch (num % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  return `${day}${getOrdinal(day)} ${month} ${year}` // 24th April 2025
}

export const formatDate3 = (isoString: string): string => {
  const date = new Date(isoString)

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'long' }) // Full month name
  const year = date.getFullYear()

  // Get ordinal suffix for the day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'
    const suffixes = ['st', 'nd', 'rd']
    return suffixes[(day % 10) - 1] || 'th'
  }

  return `${hours}:${minutes}, ${day}${getOrdinalSuffix(day)} ${month} ${year}` // 12:00, 24th April 2025
}

// Function to format the time in AM/PM
export const formatTime = (d: Date) => {
  let hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 12-hour format
  const strMinutes = minutes < 10 ? `0${minutes}` : minutes
  return `${hours}:${strMinutes} ${ampm}` // 12:00 PM
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()

  // Check if the timestamp is from today
  const isToday = date.toDateString() === now.toDateString()

  // Check if the timestamp is from yesterday
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

  // Return the formatted date/time based on conditions
  if (isToday) {
    return formatTime(date) // 12:00 PM
  } else if (isYesterday) {
    return `Yesterday, ${formatTime(date)}` // Yesterday, 12:00 PM
  } else {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    return `${formattedDate}, ${formatTime(date)}` // 24/04/2025, 12:00 PM
  }
}

export function formatTimestamp2(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()

  // Check if the timestamp is from today
  const isToday = date.toDateString() === now.toDateString()

  // Check if the timestamp is from yesterday
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

  if (isToday) {
    return 'Today'
  } else if (isYesterday) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // Example: "Mar 26"
  }
}

export function formatTimestamp3(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()

  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

  if (diffInDays < 3) {
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return `${dayName} ${time}`
  } else {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${dayName} ${day}/${month}` // Mon 24/04
  }
}

export function formatTimestamp4(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()

  // Check if the timestamp is from today
  const isToday = date.toDateString() === now.toDateString()

  // Check if the timestamp is from yesterday
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } else if (isYesterday) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export const formatDateTime = (date: Date | undefined): string => {
  if (!date) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

export const toLocalISOStringWithoutMs = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // Months are 0-based
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const formatTableValue = (value: any, field: string): string | React.ReactNode => {
  if (value === null || value === undefined) return '-'

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return '-'

    // Handle array of objects with id and name
    if (value[0]?.id && value[0]?.name) {
      return value.map((item) => item.name).join(', ')
    }

    if (value[0]?.initiator) return value.length.toString()

    // Handle array of strings/numbers
    return value.join(', ')
  }

  // Handle custom_date fields (fields that should show date and time)
  if (
    field.toLowerCase().includes('custom_date') ||
    field.toLowerCase().includes('datetime') ||
    field.toLowerCase().includes('date') ||
    field.toLowerCase().includes('time')
  ) {
    if (new Date(value).toString() !== 'Invalid Date') {
      const date = new Date(value)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year}, ${hours}:${minutes}`
    }
  }

  if (field.toLowerCase().includes('specifications')) {
    return value?.target_spec?.name ?? 'Default'
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    // Handle objects with id and name
    if (value.id && value.name) {
      return value.name
    }

    if (value.url) {
      return React.createElement(
        'div',
        { className: 'flex items-center gap-1' },
        React.createElement('span', { className: '' }, value.file_name || 'File'),
        React.createElement(
          'a',
          {
            href: value.url,
            download: value.file_name,
            target: '_blank',
            rel: 'noopener noreferrer',
            className:
              'transition-bg flex-shrink-0 cursor-pointer rounded bg-blue-50 p-0.5 text-blue-600 duration-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
            title: 'Download file',
          },
          React.createElement(ArrowDownTrayIcon, { className: 'h-2.5 w-2.5' })
        )
      )
    }

    // Handle other objects
    return JSON.stringify(value, null, 2)
  }

  // Handle primitive values
  return value.toString()
}

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
}

export const clearAllAuthData = (): void => {
  if (typeof window === 'undefined') return

  const cookieName = process.env.NEXT_PUBLIC_DEVELOPER_COOKIE === 'true' ? 'dev_auth_token' : 'auth_token'

  // Clear cookies with multiple strategies
  const strategies = [
    `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
    `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`,
    `${cookieName}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
  ]

  strategies.forEach((strategy) => {
    document.cookie = strategy
  })

  // Clear all storage
  sessionStorage.clear()
  localStorage.clear()

  // Force clear any remaining auth-related items
  localStorage.removeItem('auth_token')
  localStorage.removeItem('dev_auth_token')
  localStorage.removeItem('logoutInProgress')
}
