import { createContext, useContext, useState } from 'react'

interface GeneralContextType {
  showMobileSidebar: boolean
  setShowMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined)

export const GeneralProvider = ({ children }: { children: React.ReactNode }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false)

  return (
    <GeneralContext.Provider value={{ showMobileSidebar, setShowMobileSidebar }}>{children}</GeneralContext.Provider>
  )
}

export const useGeneral = () => {
  const context = useContext(GeneralContext)
  if (!context) {
    throw new Error('useGeneral must be used within an GeneralProvider')
  }
  return context
}
