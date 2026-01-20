# Media API Usage Examples

This document shows how to fetch media using the OpenAPI client setup.

## Basic Example: Fetch All Media

```typescript
'use client'

import { getApiClient } from '@/api'
import { useEffect, useState } from 'react'
import type { MediaListResponse } from '@/types/openapi'

export function MediaList() {
  const [media, setMedia] = useState<MediaListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        const client = await getApiClient()

        // Fetch media with default pagination (first page, default size)
        const response = await client.list_media_v1_media__get()

        setMedia(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch media')
        console.error('Error fetching media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!media) return null

  return (
    <div>
      <h2>Media ({media.total} items)</h2>
      <ul>
        {media.items.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Type: {item.media_type}</p>
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Example with Query Parameters

```typescript
'use client'

import { getApiClient } from '@/api'
import { useEffect, useState } from 'react'
import type { MediaListResponse } from '@/types/openapi'

export function FilteredMediaList() {
  const [media, setMedia] = useState<MediaListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [folderId, setFolderId] = useState<number | null>(null)
  const [mediaType, setMediaType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        const client = await getApiClient()

        // Fetch media with filters and pagination
        const response = await client.list_media_v1_media__get(
          {
            // Query parameters
            q: searchQuery || undefined, // Fuzzy search on name/description
            media_type: mediaType || undefined, // 'image' | 'video' | 'html' | 'zip' | 'other'
            folder_id: folderId, // Filter by folder (null = root level)
            tag_ids: undefined, // Array of tag IDs (e.g., [1, 2, 3])
            include_deleted: false, // Include soft-deleted items
            page: page, // Page number (default: 1)
            size: 25, // Items per page (default: varies)
          },
          null // No request body for GET requests
        )

        setMedia(response.data)
      } catch (err: any) {
        console.error('Error fetching media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [page, folderId, mediaType, searchQuery])

  if (loading) return <div>Loading...</div>
  if (!media) return null

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search media..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Media type filter */}
      <select value={mediaType || ''} onChange={(e) => setMediaType(e.target.value || null)}>
        <option value="">All Types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
        <option value="html">HTML</option>
        <option value="zip">ZIP</option>
        <option value="other">Other</option>
      </select>

      {/* Folder filter */}
      <input
        type="number"
        placeholder="Folder ID (or leave empty for root)"
        value={folderId || ''}
        onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : null)}
      />

      <h2>Media ({media.total} items)</h2>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={media.items.length < 25} // Assuming page size is 25
        >
          Next
        </button>
      </div>

      {/* Media list */}
      <ul>
        {media.items.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Type: {item.media_type}</p>
            {item.thumbnail_url && (
              <img src={item.thumbnail_url} alt={item.name} />
            )}
            {item.tags && item.tags.length > 0 && (
              <div>
                Tags: {item.tags.map(tag => tag.name).join(', ')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Example: Fetch Media by Folder

```typescript
'use client'

import { getApiClient } from '@/api'
import { useEffect, useState } from 'react'
import type { MediaListResponse } from '@/types/openapi'

interface Props {
  folderId: number | null // null = root level
}

export function FolderMediaList({ folderId }: Props) {
  const [media, setMedia] = useState<MediaListResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        const client = await getApiClient()

        // Fetch media in a specific folder (or root if folderId is null)
        const response = await client.list_media_v1_media__get(
          {
            folder_id: folderId, // null = root level, number = specific folder
            page: 1,
            size: 50,
          },
          null
        )

        setMedia(response.data)
      } catch (err: any) {
        console.error('Error fetching media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [folderId])

  if (loading) return <div>Loading...</div>
  if (!media) return null

  return (
    <div>
      <h2>{folderId ? `Folder ${folderId}` : 'Root Level'} ({media.total} items)</h2>
      <div className="grid grid-cols-4 gap-4">
        {media.items.map((item) => (
          <div key={item.id} className="border rounded p-4">
            {item.thumbnail_url && (
              <img src={item.thumbnail_url} alt={item.name} className="w-full" />
            )}
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.media_type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Example: Fetch Media with Tags Filter

```typescript
'use client'

import { getApiClient } from '@/api'
import { useEffect, useState } from 'react'
import type { MediaListResponse } from '@/types/openapi'

export function TaggedMediaList() {
  const [media, setMedia] = useState<MediaListResponse | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

  useEffect(() => {
    async function fetchMedia() {
      try {
        const client = await getApiClient()

        const response = await client.list_media_v1_media__get(
          {
            tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
            // Note: tag_ids uses AND semantics - media must have ALL specified tags
          },
          null
        )

        setMedia(response.data)
      } catch (err: any) {
        console.error('Error fetching media:', err)
      }
    }

    fetchMedia()
  }, [selectedTagIds])

  return (
    <div>
      <div>
        <label>Filter by Tags (AND logic):</label>
        <input
          type="text"
          placeholder="Enter tag IDs separated by commas (e.g., 1,2,3)"
          onChange={(e) => {
            const ids = e.target.value
              .split(',')
              .map(id => parseInt(id.trim()))
              .filter(id => !isNaN(id))
            setSelectedTagIds(ids)
          }}
        />
      </div>

      {media && (
        <div>
          <h2>Media with selected tags ({media.total} items)</h2>
          {media.items.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              {item.tags && (
                <div>
                  Tags: {item.tags.map(tag => `${tag.name} (ID: ${tag.id})`).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Example: Using in a React Hook

```typescript
// hooks/useMedia.ts
import { getApiClient } from '@/api'
import { useState, useEffect } from 'react'
import type { MediaListResponse } from '@/types/openapi'

interface UseMediaOptions {
  folderId?: number | null
  mediaType?: string | null
  searchQuery?: string
  tagIds?: number[]
  page?: number
  size?: number
  includeDeleted?: boolean
}

export function useMedia(options: UseMediaOptions = {}) {
  const {
    folderId = null,
    mediaType = null,
    searchQuery = '',
    tagIds = [],
    page = 1,
    size = 25,
    includeDeleted = false,
  } = options

  const [data, setData] = useState<MediaListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        setError(null)

        const client = await getApiClient()
        const response = await client.list_media_v1_media__get(
          {
            q: searchQuery || undefined,
            media_type: mediaType || undefined,
            folder_id: folderId,
            tag_ids: tagIds.length > 0 ? tagIds : undefined,
            page,
            size,
            include_deleted: includeDeleted,
          },
          null
        )

        setData(response.data)
      } catch (err: any) {
        setError(err)
        console.error('Error fetching media:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [folderId, mediaType, searchQuery, JSON.stringify(tagIds), page, size, includeDeleted])

  return {
    data,
    loading,
    error,
    refetch: () => {
      // Trigger re-fetch by updating a dependency
      setData(null)
    },
  }
}

// Usage in component:
// const { data, loading, error } = useMedia({
//   folderId: 123,
//   mediaType: 'image',
//   page: 1
// })
```

## Response Type Structure

The `MediaListResponse` type includes:

```typescript
{
  items: MediaItem[] // Array of media items
  total: number      // Total count for pagination
}

// MediaItem includes:
{
  id: string
  name: string
  description?: string
  media_type: 'image' | 'video' | 'html' | 'zip' | 'other'
  folder_id?: number | null
  thumbnail_url?: string
  tags?: TagSummary[]
  created_at: string
  updated_at: string
  // ... and more
}
```

## Notes

1. **Authentication**: The `getApiClient()` function automatically handles authentication tokens based on your environment (httpOnly cookies in production, localStorage in dev mode).

2. **Error Handling**: The API client has interceptors that automatically handle 401/403/446 errors and redirect to login.

3. **Type Safety**: All parameters and responses are fully typed based on your OpenAPI schema.

4. **Pagination**: Use `page` and `size` parameters for pagination. The response includes a `total` count.

5. **Folder Hierarchy**: Set `folder_id` to `null` to get root-level media, or provide a folder ID to get media within that folder.

6. **Tag Filtering**: The `tag_ids` parameter uses AND semantics - media must have ALL specified tags.
