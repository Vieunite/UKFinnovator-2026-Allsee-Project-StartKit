import { useApiQuery } from '@/hooks/useApiQuery'

export const useTimeTagDetail = (tagId: string, options?: { enabled?: boolean }) => {
  return useApiQuery(
    ['timeTagDetail', tagId],
    async (client) => {
      const response = await client.get_time_tag_detail_v1_tags_time__tag_id__get({
        tag_id: tagId,
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
