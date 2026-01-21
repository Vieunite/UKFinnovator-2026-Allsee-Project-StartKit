'use client'

import type { UserSummary } from '@/types/openapi'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Extended user type with additional properties we need
export type ExtendedUser = UserSummary & {
  username?: string
  full_name?: string
  organisationId?: string
}

// Hardcoded user accounts
export type HardcodedUser = {
  id: number
  username: string
  password: string
  email: string
  full_name: string
  organisationId: string // The organization this user belongs to
}

export const HARDCODED_USERS: HardcodedUser[] = [
  {
    id: 1,
    username: 'allsee-tech',
    password: 'allsee123',
    email: 'admin@allseetechnologies.com',
    full_name: 'Allsee Technologies Admin',
    organisationId: 'allsee-technologies',
  },
  {
    id: 2,
    username: 'allsee-bham',
    password: 'birmingham123',
    email: 'admin@allseebirmingham.com',
    full_name: 'Allsee Birmingham Admin',
    organisationId: 'allsee-birmingham',
  },
]

interface AuthContextType {
  user: ExtendedUser | null
  setUser: (user: ExtendedUser | null) => void
  isAuthenticated: boolean
  logout: () => void
  login: (username: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'auth_user'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<ExtendedUser | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as ExtendedUser
        setUserState(parsedUser)
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
      localStorage.removeItem(USER_STORAGE_KEY)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Set user and persist to localStorage
  const setUser = useCallback((newUser: ExtendedUser | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [])

  // Login function
  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      // Find user in hardcoded users
      const foundUser = HARDCODED_USERS.find((u) => u.username === username && u.password === password)

      if (!foundUser) {
        return false
      }

      // Create user object compatible with ExtendedUser
      const user: ExtendedUser = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        full_name: foundUser.full_name,
        organisationId: foundUser.organisationId,
      }

      setUser(user)
      return true
    },
    [setUser]
  )

  // Logout function
  const logout = useCallback(async () => {
    // Clear user from context and storage
    setUser(null)
    router.push('/login')
  }, [setUser, router])

  const isAuthenticated = useMemo(() => !!user, [user])

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      logout,
      login,
    }),
    [user, setUser, isAuthenticated, logout, login]
  )

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
