'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import useTheme from './useTheme'

const ThemeToggler = ({ className }: { className?: string }) => {
  const { theme, isManual, toggleTheme } = useTheme()

  const handleToggle = () => {
    toggleTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`flex items-center justify-between gap-3 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'} dark:focus:ring-offset-gray-800`}
      >
        <span
          className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'} `}
        >
          {theme === 'dark' ? (
            <MoonIcon className="h-3 w-3 text-gray-700" />
          ) : (
            <SunIcon className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  )
}

export default ThemeToggler
