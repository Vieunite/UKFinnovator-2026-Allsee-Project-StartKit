import { useApiMutation } from '@/hooks/useApiMutation'
import type { Paths } from '@/types/openapi'

type CreateTimeTagRequest = Paths.CreateTimeTagV1TagsTimePost.RequestBody

export const useCreateTimeTag = () => {
  return useApiMutation(
    async (client, data: CreateTimeTagRequest) => {
      const response = await client.create_time_tag_v1_tags_time_post(null, data)
      return response.data
    },
    {},
    [['timeTags']] // Invalidate time tags queries on success
  )
}
