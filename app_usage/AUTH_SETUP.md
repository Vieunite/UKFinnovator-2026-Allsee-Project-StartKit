# Authentication System Setup

This document describes the authentication system implementation for the CMS application.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_BASE_URL=https://54.228.22.199
NEXT_PUBLIC_DEVELOPER_MODE=false
```

### Variables Explained

- `NEXT_PUBLIC_BASE_URL`: The base URL for the API backend
- `NEXT_PUBLIC_DEVELOPER_MODE`: Set to `true` for development (uses localStorage/cookies instead of httpOnly cookies)

## Architecture

### 1. API Client (`src/api/index.ts`)

- Uses `axios` for direct API calls
- Uses `openapi-client-axios` for typed API calls based on OpenAPI schema
- Handles authentication tokens:
  - **Production mode**: Uses httpOnly cookies (secure, not accessible via JavaScript)
  - **Developer mode**: Uses localStorage and regular cookies (accessible for debugging)

### 2. Authentication Utilities (`src/lib/auth.ts`)

Server-side utilities for:

- Checking authentication status
- Getting/setting/clearing auth tokens in cookies
- Handling both production and developer modes

### 3. Middleware (`src/middleware.ts`)

- Protects all routes except public routes (currently `/login`)
- Redirects unauthenticated users to login page
- Redirects authenticated users away from login page
- Excludes API routes, static files, and images

### 4. Login Page (`src/app/login/page.tsx`)

- Simple email/password login form
- Handles authentication via `/api/auth/login` route
- Stores token in developer mode
- Redirects to original page after successful login

### 5. Login API Route (`src/app/api/auth/login/route.ts`)

- Handles login requests
- Calls backend `/v1/auth/login` endpoint
- Sets auth cookie (httpOnly in production, regular in dev mode)
- Returns user data and token (token only in dev mode)

### 6. Logout API Route (`src/app/api/logout/route.ts`)

- Clears authentication cookies
- Handles logout cleanup

## Usage

### Making API Calls

```typescript
import { getApiClient } from '@/api'

// Get the typed API client
const client = await getApiClient()

// Make API calls using the OpenAPI types
const response = await client.login_endpoint_v1_auth_login_post(null, {
  email: 'user@example.com',
  password: 'password123',
})
```

### Checking Authentication (Server-Side)

```typescript
import { isAuthenticated } from '@/lib/auth'

const authenticated = await isAuthenticated()
if (!authenticated) {
  // Handle unauthenticated state
}
```

### Logging Out

```typescript
import { clearAuthData } from '@/api'

// Client-side logout
clearAuthData()

// Or call the logout API
await fetch('/api/logout', { method: 'POST' })
```

## Developer Mode

When `NEXT_PUBLIC_DEVELOPER_MODE=true`:

1. **Cookies**: Uses non-httpOnly cookies (`dev_auth_token`) so they can be accessed via JavaScript
2. **localStorage**: Also stores token in localStorage for easy debugging
3. **Headers**: API client automatically adds `Authorization: Bearer <token>` header from localStorage/cookie

This is useful for:

- Testing in HTTP environments (where httpOnly cookies may not work properly)
- Debugging authentication issues
- Development environments without HTTPS

## Security Notes

- **Production**: Always use `NEXT_PUBLIC_DEVELOPER_MODE=false` for security
- **httpOnly cookies**: Prevent XSS attacks by making tokens inaccessible to JavaScript
- **Token expiration**: Tokens expire after 7 days (configurable in `src/lib/auth.ts`)
- **Automatic logout**: Users are automatically logged out on 401/403/446 errors

## Public Routes

Routes that don't require authentication are defined in:

- `src/middleware.ts` - `publicRoutes` array
- `src/data.tsx` - `authPages` array (for UI layout)

Currently includes: `/login`
