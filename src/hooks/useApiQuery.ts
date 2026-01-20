import { getApiClient } from '@/api'
import type { Client } from '@/types/openapi'
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'

/**
 * Generic hook for making API queries with React Query
 * This keeps API calls simple while adding caching, refetching, and other React Query benefits
 *
 * @param queryKey - Unique key for the query (e.g., ['media', folderId])
 * @param queryFn - Function that calls the API using the OpenAPI client
 * @param options - React Query options (enabled, staleTime, etc.)
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useApiQuery(
 *   ['media', folderId],
 *   async (client) => {
 *     const response = await client.list_media_v1_media__get(
 *       { folder_id: folderId, page: 1, size: 25 },
 *       null
 *     )
 *     return response.data
 *   }
 * )
 * ```
 */
export function useApiQuery<TData = unknown, TError = Error>(
  queryKey: readonly unknown[],
  queryFn: (client: Client) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const client = await getApiClient()
      return queryFn(client)
    },
    ...options,
  })
}
