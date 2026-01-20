import { useApiMutation } from '@/hooks/useApiMutation'
import type { Paths } from '@/types/openapi'

type UpdateContentTagRequest = Paths.UpdateContentTagV1TagsContentTagIdPut.RequestBody

export const useUpdateContentTag = () => {
  return useApiMutation(
    async (client, { tagId, data }: { tagId: number; data: UpdateContentTagRequest }) => {
      const response = await client.update_content_tag_v1_tags_content__tag_id__put({ tag_id: tagId.toString() }, data)
      return response.data
    },
    {},
    [['contentTags']] // Invalidate content tags queries on success
  )
}
