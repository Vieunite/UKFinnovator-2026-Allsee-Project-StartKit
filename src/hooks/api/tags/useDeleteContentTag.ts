import { useApiMutation } from '@/hooks/useApiMutation'

export const useDeleteContentTag = () => {
  return useApiMutation(
    async (client, tagId: number) => {
      await client.delete_content_tag_v1_tags_content__tag_id__delete({ tag_id: tagId.toString() })
      return { tagId }
    },
    {},
    [['contentTags']] // Invalidate content tags queries on success
  )
}
