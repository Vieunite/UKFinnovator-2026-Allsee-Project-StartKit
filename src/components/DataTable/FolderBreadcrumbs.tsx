'use client'

import { MediaFolder } from '@/data'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface FolderBreadcrumbsProps {
  homeTitle: string
  breadcrumbs: MediaFolder[]
  onNavigate: (folderId: string | null) => void
}

export const FolderBreadcrumbs: React.FC<FolderBreadcrumbsProps> = ({ homeTitle, breadcrumbs, onNavigate }) => {
  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <div className="mb-4 flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <HomeIcon className="h-4 w-4 stroke-2" />
        <span>{homeTitle}</span>
      </button>
      {breadcrumbs.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-2">
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">{folder.name}</span>
          ) : (
            <button
              onClick={() => onNavigate(folder.id)}
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {folder.name}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
