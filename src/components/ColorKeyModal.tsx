import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

export interface ColorKey {
  color: string
  title: string
  description: string
}

interface ColorKeyModalProps {
  handleClose: () => void
  colorKeys: ColorKey[]
}

const ColorKeyModal = ({ handleClose, colorKeys }: ColorKeyModalProps) => {
  useEffect(() => {
    const handlePressEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handlePressEscape)
    return () => window.removeEventListener('keydown', handlePressEscape)
  }, [handleClose])

  return (
    <div
      onClick={handleClose}
      className="fixed left-0 top-0 z-[120] flex h-full w-full items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-auto max-h-[90%] w-auto max-w-[550px] flex-col gap-6 rounded-xl bg-white p-6 shadow-xl max-sm:p-4 dark:bg-gray-800"
      >
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Colour Keys</h1>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {colorKeys.map((colorKey) => (
            <div
              key={colorKey.title}
              className={`flex items-start gap-3 rounded-lg p-3`}
              style={{ border: `2px solid ${colorKey.color}`, backgroundColor: `${colorKey.color}10` }}
            >
              <div
                className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                style={{ backgroundColor: colorKey.color }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{colorKey.title}</h3>
                <p className="whitespace-pre-line text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {colorKey.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ColorKeyModal
