// hooks/useConfirm.tsx
import OutlinedWhiteButton from '@/components/OutlinedWhiteButton'
import PrimaryButton from '@/components/PrimaryButton'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

type ConfirmOptions = {
  title?: string
  description?: string
  descriptionClassName?: string
  confirmText?: string
  cancelText?: string
  callback?: () => void
  maxWidth?: string
}

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolvePromise, setResolvePromise] = useState<(result: boolean) => void>()

  const confirm = (options: ConfirmOptions) => {
    setOptions(options)
    setIsOpen(true)

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve)
    })
  }

  const handleConfirm = useCallback(() => {
    setIsOpen(false)
    resolvePromise?.(true)
    options.callback?.()
  }, [resolvePromise, options])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
    resolvePromise?.(false)
    options.callback?.()
  }, [resolvePromise, options])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleCancel])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={(e) => {
            e.stopPropagation()
            handleCancel()
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onCopy={(e) => e.stopPropagation()}
          onCut={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
        >
          <div
            className={`max-h-[90vh] w-full ${options.maxWidth || 'max-w-md'} dark:bg-componentBackground-dark dark:text-textDarkMode overflow-y-auto rounded-lg bg-white p-6 shadow-lg`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="w-full break-words text-lg font-bold">{options.title || 'Are you sure?'}</h2>
            {options.description && (
              <div
                className="mt-2 flex w-full flex-col gap-4 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: options.description as string }}
              />
            )}
            <div className="mt-6 flex justify-end gap-2">
              <OutlinedWhiteButton onClick={handleCancel}>{options.cancelText || 'Cancel'}</OutlinedWhiteButton>
              <PrimaryButton onClick={handleConfirm}>{options.confirmText || 'Confirm'}</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
