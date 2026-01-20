import { useApiMutation } from '@/hooks/useApiMutation'
import type { Paths } from '@/types/openapi'

type UpdateTimeTagRequest = Paths.UpdateTimeTagV1TagsTimeTagIdPut.RequestBody

export const useUpdateTimeTag = () => {
  return useApiMutation(
    async (client, { tagId, data }: { tagId: string; data: UpdateTimeTagRequest }) => {
      const response = await client.update_time_tag_v1_tags_time__tag_id__put({ tag_id: tagId }, data)
      return response.data
    },
    {},
    [['timeTags']] // Invalidate time tags queries on success
  )
}
