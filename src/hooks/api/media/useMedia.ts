import { useApiQuery } from '@/hooks/useApiQuery'
import type { MediaListResponse, Paths } from '@/types/openapi'
import { useEffect } from 'react'

type ListMediaParams = Paths.ListMediaV1MediaGet.QueryParameters

interface UseMediaOptions {
  params?: ListMediaParams
  enabled?: boolean
}

/**
 * Hook for fetching media with React Query caching
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useMedia()
 *
 * // With filters
 * const { data } = useMedia({
 *   params: {
 *     folder_id: 123,
 *     media_type: 'image',
 *     page: 1,
 *     size: 25
 *   }
 * })
 *
 * // Conditional fetching
 * const { data } = useMedia({
 *   params: { folder_id: folderId },
 *   enabled: !!folderId
 * })
 * ```
 */
export function useMedia(options: UseMediaOptions = {}) {
  const { params, enabled = true } = options

  const queryResult = useApiQuery<MediaListResponse>(
    ['media', params], // Query key includes params for proper caching
    async (client) => {
      try {
        const response = await client.list_media_v1_media__get(params || undefined, null)
        return response.data
      } catch (error: any) {
        console.error('Error fetching media:', error)
        // Log axios error details if available
        if (error?.response) {
          console.error('API Error Response:', error.response.data)
          console.error('API Error Status:', error.response.status)
          console.error('API Error URL:', error.config?.url)
        }
        throw error // Re-throw to let React Query handle it
      }
    },
    {
      enabled,
      staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    }
  )

  // Log errors when they occur (React Query v5 pattern)
  useEffect(() => {
    if (queryResult.error) {
      console.error('useMedia error:', queryResult.error)
      // Access axios error details if available
      if (queryResult.error && typeof queryResult.error === 'object' && 'response' in queryResult.error) {
        const axiosError = queryResult.error as any
        console.error('API Error Response:', axiosError.response?.data)
        console.error('API Error Status:', axiosError.response?.status)
      }
    }
  }, [queryResult.error])

  return queryResult
}
