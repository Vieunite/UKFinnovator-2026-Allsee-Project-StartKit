import { useApiMutation } from '@/hooks/useApiMutation'
import type { Client, Paths } from '@/types/openapi'

type UploadMediaParams = {
  file: File
  folder_id?: number | null // integer or null
}

export const useUploadMedia = () => {
  return useApiMutation(
    async (client: Client, { file, folder_id }: UploadMediaParams) => {
      // Create FormData for multipart/form-data upload
      const formData = new FormData()
      formData.append('file', file)
      if (folder_id !== undefined && folder_id !== null) {
        // Convert to string for TypeScript type safety (FormData.append requires string | Blob)
        // At runtime, FormData would auto-convert numbers, but TypeScript types require explicit conversion
        formData.append('folder_id', folder_id.toString())
      }

      // Use the client's axios instance for file uploads (multipart/form-data)
      // For multipart/form-data, we need to pass FormData directly
      // The OpenAPI types define file as string (binary), but at runtime FormData is required
      // We cast FormData to satisfy TypeScript while maintaining correct runtime behavior
      const response = await client.upload_media_endpoint_v1_media__post(
        null, // No path parameters
        formData as unknown as Paths.UploadMediaEndpointV1MediaPost.RequestBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return response.data
    },
    {},
    []
  )
}
