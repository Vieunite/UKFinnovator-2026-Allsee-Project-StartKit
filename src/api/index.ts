import type { Client } from '@/types/openapi'
import openapiSchema from '@/types/openapi.json'
import { getCookie } from '@/utility/utility'
import axios, { type AxiosInstance } from 'axios'
import https from 'https'
import OpenAPIClientAxios from 'openapi-client-axios'

const isServer = typeof window === 'undefined'

// Get base URL from environment
const publicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const isDeveloperMode = process.env.NEXT_PUBLIC_DEVELOPER_MODE === 'true'

// Base URL exposed for reuse elsewhere in the app
export const BASE_URL = publicBaseUrl

// Create HTTPS agent for server-side requests (skip SSL verification for dev)
const agent = isServer ? new https.Agent({ rejectUnauthorized: false }) : undefined

// Create axios instance for direct API calls (like login)
export const serverApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: !isDeveloperMode, // Use httpOnly cookies in production, not in dev mode
  httpsAgent: agent,
})

// Initialize OpenAPI client
const api = new OpenAPIClientAxios({
  definition: JSON.parse(JSON.stringify(openapiSchema)),
  withServer: { url: BASE_URL },
  axiosConfigDefaults: {
    baseURL: BASE_URL,
    withCredentials: !isDeveloperMode, // Use httpOnly cookies in production, not in dev mode
    httpsAgent: agent,
  },
})

/**
 * Get the API client with authentication handling
 * In developer mode, adds token from localStorage/cookie to headers
 * In production, relies on httpOnly cookies
 */
export const getApiClient = async (): Promise<Client> => {
  const client = await api.getClient<Client>()

  // Response interceptor to handle unauthorized errors
  client.interceptors.response.use(
    (response) => response, // Pass through valid responses
    async (error) => {
      // Handle 401/403/446 unauthorized errors
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 446) {
        console.warn('Token is invalid or expired, logging out...')

        if (typeof window !== 'undefined') {
          const lastLogoutAttempt = sessionStorage.getItem('logoutInProgress')
          const now = Date.now()

          // Prevent multiple logouts within 5 seconds
          if (lastLogoutAttempt && now - Number(lastLogoutAttempt) < 5000) {
            console.warn('Logout already in progress, skipping duplicate logout attempt.')
            return Promise.reject(error)
          }

          sessionStorage.setItem('logoutInProgress', now.toString())

          try {
            // Try to logout via API
            await serverApi.post('/v1/auth/logout', null).catch(() => {
              // Ignore logout errors
            })
          } catch (err) {
            console.warn('Logout error', err)
          } finally {
            // Clear auth data
            clearAuthData()
            sessionStorage.removeItem('logoutInProgress')

            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
              window.location.replace('/login')
            }
          }
        }
      }
      return Promise.reject(error) // Reject error to be handled elsewhere
    }
  )

  // Handle developer mode: add token from localStorage/cookie to headers
  if (isDeveloperMode && typeof window !== 'undefined') {
    const token = getCookie('dev_auth_token') || localStorage.getItem('dev_auth_token')
    if (token) {
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  return client
}

/**
 * Clear authentication data (cookies, localStorage, sessionStorage)
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return

  const cookieName = isDeveloperMode ? 'dev_auth_token' : 'auth_token'

  // Clear cookies with multiple strategies
  const strategies = [
    `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
    `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`,
    `${cookieName}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
  ]

  strategies.forEach((strategy) => {
    document.cookie = strategy
  })

  // Clear storage
  sessionStorage.clear()
  localStorage.removeItem('auth_token')
  localStorage.removeItem('dev_auth_token')
  localStorage.removeItem('logoutInProgress')
}
