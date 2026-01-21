'use client'

import { ActiveBetweenModal } from '@/components/ActiveBetweenModal'
import { Table, TableBody, TableHead, TableHeadRow, TableRow, TD, TH } from '@/components/table/CustomTable'
import { useConfirm } from '@/context/ConfirmContext'
import { useOrganisation } from '@/context/OrganisationContext'
import { ActiveBetween, DeviceMedia, Entity, getTagColor, TimeTag } from '@/data'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Components } from '@/types/openapi'
import { createTimeTagObject, formatTimeTagLabel } from '@/utility/timeTagHelpers'
import { formatDate, formatTime, formatTitleString, removeBodyOverflow, resetBodyOverflow } from '@/utility/utility'
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  MinusCircleIcon,
  MinusIcon,
  PhotoIcon,
  PlusCircleIcon,
  PlusIcon,
  TagIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Tooltip from '../Tooltip'
import type { Column, ColumnOptions, DataTypes, SortState } from './types'

type ActionItem = {
  label: string
  onClick: (item: any) => void
  condition?: (item: any) => boolean // Optional function to determine if action should be shown
}

type ActionsProp = ActionItem[] | React.ComponentType<{ item: any }>

interface TableProps {
  title: string
  data: any[]
  columns: Column[]
  sortState: SortState
  selectedData: Set<string>
  onUpdateField?: (itemId: string, fieldName: string, value: any) => void
  disableSorting?: boolean
  onHandleSort: (field: string) => void
  onSelectAll: () => void
  onSelectItem: (itemId: string) => void
  onOpenTagModal: (itemId: string, itemName: string, fieldName: string) => void
  onRemoveTag: (itemId: string, fieldName: string, tagToRemove: string) => void
  merge?: boolean
  pagination?: boolean
  checkboxes?: boolean
  enableFolders?: boolean
  onFolderClick?: (folderId: string) => void
  actions?: ActionsProp
  minimiseTags?: boolean
}

// Helper function to calculate aspect ratio (GCD-based)
const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b)
  }

  const divisor = gcd(width, height)
  const ratioWidth = width / divisor
  const ratioHeight = height / divisor

  return `${ratioWidth}:${ratioHeight}`
}

// Maximum number of tags to display before showing "+X tags"
const MAX_DISPLAYED_TAGS = 4

// Tag-like object with optional color (for TagSummary compatibility)
type TagWithColor =
  | { name: string; color?: string | null }
  | string
  | TimeTag
  | (Components.Schemas.TimeTagRead & { condition?: 'include' | 'exclude' })

// Tags cell component with hover state
const TagsCell = React.memo(
  ({
    tags: tagValues,
    itemId,
    itemName,
    fieldName,
    onOpenModal,
    onRemoveTag,
    minimiseTags = false,
  }: {
    tags: TagWithColor[]
    itemId: string
    itemName: string
    fieldName: string
    onOpenModal: (itemId: string, itemName: string, fieldName: string) => void
    onRemoveTag: (itemId: string, fieldName: string, tagToRemove: string) => void
    minimiseTags?: boolean
  }) => {
    const [isHovered, setIsHovered] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMobile = useIsMobile()

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    const handleMouseEnter = () => {
      if (isMobile) return // Don't use hover delay on mobile
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true)
      }, 300)
    }

    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      if (!isMobile) {
        setIsHovered(false)
      }
    }

    const minimisedTagIcon = useMemo(() => {
      switch (fieldName) {
        case 'tags':
          return <TagIcon className="h-4 w-4 stroke-2" />
        case 'time_tag':
          return <ClockIcon className="h-4 w-4 stroke-2" />
        default:
          return <TagIcon className="h-4 w-4 stroke-2" />
      }
    }, [fieldName])

    // Show button on mobile or after hover delay on desktop
    const showAddButton = isMobile || isHovered

    // Separate displayed tags from hidden tags
    const displayedTags = tagValues.slice(0, MAX_DISPLAYED_TAGS)
    const remainingCount = tagValues.length - MAX_DISPLAYED_TAGS
    const hasMoreTags = remainingCount > 0

    // Helper to get tag name/key
    const getTagKey = useCallback((tag: TagWithColor): string => {
      if (typeof tag === 'string') return tag
      if ('name' in tag && typeof tag.name === 'string') return tag.name
      // TimeTag case
      return (tag as TimeTag).name
    }, [])

    // Helper to get tag color (from data first, fallback to getTagColor from fake data, then default)
    const getTagColorForDisplay = useCallback((tag: TagWithColor): string => {
      // If tag is an object with color property, use it
      if (typeof tag === 'object' && 'color' in tag && tag.color) {
        return tag.color
      }
      // If tag is a string, use getTagColor from fake data
      if (typeof tag === 'string') {
        return getTagColor(tag)
      }
      // If tag is an object with name property, use getTagColor with the name
      if (typeof tag === 'object' && 'name' in tag && typeof tag.name === 'string') {
        return getTagColor(tag.name)
      }
      // Default color if no color in data
      return '#D1D5DB'
    }, [])

    const getTagLabel = useCallback(
      (tag: TagWithColor): React.ReactNode => {
        if (fieldName === 'time_tag') {
          // Check if it's the old TimeTag format with conditions
          if (typeof tag === 'object' && 'conditions' in tag && Array.isArray((tag as TimeTag).conditions)) {
            const timeTag = tag as TimeTag
            return formatTimeTagLabel(timeTag)
          }
          // Check if it's TimeTagRead with condition property
          if (typeof tag === 'object' && 'id' in tag && 'condition' in tag) {
            const timeTagRead = tag as Components.Schemas.TimeTagRead & { condition?: 'include' | 'exclude' }
            const condition = timeTagRead.condition || 'include'
            const symbol =
              condition === 'include' ? (
                <PlusCircleIcon className="h-3 w-3 stroke-2" />
              ) : (
                <MinusCircleIcon className="h-3 w-3 stroke-2" />
              )
            return (
              <span className="flex items-center gap-1">
                {symbol}
                <span>{timeTagRead.name}</span>
              </span>
            )
          }
          // Fallback for string or TimeTagRead without condition
          const timeTag = typeof tag === 'string' ? createTimeTagObject(tag) : (tag as TimeTag)
          const label = formatTimeTagLabel(timeTag)
          return typeof label === 'string' ? label : typeof tag === 'object' && 'name' in tag ? tag.name : String(tag)
        }
        return formatTitleString(getTagKey(tag))
      },
      [fieldName, getTagKey]
    )

    return (
      <TD
        className={`${minimiseTags ? 'w-12 min-w-0' : 'w-64 min-w-[16rem]'} px-3 py-4 transition-colors duration-200 ${isHovered && !minimiseTags ? 'bg-blue-100/50 dark:bg-blue-900/40' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-wrap gap-2">
          {minimiseTags && (
            <span
              className="flex cursor-pointer items-center gap-1 rounded-md p-1 text-primary transition-colors duration-200 hover:bg-primary/10 dark:hover:bg-primary/20"
              onClick={() => onOpenModal(itemId, itemName, fieldName)}
            >
              {displayedTags.length > 0 && displayedTags.length}
              {minimisedTagIcon}
            </span>
          )}
          {!minimiseTags &&
            displayedTags.map((tag) => {
              const tagKey = getTagKey(tag)
              const tagColor = getTagColorForDisplay(tag)
              const tagLabel = getTagLabel(tag)
              return (
                <span
                  key={tagKey}
                  className="group relative flex min-w-0 max-w-36 select-none items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-textLightMode transition-all duration-200 hover:brightness-90"
                  style={{ backgroundColor: tagColor }}
                >
                  <span className="flex min-w-0 items-center gap-1 truncate whitespace-nowrap">
                    {typeof tagLabel === 'string' ? tagLabel : tagLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveTag(itemId, fieldName, tagKey)
                    }}
                    className="absolute -right-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-red-500 p-[1px] opacity-0 transition-all duration-200 hover:brightness-125 group-hover:opacity-100"
                  >
                    <XMarkIcon className="h-2 w-2 stroke-2 text-white" />
                  </button>
                </span>
              )
            })}
          {!minimiseTags && hasMoreTags && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenModal(itemId, itemName, fieldName)
              }}
              className="flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-blue-200 dark:text-gray-400 dark:hover:bg-blue-700/30"
            >
              +{remainingCount} tags
            </button>
          )}
          {!minimiseTags && (
            <AnimatePresence>
              {showAddButton && (
                <motion.button
                  initial={isMobile ? undefined : { opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={isMobile ? undefined : { opacity: 0, scale: 0.8, x: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium text-textLightMode hover:brightness-90"
                  style={{ backgroundColor: '#D1D5DB' }}
                  onClick={() => onOpenModal(itemId, itemName, fieldName)}
                >
                  Add Tag
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </TD>
    )
  }
)
TagsCell.displayName = 'TagsCell'

// Duration Cell Component with hover delay for buttons
const DurationCell = React.memo(
  ({
    durationValue,
    isVideo,
    onAdjust,
    disabled,
  }: {
    durationValue: number
    isVideo: boolean
    onAdjust: (delta: number) => void
    disabled: boolean
  }) => {
    const [isHovered, setIsHovered] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMobile = useIsMobile()

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    const handleMouseEnter = () => {
      if (isMobile) return // Don't use hover delay on mobile
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true)
      }, 300)
    }

    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      if (!isMobile) {
        setIsHovered(false)
      }
    }

    // Show buttons on mobile or after hover delay on desktop
    const showButtons = isMobile || isHovered

    return (
      <TD className="w-[140px]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="inline-flex items-center justify-center gap-2 max-md:min-w-[80px]">
          {!isVideo && (
            <AnimatePresence>
              {showButtons && (
                <motion.button
                  initial={isMobile ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={isMobile ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  type="button"
                  onClick={() => onAdjust(-5)}
                  disabled={disabled}
                  className="rounded-full bg-primary p-[2px] text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Decrease duration"
                >
                  <MinusIcon className="h-3 w-3 stroke-[4]" />
                </motion.button>
              )}
            </AnimatePresence>
          )}
          <span className="min-w-[2rem] text-center text-sm font-medium text-gray-800 dark:text-gray-200">
            {durationValue}s
          </span>
          {!isVideo && (
            <AnimatePresence>
              {showButtons && (
                <motion.button
                  initial={isMobile ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={isMobile ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  type="button"
                  onClick={() => onAdjust(5)}
                  disabled={disabled}
                  className="rounded-full bg-primary p-[2px] text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Increase duration"
                >
                  <PlusIcon className="h-3 w-3 stroke-[4]" />
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </TD>
    )
  }
)
DurationCell.displayName = 'DurationCell'

// Now Playing Cell Component with Portal Tooltip
const NowPlayingCell: React.FC<{ device_media: DeviceMedia; publish_status: 'Published' | 'Unpublished' }> = ({
  device_media,
  publish_status,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isHovered && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.left + window.scrollX,
      })
    } else {
      setPosition(null)
    }
  }, [isHovered])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
    }, 300)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovered(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          ref={spanRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="decoration-primary/50 cursor-pointer truncate text-primary underline decoration-dotted underline-offset-2 transition-colors hover:text-primary/80 dark:brightness-150"
        >
          {device_media.name}
        </span>
        {publish_status === 'Unpublished' && (
          <Tooltip
            content="Media publishing is processing, the device has not yet downloaded the media."
            show={true}
            className="!w-fit"
            tooltipClassName="!min-w-32"
            noWrap
            delay={300}
          >
            <span className="text-orange-500 dark:text-orange-400">
              <ExclamationTriangleIcon className="h-4 w-4 stroke-2" />
            </span>
          </Tooltip>
        )}
      </div>
      {isHovered &&
        position &&
        typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed z-[200] rounded-lg bg-white shadow-xl dark:bg-gray-800"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col gap-2 p-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preview:</p>
                <div className="relative h-48 w-48 overflow-hidden rounded">
                  <Image
                    src={device_media.preview_url}
                    alt={`${device_media.name} preview`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}

// Actions cell component
const ActionsCell: React.FC<{ actions: ActionsProp; item: any }> = ({ actions, item }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
    alignRight?: boolean
    alignTop?: boolean
  } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 160 // min-w-[160px]
      const menuHeight = 200 // estimated max height
      const padding = 8 // padding from viewport edges

      // Check if menu would overflow on the right
      const wouldOverflowRight = rect.left + menuWidth > window.innerWidth - padding
      // Check if menu would overflow on the bottom
      const wouldOverflowBottom = rect.bottom + menuHeight > window.innerHeight - padding

      // Calculate position
      let left = rect.left
      let top = rect.bottom + 4
      let alignRight = false
      let alignTop = false

      // Adjust horizontal position
      if (wouldOverflowRight) {
        left = rect.right - menuWidth
        alignRight = true
        // If still would overflow, align to right edge of viewport
        if (left < padding) {
          left = window.innerWidth - menuWidth - padding
        }
      }

      // Adjust vertical position
      if (wouldOverflowBottom) {
        top = rect.top - menuHeight - 4
        alignTop = true
        // If still would overflow, align to top edge of viewport
        if (top < padding) {
          top = padding
        }
      }

      setPosition({
        top,
        left,
        alignRight,
        alignTop,
      })
    } else {
      setPosition(null)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // If actions is a component (function), render it directly
  if (typeof actions === 'function' && !Array.isArray(actions)) {
    const ActionComponent = actions as React.ComponentType<{ item: any }>
    return <ActionComponent item={item} />
  }

  // If actions is an array, show ellipsis menu
  if (Array.isArray(actions) && actions.length > 0) {
    // Filter actions based on their condition function
    const visibleActions = actions.filter((action) => {
      // If condition is provided, use it; otherwise show the action
      return action.condition ? action.condition(item) : true
    })

    // Don't show the button if no actions are visible
    if (visibleActions.length === 0) {
      return null
    }

    return (
      <>
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
            menuOpen
              ? 'text-primary ring-1 ring-primary bg-primary/10 dark:text-primary dark:bg-primary/20'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
        {menuOpen &&
          position &&
          typeof window !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: position.alignTop ? 10 : -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: position.alignTop ? 10 : -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed z-[200] min-w-[160px] max-w-[calc(100vw-16px)] rounded-lg bg-white shadow-xl dark:bg-gray-800"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  maxHeight: `${window.innerHeight - position.top - 8}px`,
                  overflowY: 'auto',
                }}
              >
                <div className="flex flex-col gap-1 p-1">
                  {visibleActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick(item)
                        setMenuOpen(false)
                      }}
                      className="rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </>
    )
  }

  return null
}

export const TableComponent: React.FC<TableProps> = ({
  title,
  data,
  columns,
  sortState,
  selectedData,
  onUpdateField,
  onHandleSort,
  onSelectAll,
  onSelectItem,
  onOpenTagModal,
  onRemoveTag,
  merge = false,
  pagination = true,
  checkboxes = false,
  enableFolders = false,
  onFolderClick,
  disableSorting = false,
  actions,
  minimiseTags = false,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [activeBetweenModalOpen, setActiveBetweenModalOpen] = useState<{
    itemId: string
    itemName: string
  } | null>(null)

  const [licenceRenewalModalOpen, setLicenceRenewalModalOpen] = useState<{
    itemId: string
    itemName: string
    currentExpiry: Date | null
  } | null>(null)

  const [selectedDuration, setSelectedDuration] = useState<string>('1 year')
  const confirm = useConfirm()
  const { selectedOrganisation } = useOrganisation()

  const closeImagePreview = useCallback(() => {
    setImagePreviewUrl(null)
  }, [])

  const openImagePreview = useCallback((url: string) => {
    setImagePreviewUrl(url)
  }, [])

  const handleOpenActiveBetweenModal = useCallback((itemId: string, itemName: string) => {
    setActiveBetweenModalOpen({ itemId, itemName })
  }, [])

  const handleCloseActiveBetweenModal = useCallback(() => {
    setActiveBetweenModalOpen(null)
  }, [])

  const handleSaveActiveBetween = useCallback(
    (itemId: string, activeBetween: ActiveBetween | null) => {
      if (onUpdateField) {
        onUpdateField(itemId, 'active_between', activeBetween)
      }
    },
    [onUpdateField]
  )

  const handleOpenLicenceRenewalModal = useCallback((itemId: string, itemName: string, currentExpiry: Date | null) => {
    setLicenceRenewalModalOpen({ itemId, itemName, currentExpiry })
    setSelectedDuration('1 year')
  }, [])

  const handleCloseLicenceRenewalModal = useCallback(() => {
    setLicenceRenewalModalOpen(null)
    setSelectedDuration('1 year')
  }, [])

  const calculateNewExpiryDate = useCallback((duration: string): Date => {
    const today = new Date()
    const newDate = new Date(today)

    switch (duration) {
      case '3 months':
        newDate.setMonth(today.getMonth() + 3)
        break
      case '6 months':
        newDate.setMonth(today.getMonth() + 6)
        break
      case '1 year':
        newDate.setFullYear(today.getFullYear() + 1)
        break
      case '2 years':
        newDate.setFullYear(today.getFullYear() + 2)
        break
      case '3 years':
        newDate.setFullYear(today.getFullYear() + 3)
        break
      default:
        newDate.setFullYear(today.getFullYear() + 1)
    }

    return newDate
  }, [])

  const handleRenewLicence = useCallback(async () => {
    if (!licenceRenewalModalOpen) return

    const newExpiryDate = calculateNewExpiryDate(selectedDuration)
    const currentExpiry = licenceRenewalModalOpen.currentExpiry
    const willExpireSooner = currentExpiry && newExpiryDate < currentExpiry

    let description = `Are you sure you want to renew the licence for "${licenceRenewalModalOpen.itemName}"?`
    description += `\n\nThe licence will expire on ${formatDate(newExpiryDate.toISOString())}.`

    if (willExpireSooner && currentExpiry) {
      description += `\n\n⚠️ Warning: This will make the licence expire sooner than the current expiry date of ${formatDate(currentExpiry.toISOString())}.`
    }

    const shouldRenew = await confirm({
      title: 'Renew Licence',
      description,
      confirmText: 'Renew Licence',
      cancelText: 'Cancel',
    })

    if (shouldRenew && onUpdateField) {
      onUpdateField(licenceRenewalModalOpen.itemId, 'licence_expiry', newExpiryDate)
      handleCloseLicenceRenewalModal()
    }
  }, [
    licenceRenewalModalOpen,
    selectedDuration,
    calculateNewExpiryDate,
    confirm,
    onUpdateField,
    handleCloseLicenceRenewalModal,
  ])

  useEffect(() => {
    const handlePressEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImagePreview()
      }
    }

    if (imagePreviewUrl) {
      removeBodyOverflow()
      window.addEventListener('keydown', handlePressEscape)
    } else {
      resetBodyOverflow()
      window.removeEventListener('keydown', handlePressEscape)
    }

    return () => {
      resetBodyOverflow()
      window.removeEventListener('keydown', handlePressEscape)
    }
  }, [imagePreviewUrl, closeImagePreview])

  // Render table row cell content
  const renderTableRow = useCallback(
    (item: any, value: string | string[], type: DataTypes, field: string, options?: ColumnOptions): React.ReactNode => {
      const isFolder = item.media_type === 'folder'
      const handleFolderClick = () => {
        if (enableFolders && isFolder && onFolderClick) {
          onFolderClick(item.id)
        }
      }

      switch (type) {
        case 'text':
          let displayTextValue = Array.isArray(value) ? value.join(', ') : value

          if (!displayTextValue) return <TD key={field}>-</TD>

          if (options?.before) {
            displayTextValue = `${options.before} ${displayTextValue}`
          }
          if (options?.after) {
            displayTextValue = `${displayTextValue} ${options.after}`
          }

          if ((item.media_type === 'image' || item.media_type === 'video') && item.resolution && field === 'name') {
            const aspectRatio = calculateAspectRatio(item.resolution.width, item.resolution.height)
            return (
              <TD key={field}>
                <span className="flex flex-col">
                  <p>{displayTextValue}</p>
                  <p className="text-[10px] italic text-gray-500">
                    {item.resolution.width}x{item.resolution.height} - {aspectRatio}
                  </p>
                </span>
              </TD>
            )
          }

          if (item.media_type === 'folder' && item.item_count && field === 'name') {
            // Make folder name clickable
            if (enableFolders && onFolderClick) {
              return (
                <TD key={field}>
                  <span className="flex flex-col">
                    <p
                      onClick={handleFolderClick}
                      className="cursor-pointer text-primary transition-colors hover:underline hover:text-primary/80"
                    >
                      {displayTextValue}
                    </p>
                    <p className="text-[10px] italic text-gray-500">{item.item_count} items</p>
                  </span>
                </TD>
              )
            }
            return (
              <TD key={field}>
                <span className="flex flex-col">
                  <p>{displayTextValue}</p>
                  <p className="text-[10px] italic text-gray-500">{item.item_count} items</p>
                </span>
              </TD>
            )
          }

          // Make regular folder names clickable too (without item_count)
          if (enableFolders && isFolder && field === 'name') {
            return (
              <TD key={field}>
                <span
                  onClick={handleFolderClick}
                  className="cursor-pointer text-primary transition-colors hover:underline hover:text-primary/80"
                >
                  {displayTextValue}
                </span>
              </TD>
            )
          }

          return (
            <TD key={field}>
              <span
                onClick={() => options?.onClick?.(item)}
                className={`${options?.onClick ? 'cursor-pointer underline hover:text-primary' : ''}`}
              >
                {displayTextValue}
              </span>
            </TD>
          )
        case 'tag_name':
          const tagName = String(value || '')
          const tagColor = (item as any).color || '#D1D5DB'
          return (
            <TD key={field}>
              <span
                className="inline-flex min-w-0 max-w-36 select-none items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-textLightMode transition-all duration-200 hover:brightness-90"
                style={{ backgroundColor: tagColor }}
              >
                <span className="min-w-0 truncate whitespace-nowrap">{tagName}</span>
              </span>
            </TD>
          )
        case 'status':
          return (
            <TD key={field}>
              <div className="flex flex-col gap-1">
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
                    value === 'online'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : value === 'offline'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        : value === 'error'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                  }`}
                >
                  {formatTitleString(value as string)}
                </span>
                {value === 'offline' && (
                  <span className="flex flex-col text-[10px] italic leading-3 text-gray-500 dark:text-gray-400">
                    <p>Last Heartbeat:</p>
                    <p>{`${formatTime(item.last_seen)}, ${formatDate(item.last_seen.toISOString())}`}</p>
                  </span>
                )}
              </div>
            </TD>
          )
        case 'date':
          const date = new Date(value as string)
          if (!date || date.toString() === 'Invalid Date') return <TD key={field}>-</TD>
          return <TD key={field}>{`${formatTime(date)}, ${formatDate(date.toISOString())}`}</TD>
        case 'number':
          let displayNumberValue = Array.isArray(value) ? value.join(', ') : value

          if (!displayNumberValue) return <TD key={field}>NaN</TD>

          if (options?.before) {
            displayNumberValue = `${options.before} ${displayNumberValue}`
          }
          if (options?.after) {
            displayNumberValue = `${displayNumberValue} ${options.after}`
          }

          return <TD key={field}>{displayNumberValue}</TD>
        case 'duration': {
          const durationValue = typeof value === 'number' ? value : parseInt(String(value), 10) || 0
          const handleAdjust = (delta: number) => {
            if (!onUpdateField) return
            const nextValue = Math.max(0, durationValue + delta)
            onUpdateField(item.id, field, nextValue)
          }
          const isVideo = item.media_type === 'video'

          return (
            <DurationCell
              key={field}
              durationValue={durationValue}
              isVideo={isVideo}
              onAdjust={handleAdjust}
              disabled={!onUpdateField}
            />
          )
        }
        case 'tags':
          const tagValues = item[field as keyof typeof item] as TagWithColor[]

          if (!tagValues) return <TD key={field}>-</TD>
          return (
            <TagsCell
              key={field}
              tags={tagValues}
              itemId={item.id}
              itemName={item.name}
              fieldName={field}
              onOpenModal={onOpenTagModal}
              onRemoveTag={onRemoveTag}
              minimiseTags={minimiseTags}
            />
          )
        case 'licence':
          // Handle licence as string (licence_code) and use item.licence_expiry for expiry
          const licenceCode = String(value)
          const expiryDate = item.licence_expiry
            ? typeof item.licence_expiry === 'string'
              ? new Date(item.licence_expiry)
              : item.licence_expiry
            : null
          const formattedExpiry = expiryDate ? formatDate(expiryDate.toISOString()) : 'N/A'
          return (
            <TD key={field}>
              <span className="flex flex-col">
                <p>{licenceCode}</p>
                <button
                  onClick={() => handleOpenLicenceRenewalModal(item.id, item.name, expiryDate)}
                  className="whitespace-nowrap rounded p-1 text-left text-[10px] italic leading-3 text-blue-500 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-700 dark:hover:text-blue-300"
                >
                  Exp: {formattedExpiry}
                </button>
              </span>
            </TD>
          )
        case 'now_playing':
          // Handle playlist object
          if (typeof value === 'object' && value !== null && 'name' in value && 'preview_url' in value) {
            const device_media = value as DeviceMedia
            return (
              <TD key={field}>
                <NowPlayingCell device_media={device_media} publish_status={item.publish_status} />
              </TD>
            )
          }
          return null
        case 'entity':
          // Handle entity object with id and name
          if (typeof value === 'object' && value !== null && 'id' in value && 'name' in value) {
            const entity = value as Entity
            return <TD key={field}>{entity.name}</TD>
          }
          return null
        case 'media_type':
          let icon
          if (value === 'folder') {
            icon = <FolderIcon className="h-5 w-5 stroke-2" />
          } else if (value === 'image') {
            icon = <PhotoIcon className="h-5 w-5 stroke-2" />
          } else if (value === 'video') {
            icon = <VideoCameraIcon className="h-5 w-5 stroke-2" />
          }
          // Make folder icon clickable
          if (enableFolders && isFolder) {
            return (
              <TD key={field}>
                <div
                  onClick={handleFolderClick}
                  className="flex cursor-pointer items-center justify-center text-primary transition-colors hover:text-primary/80"
                >
                  {icon}
                </div>
              </TD>
            )
          }
          return (
            <TD key={field}>
              <div className="flex items-center justify-center text-primary">{icon}</div>
            </TD>
          )
        case 'tag_type': {
          const tagType = String(value)
          const isTimeTag = tagType === 'time'
          const icon = isTimeTag ? <ClockIcon className="h-4 w-4 stroke-2" /> : <TagIcon className="h-4 w-4 stroke-2" />
          const label = isTimeTag ? 'Time Tag' : 'Content Tag'

          return (
            <TD key={field}>
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  isTimeTag
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                }`}
              >
                {icon}
                <span>{label}</span>
              </div>
            </TD>
          )
        }
        case 'active_between': {
          const activeBetween =
            value && typeof value === 'object' && value !== null && ('from_date' in value || 'to_date' in value)
              ? (value as unknown as ActiveBetween)
              : null
          const hasFromDate = activeBetween?.from_date !== null && activeBetween?.from_date !== undefined
          const hasToDate = activeBetween?.to_date !== null && activeBetween?.to_date !== undefined
          const hasActiveBetween = hasFromDate || hasToDate

          const applyTimeToDate = (date: Date, time: string | null | undefined, defaultToStartOfDay: boolean): Date => {
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

          let isOutsideActiveWindow = false
          if (hasActiveBetween) {
            const now = new Date()
            if (hasFromDate && activeBetween?.from_date) {
              const fromBoundary = applyTimeToDate(new Date(activeBetween.from_date), activeBetween.from_time, true)
              if (now < fromBoundary) {
                isOutsideActiveWindow = true
              }
            }
            if (!isOutsideActiveWindow && hasToDate && activeBetween?.to_date) {
              const toBoundary = applyTimeToDate(new Date(activeBetween.to_date), activeBetween.to_time, false)
              if (now > toBoundary) {
                isOutsideActiveWindow = true
              }
            }
          }

          // Format time for display (HH:mm)
          const formatTime = (time: string | null | undefined): string => {
            if (!time) return ''
            // Ensure format is HH:mm
            const parts = time.split(':')
            if (parts.length >= 2) {
              return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
            }
            return time
          }

          let displayText = ''
          if (hasFromDate && hasToDate) {
            const fromTimeStr = formatTime(activeBetween?.from_time)
            const toTimeStr = formatTime(activeBetween?.to_time)
            const fromDateStr = formatDate(activeBetween.from_date!.toISOString())
            const toDateStr = formatDate(activeBetween.to_date!.toISOString())
            displayText = `${fromDateStr}${fromTimeStr ? ` ${fromTimeStr}` : ''} - ${toDateStr}${toTimeStr ? ` ${toTimeStr}` : ''}`
          } else if (hasFromDate) {
            const fromTimeStr = formatTime(activeBetween?.from_time)
            const fromDateStr = formatDate(activeBetween.from_date!.toISOString())
            displayText = `From ${fromDateStr}${fromTimeStr ? ` ${fromTimeStr}` : ''} onwards`
          } else if (hasToDate) {
            const toTimeStr = formatTime(activeBetween?.to_time)
            const toDateStr = formatDate(activeBetween.to_date!.toISOString())
            displayText = `Until ${toDateStr}${toTimeStr ? ` ${toTimeStr}` : ''}`
          }

          return (
            <TD key={field}>
              <button
                onClick={() => handleOpenActiveBetweenModal(item.id, item.name)}
                className={`flex items-center justify-center gap-2 rounded-md p-2 transition-colors ${
                  hasActiveBetween
                    ? isOutsideActiveWindow
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {!displayText && <ClockIcon className="h-5 w-5 min-w-5 stroke-2" />}
                {displayText && <span className="text-xs">{displayText}</span>}
              </button>
            </TD>
          )
        }
        case 'thumbnail':
          if (item.media_type === 'folder') {
            // Make folder thumbnail clickable
            if (enableFolders && onFolderClick) {
              return (
                <TD key={field}>
                  <div
                    onClick={handleFolderClick}
                    className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
                  >
                    <FolderIcon className="h-9 w-9 stroke-2 text-primary" />
                  </div>
                </TD>
              )
            }
            return (
              <TD key={field}>
                <div className="flex items-center justify-center">
                  <FolderIcon className="h-9 w-9 stroke-2 text-primary" />
                </div>
              </TD>
            )
          }
          // Display thumbnail with aspect ratio based on orientation
          const orientation = item.orientation?.toLowerCase() // Normalize to lowercase
          let thumbnailClasses: string
          let imageWidth: number
          let imageHeight: number

          if (orientation === 'portrait') {
            // Vertical rectangle for portrait
            thumbnailClasses = 'h-14 w-10 min-w-10 cursor-pointer'
            imageWidth = 100
            imageHeight = 140
          } else if (orientation === 'square') {
            // Square for square orientation
            thumbnailClasses = 'h-12 w-12 min-w-12 cursor-pointer'
            imageWidth = 120
            imageHeight = 120
          } else {
            // Horizontal rectangle for landscape (default)
            thumbnailClasses = 'h-10 w-14 min-w-14 cursor-pointer'
            imageWidth = 140
            imageHeight = 100
          }

          return (
            <TD key={field}>
              <div className="flex items-center justify-center">
                <Image
                  onClick={() => openImagePreview(value as string)}
                  src={value as string}
                  alt="thumbnail"
                  className={`${thumbnailClasses} bg-gray-300 object-cover p-1 transition-opacity hover:opacity-80 dark:bg-gray-700`}
                  width={imageWidth}
                  height={imageHeight}
                />
              </div>
            </TD>
          )
        default:
          return null
      }
    },
    [
      openImagePreview,
      enableFolders,
      onFolderClick,
      onUpdateField,
      onOpenTagModal,
      onRemoveTag,
      minimiseTags,
      handleOpenActiveBetweenModal,
      handleOpenLicenceRenewalModal,
    ]
  )

  // Calculate if all items are selected
  const isAllSelected = data.length > 0 && data.every((item) => selectedData.has(item.id))
  const selectedCount = data.filter((item) => selectedData.has(item.id)).length
  const isIndeterminate = selectedCount > 0 && selectedCount < data.length

  const getSortIcon = (field: string) => {
    if (sortState.field !== field) return <ChevronUpDownIcon className="h-4 w-4 stroke-2" />
    return sortState.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 stroke-2 text-primary" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 stroke-2 text-primary" />
    )
  }

  return (
    <>
      <div
        className={`overflow-x-auto rounded-xl ${merge ? 'rounded-t-none border-t-0' : ''} ${pagination ? 'rounded-b-none border-b-0' : ''} border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
      >
        <Table className="bg-white dark:bg-gray-800">
          <TableHead>
            <TableHeadRow>
              {checkboxes && (
                <TH className="w-12">
                  <span className="flex items-center justify-center">
                    <input
                      name={`select-all-${title}`}
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate
                      }}
                      onChange={onSelectAll}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    />
                  </span>
                </TH>
              )}
              {columns.map((column) => {
                if (column.hideHeader) return <TH key={column.field} />
                return (
                  <TH
                    key={column.field}
                    onClick={() => !disableSorting && onHandleSort(column.field)}
                    className={`${disableSorting ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'} select-none text-left text-xs font-medium text-gray-500 dark:text-gray-400`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="uppercase">{formatTitleString(column.field)}</span>
                      {!disableSorting && getSortIcon(column.field)}
                    </div>
                  </TH>
                )
              })}
              {actions && (
                <TH className="select-none text-left text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                  Actions
                </TH>
              )}
            </TableHeadRow>
          </TableHead>
          <TableBody className="font-open-sans">
            {data.map((item) => (
              <TableRow key={item.id}>
                {checkboxes && (
                  <TD className="w-12">
                    <span className="flex items-center justify-center">
                      <input
                        name={`select-item-${item.id}`}
                        type="checkbox"
                        checked={selectedData.has(item.id)}
                        onChange={() => onSelectItem(item.id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      />
                    </span>
                  </TD>
                )}
                {columns.map((column) =>
                  renderTableRow(
                    item,
                    item[column.field as keyof typeof item],
                    column.type,
                    column.field,
                    column.options
                  )
                )}

                {actions && (
                  <TD className="w-12">
                    <div className="flex items-center justify-center">
                      <ActionsCell actions={actions} item={item} />
                    </div>
                  </TD>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {imagePreviewUrl && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            closeImagePreview()
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-full max-w-full">
            <button
              onClick={closeImagePreview}
              className="absolute -right-4 -top-4 z-10 rounded-full bg-white p-2 text-gray-500 shadow-lg transition-colors hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] select-none rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={closeImagePreview}
            />
          </div>
        </div>
      )}

      {activeBetweenModalOpen && (
        <ActiveBetweenModal
          open={!!activeBetweenModalOpen}
          onClose={handleCloseActiveBetweenModal}
          name={activeBetweenModalOpen.itemName}
          currentActiveBetween={
            (data.find((item) => item.id === activeBetweenModalOpen.itemId)?.active_between as ActiveBetween | null) ||
            null
          }
          onSave={(activeBetween) => {
            handleSaveActiveBetween(activeBetweenModalOpen.itemId, activeBetween)
            handleCloseActiveBetweenModal()
          }}
        />
      )}

      {licenceRenewalModalOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {licenceRenewalModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20"
                  onClick={handleCloseLicenceRenewalModal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    className="border-b border-gray-200 px-4 py-3 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Renew Licence</h3>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400">{licenceRenewalModalOpen.itemName}</h4>
                      </div>
                      <button
                        onClick={handleCloseLicenceRenewalModal}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4" onClick={(e) => e.stopPropagation()}>
                    {selectedOrganisation?.id === 'allsee-birmingham' ? (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                          <p className="text-sm font-medium text-red-800 dark:text-red-400">
                            You do not have permission to renew licence.
                          </p>
                        </div>
                        <button
                          onClick={handleCloseLicenceRenewalModal}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="licenceDuration"
                            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                          >
                            Select licence duration
                          </label>
                          <select
                            id="licenceDuration"
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
                          >
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                            <option value="1 year">1 year</option>
                            <option value="2 years">2 years</option>
                            <option value="3 years">3 years</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCloseLicenceRenewalModal}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRenewLicence}
                            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                          >
                            Renew Licence
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
