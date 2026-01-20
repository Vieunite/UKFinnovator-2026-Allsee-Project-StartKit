import { useApiMutation } from '@/hooks/useApiMutation'
import type { Paths } from '@/types/openapi'

type CreateContentTagRequest = Paths.CreateContentTagV1TagsContentPost.RequestBody

export const useCreateContentTag = () => {
  return useApiMutation(
    async (client, data: CreateContentTagRequest) => {
      const response = await client.create_content_tag_v1_tags_content_post(null, data)
      return response.data
    },
    {},
    [['contentTags']] // Invalidate content tags queries on success
  )
}
