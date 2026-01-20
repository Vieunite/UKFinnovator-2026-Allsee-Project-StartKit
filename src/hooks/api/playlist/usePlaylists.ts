import { useApiQuery } from '@/hooks/useApiQuery'
import type { Paths } from '@/types/openapi'

// Infer the response type from the OpenAPI schema
type ListPlaylistsResponse = Paths.ListPlaylistsV1PlaylistsGet.Responses.$200
// Playlists endpoint doesn't have explicit QueryParameters type, so we use a generic type
type ListPlaylistsParams = Record<string, any> | undefined

interface UsePlaylistsOptions {
  params?: ListPlaylistsParams
  enabled?: boolean
}

/**
 * Hook for fetching playlists with React Query caching
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = usePlaylists()
 *
 * // With filters
 * const { data } = usePlaylists({
 *   params: {
 *     q: 'search term',
 *     page: 1,
 *     size: 25
 *   }
 * })
 *
 * // Conditional fetching
 * const { data } = usePlaylists({
 *   enabled: shouldFetch
 * })
 * ```
 */
export function usePlaylists(options: UsePlaylistsOptions = {}) {
  const { params, enabled = true } = options

  return useApiQuery<ListPlaylistsResponse>(
    ['playlists', params], // Query key includes params for proper caching
    async (client) => {
      const response = await client.list_playlists_v1_playlists__get(params || undefined, null)
      return response.data
    },
    {
      enabled,
      staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    }
  )
}

/**
 * Hook for fetching a single playlist by ID
 */
export function usePlaylist(playlistId: string | null, enabled = true) {
  return useApiQuery(
    ['playlist', playlistId],
    async (client) => {
      if (!playlistId) throw new Error('Playlist ID is required')
      const response = await client.get_playlist_detail_v1_playlists__playlist_id__get({
        playlist_id: playlistId,
      })
      return response.data
    },
    {
      enabled: enabled && !!playlistId,
      staleTime: 60 * 1000, // 1 minute
    }
  )
}
