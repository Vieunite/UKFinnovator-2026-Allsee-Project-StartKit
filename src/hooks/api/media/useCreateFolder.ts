import { useApiMutation } from '@/hooks/useApiMutation'
import type { Client, Paths } from '@/types/openapi'

type CreateFolderRequest = Paths.CreateMediaFolderV1MediaFoldersPost.RequestBody

export const useCreateFolder = () => {
  return useApiMutation(
    async (client: Client, data: CreateFolderRequest) => {
      const response = await client.create_media_folder_v1_media_folders_post(null, data)
      return response.data
    },
    {},
    [
      ['folders', 'tree'], // Invalidate folder tree (global structure changes)
      // Note: folderChildren invalidation should be handled in component with specific parent_folder_id
    ]
  )
}
