import { getApiClient } from '@/api'
import type { Client } from '@/types/openapi'
import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'

/**
 * Generic hook for making API mutations with React Query
 * Automatically invalidates related queries on success
 *
 * @param mutationFn - Function that calls the API using the OpenAPI client
 * @param options - React Query mutation options
 * @param invalidateQueries - Query keys to invalidate on success (defaults to [])
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useApiMutation(
 *   async (client, variables) => {
 *     const response = await client.update_media_v1_media__media_id__patch(
 *       { media_id: variables.id },
 *       variables.data
 *     )
 *     return response.data
 *   },
 *   {
 *     onSuccess: () => {
 *       console.log('Media updated!')
 *     }
 *   },
 *   [['media']] // Invalidate all media queries
 * )
 * ```
 */
export function useApiMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (client: Client, variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>,
  invalidateQueries: readonly unknown[][] = []
): UseMutationResult<TData, TError, TVariables> {
  const queryClient = useQueryClient()

  // Extract onSuccess from options to avoid conflicts
  const { onSuccess: userOnSuccess, ...restOptions } = options || {}

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const client = await getApiClient()
      return mutationFn(client, variables)
    },
    ...restOptions,
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey })
      })

      // Call user's onSuccess if provided
      if (userOnSuccess) {
        // Type assertion needed due to React Query v5 signature differences
        ;(userOnSuccess as any)(data, variables, context, mutation)
      }
    },
  })
}
