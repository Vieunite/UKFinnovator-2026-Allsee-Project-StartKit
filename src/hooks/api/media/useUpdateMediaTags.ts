import { getApiClient } from '@/api'
import { useApiMutation } from '@/hooks/useApiMutation'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook for updating media tags with optimistic updates
 * Converts tag names to tag IDs and updates the media
 * Fetches content tags lazily only when mutation is called, using cache if available
 */
export const useUpdateMediaTags = () => {
  const queryClient = useQueryClient()

  // Helper to fetch content tags and build maps (uses cache if available)
  const getTagMaps = async () => {
    // Check if content tags are already in cache
    const cachedContentTags = queryClient.getQueryData(['contentTags', {}])

    let contentTagsData: any
    if (cachedContentTags) {
      contentTagsData = cachedContentTags
    } else {
      // Fetch if not cached
      const client = await getApiClient()
      const response = await client.list_content_tags_v1_tags_content_get({})
      contentTagsData = response.data
      // Cache it for future use
      queryClient.setQueryData(['contentTags', {}], contentTagsData)
    }

    const tagNameToIdMap = new Map<string, number>()
    const tagNameToTagMap = new Map<string, { id: number; name: string; color: string | null }>()

    if (contentTagsData?.items) {
      contentTagsData.items.forEach((tag: any) => {
        const key = tag.name.toLowerCase()
        tagNameToIdMap.set(key, tag.id)
        tagNameToTagMap.set(key, {
          id: tag.id,
          name: tag.name,
          color: tag.color || null,
        })
      })
    }

    return { tagNameToIdMap, tagNameToTagMap }
  }

  return useApiMutation(
    async (client, { mediaId, tagNames }: { mediaId: string; tagNames: string[] }) => {
      // Fetch tag maps only when mutation is called
      const { tagNameToIdMap } = await getTagMaps()

      // Convert tag names to tag IDs
      const tagIds = tagNames
        .map((name) => tagNameToIdMap.get(name.toLowerCase()))
        .filter((id): id is number => id !== undefined)

      // Update media with new tag IDs
      const response = await client.update_media_v1_media__media_id__put({ media_id: mediaId }, { tag_ids: tagIds })
      return response.data
    },
    {
      // Optimistic update for instant UI feedback
      onMutate: async ({ mediaId, tagNames }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['media'] })

        // Snapshot previous values for all media queries (for rollback)
        const previousMediaQueries = new Map()
        queryClient
          .getQueryCache()
          .findAll({ queryKey: ['media'] })
          .forEach((query) => {
            previousMediaQueries.set(query.queryKey, query.state.data)
          })

        // Fetch tag maps for optimistic update
        const { tagNameToTagMap } = await getTagMaps()

        // Optimistically update all media queries in cache
        queryClient
          .getQueryCache()
          .findAll({ queryKey: ['media'] })
          .forEach((query) => {
            queryClient.setQueryData(query.queryKey, (old: any) => {
              if (!old?.items) return old

              return {
                ...old,
                items: old.items.map((item: any) => {
                  if (item.id === mediaId) {
                    return {
                      ...item,
                      tags: tagNames.map((name) => {
                        const tag = tagNameToTagMap.get(name.toLowerCase())
                        return (
                          tag || {
                            id: 0,
                            name,
                            color: null,
                          }
                        )
                      }),
                    }
                  }
                  return item
                }),
              }
            })
          })

        return { previousMediaQueries }
      },
      // On success, invalidate to refetch fresh data from server
      onSuccess: () => {
        // Invalidate all media queries to refetch fresh data
        // This is simpler and ensures consistency with server
        queryClient.invalidateQueries({ queryKey: ['media'] })
      },
      // On error, rollback optimistic update
      onError: (err, variables, context) => {
        if (context?.previousMediaQueries) {
          context.previousMediaQueries.forEach((previousData: any, queryKey: any) => {
            queryClient.setQueryData(queryKey, previousData)
          })
        }
      },
    },
    [] // No automatic invalidation - we handle it manually in onSuccess
  )
}
