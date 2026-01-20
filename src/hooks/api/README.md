# API Hooks

Pre-built React Query hooks for common API endpoints.

## Available Hooks

### Media

- `useMedia(options)` - List media with filters
- More hooks can be added as needed

### Playlists

- `usePlaylists(options)` - List playlists with filters
- `usePlaylist(id)` - Get single playlist by ID

## Usage

```tsx
import { useMedia } from '@/hooks/api/useMedia'
import { usePlaylists } from '@/hooks/api/usePlaylists'

function MyComponent() {
  // Fetch media
  const {
    data: media,
    isLoading,
    error,
  } = useMedia({
    params: {
      folder_id: 123,
      media_type: 'image',
      page: 1,
      size: 25,
    },
  })

  // Fetch playlists
  const { data: playlists } = usePlaylists({
    params: {
      q: 'search term',
      page: 1,
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Media ({media?.total} items)</h2>
      {media?.items.map((item) => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

## Creating New Hooks

Follow the pattern in `useMedia.ts` or `usePlaylists.ts`:

1. Import `useApiQuery` from `@/hooks/useApiQuery`
2. Define types from OpenAPI schema
3. Create hook with proper query key
4. Export hook

See `REACT_QUERY_SETUP.md` for detailed examples.
