import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  count?: number
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  buttonClassName?: string
  truncate?: boolean
}

const CollapsibleSection = ({
  title,
  count,
  children,
  defaultOpen = false,
  className = '',
  truncate = true,
  buttonClassName = '',
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-3 rounded-lg p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${buttonClassName}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center">
            {isOpen ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`${truncate ? 'truncate' : ''} text-sm font-medium text-gray-900 dark:text-gray-100`}>
              {title}
            </h3>
            {count !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {count} item{count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 dark:border-gray-700">{children}</div>
      </div>
    </div>
  )
}

export default CollapsibleSection
