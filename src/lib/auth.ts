import { cookies } from 'next/headers'

const isDeveloperMode = process.env.NEXT_PUBLIC_DEVELOPER_MODE === 'true'

/**
 * Check if user is authenticated by checking for auth token
 * In production: checks httpOnly cookie
 * In developer mode: checks localStorage cookie or httpOnly cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  if (isDeveloperMode) {
    // In dev mode, we can check both httpOnly and regular cookies
    const cookieStore = await cookies()
    const httpOnlyToken = cookieStore.get('auth_token')
    const devToken = cookieStore.get('dev_auth_token')
    return !!(httpOnlyToken || devToken)
  } else {
    // In production, only check httpOnly cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')
    return !!token
  }
}

/**
 * Get auth token from cookies (server-side only)
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()

  if (isDeveloperMode) {
    return cookieStore.get('dev_auth_token')?.value || cookieStore.get('auth_token')?.value || null
  }

  return cookieStore.get('auth_token')?.value || null
}

/**
 * Set auth token in cookies after login
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  const cookieName = isDeveloperMode ? 'dev_auth_token' : 'auth_token'

  // In developer mode, set non-httpOnly cookie so client can access it
  // In production, use httpOnly cookie for security
  cookieStore.set(cookieName, token, {
    httpOnly: !isDeveloperMode,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Clear auth token from cookies
 */
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies()

  // Clear both possible cookie names
  cookieStore.set('auth_token', '', {
    expires: new Date(0),
    path: '/',
  })

  cookieStore.set('dev_auth_token', '', {
    expires: new Date(0),
    path: '/',
  })
}
