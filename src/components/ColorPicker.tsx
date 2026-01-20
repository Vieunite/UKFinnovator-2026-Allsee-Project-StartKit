'use client'

import { TagColors } from '@/data'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

type ColorPickerProps = {
  value: string // Hex color code
  onChange: (color: string) => void
  tagName?: string // Optional tag name to show in preview
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, tagName }) => {
  const [customColor, setCustomColor] = useState(value)

  // Sync customColor with value prop when it changes externally
  useEffect(() => {
    setCustomColor(value)
  }, [value])

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)
    onChange(newColor)
  }

  const handleSwatchClick = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tag Preview */}
      {tagName && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Preview
          </span>
          <div className="flex items-center gap-2">
            <span
              className="flex min-w-0 max-w-36 select-none items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-textLightMode transition-all duration-200"
              style={{ backgroundColor: value || '#D1D5DB' }}
            >
              <span className="min-w-0 truncate whitespace-nowrap">{tagName}</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">This is how the tag will appear</span>
          </div>
        </div>
      )}
      {/* Custom Color Picker */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="customColor"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Custom Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            name="customColor"
            id="customColor"
            value={customColor}
            onChange={handleCustomColorChange}
            className="h-10 w-20 cursor-pointer border border-gray-300 bg-white dark:border-gray-600"
          />
          <input
            type="text"
            name="customColor"
            id="customColor"
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#000000"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-textDarkMode"
          />
        </div>
      </div>

      {/* Default Swatches */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Default Colors
        </span>
        <div className="grid grid-cols-5 gap-2">
          {TagColors.map((color) => {
            const isSelected = color.toLowerCase() === value.toLowerCase()
            return (
              <button
                key={color}
                type="button"
                onClick={() => handleSwatchClick(color)}
                className={`relative flex h-10 w-full items-center justify-center rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              >
                {isSelected && (
                  <CheckIcon
                    className="h-5 w-5 text-white drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
