'use client'

import { useAuth } from '@/context/AuthContext'
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

// Initial organisations - Allsee Technologies as the parent organisation
export const initialOrganisations: Organisation[] = [
  {
    id: 'allsee-technologies',
    name: 'Allsee Technologies',
    primaryColor: '#329FD9',
    children: [
      {
        id: 'allsee-birmingham',
        name: 'Allsee Birmingham',
        primaryColor: '#EF5124',
        logo: '/svgs/allsee-logo-colour.svg',
      },
    ],
    logo: '/svgs/allsee-logo-colour.svg',
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
  const { user } = useAuth() // AuthProvider wraps OrganisationProvider, so this is safe

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

  // Load organisation from localStorage on mount, but prioritize user's organization
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      // If user is logged in, use their organizationId as the default
      if (user?.organisationId) {
        const userOrg = getOrganisationById(user.organisationId)
        if (userOrg) {
          setSelectedOrganisationState(userOrg)
          // Also update localStorage to persist this selection
          localStorage.setItem('selectedOrganisationId', userOrg.id)
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
          return
        }
      }

      // If no user or user org not found, check localStorage
      const storedOrgId = localStorage.getItem('selectedOrganisationId')
      if (storedOrgId) {
        const foundOrg = getOrganisationById(storedOrgId)
        if (foundOrg) {
          // Validate: if user is Birmingham, they can't have Technologies selected
          if (user?.organisationId === 'allsee-birmingham' && storedOrgId === 'allsee-technologies') {
            // Invalid selection for Birmingham user, use their org instead
            const userOrg = getOrganisationById('allsee-birmingham')
            if (userOrg) {
              setSelectedOrganisationState(userOrg)
              localStorage.setItem('selectedOrganisationId', userOrg.id)
            }
          } else {
            setSelectedOrganisationState(foundOrg)
          }
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
          return
        }
      }

      // If no valid stored organisation, default to first organisation
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
  }, [getOrganisationById, user?.organisationId])

  // When user logs in or changes, set default organization or enforce restrictions
  useEffect(() => {
    if (user?.organisationId) {
      const userOrg = getOrganisationById(user.organisationId)
      if (userOrg) {
        // If no organization is selected, set to user's organization
        if (!selectedOrganisation) {
          setSelectedOrganisationState(userOrg)
          localStorage.setItem('selectedOrganisationId', userOrg.id)
        }
        // If user is Birmingham, enforce they can only have Birmingham selected
        else if (user.organisationId === 'allsee-birmingham' && selectedOrganisation.id !== 'allsee-birmingham') {
          setSelectedOrganisationState(userOrg)
          localStorage.setItem('selectedOrganisationId', userOrg.id)
        }
        // Technologies users can switch freely, so we don't enforce anything here
      }
    } else if (!user && selectedOrganisation) {
      // User logged out, clear selection
      setSelectedOrganisationState(null)
      localStorage.removeItem('selectedOrganisationId')
    }
  }, [user?.organisationId, getOrganisationById, selectedOrganisation, user])

  // Wrapper to persist selection to localStorage
  // Also validates that the user can access the selected organization
  const setSelectedOrganisation = (org: Organisation | null) => {
    // Validate: if user is Birmingham, they can't select Technologies
    if (org && user?.organisationId === 'allsee-birmingham' && org.id === 'allsee-technologies') {
      console.warn('Birmingham users cannot access Allsee Technologies organization')
      return // Don't allow the change
    }

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
