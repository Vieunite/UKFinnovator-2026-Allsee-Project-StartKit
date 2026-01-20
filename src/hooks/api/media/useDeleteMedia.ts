import { useApiMutation } from '@/hooks/useApiMutation'
import type { Client, Paths } from '@/types/openapi'

type DeleteMediaParams = Paths.DeleteMediaV1MediaMediaIdDelete.PathParameters

export const useDeleteMedia = (currentFolderId: number | null) => {
  return useApiMutation(
    async (client: Client, { media_id }: DeleteMediaParams) => {
      await client.delete_media_v1_media__media_id__delete({
        media_id,
      })
      return { media_id }
    },
    {},
    [
      // Invalidate media query for the current folder
      ['media', { folder_id: currentFolderId }],
    ]
  )
}
