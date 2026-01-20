import { useApiQuery } from '@/hooks/useApiQuery'
import type { Paths } from '@/types/openapi'

type ListContentTagsParams = Paths.ListContentTagsV1TagsContentGet.QueryParameters

export const useContentTags = (params?: ListContentTagsParams, options?: { enabled?: boolean }) => {
  return useApiQuery(
    ['contentTags', params],
    async (client) => {
      const response = await client.list_content_tags_v1_tags_content_get(params || {})
      return response.data
    },
    {
      staleTime: 60 * 1000, // 1 minute
      ...options,
    }
  )
}
