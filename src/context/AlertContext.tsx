// hooks/useAlert.tsx
import OutlinedWhiteButton from '@/components/OutlinedWhiteButton'
import PrimaryButton from '@/components/PrimaryButton'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type AlertOptions = {
  title?: string
  description?: ReactNode
  action?: {
    label: string
    onClick: (onClose: () => void, setActionLoading?: React.Dispatch<React.SetStateAction<boolean>>) => void
  }
  onOpenCallback?: () => void
  onCloseCallback?: () => void
}

type AlertContextType = {
  alert: (options: AlertOptions) => void
  handleClose: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AlertOptions>({})
  const onCloseCallbackRef = useRef<(() => void) | undefined>()
  const [actionLoading, setActionLoading] = useState(false)

  // Use functional update to avoid closing over state
  const alert = useCallback((opts: AlertOptions) => {
    setOptions(() => opts)
    onCloseCallbackRef.current = opts.onCloseCallback
    setIsOpen(true)
    setActionLoading(false)
    if (opts.onOpenCallback) {
      opts.onOpenCallback()
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      if (onCloseCallbackRef.current) {
        onCloseCallbackRef.current()
      }
    })
  }, [])

  const contextValue = useMemo(() => ({ alert, handleClose }), [alert, handleClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onCopy={(e) => e.stopPropagation()}
          onCut={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
        >
          <div
            className="dark:bg-componentBackground-dark dark:text-textDarkMode max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg"
            style={{ maxWidth: '500px', width: 'auto', padding: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ overflowWrap: 'anywhere' }} className="w-full break-words text-lg font-bold">
              {options.title || 'Alert'}
            </h2>
            {options.description && (
              <div
                className="mt-2 flex w-full flex-col gap-4 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: options.description as string }}
              />
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <OutlinedWhiteButton onClick={handleClose}>Close</OutlinedWhiteButton>
              {options.action && (
                <PrimaryButton
                  disabled={actionLoading}
                  onClick={() => {
                    setActionLoading(true)
                    options?.action?.onClick(handleClose, setActionLoading)
                  }}
                >
                  {options.action.label}
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}
