import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export default function useTheme() {
  // Get system preference
  const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'
  }

  // Check if user has manually set a theme
  const getStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('theme')
    return stored === 'dark' || stored === 'light' ? stored : null
  }

  // Get effective theme (stored preference or system)
  const getEffectiveTheme = useCallback((): Theme => {
    const stored = getStoredTheme()
    return stored || getSystemTheme()
  }, [])

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    return getEffectiveTheme()
  })

  const [isManual, setIsManual] = useState(() => {
    if (typeof window === 'undefined') return false
    return getStoredTheme() !== null
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    const effectiveTheme = getEffectiveTheme()

    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    setTheme(effectiveTheme)
  }, [getEffectiveTheme])

  // Listen for system theme changes (only if not manually set)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme:dark)')

    const handler = () => {
      if (!isManual) {
        const systemTheme = getSystemTheme()
        setTheme(systemTheme)
        const root = document.documentElement
        if (systemTheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [isManual])

  // Manual theme toggle
  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    setIsManual(true)
    localStorage.setItem('theme', newTheme)

    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Reset to system preference
  const resetToSystem = () => {
    setIsManual(false)
    localStorage.removeItem('theme')
    const systemTheme = getSystemTheme()
    setTheme(systemTheme)

    const root = document.documentElement
    if (systemTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  return {
    theme,
    isManual,
    toggleTheme,
    resetToSystem,
  }
}
