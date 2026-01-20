import { useApiQuery } from '@/hooks/useApiQuery'
import type { Paths } from '@/types/openapi'

type ListTimeTagsParams = Paths.ListTimeTagsV1TagsTimeGet.QueryParameters

export const useTimeTags = (params?: ListTimeTagsParams, options?: { enabled?: boolean }) => {
  return useApiQuery(
    ['timeTags', params],
    async (client) => {
      const response = await client.list_time_tags_v1_tags_time_get(params || {})
      return response.data
    },
    {
      staleTime: 60 * 1000, // 1 minute
      ...options,
    }
  )
}
