# React Query Setup Guide

This guide explains how to use React Query (TanStack Query) with the OpenAPI client for optimized API calls with automatic caching, refetching, and state management.

## Overview

React Query provides:

- ✅ **Automatic caching** - Reduces duplicate API calls
- ✅ **Background refetching** - Keeps data fresh
- ✅ **Optimistic updates** - Instant UI updates
- ✅ **Request deduplication** - Multiple components requesting same data = 1 API call
- ✅ **Error handling** - Built-in error states
- ✅ **Loading states** - Built-in loading states

## Setup

The React Query provider is already set up in `ApplicationLayout`. You can start using hooks immediately!

## Basic Usage

### Using the Generic `useApiQuery` Hook

```typescript
import { useApiQuery } from '@/hooks/useApiQuery'
import type { MediaListResponse } from '@/types/openapi'

function MediaList() {
  const { data, isLoading, error } = useApiQuery<MediaListResponse>(
    ['media'], // Query key - must be unique
    async (client) => {
      const response = await client.list_media_v1_media__get()
      return response.data
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Using Pre-built Hooks (Recommended)

We've created pre-built hooks for common endpoints:

```typescript
import { useMedia } from '@/hooks/api/useMedia'

function MediaList() {
  const { data, isLoading, error } = useMedia({
    params: {
      folder_id: 123,
      media_type: 'image',
      page: 1,
      size: 25,
    },
  })

  // Same usage as above
}
```

## Query Keys

Query keys are crucial for caching. They should include all parameters that affect the result:

```typescript
// ✅ Good - includes folderId in key
useApiQuery(['media', folderId], ...)

// ❌ Bad - same key for different folders
useApiQuery(['media'], ...)
```

## Advanced Examples

### Conditional Fetching

```typescript
const { data } = useMedia({
  params: { folder_id: folderId },
  enabled: !!folderId, // Only fetch if folderId exists
})
```

### Mutations (Create/Update/Delete)

```typescript
import { useApiMutation } from '@/hooks/useApiMutation'
import { useQueryClient } from '@tanstack/react-query'

function UpdateMediaButton({ mediaId }: { mediaId: string }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useApiMutation(
    async (client, variables: { name: string }) => {
      const response = await client.update_media_v1_media__media_id__patch(
        { media_id: mediaId },
        { name: variables.name }
      )
      return response.data
    },
    {
      onSuccess: () => {
        // Invalidate and refetch media queries
        queryClient.invalidateQueries({ queryKey: ['media'] })
      }
    },
    [['media']] // Auto-invalidate these queries on success
  )

  return (
    <button
      onClick={() => mutate({ name: 'New Name' })}
      disabled={isPending}
    >
      {isPending ? 'Updating...' : 'Update'}
    </button>
  )
}
```

### Optimistic Updates

```typescript
const { mutate } = useApiMutation(
  async (client, variables) => {
    return client.delete_media_v1_media__media_id__delete({ media_id: variables.id })
  },
  {
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['media'] })

      // Snapshot previous value
      const previous = queryClient.getQueryData(['media'])

      // Optimistically update
      queryClient.setQueryData(['media'], (old: any) => ({
        ...old,
        items: old.items.filter((item: any) => item.id !== variables.id),
      }))

      return { previous }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['media'], context?.previous)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  },
  [['media']]
)
```

### Dependent Queries

```typescript
// First, fetch media
const { data: media } = useMedia({ params: { folder_id: 123 } })

// Then, fetch details for each media item
const { data: details } = useApiQuery(
  ['media-details', media?.items[0]?.id],
  async (client) => {
    const response = await client.get_media_v1_media__media_id__get({
      media_id: media.items[0].id,
    })
    return response.data
  },
  {
    enabled: !!media?.items[0]?.id, // Only fetch if we have an ID
  }
)
```

## Creating Custom Hooks

Create hooks in `src/hooks/api/` following this pattern:

```typescript
// src/hooks/api/usePlaylists.ts
import { useApiQuery } from '@/hooks/useApiQuery'
import type { PlaylistListResponse } from '@/types/openapi'
import type { Paths } from '@/types/openapi'

type ListPlaylistsParams = Paths.ListPlaylistsV1PlaylistsGet.QueryParameters

interface UsePlaylistsOptions {
  params?: ListPlaylistsParams
  enabled?: boolean
}

export function usePlaylists(options: UsePlaylistsOptions = {}) {
  const { params, enabled = true } = options

  return useApiQuery<PlaylistListResponse>(
    ['playlists', params],
    async (client) => {
      const response = await client.list_playlists_v1_playlists__get(params || undefined, null)
      return response.data
    },
    {
      enabled,
      staleTime: 30 * 1000, // 30 seconds
    }
  )
}
```

## Benefits

### 1. Automatic Caching

```typescript
// Component A
const { data } = useMedia({ params: { folder_id: 123 } })

// Component B - Same query, uses cached data (no API call!)
const { data } = useMedia({ params: { folder_id: 123 } })
```

### 2. Background Refetching

Data automatically refetches when:

- Window regains focus
- Network reconnects
- Data becomes stale (after `staleTime`)

### 3. Request Deduplication

```typescript
// Multiple components mount simultaneously
// Only 1 API call is made, all components get the same data
```

### 4. Loading States

```typescript
const { data, isLoading, isFetching, isRefetching } = useMedia()

// isLoading - Initial load
// isFetching - Any fetch (including background)
// isRefetching - Background refetch
```

## Configuration

Default settings in `QueryProvider`:

- `staleTime`: 60 seconds (data considered fresh)
- `refetchOnWindowFocus`: false (don't refetch on tab focus)
- `retry`: 1 (retry failed requests once)

You can override these per-query:

```typescript
useMedia({
  params: { folder_id: 123 },
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
})
```

## DevTools

React Query DevTools are automatically enabled in development. Look for the floating icon in the bottom-left corner to inspect queries, cache, and mutations.

## Migration from Direct API Calls

### Before (Direct API Call)

```typescript
const [media, setMedia] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetch() {
    const client = await getApiClient()
    const response = await client.list_media_v1_media__get()
    setMedia(response.data)
    setLoading(false)
  }
  fetch()
}, [])
```

### After (React Query)

```typescript
const { data: media, isLoading: loading } = useMedia()
```

Much simpler! 🎉

## Best Practices

1. **Use pre-built hooks** when available (`useMedia`, etc.)
2. **Include all parameters in query keys** for proper caching
3. **Use `enabled` option** for conditional fetching
4. **Invalidate queries** after mutations to keep data fresh
5. **Use optimistic updates** for better UX on mutations

## Common Patterns

### Refetch on Button Click

```typescript
const { data, refetch } = useMedia()

<button onClick={() => refetch()}>Refresh</button>
```

### Manual Cache Updates

```typescript
const queryClient = useQueryClient()

// Update cache directly
queryClient.setQueryData(['media', 123], (old: any) => ({
  ...old,
  items: [...old.items, newItem],
}))
```

### Prefetching

```typescript
const queryClient = useQueryClient()

// Prefetch data before user navigates
queryClient.prefetchQuery({
  queryKey: ['media', folderId],
  queryFn: async () => {
    const client = await getApiClient()
    const response = await client.list_media_v1_media__get({ folder_id: folderId })
    return response.data
  },
})
```
