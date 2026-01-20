'use client'

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import React from 'react'

interface PaginationProps {
  title: string
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  itemsPerPage: number
  onItemsPerPageChange: (itemsPerPage: number) => void
  onGoToFirstPage: () => void
  onGoToPreviousPage: () => void
  onGoToNextPage: () => void
  onGoToLastPage: () => void
  merge?: boolean
  useCompactLayout?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  title,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  itemsPerPage,
  onItemsPerPageChange,
  onGoToFirstPage,
  onGoToPreviousPage,
  onGoToNextPage,
  onGoToLastPage,
  merge = false,
  useCompactLayout = false,
}) => {
  const perPageOptions = [10, 25, 50, 100]
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <div
      className={`flex items-center justify-end border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 max-sm:justify-between ${merge ? 'rounded-b-xl border' : ''}`}
    >
      <div className="flex w-full max-w-[29rem] items-center justify-between gap-2">
        {/* Left: Per Page Dropdown */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs text-gray-700 dark:text-gray-300 max-sm:hidden ${useCompactLayout ? '!hidden' : ''}`}
          >
            Per Page:
          </span>
          <select
            name={`per-page-${title}`}
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none transition-all dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Page Info */}
        <div className={`text-xs text-gray-700 dark:text-gray-300 max-sm:hidden ${useCompactLayout ? '!hidden' : ''}`}>
          {totalPages > 0 ? (
            <span>
              Showing {startIndex + 1}-{endIndex}
            </span>
          ) : (
            <span>No items</span>
          )}
        </div>
        <div
          className={`hidden text-xs text-gray-700 dark:text-gray-300 max-sm:block ${useCompactLayout ? '!block' : ''}`}
        >
          {currentPage} of {totalPages || 1}
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={onGoToFirstPage}
            disabled={isFirstPage}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="First page"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>

          {/* Previous Page */}
          <button
            onClick={onGoToPreviousPage}
            disabled={isFirstPage}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Page Info */}
          <span
            className={`px-3 text-xs text-gray-700 dark:text-gray-300 max-sm:hidden ${useCompactLayout ? '!hidden' : ''}`}
          >
            Page {currentPage} of {totalPages || 1}
          </span>

          {/* Next Page */}
          <button
            onClick={onGoToNextPage}
            disabled={isLastPage}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* Last Page */}
          <button
            onClick={onGoToLastPage}
            disabled={isLastPage}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Last page"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
