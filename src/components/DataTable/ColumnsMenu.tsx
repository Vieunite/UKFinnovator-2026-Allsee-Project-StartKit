'use client'

import { useIsMobile } from '@/hooks/useIsMobile'
import { formatTitleString } from '@/utility/utility'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { MenuOpen } from './DataTable'
import type { Column } from './types'

interface ColumnsMenuProps {
  menuOpen: MenuOpen | null
  onCloseMenu: () => void
  columns: Column[]
  onToggleColumnVisibility: (field: string) => void
}

export const ColumnsMenu: React.FC<ColumnsMenuProps> = ({
  menuOpen,
  onCloseMenu,
  columns,
  onToggleColumnVisibility,
}) => {
  const isMobile = useIsMobile()
  const columnsMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuOpen === 'columns' && columnsMenuRef.current && !columnsMenuRef.current.contains(target)) {
        onCloseMenu()
      }
    }

    if (menuOpen === 'columns') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen, onCloseMenu])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen === 'columns') {
        onCloseMenu()
      }
    }

    if (menuOpen === 'columns') {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, onCloseMenu])

  if (menuOpen !== 'columns') return null

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30"
          onClick={onCloseMenu}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed left-0 top-0 z-50 h-full w-[85vw] max-w-xs overflow-y-auto bg-white shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Show Columns</h3>
              <button
                onClick={onCloseMenu}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-56px)] overflow-y-auto p-2">
              {columns.map((column) => (
                <label
                  key={column.field}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <input
                    name={`column-${column.field}`}
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => onToggleColumnVisibility(column.field)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{formatTitleString(column.field)}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div
      ref={columnsMenuRef}
      className="absolute left-0 top-full z-50 mt-2 w-72 origin-top-left rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Show Columns</h3>
        <button
          onClick={onCloseMenu}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto p-2">
        {columns.map((column) => (
          <label
            key={column.field}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <input
              name={`column-${column.field}`}
              type="checkbox"
              checked={column.visible}
              onChange={() => onToggleColumnVisibility(column.field)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{formatTitleString(column.field)}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
