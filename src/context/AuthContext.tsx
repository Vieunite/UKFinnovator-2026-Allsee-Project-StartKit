'use client'

import type { UserSummary } from '@/types/openapi'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface AuthContextType {
  user: UserSummary | null
  setUser: (user: UserSummary | null) => void
  isAuthenticated: boolean
  logout: () => void
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
  const [user, setUserState] = useState<UserSummary | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as UserSummary
        console.log('user', parsedUser)
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
  const setUser = useCallback((newUser: UserSummary | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API
      await fetch('/api/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear user from context and storage
      setUser(null)
    }
  }, [setUser])

  const isAuthenticated = useMemo(() => !!user, [user])

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      logout,
    }),
    [user, setUser, isAuthenticated, logout]
  )

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
