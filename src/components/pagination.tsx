import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import OutlinedWhiteButton from './OutlinedWhiteButton'
import PrimaryButton from './PrimaryButton'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return []

    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
      {/* Previous Button */}
      <OutlinedWhiteButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
      >
        <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Previous</span>
      </OutlinedWhiteButton>

      {/* First Page Button (Mobile) */}
      <OutlinedWhiteButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1.5 text-xs sm:hidden"
      >
        1
      </OutlinedWhiteButton>

      {/* Page Numbers */}
      <div className="hidden sm:flex sm:items-center sm:gap-1">
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">...</span>
            ) : (
              <OutlinedWhiteButton
                onClick={() => onPageChange(page as number)}
                disabled={currentPage === page}
                className="px-2 py-1.5 text-xs"
              >
                {page}
              </OutlinedWhiteButton>
            )}
          </div>
        ))}
      </div>

      {/* Current Page (Mobile) */}
      <div className="flex items-center gap-1 sm:hidden">
        <span className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">Page</span>
        <PrimaryButton className="px-2 py-1.5 text-xs">{currentPage}</PrimaryButton>
        <span className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">of {totalPages}</span>
      </div>

      {/* Last Page Button (Mobile) */}
      <OutlinedWhiteButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1.5 text-xs sm:hidden"
      >
        {totalPages}
      </OutlinedWhiteButton>

      {/* Next Button */}
      <OutlinedWhiteButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      </OutlinedWhiteButton>
    </div>
  )
}

export default Pagination
