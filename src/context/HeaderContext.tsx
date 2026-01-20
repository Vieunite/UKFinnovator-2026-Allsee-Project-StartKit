'use client'

import { createContext, useContext, useState } from 'react'

interface HeaderContextType {
  customHeader: React.ReactNode | null
  setCustomHeader: (component: React.ReactNode | null) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [customHeader, setCustomHeader] = useState<React.ReactNode | null>(null)

  // Wrapper for setCustomHeader that tracks when header is being set
  const setCustomHeaderWithFlag = (component: React.ReactNode | null) => {
    if (component !== null) {
      setCustomHeader(component)
    } else {
      setCustomHeader(component)
    }
  }

  return (
    <HeaderContext.Provider value={{ customHeader, setCustomHeader: setCustomHeaderWithFlag }}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
