'use client'

import Image from 'next/image'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type Organisation = {
  id: string
  name: string
  logo?: string
  primaryColor: string
  children?: Organisation[]
}

interface OrganisationContextType {
  organisations: Organisation[]
  selectedOrganisation: Organisation | null
  setSelectedOrganisation: (org: Organisation | null) => void
  getOrganisationById: (id: string) => Organisation | null
  getAllSubOrganisationIds: (org: Organisation) => string[]
  isLoading: boolean
}

const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined)

// Initial organisations - PMI as the first organisation
export const initialOrganisations: Organisation[] = [
  {
    id: 'pmi',
    name: 'Philip Morris International',
    logo: '/images/pmi_logo.png',
    primaryColor: '#0077c3',
    children: [
      {
        id: 'pmi-morrisons',
        name: 'Morrisons',
        logo: '/images/Morrisons-Logo.png',
        primaryColor: '#00563F',
      },
      {
        id: 'pmi-sainsburys',
        name: 'Sainsburys',
        logo: `/images/Sainsbury's_Logo.png`,
        primaryColor: '#F06C00',
      },
    ],
  },
]

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Component to update CSS variable for primary color based on selected organisation
// This must be inside the OrganisationProvider to access the context
const OrganisationThemeSetter = ({ selectedOrganisation }: { selectedOrganisation: Organisation | null }) => {
  // Update CSS variable for primary color based on selected organisation
  useEffect(() => {
    const primaryColor = selectedOrganisation?.primaryColor || '#158cae'
    document.documentElement.style.setProperty('--color-primary', primaryColor)

    // Also set RGB values for opacity support
    const rgb = hexToRgb(primaryColor)
    if (rgb) {
      document.documentElement.style.setProperty('--color-primary-r', rgb.r.toString())
      document.documentElement.style.setProperty('--color-primary-g', rgb.g.toString())
      document.documentElement.style.setProperty('--color-primary-b', rgb.b.toString())
    }
  }, [selectedOrganisation?.primaryColor])

  return null
}

// Component to display the selected organisation's logo
export const OrganisationLogo = () => {
  const { selectedOrganisation } = useOrganisation()

  if (!selectedOrganisation?.logo) return <div className="h-[20px] w-full flex-shrink-0" />

  return (
    <div className="flex h-[170px] w-full flex-shrink-0 items-center justify-center p-8">
      <Image
        src={selectedOrganisation.logo}
        alt={selectedOrganisation?.name || ''}
        priority
        className="h-full w-full object-contain"
        width={200}
        height={200}
      />
    </div>
  )
}

export const OrganisationProvider = ({ children }: { children: React.ReactNode }) => {
  const [organisations] = useState<Organisation[]>(initialOrganisations)
  const [selectedOrganisation, setSelectedOrganisationState] = useState<Organisation | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Helper to find organisation by ID (memoized for use in useEffect)
  const getOrganisationById = useCallback(
    (id: string): Organisation | null => {
      const findOrg = (orgs: Organisation[]): Organisation | null => {
        for (const org of orgs) {
          if (org.id === id) return org
          if (org.children) {
            const found = findOrg(org.children)
            if (found) return found
          }
        }
        return null
      }
      return findOrg(organisations)
    },
    [organisations]
  )

  // Load organisation from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const storedOrgId = localStorage.getItem('selectedOrganisationId')
      if (storedOrgId) {
        const foundOrg = getOrganisationById(storedOrgId)
        if (foundOrg) {
          setSelectedOrganisationState(foundOrg)
          return
        }
      }
      // If no valid stored organisation, default to PMI
      setSelectedOrganisationState(initialOrganisations[0])
    } catch (error) {
      console.error('Error loading selected organisation from localStorage:', error)
      // Fallback to default on error
      setSelectedOrganisationState(initialOrganisations[0])
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }, [getOrganisationById])

  // Wrapper to persist selection to localStorage
  const setSelectedOrganisation = (org: Organisation | null) => {
    setSelectedOrganisationState(org)

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        if (org) {
          localStorage.setItem('selectedOrganisationId', org.id)
        } else {
          localStorage.removeItem('selectedOrganisationId')
        }
      } catch (error) {
        console.error('Error saving selected organisation to localStorage:', error)
      }
    }
  }

  const getAllSubOrganisationIds = (org: Organisation): string[] => {
    const ids: string[] = [org.id]
    if (org.children) {
      org.children.forEach((child) => {
        ids.push(...getAllSubOrganisationIds(child))
      })
    }
    return ids
  }

  return (
    <OrganisationContext.Provider
      value={{
        organisations,
        selectedOrganisation,
        setSelectedOrganisation,
        getOrganisationById,
        getAllSubOrganisationIds,
        isLoading,
      }}
    >
      <OrganisationThemeSetter selectedOrganisation={selectedOrganisation} />
      {children}
    </OrganisationContext.Provider>
  )
}

export const useOrganisation = () => {
  const context = useContext(OrganisationContext)
  if (!context) {
    throw new Error('useOrganisation must be used within an OrganisationProvider')
  }
  return context
}
