import { useApiQuery } from '@/hooks/useApiQuery'

export const useContentTagDetail = (tagId: number | string, options?: { enabled?: boolean }) => {
  return useApiQuery(
    ['contentTagDetail', tagId],
    async (client) => {
      const response = await client.get_content_tag_detail_v1_tags_content__tag_id__get({
        tag_id: tagId.toString(),
      })
      return response.data
    },
    {
      staleTime: 30 * 1000, // 30 seconds
      enabled: tagId !== null && tagId !== undefined,
      ...options,
    }
  )
}
