import { useApiMutation } from '@/hooks/useApiMutation'
import type { Client, Paths } from '@/types/openapi'

type DeleteFolderParams = Paths.DeleteFolderV1MediaFoldersFolderIdDelete.PathParameters

export const useDeleteFolder = () => {
  return useApiMutation(
    async (client: Client, { folder_id }: DeleteFolderParams) => {
      await client.delete_folder_v1_media_folders__folder_id__delete({
        folder_id,
      })
      return { folder_id }
    },
    {},
    [
      // Invalidate folder tree as structure changes
      // Note: folderChildren invalidation should be handled in component with specific parent_folder_id
      ['folders', 'tree'],
    ]
  )
}
