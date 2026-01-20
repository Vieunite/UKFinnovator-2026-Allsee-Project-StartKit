import { useApiMutation } from '@/hooks/useApiMutation'

export const useDeleteTimeTag = () => {
  return useApiMutation(
    async (client, tagId: string) => {
      await client.delete_time_tag_v1_tags_time__tag_id__delete({ tag_id: tagId })
      return { tagId }
    },
    {},
    [['timeTags']] // Invalidate time tags queries on success
  )
}
