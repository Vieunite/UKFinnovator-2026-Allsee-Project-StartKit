'use client'

import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SuccessAndErrorProps {
  showSuccess: string | null
  showError: string | null
  className?: string
  duration?: number // Auto-dismiss duration in milliseconds
  onDismiss?: () => void
}

const SuccessAndError = ({
  showSuccess = null,
  showError = null,
  className = '',
  duration = 4000,
  onDismiss,
}: SuccessAndErrorProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showSuccess || showError) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onDismiss?.()
        }, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [showSuccess, showError, duration, onDismiss])

  const message = showSuccess || showError
  const isSuccess = !!showSuccess

  return (
    <AnimatePresence>
      {message && isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed right-4 top-4 z-[9999] max-w-md ${className}`}
        >
          <div
            className={`flex items-center gap-3 rounded-lg border shadow-lg backdrop-blur-sm ${
              isSuccess
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
            } p-4`}
          >
            <div className="flex-shrink-0">
              {isSuccess ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}
              >
                {message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  onDismiss?.()
                }, 300)
              }}
              className={`flex-shrink-0 rounded p-1 transition-colors ${
                isSuccess
                  ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800/30'
                  : 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/30'
              }`}
              aria-label="Dismiss"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SuccessAndError
