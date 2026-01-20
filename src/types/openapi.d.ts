import type {
  AxiosRequestConfig,
  OpenAPIClient,
  OperationResponse,
  Parameters,
  UnknownParamsObject,
} from 'openapi-client-axios'

declare namespace Components {
  namespace Schemas {
    /**
     * Body_upload_media_endpoint_v1_media__post
     */
    export interface BodyUploadMediaEndpointV1MediaPost {
      /**
       * File
       */
      file: string // binary
      /**
       * Folder Id
       * Optional target folder id for this upload
       */
      folder_id?: /**
       * Folder Id
       * Optional target folder id for this upload
       */
      number | null
    }
    /**
     * CognitoBindRequest
     */
    export interface CognitoBindRequest {
      /**
       * Code
       * Authorization code returned by Cognito
       */
      code: string
    }
    /**
     * ContentTagBrief
     * Lightweight content tag summary used in playlist responses.
     */
    export interface ContentTagBrief {
      /**
       * Id
       */
      id: number
      /**
       * Name
       */
      name: string
      /**
       * Color
       */
      color?: /* Color */ string | null
    }
    /**
     * FilterPresetCreateRequest
     * Payload to save a filter preset for the current user.
     */
    export interface FilterPresetCreateRequest {
      /**
       * Name
       * Display name for this preset
       */
      name: string
      /**
       * Filter String
       * Query string fragment to append to the list endpoint (no leading ?)
       */
      filter_string: string
    }
    /**
     * FilterPresetListResponse
     * Collection of presets for a user/object type.
     */
    export interface FilterPresetListResponse {
      /**
       * Items
       */
      items: /**
       * FilterPresetResponse
       * Preset representation returned from APIs.
       */
      FilterPresetResponse[]
    }
    /**
     * FilterPresetResponse
     * Preset representation returned from APIs.
     */
    export interface FilterPresetResponse {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
      /**
       * User Id
       */
      user_id: number
      /**
       * Object Type
       */
      object_type: string
      /**
       * Filter String
       */
      filter_string: string
      /**
       * Created At
       */
      created_at: string // date-time
      /**
       * Updated At
       */
      updated_at: string // date-time
    }
    /**
     * FolderCreateRequest
     * Request payload to create a folder.
     */
    export interface FolderCreateRequest {
      /**
       * Name
       * Folder name (unique within the same parent)
       */
      name: string
      /**
       * Parent Folder Id
       * Parent folder id; null to create at root level
       */
      parent_folder_id?: /**
       * Parent Folder Id
       * Parent folder id; null to create at root level
       */
      number | null
      /**
       * Sort Order
       * Ordering weight among siblings (lower comes first)
       */
      sort_order?: /**
       * Sort Order
       * Ordering weight among siblings (lower comes first)
       */
      number | null
    }
    /**
     * FolderNode
     * Tree node representation for folder listings.
     */
    export interface FolderNode {
      /**
       * Id
       * Folder identifier
       */
      id: number
      /**
       * Name
       * Folder display name
       */
      name: string
      /**
       * Parent Folder Id
       * Parent folder id; null for root-level nodes
       */
      parent_folder_id?: /**
       * Parent Folder Id
       * Parent folder id; null for root-level nodes
       */
      number | null
      /**
       * Sort Order
       * Sibling ordering weight
       */
      sort_order?: number
      /**
       * Is System
       * True when folder is system-reserved
       */
      is_system?: boolean
      /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      deleted_at?: /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      string /* date-time */ | null
      /**
       * Children
       * Nested child folders
       */
      children?: /**
       * FolderNode
       * Tree node representation for folder listings.
       */
      FolderNode[]
    }
    /**
     * FolderTreeResponse
     * Folder tree for the current organisation/user.
     */
    export interface FolderTreeResponse {
      /**
       * Items
       * Top-level folder nodes
       */
      items: /**
       * FolderNode
       * Tree node representation for folder listings.
       */
      FolderNode[]
    }
    /**
     * FolderUpdateRequest
     * Request payload to rename or move a folder.
     */
    export interface FolderUpdateRequest {
      /**
       * Name
       * New folder name
       */
      name?: /**
       * Name
       * New folder name
       */
      string | null
      /**
       * Parent Folder Id
       * New parent folder id; null to move to root
       */
      parent_folder_id?: /**
       * Parent Folder Id
       * New parent folder id; null to move to root
       */
      number | null
      /**
       * Sort Order
       * Updated sort order
       */
      sort_order?: /**
       * Sort Order
       * Updated sort order
       */
      number | null
    }
    /**
     * HTTPValidationError
     */
    export interface HTTPValidationError {
      /**
       * Detail
       */
      detail?: /* ValidationError */ ValidationError[]
    }
    /**
     * LoginRequest
     * Payload for local username/password authentication.
     */
    export interface LoginRequest {
      /**
       * Email
       * Registered email address
       */
      email: string
      /**
       * Password
       * Plaintext password
       */
      password: string
    }
    /**
     * LoginResponse
     * Standard response body for all auth endpoints.
     */
    export interface LoginResponse {
      /**
       * Access Token
       */
      access_token: string
      /**
       * Token Type
       */
      token_type?: 'bearer'
      user: /**
       * UserSummary
       * Minimal user info returned after successful authentication.
       */
      UserSummary
    }
    /**
     * MediaBrief
     * Minimal media representation embedded in playlist items.
     */
    export interface MediaBrief {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
      /**
       * Thumbnail Url
       */
      thumbnail_url?: /* Thumbnail Url */ string | null
    }
    /**
     * MediaDetail
     * Detailed media response including upload metadata.
     */
    export interface MediaDetail {
      /**
       * Id
       * Media UUID (primary key and external id)
       */
      id: string
      /**
       * Name
       * Display name shown in the media library
       */
      name: string
      /**
       * Description
       * Optional media description
       */
      description?: /**
       * Description
       * Optional media description
       */
      string | null
      /**
       * Media Type
       * Logical media type for filtering
       */
      media_type: 'image' | 'video' | 'html' | 'zip' | 'other'
      /**
       * Folder Id
       * Folder id the media belongs to; null means root/uncategorised
       */
      folder_id?: /**
       * Folder Id
       * Folder id the media belongs to; null means root/uncategorised
       */
      number | null
      /**
       * Thumbnail Key
       * Object key for the thumbnail (e.g., Thumbnail/...)
       */
      thumbnail_key?: /**
       * Thumbnail Key
       * Object key for the thumbnail (e.g., Thumbnail/...)
       */
      string | null
      /**
       * Thumbnail Url
       * Public URL to access the thumbnail (if available)
       */
      thumbnail_url?: /**
       * Thumbnail Url
       * Public URL to access the thumbnail (if available)
       */
      string | null
      /**
       * Width
       * Processed width in pixels; null when unknown
       */
      width?: /**
       * Width
       * Processed width in pixels; null when unknown
       */
      number | null
      /**
       * Height
       * Processed height in pixels; null when unknown
       */
      height?: /**
       * Height
       * Processed height in pixels; null when unknown
       */
      number | null
      /**
       * Created At
       * Creation timestamp
       */
      created_at: string // date-time
      /**
       * Updated At
       * Last updated timestamp
       */
      updated_at: string // date-time
      /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      deleted_at?: /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      string /* date-time */ | null
      /**
       * Tags
       * Tags attached to this media
       */
      tags?: /**
       * TagSummary
       * Lightweight tag representation used in media responses.
       */
      TagSummary[]
      /**
       * Upload Id
       * Associated upload record id
       */
      upload_id: string
      /**
       * Organisation Id
       * Owning organisation id (if applicable)
       */
      organisation_id?: /**
       * Organisation Id
       * Owning organisation id (if applicable)
       */
      number | null
      /**
       * Owner User Id
       * User who created/uploaded the media
       */
      owner_user_id?: /**
       * Owner User Id
       * User who created/uploaded the media
       */
      number | null
      /**
       * Size Bytes
       * File size in bytes
       */
      size_bytes?: /**
       * Size Bytes
       * File size in bytes
       */
      number | null
      /**
       * Content Type
       * MIME type of the object
       */
      content_type?: /**
       * Content Type
       * MIME type of the object
       */
      string | null
      /**
       * Status
       * Processing status from the upload pipeline
       */
      status?: /**
       * Status
       * Processing status from the upload pipeline
       */
      string | null
      /**
       * Object Key
       * Key to the processed object (prefers Media/ path; falls back to current prefix)
       */
      object_key?: /**
       * Object Key
       * Key to the processed object (prefers Media/ path; falls back to current prefix)
       */
      string | null
      /**
       * Object Url
       * Public URL to the object
       */
      object_url?: /**
       * Object Url
       * Public URL to the object
       */
      string | null
      /**
       * Processed Key
       * Processed key as stored on the upload row
       */
      processed_key?: /**
       * Processed Key
       * Processed key as stored on the upload row
       */
      string | null
      /**
       * Orientation
       * Derive orientation from width/height when both are present.
       *
       * Returns:
       *     - "landscape" if width > height
       *     - "portrait" if height > width
       *     - "square" if equal
       *     - None when width/height are missing
       */
      orientation: /**
       * Orientation
       * Derive orientation from width/height when both are present.
       *
       * Returns:
       *     - "landscape" if width > height
       *     - "portrait" if height > width
       *     - "square" if equal
       *     - None when width/height are missing
       */
      ('portrait' | 'landscape' | 'square') | null
    }
    /**
     * MediaItem
     * Media summary used for list responses.
     */
    export interface MediaItem {
      /**
       * Id
       * Media UUID (primary key and external id)
       */
      id: string
      /**
       * Name
       * Display name shown in the media library
       */
      name: string
      /**
       * Description
       * Optional media description
       */
      description?: /**
       * Description
       * Optional media description
       */
      string | null
      /**
       * Media Type
       * Logical media type for filtering
       */
      media_type: 'image' | 'video' | 'html' | 'zip' | 'other'
      /**
       * Folder Id
       * Folder id the media belongs to; null means root/uncategorised
       */
      folder_id?: /**
       * Folder Id
       * Folder id the media belongs to; null means root/uncategorised
       */
      number | null
      /**
       * Thumbnail Key
       * Object key for the thumbnail (e.g., Thumbnail/...)
       */
      thumbnail_key?: /**
       * Thumbnail Key
       * Object key for the thumbnail (e.g., Thumbnail/...)
       */
      string | null
      /**
       * Thumbnail Url
       * Public URL to access the thumbnail (if available)
       */
      thumbnail_url?: /**
       * Thumbnail Url
       * Public URL to access the thumbnail (if available)
       */
      string | null
      /**
       * Width
       * Processed width in pixels; null when unknown
       */
      width?: /**
       * Width
       * Processed width in pixels; null when unknown
       */
      number | null
      /**
       * Height
       * Processed height in pixels; null when unknown
       */
      height?: /**
       * Height
       * Processed height in pixels; null when unknown
       */
      number | null
      /**
       * Created At
       * Creation timestamp
       */
      created_at: string // date-time
      /**
       * Updated At
       * Last updated timestamp
       */
      updated_at: string // date-time
      /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      deleted_at?: /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      string /* date-time */ | null
      /**
       * Tags
       * Tags attached to this media
       */
      tags?: /**
       * TagSummary
       * Lightweight tag representation used in media responses.
       */
      TagSummary[]
      /**
       * Orientation
       * Derive orientation from width/height when both are present.
       *
       * Returns:
       *     - "landscape" if width > height
       *     - "portrait" if height > width
       *     - "square" if equal
       *     - None when width/height are missing
       */
      orientation: /**
       * Orientation
       * Derive orientation from width/height when both are present.
       *
       * Returns:
       *     - "landscape" if width > height
       *     - "portrait" if height > width
       *     - "square" if equal
       *     - None when width/height are missing
       */
      ('portrait' | 'landscape' | 'square') | null
    }
    /**
     * MediaListResponse
     * Paginated media list payload.
     */
    export interface MediaListResponse {
      /**
       * Items
       * Media records for this page
       */
      items: /**
       * MediaItem
       * Media summary used for list responses.
       */
      MediaItem[]
      /**
       * Total
       * Total matching records for pagination
       */
      total: number
      /**
       * Page
       * Current page number (1-based)
       */
      page: number
      /**
       * Page Size
       * Page size used for this response
       */
      page_size: number
    }
    /**
     * MediaMoveRequest
     * Batch move media into a folder.
     */
    export interface MediaMoveRequest {
      /**
       * Folder Id
       * Target folder id
       */
      folder_id: number
      /**
       * Media Ids
       * Array of media ids to move
       */
      media_ids: [string, ...string[]]
    }
    /**
     * MediaUpdateRequest
     * Fields that can be updated on a media entity.
     */
    export interface MediaUpdateRequest {
      /**
       * Name
       * New display name
       */
      name?: /**
       * Name
       * New display name
       */
      string | null
      /**
       * Description
       * New description text
       */
      description?: /**
       * Description
       * New description text
       */
      string | null
      /**
       * Folder Id
       * Move media into this folder (null to unset)
       */
      folder_id?: /**
       * Folder Id
       * Move media into this folder (null to unset)
       */
      number | null
      /**
       * Tag Ids
       * Replace media tag set with these tag ids
       */
      tag_ids?: /**
       * Tag Ids
       * Replace media tag set with these tag ids
       */
      number[] | null
      /**
       * Restore
       * When true, clears deleted_at to restore a soft-deleted media
       */
      restore?: /**
       * Restore
       * When true, clears deleted_at to restore a soft-deleted media
       */
      boolean | null
    }
    /**
     * MediaUploadResponse
     * Response payload returned after uploading media to S3.
     */
    export interface MediaUploadResponse {
      /**
       * Id
       * Upload record identifier (UUID)
       */
      id: string
      /**
       * Bucket
       * Destination S3 bucket name
       */
      bucket: string
      /**
       * Key
       * Object key created inside the Unprocessed prefix
       */
      key: string
      /**
       * Size Bytes
       * Size of the uploaded file
       */
      size_bytes: number
      /**
       * Content Type
       * Detected MIME type
       */
      content_type: string
      /**
       * Status
       * Processing status within the ingestion pipeline
       */
      status?: 'pending' | 'processing' | 'completed' | 'failed'
      /**
       * Upload Type
       * Media category inferred from content type or suffix
       */
      upload_type?: 'image' | 'video' | 'unknown'
      /**
       * Processed Key
       * Key of the processed asset under Media/ once Lambda completes
       */
      processed_key?: /**
       * Processed Key
       * Key of the processed asset under Media/ once Lambda completes
       */
      string | null
      /**
       * Thumbnail Key
       * Key of the generated thumbnail under Thumbnail/
       */
      thumbnail_key?: /**
       * Thumbnail Key
       * Key of the generated thumbnail under Thumbnail/
       */
      string | null
      /**
       * Folder Id
       * Target folder id captured at upload time (if provided)
       */
      folder_id?: /**
       * Folder Id
       * Target folder id captured at upload time (if provided)
       */
      number | null
      /**
       * Media Id
       * Identifier of the created media entity when processing is completed
       */
      media_id?: /**
       * Media Id
       * Identifier of the created media entity when processing is completed
       */
      string | null
    }
    /**
     * OrganisationProfile
     * Basic organisation info returned in user profile.
     */
    export interface OrganisationProfile {
      /**
       * Id
       * Organisation id
       */
      id: number
      /**
       * Name
       * Organisation name
       */
      name?: /**
       * Name
       * Organisation name
       */
      string | null
      /**
       * Parent Id
       * Parent organisation id
       */
      parent_id?: /**
       * Parent Id
       * Parent organisation id
       */
      number | null
    }
    /**
     * PlaylistCreate
     * Request payload to create a playlist.
     */
    export interface PlaylistCreate {
      /**
       * Name
       * Playlist display name
       */
      name: string
      /**
       * Description
       * Optional playlist description
       */
      description?: /**
       * Description
       * Optional playlist description
       */
      string | null
      /**
       * Is Enabled
       * Whether the playlist is enabled
       */
      is_enabled?: boolean
      /**
       * Active From
       * Optional start time when the playlist becomes active
       */
      active_from?: /**
       * Active From
       * Optional start time when the playlist becomes active
       */
      string /* date-time */ | null
      /**
       * Active To
       * Optional end time when the playlist expires
       */
      active_to?: /**
       * Active To
       * Optional end time when the playlist expires
       */
      string /* date-time */ | null
      /**
       * Content Tag Ids
       * Content tags attached to this playlist
       */
      content_tag_ids?: number[]
      /**
       * Time Tag Ids
       * Time tags attached to this playlist
       */
      time_tag_ids?: string[]
      /**
       * Items
       * Optional initial playlist items
       */
      items?: /**
       * Items
       * Optional initial playlist items
       */
      /**
       * PlaylistItemCreateInPlaylist
       * Payload for creating an item while creating or updating a playlist.
       *
       * - content_tag_ids: None to copy media tags; [] to clear; otherwise explicit set.
       * - time_tag_ids: None/[] to skip; otherwise explicit set.
       * - insert_after_item_id: place the new item after this item; None appends to end.
       */
      PlaylistItemCreateInPlaylist[] | null
    }
    /**
     * PlaylistDetail
     * Full playlist detail including items and tag associations.
     */
    export interface PlaylistDetail {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
      /**
       * Description
       */
      description: /* Description */ string | null
      /**
       * Organisation Id
       */
      organisation_id: /* Organisation Id */ number | null
      /**
       * Is Enabled
       */
      is_enabled: boolean
      /**
       * Active From
       */
      active_from: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to: /* Active To */ string /* date-time */ | null
      /**
       * Content Tags
       */
      content_tags: /**
       * ContentTagBrief
       * Lightweight content tag summary used in playlist responses.
       */
      ContentTagBrief[]
      /**
       * Time Tags
       */
      time_tags: /**
       * TimeTagBrief
       * Lightweight time tag summary used in playlist responses.
       */
      TimeTagBrief[]
      /**
       * Created At
       */
      created_at: string // date-time
      /**
       * Updated At
       */
      updated_at: string // date-time
      /**
       * Items
       */
      items: /**
       * PlaylistItemRead
       * Full playlist item detail.
       */
      PlaylistItemRead[]
    }
    /**
     * PlaylistItemCreateInPlaylist
     * Payload for creating an item while creating or updating a playlist.
     *
     * - content_tag_ids: None to copy media tags; [] to clear; otherwise explicit set.
     * - time_tag_ids: None/[] to skip; otherwise explicit set.
     * - insert_after_item_id: place the new item after this item; None appends to end.
     */
    export interface PlaylistItemCreateInPlaylist {
      /**
       * Media Id
       */
      media_id: string
      /**
       * Duration Seconds
       */
      duration_seconds?: /* Duration Seconds */ number | null
      /**
       * Is Enabled
       */
      is_enabled?: boolean
      /**
       * Active From
       */
      active_from?: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to?: /* Active To */ string /* date-time */ | null
      /**
       * Content Tag Ids
       */
      content_tag_ids?: /* Content Tag Ids */ number[] | null
      /**
       * Time Tag Ids
       */
      time_tag_ids?: /* Time Tag Ids */ string[] | null
      /**
       * Insert After Item Id
       */
      insert_after_item_id?: /* Insert After Item Id */ string | null
    }
    /**
     * PlaylistItemRead
     * Full playlist item detail.
     */
    export interface PlaylistItemRead {
      /**
       * Id
       */
      id: string
      /**
       * Playlist Id
       */
      playlist_id: string
      media: /**
       * MediaBrief
       * Minimal media representation embedded in playlist items.
       */
      MediaBrief
      /**
       * Order Index
       */
      order_index: number
      /**
       * Duration Seconds
       */
      duration_seconds: /* Duration Seconds */ number | null
      /**
       * Is Enabled
       */
      is_enabled: boolean
      /**
       * Active From
       */
      active_from: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to: /* Active To */ string /* date-time */ | null
      /**
       * Content Tags
       */
      content_tags: /**
       * ContentTagBrief
       * Lightweight content tag summary used in playlist responses.
       */
      ContentTagBrief[]
      /**
       * Time Tags
       */
      time_tags: /**
       * TimeTagBrief
       * Lightweight time tag summary used in playlist responses.
       */
      TimeTagBrief[]
      /**
       * Created At
       */
      created_at: string // date-time
      /**
       * Updated At
       */
      updated_at: string // date-time
    }
    /**
     * PlaylistItemUpdate
     * Partial update for a playlist item.
     */
    export interface PlaylistItemUpdate {
      /**
       * Duration Seconds
       */
      duration_seconds?: /* Duration Seconds */ number | null
      /**
       * Is Enabled
       */
      is_enabled?: /* Is Enabled */ boolean | null
      /**
       * Active From
       */
      active_from?: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to?: /* Active To */ string /* date-time */ | null
      /**
       * Content Tag Ids
       */
      content_tag_ids?: /* Content Tag Ids */ number[] | null
      /**
       * Time Tag Ids
       */
      time_tag_ids?: /* Time Tag Ids */ string[] | null
    }
    /**
     * PlaylistItemsReorderRequest
     * Payload for reordering items within a playlist.
     */
    export interface PlaylistItemsReorderRequest {
      /**
       * Item Ids In Order
       */
      item_ids_in_order: string[]
    }
    /**
     * PlaylistListItem
     * List view of a playlist with tag summaries and item count.
     */
    export interface PlaylistListItem {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
      /**
       * Description
       */
      description: /* Description */ string | null
      /**
       * Organisation Id
       */
      organisation_id: /* Organisation Id */ number | null
      /**
       * Is Enabled
       */
      is_enabled: boolean
      /**
       * Active From
       */
      active_from: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to: /* Active To */ string /* date-time */ | null
      /**
       * Item Count
       */
      item_count: number
      /**
       * Content Tags
       */
      content_tags: /**
       * ContentTagBrief
       * Lightweight content tag summary used in playlist responses.
       */
      ContentTagBrief[]
      /**
       * Time Tags
       */
      time_tags: /**
       * TimeTagBrief
       * Lightweight time tag summary used in playlist responses.
       */
      TimeTagBrief[]
      /**
       * Created At
       */
      created_at: string // date-time
      /**
       * Updated At
       */
      updated_at: string // date-time
    }
    /**
     * PlaylistListResponse
     * Paginated playlist list response.
     */
    export interface PlaylistListResponse {
      /**
       * Items
       */
      items: /**
       * PlaylistListItem
       * List view of a playlist with tag summaries and item count.
       */
      PlaylistListItem[]
      /**
       * Total
       */
      total: number
      /**
       * Page
       */
      page: number
      /**
       * Page Size
       */
      page_size: number
    }
    /**
     * PlaylistUpdate
     * Request payload to update playlist metadata and tag associations.
     */
    export interface PlaylistUpdate {
      /**
       * Name
       */
      name?: /* Name */ string | null
      /**
       * Description
       */
      description?: /* Description */ string | null
      /**
       * Is Enabled
       */
      is_enabled?: /* Is Enabled */ boolean | null
      /**
       * Active From
       */
      active_from?: /* Active From */ string /* date-time */ | null
      /**
       * Active To
       */
      active_to?: /* Active To */ string /* date-time */ | null
      /**
       * Content Tag Ids
       */
      content_tag_ids?: /* Content Tag Ids */ number[] | null
      /**
       * Time Tag Ids
       */
      time_tag_ids?: /* Time Tag Ids */ string[] | null
    }
    /**
     * TagCreateRequest
     * Payload to create a tag.
     */
    export interface TagCreateRequest {
      /**
       * Name
       * Tag name
       */
      name: string
      /**
       * Description
       * Optional tag description/notes
       */
      description?: /**
       * Description
       * Optional tag description/notes
       */
      string | null
      /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      color?: /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      string /* ^#?[0-9A-Fa-f]{6}$ */ | null
    }
    /**
     * TagDetailResponse
     * Full tag detail including type and usage counts.
     */
    export interface TagDetailResponse {
      /**
       * Id
       * Tag identifier
       */
      id: number
      /**
       * Name
       * Tag name
       */
      name: string
      /**
       * Description
       * Optional tag description/notes
       */
      description?: /**
       * Description
       * Optional tag description/notes
       */
      string | null
      /**
       * Color
       * Optional display color
       */
      color?: /**
       * Color
       * Optional display color
       */
      string | null
      /**
       * Organisation Id
       * Owning organisation; null when global
       */
      organisation_id?: /**
       * Organisation Id
       * Owning organisation; null when global
       */
      number | null
      /**
       * Created At
       * Creation timestamp (server clock)
       */
      created_at: string // date-time
      /**
       * Updated At
       * Last update timestamp (server clock)
       */
      updated_at: string // date-time
      /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      deleted_at?: /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      string /* date-time */ | null
      /**
       * Tag Type
       * Tag type/category
       */
      tag_type: 'content' | 'time'
      /**
       * Aggregated usage counts for the tag
       */
      usage_counts: /**
       * TagUsageCounts
       * Usage counts for a tag across entity types.
       */
      TagUsageCounts
    }
    /**
     * TagListResponse
     * Paginated collection of tags.
     */
    export interface TagListResponse {
      /**
       * Items
       * List of tag definitions
       */
      items: /**
       * TagResponse
       * Full tag definition payload.
       */
      TagResponse[]
      /**
       * Total
       * Total number of pages
       */
      total: number
      /**
       * Page
       * Current page number (1-based)
       */
      page: number
      /**
       * Page Size
       * Page size used for this response
       */
      page_size: number
    }
    /**
     * TagResponse
     * Full tag definition payload.
     */
    export interface TagResponse {
      /**
       * Id
       * Tag identifier
       */
      id: number
      /**
       * Name
       * Tag name
       */
      name: string
      /**
       * Description
       * Optional tag description/notes
       */
      description?: /**
       * Description
       * Optional tag description/notes
       */
      string | null
      /**
       * Color
       * Optional display color
       */
      color?: /**
       * Color
       * Optional display color
       */
      string | null
      /**
       * Organisation Id
       * Owning organisation; null when global
       */
      organisation_id?: /**
       * Organisation Id
       * Owning organisation; null when global
       */
      number | null
      /**
       * Created At
       * Creation timestamp (server clock)
       */
      created_at: string // date-time
      /**
       * Updated At
       * Last update timestamp (server clock)
       */
      updated_at: string // date-time
      /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      deleted_at?: /**
       * Deleted At
       * Soft delete timestamp; null when active
       */
      string /* date-time */ | null
    }
    /**
     * TagSummary
     * Lightweight tag representation used in media responses.
     */
    export interface TagSummary {
      /**
       * Id
       */
      id: number
      /**
       * Name
       */
      name: string
      /**
       * Color
       */
      color?: /* Color */ string | null
    }
    /**
     * TagUpdateRequest
     * Editable fields for an existing tag.
     */
    export interface TagUpdateRequest {
      /**
       * Name
       * Updated tag name
       */
      name?: /**
       * Name
       * Updated tag name
       */
      string | null
      /**
       * Description
       * Updated tag description/notes
       */
      description?: /**
       * Description
       * Updated tag description/notes
       */
      string | null
      /**
       * Color
       * Updated display color (hex, e.g., #RRGGBB)
       */
      color?: /**
       * Color
       * Updated display color (hex, e.g., #RRGGBB)
       */
      string /* ^#?[0-9A-Fa-f]{6}$ */ | null
    }
    /**
     * TagUsageCounts
     * Usage counts for a tag across entity types.
     */
    export interface TagUsageCounts {
      /**
       * Media
       * Number of media items using this tag
       */
      media?: number
      /**
       * Playlists
       * Number of playlists using this tag
       */
      playlists?: number
      /**
       * Devices
       * Number of devices using this tag
       */
      devices?: number
    }
    /**
     * TagUsageResponse
     * Where a tag is referenced.
     */
    export interface TagUsageResponse {
      /**
       * Tag Id
       * Tag identifier
       */
      tag_id: number
      /**
       * Media Ids
       * Media ids that reference this tag
       */
      media_ids?: string[]
      /**
       * Playlist Ids
       * Playlist ids that reference this tag
       */
      playlist_ids?: number[]
      /**
       * Device Ids
       * Device ids that reference this tag
       */
      device_ids?: number[]
    }
    /**
     * TimeTagBrief
     * Lightweight time tag summary used in playlist responses.
     */
    export interface TimeTagBrief {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
    }
    /**
     * TimeTagCreate
     * Payload to create a time tag with its windows.
     */
    export interface TimeTagCreate {
      /**
       * Name
       */
      name: string
      /**
       * Description
       */
      description?: /* Description */ string | null
      /**
       * Is Active
       */
      is_active?: boolean
      /**
       * Organisation Id
       * Owning organisation; null means global/system
       */
      organisation_id?: /**
       * Organisation Id
       * Owning organisation; null means global/system
       */
      number | null
      /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      color?: /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      string /* ^#?[0-9A-Fa-f]{6}$ */ | null
      /**
       * Windows
       */
      windows: /**
       * TimeTagWindowCreate
       * Window payload used on create/update (full replacement).
       */
      TimeTagWindowCreate[]
    }
    /**
     * TimeTagListResponse
     * Paginated time tag list.
     */
    export interface TimeTagListResponse {
      /**
       * Items
       */
      items: /**
       * TimeTagRead
       * Full time tag detail including windows.
       */
      TimeTagRead[]
      /**
       * Total
       * Total number of pages
       */
      total: number
      /**
       * Page
       */
      page: number
      /**
       * Page Size
       */
      page_size: number
    }
    /**
     * TimeTagRead
     * Full time tag detail including windows.
     */
    export interface TimeTagRead {
      /**
       * Id
       */
      id: string
      /**
       * Name
       */
      name: string
      /**
       * Description
       */
      description: /* Description */ string | null
      /**
       * Is Active
       */
      is_active: boolean
      /**
       * Organisation Id
       * Owning organisation; null means global/system
       */
      organisation_id?: /**
       * Organisation Id
       * Owning organisation; null means global/system
       */
      number | null
      /**
       * Color
       * Optional display color
       */
      color?: /**
       * Color
       * Optional display color
       */
      string | null
      /**
       * Created At
       */
      created_at: string // date-time
      /**
       * Updated At
       */
      updated_at: string // date-time
      /**
       * Windows
       */
      windows: /**
       * TimeTagWindowRead
       * Window returned from read endpoints.
       */
      TimeTagWindowRead[]
    }
    /**
     * TimeTagUpdate
     * Payload to update a time tag (partial).
     */
    export interface TimeTagUpdate {
      /**
       * Name
       */
      name?: /* Name */ string | null
      /**
       * Description
       */
      description?: /* Description */ string | null
      /**
       * Is Active
       */
      is_active?: /* Is Active */ boolean | null
      /**
       * Windows
       */
      windows?: /* Windows */ /**
       * TimeTagWindowCreate
       * Window payload used on create/update (full replacement).
       */
      TimeTagWindowCreate[] | null
      /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      color?: /**
       * Color
       * Optional display color (hex, e.g., #RRGGBB)
       */
      string /* ^#?[0-9A-Fa-f]{6}$ */ | null
    }
    /**
     * TimeTagWindowCreate
     * Window payload used on create/update (full replacement).
     */
    export interface TimeTagWindowCreate {
      /**
       * Days Of Week
       * List of days 0=Monday ... 6=Sunday (at least one value)
       * example:
       * [
       *   0,
       *   1,
       *   2,
       *   3,
       *   4
       * ]
       */
      days_of_week: number[]
      /**
       * Start Time
       * Start time in HH:MM (minute precision, local time)
       * example:
       * 10:45
       */
      start_time: string // time ^\d{2}:\d{2}$
      /**
       * End Time
       * End time in HH:MM (must be after start_time, local time)
       * example:
       * 12:00
       */
      end_time: string // time ^\d{2}:\d{2}$
    }
    /**
     * TimeTagWindowRead
     * Window returned from read endpoints.
     */
    export interface TimeTagWindowRead {
      /**
       * Days Of Week
       * List of days 0=Monday ... 6=Sunday (at least one value)
       * example:
       * [
       *   0,
       *   1,
       *   2,
       *   3,
       *   4
       * ]
       */
      days_of_week: number[]
      /**
       * Start Time
       * Start time in HH:MM (minute precision, local time)
       * example:
       * 10:45
       */
      start_time: string // ^\d{2}:\d{2}$
      /**
       * End Time
       * End time in HH:MM (must be after start_time, local time)
       * example:
       * 12:00
       */
      end_time: string // ^\d{2}:\d{2}$
      /**
       * Id
       */
      id: string
    }
    /**
     * UploadNotifyRequest
     * Payload sent by Lambda to report processing results.
     */
    export interface UploadNotifyRequest {
      /**
       * Upload Id
       * Upload record id; preferred identifier for correlating the upload
       */
      upload_id?: /**
       * Upload Id
       * Upload record id; preferred identifier for correlating the upload
       */
      string | null
      /**
       * Original Key
       * Unprocessed object key; used as a fallback to locate the record
       */
      original_key?: /**
       * Original Key
       * Unprocessed object key; used as a fallback to locate the record
       */
      string | null
      /**
       * Status
       * Processing state reported by Lambda
       */
      status: 'processing' | 'completed' | 'failed'
      /**
       * Processed Key
       * Final processed key under Media/
       */
      processed_key?: /**
       * Processed Key
       * Final processed key under Media/
       */
      string | null
      /**
       * Thumbnail Key
       * Thumbnail key under Thumbnail/
       */
      thumbnail_key?: /**
       * Thumbnail Key
       * Thumbnail key under Thumbnail/
       */
      string | null
      /**
       * Error Message
       * Error details if failed
       */
      error_message?: /**
       * Error Message
       * Error details if failed
       */
      string | null
      /**
       * Upload Type
       * Optional override of inferred upload type
       */
      upload_type?: /**
       * Upload Type
       * Optional override of inferred upload type
       */
      ('image' | 'video' | 'unknown') | null
      /**
       * Width
       * Processed width in pixels (optional metadata)
       */
      width?: /**
       * Width
       * Processed width in pixels (optional metadata)
       */
      number | null
      /**
       * Height
       * Processed height in pixels (optional metadata)
       */
      height?: /**
       * Height
       * Processed height in pixels (optional metadata)
       */
      number | null
      /**
       * Duration Seconds
       * Duration in seconds for video content
       */
      duration_seconds?: /**
       * Duration Seconds
       * Duration in seconds for video content
       */
      number | null
      /**
       * File Hash
       * Optional file hash returned by the processor
       */
      file_hash?: /**
       * File Hash
       * Optional file hash returned by the processor
       */
      string | null
    }
    /**
     * UserProfile
     * Current user profile, including organisation summary.
     */
    export interface UserProfile {
      /**
       * Id
       * User id
       */
      id: number
      /**
       * Email
       * Primary email/login
       */
      email: string
      /**
       * Username
       * Legacy username
       */
      username?: /**
       * Username
       * Legacy username
       */
      string | null
      /**
       * Full Name
       * Display/full name
       */
      full_name?: /**
       * Full Name
       * Display/full name
       */
      string | null
      /**
       * Organisation info; null when user has no org
       */
      organisation?: /* Organisation info; null when user has no org */ /**
       * OrganisationProfile
       * Basic organisation info returned in user profile.
       */
      OrganisationProfile | null
    }
    /**
     * UserSummary
     * Minimal user info returned after successful authentication.
     */
    export interface UserSummary {
      /**
       * Id
       */
      id: number
      /**
       * Email
       */
      email: string
    }
    /**
     * ValidationError
     */
    export interface ValidationError {
      /**
       * Location
       */
      loc: (string | number)[]
      /**
       * Message
       */
      msg: string
      /**
       * Error Type
       */
      type: string
    }
  }
}
declare namespace Paths {
  namespace AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    /**
     * Items
     */
    export type RequestBody =
      /**
       * PlaylistItemCreateInPlaylist
       * Payload for creating an item while creating or updating a playlist.
       *
       * - content_tag_ids: None to copy media tags; [] to clear; otherwise explicit set.
       * - time_tag_ids: None/[] to skip; otherwise explicit set.
       * - insert_after_item_id: place the new item after this item; None appends to end.
       */
      Components.Schemas.PlaylistItemCreateInPlaylist[]
    namespace Responses {
      /**
       * Response Add Playlist Items V1 Playlists  Playlist Id  Media Post
       */
      export type $201 =
        /**
         * PlaylistItemRead
         * Full playlist item detail.
         */
        Components.Schemas.PlaylistItemRead[]
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace BulkRebootDevicesV1DevicesRebootPost {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace CognitoBindV1AuthCognitoBindPost {
    export type RequestBody = /* CognitoBindRequest */ Components.Schemas.CognitoBindRequest
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CognitoCallbackV1AuthCognitoCallbackGet {
    namespace Parameters {
      /**
       * Code
       * Authorization code from Cognito
       */
      export type Code = string
    }
    export interface QueryParameters {
      code: /**
       * Code
       * Authorization code from Cognito
       */
      Parameters.Code
    }
    namespace Responses {
      export type $200 =
        /**
         * LoginResponse
         * Standard response body for all auth endpoints.
         */
        Components.Schemas.LoginResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreateContentTagV1TagsContentPost {
    export type RequestBody =
      /**
       * TagCreateRequest
       * Payload to create a tag.
       */
      Components.Schemas.TagCreateRequest
    namespace Responses {
      export type $201 =
        /**
         * TagResponse
         * Full tag definition payload.
         */
        Components.Schemas.TagResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreateDeviceFilterPresetsV1DevicesPresetsPost {
    export type RequestBody =
      /**
       * FilterPresetCreateRequest
       * Payload to save a filter preset for the current user.
       */
      Components.Schemas.FilterPresetCreateRequest
    namespace Responses {
      export type $201 =
        /**
         * FilterPresetResponse
         * Preset representation returned from APIs.
         */
        Components.Schemas.FilterPresetResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreateDeviceV1DevicesPost {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace CreateMediaFilterPresetsV1MediaPresetsPost {
    export type RequestBody =
      /**
       * FilterPresetCreateRequest
       * Payload to save a filter preset for the current user.
       */
      Components.Schemas.FilterPresetCreateRequest
    namespace Responses {
      export type $201 =
        /**
         * FilterPresetResponse
         * Preset representation returned from APIs.
         */
        Components.Schemas.FilterPresetResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreateMediaFolderV1MediaFoldersPost {
    export type RequestBody =
      /**
       * FolderCreateRequest
       * Request payload to create a folder.
       */
      Components.Schemas.FolderCreateRequest
    namespace Responses {
      export type $200 =
        /**
         * FolderNode
         * Tree node representation for folder listings.
         */
        Components.Schemas.FolderNode
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreatePlaylistFilterPresetsV1PlaylistsPresetsPost {
    export type RequestBody =
      /**
       * FilterPresetCreateRequest
       * Payload to save a filter preset for the current user.
       */
      Components.Schemas.FilterPresetCreateRequest
    namespace Responses {
      export type $201 =
        /**
         * FilterPresetResponse
         * Preset representation returned from APIs.
         */
        Components.Schemas.FilterPresetResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreatePlaylistV1PlaylistsPost {
    export type RequestBody =
      /**
       * PlaylistCreate
       * Request payload to create a playlist.
       */
      Components.Schemas.PlaylistCreate
    namespace Responses {
      export type $201 =
        /**
         * PlaylistDetail
         * Full playlist detail including items and tag associations.
         */
        Components.Schemas.PlaylistDetail
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace CreateTimeTagV1TagsTimePost {
    export type RequestBody =
      /**
       * TimeTagCreate
       * Payload to create a time tag with its windows.
       */
      Components.Schemas.TimeTagCreate
    namespace Responses {
      export type $201 =
        /**
         * TimeTagRead
         * Full time tag detail including windows.
         */
        Components.Schemas.TimeTagRead
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteContentTagV1TagsContentTagIdDelete {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string // \d+
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId /* \d+ */
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteDeviceFilterPresetsV1DevicesPresetsDelete {
    namespace Parameters {
      /**
       * Preset Id
       * Preset id to remove
       */
      export type PresetId = string
    }
    export interface QueryParameters {
      preset_id: /**
       * Preset Id
       * Preset id to remove
       */
      Parameters.PresetId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteDeviceV1DevicesDeviceIdDelete {
    namespace Parameters {
      /**
       * Device Id
       */
      export type DeviceId = string
    }
    export interface PathParameters {
      device_id: /* Device Id */ Parameters.DeviceId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteFolderV1MediaFoldersFolderIdDelete {
    namespace Parameters {
      /**
       * Folder Id
       */
      export type FolderId = number
    }
    export interface PathParameters {
      folder_id: /* Folder Id */ Parameters.FolderId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteMediaFilterPresetsV1MediaPresetsDelete {
    namespace Parameters {
      /**
       * Preset Id
       * Preset id to remove
       */
      export type PresetId = string
    }
    export interface QueryParameters {
      preset_id: /**
       * Preset Id
       * Preset id to remove
       */
      Parameters.PresetId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteMediaV1MediaMediaIdDelete {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeletePlaylistFilterPresetsV1PlaylistsPresetsDelete {
    namespace Parameters {
      /**
       * Preset Id
       * Preset id to remove
       */
      export type PresetId = string
    }
    export interface QueryParameters {
      preset_id: /**
       * Preset Id
       * Preset id to remove
       */
      Parameters.PresetId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeletePlaylistV1PlaylistsPlaylistIdDelete {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DeleteTimeTagV1TagsTimeTagIdDelete {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace DuplicateMediaV1MediaMediaIdDuplicatePost {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetAppDetailV1AppsAppIdGet {
    namespace Parameters {
      /**
       * App Id
       */
      export type AppId = string
    }
    export interface PathParameters {
      app_id: /* App Id */ Parameters.AppId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetContentTagDetailV1TagsContentTagIdGet {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string // \d+
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId /* \d+ */
    }
    namespace Responses {
      export type $200 =
        /**
         * TagDetailResponse
         * Full tag detail including type and usage counts.
         */
        Components.Schemas.TagDetailResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetContentTagUsageV1TagsContentTagIdUsageGet {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string // \d+
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId /* \d+ */
    }
    namespace Responses {
      export type $200 =
        /**
         * TagUsageResponse
         * Where a tag is referenced.
         */
        Components.Schemas.TagUsageResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetCurrentUserProfileV1UserMeGet {
    namespace Responses {
      export type $200 =
        /**
         * UserProfile
         * Current user profile, including organisation summary.
         */
        Components.Schemas.UserProfile
    }
  }
  namespace GetDeviceDetailV1DevicesDeviceIdGet {
    namespace Parameters {
      /**
       * Device Id
       */
      export type DeviceId = string
    }
    export interface PathParameters {
      device_id: /* Device Id */ Parameters.DeviceId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetDeviceSchedulesV1DevicesDeviceIdSchedulesGet {
    namespace Parameters {
      /**
       * Device Id
       */
      export type DeviceId = string
    }
    export interface PathParameters {
      device_id: /* Device Id */ Parameters.DeviceId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetMediaDetailV1MediaMediaIdGet {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    namespace Responses {
      export type $200 =
        /**
         * MediaDetail
         * Detailed media response including upload metadata.
         */
        Components.Schemas.MediaDetail
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetMediaUsageV1MediaMediaIdUsageGet {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetPlaylistDetailV1PlaylistsPlaylistIdGet {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    namespace Responses {
      export type $200 =
        /**
         * PlaylistDetail
         * Full playlist detail including items and tag associations.
         */
        Components.Schemas.PlaylistDetail
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetPlaylistDevicesV1PlaylistsPlaylistIdDevicesGet {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    namespace Responses {
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
      export type $501 = any
    }
  }
  namespace GetPlaylistSchedulesV1PlaylistsPlaylistIdSchedulesGet {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    namespace Responses {
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
      export type $501 = any
    }
  }
  namespace GetScheduleDetailV1SchedulesScheduleIdGet {
    namespace Parameters {
      /**
       * Schedule Id
       */
      export type ScheduleId = string
    }
    export interface PathParameters {
      schedule_id: /* Schedule Id */ Parameters.ScheduleId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetScheduleOccurrencesV1SchedulesScheduleIdOccurrencesGet {
    namespace Parameters {
      /**
       * Schedule Id
       */
      export type ScheduleId = string
    }
    export interface PathParameters {
      schedule_id: /* Schedule Id */ Parameters.ScheduleId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetTimeTagDetailV1TagsTimeTagIdGet {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId
    }
    namespace Responses {
      export type $200 =
        /**
         * TimeTagRead
         * Full time tag detail including windows.
         */
        Components.Schemas.TimeTagRead
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace GetUploadStatusV1MediaUploadsUploadIdGet {
    namespace Parameters {
      /**
       * Upload Id
       */
      export type UploadId = string
    }
    export interface PathParameters {
      upload_id: /* Upload Id */ Parameters.UploadId
    }
    namespace Responses {
      export type $200 =
        /**
         * MediaUploadResponse
         * Response payload returned after uploading media to S3.
         */
        Components.Schemas.MediaUploadResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace InstallAppV1AppsAppIdInstallPost {
    namespace Parameters {
      /**
       * App Id
       */
      export type AppId = string
    }
    export interface PathParameters {
      app_id: /* App Id */ Parameters.AppId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListAppsV1AppsGet {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace ListContentTagsV1TagsContentGet {
    namespace Parameters {
      /**
       * Page
       * Page number (1-based)
       */
      export type Page = number
      /**
       * Page Size
       * Page size (max 100 items)
       */
      export type PageSize = number
      /**
       * Q
       * Case-insensitive substring match on tag name
       */
      export type Q =
        /**
         * Q
         * Case-insensitive substring match on tag name
         */
        string | null
    }
    export interface QueryParameters {
      q?: /**
       * Q
       * Case-insensitive substring match on tag name
       */
      Parameters.Q
      page?: /**
       * Page
       * Page number (1-based)
       */
      Parameters.Page
      page_size?: /**
       * Page Size
       * Page size (max 100 items)
       */
      Parameters.PageSize
    }
    namespace Responses {
      export type $200 =
        /**
         * TagListResponse
         * Paginated collection of tags.
         */
        Components.Schemas.TagListResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListDeviceFilterPresetsV1DevicesPresetsGet {
    namespace Responses {
      export type $200 =
        /**
         * FilterPresetListResponse
         * Collection of presets for a user/object type.
         */
        Components.Schemas.FilterPresetListResponse
    }
  }
  namespace ListDevicesV1DevicesGet {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace ListFolderChildrenV1MediaFoldersFolderIdChildrenGet {
    namespace Parameters {
      /**
       * Folder Id
       */
      export type FolderId = number
    }
    export interface PathParameters {
      folder_id: /* Folder Id */ Parameters.FolderId
    }
    namespace Responses {
      /**
       * Response List Folder Children V1 Media Folders  Folder Id  Children Get
       */
      export type $200 =
        /**
         * FolderNode
         * Tree node representation for folder listings.
         */
        Components.Schemas.FolderNode[]
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListFolderTreeV1MediaFoldersGet {
    namespace Responses {
      export type $200 =
        /**
         * FolderTreeResponse
         * Folder tree for the current organisation/user.
         */
        Components.Schemas.FolderTreeResponse
    }
  }
  namespace ListInstalledAppsV1AppsInstalledGet {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace ListMediaFilterPresetsV1MediaPresetsGet {
    namespace Responses {
      export type $200 =
        /**
         * FilterPresetListResponse
         * Collection of presets for a user/object type.
         */
        Components.Schemas.FilterPresetListResponse
    }
  }
  namespace ListMediaV1MediaGet {
    namespace Parameters {
      /**
       * Folder Id
       * Filter by folder id; null means top-level only
       */
      export type FolderId =
        /**
         * Folder Id
         * Filter by folder id; null means top-level only
         */
        number | null
      /**
       * Include Deleted
       * Include soft-deleted media when true
       */
      export type IncludeDeleted = boolean
      /**
       * Media Type
       * Filter by media type (image/video/html/zip/other)
       */
      export type MediaType =
        /**
         * Media Type
         * Filter by media type (image/video/html/zip/other)
         */
        string | null
      /**
       * Organisation Id
       * Optional organisation id to scope results; must be within caller org tree
       */
      export type OrganisationId =
        /**
         * Organisation Id
         * Optional organisation id to scope results; must be within caller org tree
         */
        number | null
      /**
       * Page
       */
      export type Page = number
      /**
       * Q
       * Fuzzy search on name/description
       */
      export type Q =
        /**
         * Q
         * Fuzzy search on name/description
         */
        string | null
      /**
       * Size
       */
      export type Size = number
      /**
       * Tag Ids
       * Filter by one or more tag ids
       */
      export type TagIds =
        /**
         * Tag Ids
         * Filter by one or more tag ids
         */
        number[] | null
    }
    export interface QueryParameters {
      q?: /**
       * Q
       * Fuzzy search on name/description
       */
      Parameters.Q
      media_type?: /**
       * Media Type
       * Filter by media type (image/video/html/zip/other)
       */
      Parameters.MediaType
      folder_id?: /**
       * Folder Id
       * Filter by folder id; null means top-level only
       */
      Parameters.FolderId
      tag_ids?: /**
       * Tag Ids
       * Filter by one or more tag ids
       */
      Parameters.TagIds
      include_deleted?: /**
       * Include Deleted
       * Include soft-deleted media when true
       */
      Parameters.IncludeDeleted
      organisation_id?: /**
       * Organisation Id
       * Optional organisation id to scope results; must be within caller org tree
       */
      Parameters.OrganisationId
      page?: /* Page */ Parameters.Page
      size?: /* Size */ Parameters.Size
    }
    namespace Responses {
      export type $200 =
        /**
         * MediaListResponse
         * Paginated media list payload.
         */
        Components.Schemas.MediaListResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListPlaylistFilterPresetsV1PlaylistsPresetsGet {
    namespace Responses {
      export type $200 =
        /**
         * FilterPresetListResponse
         * Collection of presets for a user/object type.
         */
        Components.Schemas.FilterPresetListResponse
    }
  }
  namespace ListPlaylistsV1PlaylistsGet {
    namespace Parameters {
      /**
       * Content Tag Ids
       * Filter playlists containing all provided content tag ids
       */
      export type ContentTagIds =
        /**
         * Content Tag Ids
         * Filter playlists containing all provided content tag ids
         */
        number[] | null
      /**
       * Include Disabled
       * Include disabled playlists when true
       */
      export type IncludeDisabled = boolean
      /**
       * Organisation Id
       * Optional organisation id to scope results; must belong to caller's org tree
       */
      export type OrganisationId =
        /**
         * Organisation Id
         * Optional organisation id to scope results; must belong to caller's org tree
         */
        number | null
      /**
       * Page
       * Page number (1-based)
       */
      export type Page = number
      /**
       * Page Size
       * Page size
       */
      export type PageSize = number
      /**
       * Q
       * Search by playlist name
       */
      export type Q =
        /**
         * Q
         * Search by playlist name
         */
        string | null
      /**
       * Time Tag Ids
       * Filter playlists containing all provided time tag ids
       */
      export type TimeTagIds =
        /**
         * Time Tag Ids
         * Filter playlists containing all provided time tag ids
         */
        string[] | null
    }
    export interface QueryParameters {
      q?: /**
       * Q
       * Search by playlist name
       */
      Parameters.Q
      page?: /**
       * Page
       * Page number (1-based)
       */
      Parameters.Page
      page_size?: /**
       * Page Size
       * Page size
       */
      Parameters.PageSize
      include_disabled?: /**
       * Include Disabled
       * Include disabled playlists when true
       */
      Parameters.IncludeDisabled
      organisation_id?: /**
       * Organisation Id
       * Optional organisation id to scope results; must belong to caller's org tree
       */
      Parameters.OrganisationId
      content_tag_ids?: /**
       * Content Tag Ids
       * Filter playlists containing all provided content tag ids
       */
      Parameters.ContentTagIds
      time_tag_ids?: /**
       * Time Tag Ids
       * Filter playlists containing all provided time tag ids
       */
      Parameters.TimeTagIds
    }
    namespace Responses {
      export type $200 =
        /**
         * PlaylistListResponse
         * Paginated playlist list response.
         */
        Components.Schemas.PlaylistListResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListSchedulesV1SchedulesGet {
    namespace Responses {
      export type $200 = any
    }
  }
  namespace ListTimeTagsV1TagsTimeGet {
    namespace Parameters {
      /**
       * Page
       */
      export type Page = number
      /**
       * Page Size
       */
      export type PageSize = number
      /**
       * Q
       * Case-insensitive substring match on name
       */
      export type Q =
        /**
         * Q
         * Case-insensitive substring match on name
         */
        string | null
    }
    export interface QueryParameters {
      q?: /**
       * Q
       * Case-insensitive substring match on name
       */
      Parameters.Q
      page?: /* Page */ Parameters.Page
      page_size?: /* Page Size */ Parameters.PageSize
    }
    namespace Responses {
      export type $200 =
        /**
         * TimeTagListResponse
         * Paginated time tag list.
         */
        Components.Schemas.TimeTagListResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ListUserOrganisationsV1UserOrganisationsGet {
    namespace Responses {
      /**
       * Response List User Organisations V1 User Organisations Get
       */
      export type $200 =
        /**
         * OrganisationProfile
         * Basic organisation info returned in user profile.
         */
        Components.Schemas.OrganisationProfile[]
    }
  }
  namespace LoginEndpointV1AuthLoginPost {
    export type RequestBody =
      /**
       * LoginRequest
       * Payload for local username/password authentication.
       */
      Components.Schemas.LoginRequest
    namespace Responses {
      export type $200 =
        /**
         * LoginResponse
         * Standard response body for all auth endpoints.
         */
        Components.Schemas.LoginResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace MoveMediaBatchV1MediaMovePost {
    export type RequestBody =
      /**
       * MediaMoveRequest
       * Batch move media into a folder.
       */
      Components.Schemas.MediaMoveRequest
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace NotifyUploadResultV1MediaNotifyPost {
    export type RequestBody =
      /**
       * UploadNotifyRequest
       * Payload sent by Lambda to report processing results.
       */
      Components.Schemas.UploadNotifyRequest
    namespace Responses {
      export type $200 =
        /**
         * MediaUploadResponse
         * Response payload returned after uploading media to S3.
         */
        Components.Schemas.MediaUploadResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace PublishMediaV1MediaMediaIdPublishPost {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace PublishPlaylistV1PlaylistsPlaylistIdPublishPost {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    namespace Responses {
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
      export type $501 = any
    }
  }
  namespace RebootDeviceV1DevicesDeviceIdRebootPatch {
    namespace Parameters {
      /**
       * Device Id
       */
      export type DeviceId = string
    }
    export interface PathParameters {
      device_id: /* Device Id */ Parameters.DeviceId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace RemovePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdDelete {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
      /**
       * Playlist Media Id
       */
      export type PlaylistMediaId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
      playlist_media_id: /* Playlist Media Id */ Parameters.PlaylistMediaId
    }
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    export type RequestBody =
      /**
       * PlaylistItemsReorderRequest
       * Payload for reordering items within a playlist.
       */
      Components.Schemas.PlaylistItemsReorderRequest
    namespace Responses {
      export interface $204 {}
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UninstallAppV1AppsAppIdInstallDelete {
    namespace Parameters {
      /**
       * App Id
       */
      export type AppId = string
    }
    export interface PathParameters {
      app_id: /* App Id */ Parameters.AppId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdateContentTagV1TagsContentTagIdPut {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string // \d+
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId /* \d+ */
    }
    export type RequestBody =
      /**
       * TagUpdateRequest
       * Editable fields for an existing tag.
       */
      Components.Schemas.TagUpdateRequest
    namespace Responses {
      export type $200 =
        /**
         * TagResponse
         * Full tag definition payload.
         */
        Components.Schemas.TagResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdateDeviceV1DevicesDeviceIdPut {
    namespace Parameters {
      /**
       * Device Id
       */
      export type DeviceId = string
    }
    export interface PathParameters {
      device_id: /* Device Id */ Parameters.DeviceId
    }
    namespace Responses {
      export type $200 = any
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdateFolderV1MediaFoldersFolderIdPut {
    namespace Parameters {
      /**
       * Folder Id
       */
      export type FolderId = number
    }
    export interface PathParameters {
      folder_id: /* Folder Id */ Parameters.FolderId
    }
    /**
     * New name/parent/sort_order for folder
     */
    export type RequestBody =
      /**
       * FolderUpdateRequest
       * Request payload to rename or move a folder.
       */
      Components.Schemas.FolderUpdateRequest
    namespace Responses {
      export type $200 =
        /**
         * FolderNode
         * Tree node representation for folder listings.
         */
        Components.Schemas.FolderNode
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdateMediaV1MediaMediaIdPut {
    namespace Parameters {
      /**
       * Media Id
       */
      export type MediaId = string
    }
    export interface PathParameters {
      media_id: /* Media Id */ Parameters.MediaId
    }
    export type RequestBody =
      /**
       * MediaUpdateRequest
       * Fields that can be updated on a media entity.
       */
      Components.Schemas.MediaUpdateRequest
    namespace Responses {
      export type $200 =
        /**
         * MediaDetail
         * Detailed media response including upload metadata.
         */
        Components.Schemas.MediaDetail
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
      /**
       * Playlist Media Id
       */
      export type PlaylistMediaId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
      playlist_media_id: /* Playlist Media Id */ Parameters.PlaylistMediaId
    }
    export type RequestBody =
      /**
       * PlaylistItemUpdate
       * Partial update for a playlist item.
       */
      Components.Schemas.PlaylistItemUpdate
    namespace Responses {
      export type $200 =
        /**
         * PlaylistItemRead
         * Full playlist item detail.
         */
        Components.Schemas.PlaylistItemRead
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdatePlaylistV1PlaylistsPlaylistIdPut {
    namespace Parameters {
      /**
       * Playlist Id
       */
      export type PlaylistId = string
    }
    export interface PathParameters {
      playlist_id: /* Playlist Id */ Parameters.PlaylistId
    }
    export type RequestBody =
      /**
       * PlaylistUpdate
       * Request payload to update playlist metadata and tag associations.
       */
      Components.Schemas.PlaylistUpdate
    namespace Responses {
      export type $200 =
        /**
         * PlaylistDetail
         * Full playlist detail including items and tag associations.
         */
        Components.Schemas.PlaylistDetail
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UpdateTimeTagV1TagsTimeTagIdPut {
    namespace Parameters {
      /**
       * Tag Id
       */
      export type TagId = string
    }
    export interface PathParameters {
      tag_id: /* Tag Id */ Parameters.TagId
    }
    export type RequestBody =
      /**
       * TimeTagUpdate
       * Payload to update a time tag (partial).
       */
      Components.Schemas.TimeTagUpdate
    namespace Responses {
      export type $200 =
        /**
         * TimeTagRead
         * Full time tag detail including windows.
         */
        Components.Schemas.TimeTagRead
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
  namespace UploadMediaEndpointV1MediaPost {
    export type RequestBody =
      /* Body_upload_media_endpoint_v1_media__post */ Components.Schemas.BodyUploadMediaEndpointV1MediaPost
    namespace Responses {
      export type $201 =
        /**
         * MediaUploadResponse
         * Response payload returned after uploading media to S3.
         */
        Components.Schemas.MediaUploadResponse
      export type $422 = /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
}

export interface OperationMethods {
  /**
   * get_current_user_profile_v1_user_me_get - Get Current User Profile
   *
   * Fetch the current user's profile including organisation info.
   *
   * Auth: Bearer token. Returns user id/email/username/full_name and the user's
   * organisation summary (id/name/parent_id) when available. 404 if the user
   * cannot be resolved (inactive or missing in legacy DB).
   */
  'get_current_user_profile_v1_user_me_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetCurrentUserProfileV1UserMeGet.Responses.$200>
  /**
   * list_user_organisations_v1_user_organisations_get - List User Organisations
   *
   * List the caller's organisation and all descendant organisations.
   *
   * Auth: Bearer token. Uses the caller's org_id to return a flat list of orgs
   * within their visibility scope (self + children). Returns 404 if the user
   * does not have an organisation assigned.
   */
  'list_user_organisations_v1_user_organisations_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListUserOrganisationsV1UserOrganisationsGet.Responses.$200>
  /**
   * login_endpoint_v1_auth_login_post - Authenticate a user and issue an access token
   *
   * Handle local username/password authentication.
   */
  'login_endpoint_v1_auth_login_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoginEndpointV1AuthLoginPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.LoginEndpointV1AuthLoginPost.Responses.$200>
  /**
   * cognito_callback_v1_auth_cognito_callback_get - OAuth callback: exchange code for a local JWT
   *
   * Exchange the Cognito authorization code for an ID token and issue our JWT.
   */
  'cognito_callback_v1_auth_cognito_callback_get'(
    parameters?: Parameters<Paths.CognitoCallbackV1AuthCognitoCallbackGet.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CognitoCallbackV1AuthCognitoCallbackGet.Responses.$200>
  /**
   * cognito_bind_v1_auth_cognito_bind_post - Bind Cognito identity to the currently authenticated user
   *
   * Bind an authorization code to the logged-in legacy user.
   */
  'cognito_bind_v1_auth_cognito_bind_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CognitoBindV1AuthCognitoBindPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CognitoBindV1AuthCognitoBindPost.Responses.$204>
  /**
   * list_media_v1_media__get - List media items with pagination and filters
   *
   * List media the caller owns, with rich filters and pagination.
   *
   * Auth: Bearer token; results are scoped to the current user's uploads (owner_user_id)
   * and, when available, their organisation. Inputs: optional `q` fuzzy-matches name/description,
   * `media_type` filters image/video/html/zip/other, `tag_ids` uses AND semantics (must contain all),
   * `include_deleted` toggles soft-deleted items, `page`/`size` drive pagination. Hierarchy: omitting
   * `folder_id` intentionally returns only root-level media (folder_id IS NULL); provide a folder_id
   * to list items inside that folder. Org scope: results are filtered to the caller's organisation
   * and all its descendant orgs; when organisation_id is provided and within that scope, results are
   * further limited to that specific organisation. Response: items include tags, thumbnail URLs/keys,
   * timestamps, deletion marker, and a `total` count for pagination.
   */
  'list_media_v1_media__get'(
    parameters?: Parameters<Paths.ListMediaV1MediaGet.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListMediaV1MediaGet.Responses.$200>
  /**
   * upload_media_endpoint_v1_media__post - Upload media to S3 (Unprocessed prefix)
   *
   * Upload a file to S3 under `Unprocessed/` and create an uploads row.
   *
   * Auth: Bearer token. Inputs: multipart `file` plus optional `folder_id` (validated against the
   * caller's organisation). Validation: filename required; SizeLimitedReader enforces 10 GiB cap;
   * upload_type inferred from MIME/extension. Side effects: writes to S3 at
   * `Unprocessed/YYYY/MM/DD/<upload_uuid>/<uuid>_<filename>`; inserts an `uploads` record with
   * status=pending, owner=user_id, optional folder_id for later media creation. Response: upload
   * metadata (ids, prefix/key, status/type, size, folder_id) for client-side status polling.
   */
  'upload_media_endpoint_v1_media__post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UploadMediaEndpointV1MediaPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UploadMediaEndpointV1MediaPost.Responses.$201>
  /**
   * get_upload_status_v1_media_uploads__upload_id__get - Check media upload status
   *
   * Check upload status (restricted to the current user's uploads).
   *
   * Auth: Bearer token. Input: upload_id path. Enforcement: rejects uploads not owned by the caller
   * (treated as 404). Returns current status, keys (original/processed/thumbnail), size/type,
   * folder_id, and media_id if Lambda processing has already created a media record.
   */
  'get_upload_status_v1_media_uploads__upload_id__get'(
    parameters?: Parameters<Paths.GetUploadStatusV1MediaUploadsUploadIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetUploadStatusV1MediaUploadsUploadIdGet.Responses.$200>
  /**
   * notify_upload_result_v1_media_notify_post - Notify backend of upload processing result (Lambda callback)
   *
   * Handle Lambda callback: update upload status and create/refresh media on completion.
   *
   * Auth: UPLOAD_NOTIFY_TOKEN Bearer (no user token). Input: upload_id (required), status in
   * {processing, completed, failed}, optional processed_key, thumbnail_key, upload_type,
   * error_message. Behavior: validates status, updates uploads prefix/status/keys/type, and when
   * status=completed idempotently creates or refreshes the associated media row (keeping folder_id
   * from upload). Response: updated upload plus media_id when available; 404 if upload missing.
   */
  'notify_upload_result_v1_media_notify_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.NotifyUploadResultV1MediaNotifyPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.NotifyUploadResultV1MediaNotifyPost.Responses.$200>
  /**
   * list_folder_tree_v1_media_folders_get - List folder tree
   *
   * Get the folder tree visible to the current user.
   *
   * Auth: Bearer token. Scope: caller's organisation. Returns a tree of non-deleted folders with
   * children populated to support UI rendering; media items are not included here.
   */
  'list_folder_tree_v1_media_folders_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListFolderTreeV1MediaFoldersGet.Responses.$200>
  /**
   * create_media_folder_v1_media_folders_post - Create media folder
   *
   * Create a logical media folder (not tied to S3 prefixes).
   *
   * Auth: Bearer token. Input: name, optional parent_folder_id (must exist, not deleted, same org),
   * optional sort_order. Validation: rejects duplicate sibling names with 400; parent existence and
   * org ownership enforced. Side effects: inserts folder row; no S3 interaction. Response: created
   * folder node with hierarchy metadata (ids, parent, sort order, flags).
   */
  'create_media_folder_v1_media_folders_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateMediaFolderV1MediaFoldersPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateMediaFolderV1MediaFoldersPost.Responses.$200>
  /**
   * list_folder_children_v1_media_folders__folder_id__children_get - List folder children
   *
   * List direct child folders under a parent.
   *
   * Auth: Bearer token. Input: parent folder_id. Scope: caller's organisation. Returns immediate
   * child folders only (no media items), excluding soft-deleted ones.
   */
  'list_folder_children_v1_media_folders__folder_id__children_get'(
    parameters?: Parameters<Paths.ListFolderChildrenV1MediaFoldersFolderIdChildrenGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListFolderChildrenV1MediaFoldersFolderIdChildrenGet.Responses.$200>
  /**
   * update_folder_v1_media_folders__folder_id__put - Update folder (rename/move)
   *
   * Rename/move a folder or update its sort order.
   *
   * Auth: Bearer token. Input: name/parent_folder_id/sort_order. Validation: both current folder
   * and new parent must belong to caller's org; cycle detection prevents moving into descendants;
   * duplicate sibling names raise 400. Response: updated folder node.
   */
  'update_folder_v1_media_folders__folder_id__put'(
    parameters?: Parameters<Paths.UpdateFolderV1MediaFoldersFolderIdPut.PathParameters> | null,
    data?: Paths.UpdateFolderV1MediaFoldersFolderIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateFolderV1MediaFoldersFolderIdPut.Responses.$200>
  /**
   * delete_folder_v1_media_folders__folder_id__delete - Soft delete folder
   *
   * Soft delete an empty folder.
   *
   * Auth: Bearer token. Preconditions: folder must belong to caller's org and be empty (no active
   * child folders, no non-deleted media). Errors: 400 when not empty, 404 when missing/inaccessible.
   * Side effects: sets deleted_at only (no S3 actions). Response: 204 on success.
   */
  'delete_folder_v1_media_folders__folder_id__delete'(
    parameters?: Parameters<Paths.DeleteFolderV1MediaFoldersFolderIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteFolderV1MediaFoldersFolderIdDelete.Responses.$204>
  /**
   * list_media_filter_presets_v1_media_presets_get - List media filter presets for the current user
   *
   * Return saved media filter presets scoped to the caller.
   */
  'list_media_filter_presets_v1_media_presets_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListMediaFilterPresetsV1MediaPresetsGet.Responses.$200>
  /**
   * create_media_filter_presets_v1_media_presets_post - Create a media filter preset
   *
   * Persist a filter preset for media list endpoints.
   */
  'create_media_filter_presets_v1_media_presets_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateMediaFilterPresetsV1MediaPresetsPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateMediaFilterPresetsV1MediaPresetsPost.Responses.$201>
  /**
   * delete_media_filter_presets_v1_media_presets_delete - Delete a media filter preset
   *
   * Delete a saved media filter preset owned by the caller.
   */
  'delete_media_filter_presets_v1_media_presets_delete'(
    parameters?: Parameters<Paths.DeleteMediaFilterPresetsV1MediaPresetsDelete.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteMediaFilterPresetsV1MediaPresetsDelete.Responses.$204>
  /**
   * get_media_detail_v1_media__media_id__get - Get media detail
   *
   * Get media detail including upload metadata and URLs.
   *
   * Auth: Bearer token. Scope: caller's ownership/organisation. Returns media fields plus upload
   * metadata (size/content_type/status), processed object key/URL, thumbnail key/URL, tags, and
   * folder info. Errors: 404 when missing or not accessible to caller.
   */
  'get_media_detail_v1_media__media_id__get'(
    parameters?: Parameters<Paths.GetMediaDetailV1MediaMediaIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetMediaDetailV1MediaMediaIdGet.Responses.$200>
  /**
   * update_media_v1_media__media_id__put - Update media
   *
   * Update media fields and tags, or restore a soft-deleted item.
   *
   * Auth: Bearer token. Scope: owner/org. Inputs: name, description, folder_id (move/unset),
   * tag_ids (full replacement), restore flag to clear deleted_at. Validation: folder must exist
   * within org; all tag_ids must exist and be active. Response: refreshed media detail; 404 when
   * missing or unauthorized; 400 on validation errors.
   */
  'update_media_v1_media__media_id__put'(
    parameters?: Parameters<Paths.UpdateMediaV1MediaMediaIdPut.PathParameters> | null,
    data?: Paths.UpdateMediaV1MediaMediaIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateMediaV1MediaMediaIdPut.Responses.$200>
  /**
   * delete_media_v1_media__media_id__delete - Soft delete media
   *
   * Soft delete a media item (S3 objects remain).
   *
   * Auth: Bearer token. Scope: owner/org. Marks deleted_at only; does not delete S3 objects or
   * related uploads. Errors: 404 when missing or inaccessible. Response: 204 on success.
   */
  'delete_media_v1_media__media_id__delete'(
    parameters?: Parameters<Paths.DeleteMediaV1MediaMediaIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteMediaV1MediaMediaIdDelete.Responses.$204>
  /**
   * move_media_batch_v1_media_move_post - Move multiple media into a folder
   *
   * Move multiple media items to a target folder in one request.
   *
   * Auth: Bearer token. Validates target folder is within caller's org scope and
   * that all provided media ids are accessible to the caller.
   */
  'move_media_batch_v1_media_move_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.MoveMediaBatchV1MediaMovePost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.MoveMediaBatchV1MediaMovePost.Responses.$204>
  /**
   * duplicate_media_v1_media__media_id__duplicate_post - Duplicate media (placeholder)
   *
   * Placeholder: create a copy of a media item (including upload linkage) and
   * optionally place it in another folder. Should accept destination folder and
   * return the new media id.
   */
  'duplicate_media_v1_media__media_id__duplicate_post'(
    parameters?: Parameters<Paths.DuplicateMediaV1MediaMediaIdDuplicatePost.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DuplicateMediaV1MediaMediaIdDuplicatePost.Responses.$200>
  /**
   * get_media_usage_v1_media__media_id__usage_get - Get media usage (placeholder)
   *
   * Placeholder: list where a media item is referenced (playlists, schedules,
   * devices), for impact analysis before deletion.
   */
  'get_media_usage_v1_media__media_id__usage_get'(
    parameters?: Parameters<Paths.GetMediaUsageV1MediaMediaIdUsageGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetMediaUsageV1MediaMediaIdUsageGet.Responses.$200>
  /**
   * publish_media_v1_media__media_id__publish_post - Publish media (placeholder)
   *
   * Placeholder: publish a media item to make it available for downstream
   * delivery/playback pipelines; expected to trigger packaging or cache invalidation.
   */
  'publish_media_v1_media__media_id__publish_post'(
    parameters?: Parameters<Paths.PublishMediaV1MediaMediaIdPublishPost.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.PublishMediaV1MediaMediaIdPublishPost.Responses.$200>
  /**
   * list_device_filter_presets_v1_devices_presets_get - List device filter presets for the current user
   *
   * Return saved device filter presets scoped to the caller.
   */
  'list_device_filter_presets_v1_devices_presets_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListDeviceFilterPresetsV1DevicesPresetsGet.Responses.$200>
  /**
   * create_device_filter_presets_v1_devices_presets_post - Create a device filter preset
   *
   * Persist a filter preset for device list endpoints.
   */
  'create_device_filter_presets_v1_devices_presets_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateDeviceFilterPresetsV1DevicesPresetsPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDeviceFilterPresetsV1DevicesPresetsPost.Responses.$201>
  /**
   * delete_device_filter_presets_v1_devices_presets_delete - Delete a device filter preset
   *
   * Delete a saved device filter preset owned by the caller.
   */
  'delete_device_filter_presets_v1_devices_presets_delete'(
    parameters?: Parameters<Paths.DeleteDeviceFilterPresetsV1DevicesPresetsDelete.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDeviceFilterPresetsV1DevicesPresetsDelete.Responses.$204>
  /**
   * list_devices_v1_devices__get - List Devices
   *
   * List all devices with pagination, search, status, organisation and tag filters.
   */
  'list_devices_v1_devices__get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListDevicesV1DevicesGet.Responses.$200>
  /**
   * create_device_v1_devices__post - Create Device
   *
   * Create a new device (name, organisation, licence, location, timezone, resolution, tags).
   */
  'create_device_v1_devices__post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDeviceV1DevicesPost.Responses.$200>
  /**
   * get_device_detail_v1_devices__device_id__get - Get Device Detail
   *
   * Get full details for a single device, including status, last heartbeat, location and bindings.
   */
  'get_device_detail_v1_devices__device_id__get'(
    parameters?: Parameters<Paths.GetDeviceDetailV1DevicesDeviceIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDeviceDetailV1DevicesDeviceIdGet.Responses.$200>
  /**
   * update_device_v1_devices__device_id__put - Update Device
   *
   * Update an existing device’s metadata (name, location, tags, bindings, etc.).
   */
  'update_device_v1_devices__device_id__put'(
    parameters?: Parameters<Paths.UpdateDeviceV1DevicesDeviceIdPut.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDeviceV1DevicesDeviceIdPut.Responses.$200>
  /**
   * delete_device_v1_devices__device_id__delete - Delete Device
   *
   * Permanently delete a device.
   */
  'delete_device_v1_devices__device_id__delete'(
    parameters?: Parameters<Paths.DeleteDeviceV1DevicesDeviceIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDeviceV1DevicesDeviceIdDelete.Responses.$200>
  /**
   * reboot_device_v1_devices__device_id__reboot_patch - Reboot Device
   *
   * Trigger a remote reboot for a single device.
   */
  'reboot_device_v1_devices__device_id__reboot_patch'(
    parameters?: Parameters<Paths.RebootDeviceV1DevicesDeviceIdRebootPatch.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RebootDeviceV1DevicesDeviceIdRebootPatch.Responses.$200>
  /**
   * bulk_reboot_devices_v1_devices_reboot_post - Bulk Reboot Devices
   *
   * Trigger a remote reboot for multiple devices in one request.
   */
  'bulk_reboot_devices_v1_devices_reboot_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.BulkRebootDevicesV1DevicesRebootPost.Responses.$200>
  /**
   * get_device_schedules_v1_devices__device_id__schedules_get - Get Device Schedules
   *
   * Return all schedule instances affecting a device in a given date range.
   */
  'get_device_schedules_v1_devices__device_id__schedules_get'(
    parameters?: Parameters<Paths.GetDeviceSchedulesV1DevicesDeviceIdSchedulesGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDeviceSchedulesV1DevicesDeviceIdSchedulesGet.Responses.$200>
  /**
   * list_playlists_v1_playlists__get - List Playlists
   *
   * List playlists with pagination and optional tag filters.
   */
  'list_playlists_v1_playlists__get'(
    parameters?: Parameters<Paths.ListPlaylistsV1PlaylistsGet.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListPlaylistsV1PlaylistsGet.Responses.$200>
  /**
   * create_playlist_v1_playlists__post - Create Playlist
   *
   * Create a playlist with optional initial items and tag associations.
   */
  'create_playlist_v1_playlists__post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreatePlaylistV1PlaylistsPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreatePlaylistV1PlaylistsPost.Responses.$201>
  /**
   * list_playlist_filter_presets_v1_playlists_presets_get - List playlist filter presets for the current user
   *
   * Return saved playlist filter presets scoped to the caller.
   */
  'list_playlist_filter_presets_v1_playlists_presets_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListPlaylistFilterPresetsV1PlaylistsPresetsGet.Responses.$200>
  /**
   * create_playlist_filter_presets_v1_playlists_presets_post - Create a playlist filter preset
   *
   * Persist a filter preset for playlist list endpoints.
   */
  'create_playlist_filter_presets_v1_playlists_presets_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreatePlaylistFilterPresetsV1PlaylistsPresetsPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreatePlaylistFilterPresetsV1PlaylistsPresetsPost.Responses.$201>
  /**
   * delete_playlist_filter_presets_v1_playlists_presets_delete - Delete a playlist filter preset
   *
   * Delete a saved playlist filter preset owned by the caller.
   */
  'delete_playlist_filter_presets_v1_playlists_presets_delete'(
    parameters?: Parameters<Paths.DeletePlaylistFilterPresetsV1PlaylistsPresetsDelete.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeletePlaylistFilterPresetsV1PlaylistsPresetsDelete.Responses.$204>
  /**
   * get_playlist_detail_v1_playlists__playlist_id__get - Get Playlist Detail
   *
   * Return full playlist detail including items and associated tags.
   */
  'get_playlist_detail_v1_playlists__playlist_id__get'(
    parameters?: Parameters<Paths.GetPlaylistDetailV1PlaylistsPlaylistIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetPlaylistDetailV1PlaylistsPlaylistIdGet.Responses.$200>
  /**
   * update_playlist_v1_playlists__playlist_id__put - Update Playlist
   *
   * Update playlist metadata and replace tag associations when provided.
   */
  'update_playlist_v1_playlists__playlist_id__put'(
    parameters?: Parameters<Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.PathParameters> | null,
    data?: Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.Responses.$200>
  /**
   * delete_playlist_v1_playlists__playlist_id__delete - Delete Playlist
   *
   * Soft delete a playlist and its items.
   */
  'delete_playlist_v1_playlists__playlist_id__delete'(
    parameters?: Parameters<Paths.DeletePlaylistV1PlaylistsPlaylistIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeletePlaylistV1PlaylistsPlaylistIdDelete.Responses.$204>
  /**
   * add_playlist_items_v1_playlists__playlist_id__media_post - Add Playlist Items
   *
   * Add one or more media items into a playlist with duration and tag rules.
   */
  'add_playlist_items_v1_playlists__playlist_id__media_post'(
    parameters?: Parameters<Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.PathParameters> | null,
    data?: Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.Responses.$201>
  /**
   * update_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__put - Update Playlist Item
   *
   * Update a single playlist item (duration/tags/active window).
   */
  'update_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__put'(
    parameters?: Parameters<Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.PathParameters> | null,
    data?: Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.Responses.$200>
  /**
   * remove_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__delete - Remove Playlist Item
   *
   * Remove (soft delete) a media item from a playlist.
   */
  'remove_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__delete'(
    parameters?: Parameters<Paths.RemovePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemovePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdDelete.Responses.$204>
  /**
   * reorder_playlist_items_v1_playlists__playlist_id__media_reorder_post - Reorder Playlist Items
   *
   * Rewrite playlist item ordering using the supplied item id list.
   */
  'reorder_playlist_items_v1_playlists__playlist_id__media_reorder_post'(
    parameters?: Parameters<Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.PathParameters> | null,
    data?: Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.Responses.$204>
  /**
   * get_playlist_devices_v1_playlists__playlist_id__devices_get - Get Playlist Devices
   *
   * List all devices currently using this playlist.
   */
  'get_playlist_devices_v1_playlists__playlist_id__devices_get'(
    parameters?: Parameters<Paths.GetPlaylistDevicesV1PlaylistsPlaylistIdDevicesGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * get_playlist_schedules_v1_playlists__playlist_id__schedules_get - Get Playlist Schedules
   *
   * Return all schedule instances where this playlist is scheduled.
   */
  'get_playlist_schedules_v1_playlists__playlist_id__schedules_get'(
    parameters?: Parameters<Paths.GetPlaylistSchedulesV1PlaylistsPlaylistIdSchedulesGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * publish_playlist_v1_playlists__playlist_id__publish_post - Publish Playlist
   *
   * Publish a playlist so changes are rolled out to devices and schedules.
   */
  'publish_playlist_v1_playlists__playlist_id__publish_post'(
    parameters?: Parameters<Paths.PublishPlaylistV1PlaylistsPlaylistIdPublishPost.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * list_schedules_v1_schedules__get - List Schedules
   *
   * List all schedules with pagination, search, organisation and target filters.
   */
  'list_schedules_v1_schedules__get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListSchedulesV1SchedulesGet.Responses.$200>
  /**
   * get_schedule_detail_v1_schedules__schedule_id__get - Get Schedule Detail
   *
   * Get full details for a schedule, including targets, date range and time rules.
   */
  'get_schedule_detail_v1_schedules__schedule_id__get'(
    parameters?: Parameters<Paths.GetScheduleDetailV1SchedulesScheduleIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetScheduleDetailV1SchedulesScheduleIdGet.Responses.$200>
  /**
   * get_schedule_occurrences_v1_schedules__schedule_id__occurrences_get - Get Schedule Occurrences
   *
   * Expand a schedule into concrete occurrences over a date range for calendars.
   */
  'get_schedule_occurrences_v1_schedules__schedule_id__occurrences_get'(
    parameters?: Parameters<Paths.GetScheduleOccurrencesV1SchedulesScheduleIdOccurrencesGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetScheduleOccurrencesV1SchedulesScheduleIdOccurrencesGet.Responses.$200>
  /**
   * list_apps_v1_apps__get - List Apps
   *
   * List all available apps with search, category and organisation filters.
   */
  'list_apps_v1_apps__get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListAppsV1AppsGet.Responses.$200>
  /**
   * get_app_detail_v1_apps__app_id__get - Get App Detail
   *
   * Get details of a specific app (description, version, permissions, config schema).
   */
  'get_app_detail_v1_apps__app_id__get'(
    parameters?: Parameters<Paths.GetAppDetailV1AppsAppIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetAppDetailV1AppsAppIdGet.Responses.$200>
  /**
   * list_installed_apps_v1_apps_installed_get - List Installed Apps
   *
   * List apps that are installed for a given organisation or device.
   */
  'list_installed_apps_v1_apps_installed_get'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListInstalledAppsV1AppsInstalledGet.Responses.$200>
  /**
   * install_app_v1_apps__app_id__install_post - Install App
   *
   * Install an app for an organisation and/or a set of devices with initial config.
   */
  'install_app_v1_apps__app_id__install_post'(
    parameters?: Parameters<Paths.InstallAppV1AppsAppIdInstallPost.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.InstallAppV1AppsAppIdInstallPost.Responses.$200>
  /**
   * uninstall_app_v1_apps__app_id__install_delete - Uninstall App
   *
   * Uninstall an app from an organisation or from specific devices.
   */
  'uninstall_app_v1_apps__app_id__install_delete'(
    parameters?: Parameters<Paths.UninstallAppV1AppsAppIdInstallDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UninstallAppV1AppsAppIdInstallDelete.Responses.$200>
  /**
   * list_content_tags_v1_tags_content_get - List Content Tags
   *
   * List content tags visible to the current user, with optional search and pagination.
   *
   * Requires Bearer auth. Filters by the caller's organisation (or global tags if supported).
   * Accepts optional `q` (substring search on name), `page`, and `page_size` (capped at 100).
   */
  'list_content_tags_v1_tags_content_get'(
    parameters?: Parameters<Paths.ListContentTagsV1TagsContentGet.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListContentTagsV1TagsContentGet.Responses.$200>
  /**
   * create_content_tag_v1_tags_content_post - Create Content Tag
   *
   * Create a content tag.
   *
   * Requires Bearer auth; organisation defaults to the caller. Accepts name (required),
   * optional description, and optional hex color (#RRGGBB). Validates color format and
   * enforces unique name within the same organisation (400 on conflict). Returns the created tag.
   */
  'create_content_tag_v1_tags_content_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateContentTagV1TagsContentPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateContentTagV1TagsContentPost.Responses.$201>
  /**
   * get_content_tag_detail_v1_tags_content__tag_id__get - Get Content Tag Detail
   *
   * Return full details for a content tag including type and usage counts.
   *
   * Auth: Bearer token. Scope: caller's organisation. Response includes tag type (content),
   * metadata, and aggregated usage counts across media/playlists/devices. Errors: 404 when the
   * tag is missing or belongs to another organisation.
   */
  'get_content_tag_detail_v1_tags_content__tag_id__get'(
    parameters?: Parameters<Paths.GetContentTagDetailV1TagsContentTagIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetContentTagDetailV1TagsContentTagIdGet.Responses.$200>
  /**
   * update_content_tag_v1_tags_content__tag_id__put - Update Content Tag
   *
   * Update tag name/notes/color for a specific content tag.
   *
   * Auth: Bearer token. Scope: caller's organisation. Request body accepts any combination of
   * name, description, or color (hex). Returns the updated tag. Errors: 400 on validation/duplicate
   * name, 404 when the tag is missing or inaccessible.
   */
  'update_content_tag_v1_tags_content__tag_id__put'(
    parameters?: Parameters<Paths.UpdateContentTagV1TagsContentTagIdPut.PathParameters> | null,
    data?: Paths.UpdateContentTagV1TagsContentTagIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateContentTagV1TagsContentTagIdPut.Responses.$200>
  /**
   * delete_content_tag_v1_tags_content__tag_id__delete - Delete Content Tag
   *
   * Soft delete a content tag after validating it is safe to remove.
   *
   * Auth: Bearer token. Scope: caller's organisation. Prevents deletion when the tag is still
   * referenced by any media/playlists/devices. Errors: 400 when in use; 404 when missing.
   */
  'delete_content_tag_v1_tags_content__tag_id__delete'(
    parameters?: Parameters<Paths.DeleteContentTagV1TagsContentTagIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteContentTagV1TagsContentTagIdDelete.Responses.$204>
  /**
   * get_content_tag_usage_v1_tags_content__tag_id__usage_get - Get Content Tag Usage
   *
   * Show where a content tag is used (media, playlists, devices).
   *
   * Auth: Bearer token. Scope: caller's organisation. Returns ids for media/playlists/devices
   * that reference the tag (empty lists when unused). Errors: 404 when tag not found.
   */
  'get_content_tag_usage_v1_tags_content__tag_id__usage_get'(
    parameters?: Parameters<Paths.GetContentTagUsageV1TagsContentTagIdUsageGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetContentTagUsageV1TagsContentTagIdUsageGet.Responses.$200>
  /**
   * list_time_tags_v1_tags_time_get - List Time Tags
   *
   * List non-deleted time tags with pagination and optional search on name.
   *
   * Auth: Bearer token. Returns items without windows plus pagination metadata.
   */
  'list_time_tags_v1_tags_time_get'(
    parameters?: Parameters<Paths.ListTimeTagsV1TagsTimeGet.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListTimeTagsV1TagsTimeGet.Responses.$200>
  /**
   * create_time_tag_v1_tags_time_post - Create Time Tag
   *
   * Create a time tag with one or more windows (local time, no timezone).
   *
   * Inputs:
   * - `windows[].days_of_week`: list of days 0=Monday ... 6=Sunday (player local week-day).
   * - `windows[].start_time` / `end_time`: minute precision only (`HH:MM`, no seconds/millis).
   *
   * Auth: Bearer token. Validates unique name and ensures per-day windows do not overlap.
   * Errors: 400 on name conflict or window overlap.
   */
  'create_time_tag_v1_tags_time_post'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateTimeTagV1TagsTimePost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateTimeTagV1TagsTimePost.Responses.$201>
  /**
   * get_time_tag_detail_v1_tags_time__tag_id__get - Get Time Tag Detail
   *
   * Return full details for a time tag including its windows.
   *
   * Auth: Bearer token. 404 when missing or soft-deleted.
   */
  'get_time_tag_detail_v1_tags_time__tag_id__get'(
    parameters?: Parameters<Paths.GetTimeTagDetailV1TagsTimeTagIdGet.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetTimeTagDetailV1TagsTimeTagIdGet.Responses.$200>
  /**
   * update_time_tag_v1_tags_time__tag_id__put - Update Time Tag
   *
   * Update a time tag; windows are fully replaced when provided.
   *
   * Inputs:
   * - `windows[].days_of_week`: list of days 0=Monday ... 6=Sunday (player local week-day).
   * - `windows[].start_time` / `end_time`: minute precision only (`HH:MM`, no seconds/millis).
   *
   * Auth: Bearer token. Partial updates for name/description/is_active. When `windows`
   * is supplied, existing windows are deleted and replaced (validated for overlap and minute precision).
   * Errors: 404 when tag missing; 400 on name conflict or overlap.
   */
  'update_time_tag_v1_tags_time__tag_id__put'(
    parameters?: Parameters<Paths.UpdateTimeTagV1TagsTimeTagIdPut.PathParameters> | null,
    data?: Paths.UpdateTimeTagV1TagsTimeTagIdPut.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateTimeTagV1TagsTimeTagIdPut.Responses.$200>
  /**
   * delete_time_tag_v1_tags_time__tag_id__delete - Delete Time Tag
   *
   * Soft delete a time tag (sets deleted_at). Windows remain for audit.
   *
   * Auth: Bearer token. 404 when missing or already deleted.
   */
  'delete_time_tag_v1_tags_time__tag_id__delete'(
    parameters?: Parameters<Paths.DeleteTimeTagV1TagsTimeTagIdDelete.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteTimeTagV1TagsTimeTagIdDelete.Responses.$204>
}

export interface PathsDictionary {
  ['/v1/user/me']: {
    /**
     * get_current_user_profile_v1_user_me_get - Get Current User Profile
     *
     * Fetch the current user's profile including organisation info.
     *
     * Auth: Bearer token. Returns user id/email/username/full_name and the user's
     * organisation summary (id/name/parent_id) when available. 404 if the user
     * cannot be resolved (inactive or missing in legacy DB).
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCurrentUserProfileV1UserMeGet.Responses.$200>
  }
  ['/v1/user/organisations']: {
    /**
     * list_user_organisations_v1_user_organisations_get - List User Organisations
     *
     * List the caller's organisation and all descendant organisations.
     *
     * Auth: Bearer token. Uses the caller's org_id to return a flat list of orgs
     * within their visibility scope (self + children). Returns 404 if the user
     * does not have an organisation assigned.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListUserOrganisationsV1UserOrganisationsGet.Responses.$200>
  }
  ['/v1/auth/login']: {
    /**
     * login_endpoint_v1_auth_login_post - Authenticate a user and issue an access token
     *
     * Handle local username/password authentication.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoginEndpointV1AuthLoginPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.LoginEndpointV1AuthLoginPost.Responses.$200>
  }
  ['/v1/auth/cognito/callback']: {
    /**
     * cognito_callback_v1_auth_cognito_callback_get - OAuth callback: exchange code for a local JWT
     *
     * Exchange the Cognito authorization code for an ID token and issue our JWT.
     */
    'get'(
      parameters?: Parameters<Paths.CognitoCallbackV1AuthCognitoCallbackGet.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CognitoCallbackV1AuthCognitoCallbackGet.Responses.$200>
  }
  ['/v1/auth/cognito/bind']: {
    /**
     * cognito_bind_v1_auth_cognito_bind_post - Bind Cognito identity to the currently authenticated user
     *
     * Bind an authorization code to the logged-in legacy user.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CognitoBindV1AuthCognitoBindPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CognitoBindV1AuthCognitoBindPost.Responses.$204>
  }
  ['/v1/media/']: {
    /**
     * list_media_v1_media__get - List media items with pagination and filters
     *
     * List media the caller owns, with rich filters and pagination.
     *
     * Auth: Bearer token; results are scoped to the current user's uploads (owner_user_id)
     * and, when available, their organisation. Inputs: optional `q` fuzzy-matches name/description,
     * `media_type` filters image/video/html/zip/other, `tag_ids` uses AND semantics (must contain all),
     * `include_deleted` toggles soft-deleted items, `page`/`size` drive pagination. Hierarchy: omitting
     * `folder_id` intentionally returns only root-level media (folder_id IS NULL); provide a folder_id
     * to list items inside that folder. Org scope: results are filtered to the caller's organisation
     * and all its descendant orgs; when organisation_id is provided and within that scope, results are
     * further limited to that specific organisation. Response: items include tags, thumbnail URLs/keys,
     * timestamps, deletion marker, and a `total` count for pagination.
     */
    'get'(
      parameters?: Parameters<Paths.ListMediaV1MediaGet.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListMediaV1MediaGet.Responses.$200>
    /**
     * upload_media_endpoint_v1_media__post - Upload media to S3 (Unprocessed prefix)
     *
     * Upload a file to S3 under `Unprocessed/` and create an uploads row.
     *
     * Auth: Bearer token. Inputs: multipart `file` plus optional `folder_id` (validated against the
     * caller's organisation). Validation: filename required; SizeLimitedReader enforces 10 GiB cap;
     * upload_type inferred from MIME/extension. Side effects: writes to S3 at
     * `Unprocessed/YYYY/MM/DD/<upload_uuid>/<uuid>_<filename>`; inserts an `uploads` record with
     * status=pending, owner=user_id, optional folder_id for later media creation. Response: upload
     * metadata (ids, prefix/key, status/type, size, folder_id) for client-side status polling.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UploadMediaEndpointV1MediaPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UploadMediaEndpointV1MediaPost.Responses.$201>
  }
  ['/v1/media/uploads/{upload_id}']: {
    /**
     * get_upload_status_v1_media_uploads__upload_id__get - Check media upload status
     *
     * Check upload status (restricted to the current user's uploads).
     *
     * Auth: Bearer token. Input: upload_id path. Enforcement: rejects uploads not owned by the caller
     * (treated as 404). Returns current status, keys (original/processed/thumbnail), size/type,
     * folder_id, and media_id if Lambda processing has already created a media record.
     */
    'get'(
      parameters?: Parameters<Paths.GetUploadStatusV1MediaUploadsUploadIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetUploadStatusV1MediaUploadsUploadIdGet.Responses.$200>
  }
  ['/v1/media/notify']: {
    /**
     * notify_upload_result_v1_media_notify_post - Notify backend of upload processing result (Lambda callback)
     *
     * Handle Lambda callback: update upload status and create/refresh media on completion.
     *
     * Auth: UPLOAD_NOTIFY_TOKEN Bearer (no user token). Input: upload_id (required), status in
     * {processing, completed, failed}, optional processed_key, thumbnail_key, upload_type,
     * error_message. Behavior: validates status, updates uploads prefix/status/keys/type, and when
     * status=completed idempotently creates or refreshes the associated media row (keeping folder_id
     * from upload). Response: updated upload plus media_id when available; 404 if upload missing.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.NotifyUploadResultV1MediaNotifyPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.NotifyUploadResultV1MediaNotifyPost.Responses.$200>
  }
  ['/v1/media/folders']: {
    /**
     * list_folder_tree_v1_media_folders_get - List folder tree
     *
     * Get the folder tree visible to the current user.
     *
     * Auth: Bearer token. Scope: caller's organisation. Returns a tree of non-deleted folders with
     * children populated to support UI rendering; media items are not included here.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListFolderTreeV1MediaFoldersGet.Responses.$200>
    /**
     * create_media_folder_v1_media_folders_post - Create media folder
     *
     * Create a logical media folder (not tied to S3 prefixes).
     *
     * Auth: Bearer token. Input: name, optional parent_folder_id (must exist, not deleted, same org),
     * optional sort_order. Validation: rejects duplicate sibling names with 400; parent existence and
     * org ownership enforced. Side effects: inserts folder row; no S3 interaction. Response: created
     * folder node with hierarchy metadata (ids, parent, sort order, flags).
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateMediaFolderV1MediaFoldersPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateMediaFolderV1MediaFoldersPost.Responses.$200>
  }
  ['/v1/media/folders/{folder_id}/children']: {
    /**
     * list_folder_children_v1_media_folders__folder_id__children_get - List folder children
     *
     * List direct child folders under a parent.
     *
     * Auth: Bearer token. Input: parent folder_id. Scope: caller's organisation. Returns immediate
     * child folders only (no media items), excluding soft-deleted ones.
     */
    'get'(
      parameters?: Parameters<Paths.ListFolderChildrenV1MediaFoldersFolderIdChildrenGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListFolderChildrenV1MediaFoldersFolderIdChildrenGet.Responses.$200>
  }
  ['/v1/media/folders/{folder_id}']: {
    /**
     * update_folder_v1_media_folders__folder_id__put - Update folder (rename/move)
     *
     * Rename/move a folder or update its sort order.
     *
     * Auth: Bearer token. Input: name/parent_folder_id/sort_order. Validation: both current folder
     * and new parent must belong to caller's org; cycle detection prevents moving into descendants;
     * duplicate sibling names raise 400. Response: updated folder node.
     */
    'put'(
      parameters?: Parameters<Paths.UpdateFolderV1MediaFoldersFolderIdPut.PathParameters> | null,
      data?: Paths.UpdateFolderV1MediaFoldersFolderIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateFolderV1MediaFoldersFolderIdPut.Responses.$200>
    /**
     * delete_folder_v1_media_folders__folder_id__delete - Soft delete folder
     *
     * Soft delete an empty folder.
     *
     * Auth: Bearer token. Preconditions: folder must belong to caller's org and be empty (no active
     * child folders, no non-deleted media). Errors: 400 when not empty, 404 when missing/inaccessible.
     * Side effects: sets deleted_at only (no S3 actions). Response: 204 on success.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteFolderV1MediaFoldersFolderIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteFolderV1MediaFoldersFolderIdDelete.Responses.$204>
  }
  ['/v1/media/presets']: {
    /**
     * list_media_filter_presets_v1_media_presets_get - List media filter presets for the current user
     *
     * Return saved media filter presets scoped to the caller.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListMediaFilterPresetsV1MediaPresetsGet.Responses.$200>
    /**
     * create_media_filter_presets_v1_media_presets_post - Create a media filter preset
     *
     * Persist a filter preset for media list endpoints.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateMediaFilterPresetsV1MediaPresetsPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateMediaFilterPresetsV1MediaPresetsPost.Responses.$201>
    /**
     * delete_media_filter_presets_v1_media_presets_delete - Delete a media filter preset
     *
     * Delete a saved media filter preset owned by the caller.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteMediaFilterPresetsV1MediaPresetsDelete.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteMediaFilterPresetsV1MediaPresetsDelete.Responses.$204>
  }
  ['/v1/media/{media_id}']: {
    /**
     * get_media_detail_v1_media__media_id__get - Get media detail
     *
     * Get media detail including upload metadata and URLs.
     *
     * Auth: Bearer token. Scope: caller's ownership/organisation. Returns media fields plus upload
     * metadata (size/content_type/status), processed object key/URL, thumbnail key/URL, tags, and
     * folder info. Errors: 404 when missing or not accessible to caller.
     */
    'get'(
      parameters?: Parameters<Paths.GetMediaDetailV1MediaMediaIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetMediaDetailV1MediaMediaIdGet.Responses.$200>
    /**
     * delete_media_v1_media__media_id__delete - Soft delete media
     *
     * Soft delete a media item (S3 objects remain).
     *
     * Auth: Bearer token. Scope: owner/org. Marks deleted_at only; does not delete S3 objects or
     * related uploads. Errors: 404 when missing or inaccessible. Response: 204 on success.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteMediaV1MediaMediaIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteMediaV1MediaMediaIdDelete.Responses.$204>
    /**
     * update_media_v1_media__media_id__put - Update media
     *
     * Update media fields and tags, or restore a soft-deleted item.
     *
     * Auth: Bearer token. Scope: owner/org. Inputs: name, description, folder_id (move/unset),
     * tag_ids (full replacement), restore flag to clear deleted_at. Validation: folder must exist
     * within org; all tag_ids must exist and be active. Response: refreshed media detail; 404 when
     * missing or unauthorized; 400 on validation errors.
     */
    'put'(
      parameters?: Parameters<Paths.UpdateMediaV1MediaMediaIdPut.PathParameters> | null,
      data?: Paths.UpdateMediaV1MediaMediaIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateMediaV1MediaMediaIdPut.Responses.$200>
  }
  ['/v1/media/move']: {
    /**
     * move_media_batch_v1_media_move_post - Move multiple media into a folder
     *
     * Move multiple media items to a target folder in one request.
     *
     * Auth: Bearer token. Validates target folder is within caller's org scope and
     * that all provided media ids are accessible to the caller.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.MoveMediaBatchV1MediaMovePost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.MoveMediaBatchV1MediaMovePost.Responses.$204>
  }
  ['/v1/media/{media_id}/duplicate']: {
    /**
     * duplicate_media_v1_media__media_id__duplicate_post - Duplicate media (placeholder)
     *
     * Placeholder: create a copy of a media item (including upload linkage) and
     * optionally place it in another folder. Should accept destination folder and
     * return the new media id.
     */
    'post'(
      parameters?: Parameters<Paths.DuplicateMediaV1MediaMediaIdDuplicatePost.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DuplicateMediaV1MediaMediaIdDuplicatePost.Responses.$200>
  }
  ['/v1/media/{media_id}/usage']: {
    /**
     * get_media_usage_v1_media__media_id__usage_get - Get media usage (placeholder)
     *
     * Placeholder: list where a media item is referenced (playlists, schedules,
     * devices), for impact analysis before deletion.
     */
    'get'(
      parameters?: Parameters<Paths.GetMediaUsageV1MediaMediaIdUsageGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetMediaUsageV1MediaMediaIdUsageGet.Responses.$200>
  }
  ['/v1/media/{media_id}/publish']: {
    /**
     * publish_media_v1_media__media_id__publish_post - Publish media (placeholder)
     *
     * Placeholder: publish a media item to make it available for downstream
     * delivery/playback pipelines; expected to trigger packaging or cache invalidation.
     */
    'post'(
      parameters?: Parameters<Paths.PublishMediaV1MediaMediaIdPublishPost.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PublishMediaV1MediaMediaIdPublishPost.Responses.$200>
  }
  ['/v1/devices/presets']: {
    /**
     * list_device_filter_presets_v1_devices_presets_get - List device filter presets for the current user
     *
     * Return saved device filter presets scoped to the caller.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListDeviceFilterPresetsV1DevicesPresetsGet.Responses.$200>
    /**
     * create_device_filter_presets_v1_devices_presets_post - Create a device filter preset
     *
     * Persist a filter preset for device list endpoints.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateDeviceFilterPresetsV1DevicesPresetsPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDeviceFilterPresetsV1DevicesPresetsPost.Responses.$201>
    /**
     * delete_device_filter_presets_v1_devices_presets_delete - Delete a device filter preset
     *
     * Delete a saved device filter preset owned by the caller.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteDeviceFilterPresetsV1DevicesPresetsDelete.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDeviceFilterPresetsV1DevicesPresetsDelete.Responses.$204>
  }
  ['/v1/devices/']: {
    /**
     * list_devices_v1_devices__get - List Devices
     *
     * List all devices with pagination, search, status, organisation and tag filters.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListDevicesV1DevicesGet.Responses.$200>
    /**
     * create_device_v1_devices__post - Create Device
     *
     * Create a new device (name, organisation, licence, location, timezone, resolution, tags).
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDeviceV1DevicesPost.Responses.$200>
  }
  ['/v1/devices/{device_id}']: {
    /**
     * get_device_detail_v1_devices__device_id__get - Get Device Detail
     *
     * Get full details for a single device, including status, last heartbeat, location and bindings.
     */
    'get'(
      parameters?: Parameters<Paths.GetDeviceDetailV1DevicesDeviceIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDeviceDetailV1DevicesDeviceIdGet.Responses.$200>
    /**
     * update_device_v1_devices__device_id__put - Update Device
     *
     * Update an existing device’s metadata (name, location, tags, bindings, etc.).
     */
    'put'(
      parameters?: Parameters<Paths.UpdateDeviceV1DevicesDeviceIdPut.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDeviceV1DevicesDeviceIdPut.Responses.$200>
    /**
     * delete_device_v1_devices__device_id__delete - Delete Device
     *
     * Permanently delete a device.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteDeviceV1DevicesDeviceIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDeviceV1DevicesDeviceIdDelete.Responses.$200>
  }
  ['/v1/devices/{device_id}/reboot']: {
    /**
     * reboot_device_v1_devices__device_id__reboot_patch - Reboot Device
     *
     * Trigger a remote reboot for a single device.
     */
    'patch'(
      parameters?: Parameters<Paths.RebootDeviceV1DevicesDeviceIdRebootPatch.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RebootDeviceV1DevicesDeviceIdRebootPatch.Responses.$200>
  }
  ['/v1/devices/reboot']: {
    /**
     * bulk_reboot_devices_v1_devices_reboot_post - Bulk Reboot Devices
     *
     * Trigger a remote reboot for multiple devices in one request.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.BulkRebootDevicesV1DevicesRebootPost.Responses.$200>
  }
  ['/v1/devices/{device_id}/schedules']: {
    /**
     * get_device_schedules_v1_devices__device_id__schedules_get - Get Device Schedules
     *
     * Return all schedule instances affecting a device in a given date range.
     */
    'get'(
      parameters?: Parameters<Paths.GetDeviceSchedulesV1DevicesDeviceIdSchedulesGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDeviceSchedulesV1DevicesDeviceIdSchedulesGet.Responses.$200>
  }
  ['/v1/playlists/']: {
    /**
     * list_playlists_v1_playlists__get - List Playlists
     *
     * List playlists with pagination and optional tag filters.
     */
    'get'(
      parameters?: Parameters<Paths.ListPlaylistsV1PlaylistsGet.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListPlaylistsV1PlaylistsGet.Responses.$200>
    /**
     * create_playlist_v1_playlists__post - Create Playlist
     *
     * Create a playlist with optional initial items and tag associations.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreatePlaylistV1PlaylistsPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreatePlaylistV1PlaylistsPost.Responses.$201>
  }
  ['/v1/playlists/presets']: {
    /**
     * list_playlist_filter_presets_v1_playlists_presets_get - List playlist filter presets for the current user
     *
     * Return saved playlist filter presets scoped to the caller.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListPlaylistFilterPresetsV1PlaylistsPresetsGet.Responses.$200>
    /**
     * create_playlist_filter_presets_v1_playlists_presets_post - Create a playlist filter preset
     *
     * Persist a filter preset for playlist list endpoints.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreatePlaylistFilterPresetsV1PlaylistsPresetsPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreatePlaylistFilterPresetsV1PlaylistsPresetsPost.Responses.$201>
    /**
     * delete_playlist_filter_presets_v1_playlists_presets_delete - Delete a playlist filter preset
     *
     * Delete a saved playlist filter preset owned by the caller.
     */
    'delete'(
      parameters?: Parameters<Paths.DeletePlaylistFilterPresetsV1PlaylistsPresetsDelete.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeletePlaylistFilterPresetsV1PlaylistsPresetsDelete.Responses.$204>
  }
  ['/v1/playlists/{playlist_id}']: {
    /**
     * get_playlist_detail_v1_playlists__playlist_id__get - Get Playlist Detail
     *
     * Return full playlist detail including items and associated tags.
     */
    'get'(
      parameters?: Parameters<Paths.GetPlaylistDetailV1PlaylistsPlaylistIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetPlaylistDetailV1PlaylistsPlaylistIdGet.Responses.$200>
    /**
     * update_playlist_v1_playlists__playlist_id__put - Update Playlist
     *
     * Update playlist metadata and replace tag associations when provided.
     */
    'put'(
      parameters?: Parameters<Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.PathParameters> | null,
      data?: Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdatePlaylistV1PlaylistsPlaylistIdPut.Responses.$200>
    /**
     * delete_playlist_v1_playlists__playlist_id__delete - Delete Playlist
     *
     * Soft delete a playlist and its items.
     */
    'delete'(
      parameters?: Parameters<Paths.DeletePlaylistV1PlaylistsPlaylistIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeletePlaylistV1PlaylistsPlaylistIdDelete.Responses.$204>
  }
  ['/v1/playlists/{playlist_id}/media']: {
    /**
     * add_playlist_items_v1_playlists__playlist_id__media_post - Add Playlist Items
     *
     * Add one or more media items into a playlist with duration and tag rules.
     */
    'post'(
      parameters?: Parameters<Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.PathParameters> | null,
      data?: Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AddPlaylistItemsV1PlaylistsPlaylistIdMediaPost.Responses.$201>
  }
  ['/v1/playlists/{playlist_id}/media/{playlist_media_id}']: {
    /**
     * update_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__put - Update Playlist Item
     *
     * Update a single playlist item (duration/tags/active window).
     */
    'put'(
      parameters?: Parameters<Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.PathParameters> | null,
      data?: Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdatePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdPut.Responses.$200>
    /**
     * remove_playlist_item_v1_playlists__playlist_id__media__playlist_media_id__delete - Remove Playlist Item
     *
     * Remove (soft delete) a media item from a playlist.
     */
    'delete'(
      parameters?: Parameters<Paths.RemovePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemovePlaylistItemV1PlaylistsPlaylistIdMediaPlaylistMediaIdDelete.Responses.$204>
  }
  ['/v1/playlists/{playlist_id}/media/reorder']: {
    /**
     * reorder_playlist_items_v1_playlists__playlist_id__media_reorder_post - Reorder Playlist Items
     *
     * Rewrite playlist item ordering using the supplied item id list.
     */
    'post'(
      parameters?: Parameters<Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.PathParameters> | null,
      data?: Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReorderPlaylistItemsV1PlaylistsPlaylistIdMediaReorderPost.Responses.$204>
  }
  ['/v1/playlists/{playlist_id}/devices']: {
    /**
     * get_playlist_devices_v1_playlists__playlist_id__devices_get - Get Playlist Devices
     *
     * List all devices currently using this playlist.
     */
    'get'(
      parameters?: Parameters<Paths.GetPlaylistDevicesV1PlaylistsPlaylistIdDevicesGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ['/v1/playlists/{playlist_id}/schedules']: {
    /**
     * get_playlist_schedules_v1_playlists__playlist_id__schedules_get - Get Playlist Schedules
     *
     * Return all schedule instances where this playlist is scheduled.
     */
    'get'(
      parameters?: Parameters<Paths.GetPlaylistSchedulesV1PlaylistsPlaylistIdSchedulesGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ['/v1/playlists/{playlist_id}/publish']: {
    /**
     * publish_playlist_v1_playlists__playlist_id__publish_post - Publish Playlist
     *
     * Publish a playlist so changes are rolled out to devices and schedules.
     */
    'post'(
      parameters?: Parameters<Paths.PublishPlaylistV1PlaylistsPlaylistIdPublishPost.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ['/v1/schedules/']: {
    /**
     * list_schedules_v1_schedules__get - List Schedules
     *
     * List all schedules with pagination, search, organisation and target filters.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListSchedulesV1SchedulesGet.Responses.$200>
  }
  ['/v1/schedules/{schedule_id}']: {
    /**
     * get_schedule_detail_v1_schedules__schedule_id__get - Get Schedule Detail
     *
     * Get full details for a schedule, including targets, date range and time rules.
     */
    'get'(
      parameters?: Parameters<Paths.GetScheduleDetailV1SchedulesScheduleIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetScheduleDetailV1SchedulesScheduleIdGet.Responses.$200>
  }
  ['/v1/schedules/{schedule_id}/occurrences']: {
    /**
     * get_schedule_occurrences_v1_schedules__schedule_id__occurrences_get - Get Schedule Occurrences
     *
     * Expand a schedule into concrete occurrences over a date range for calendars.
     */
    'get'(
      parameters?: Parameters<Paths.GetScheduleOccurrencesV1SchedulesScheduleIdOccurrencesGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetScheduleOccurrencesV1SchedulesScheduleIdOccurrencesGet.Responses.$200>
  }
  ['/v1/apps/']: {
    /**
     * list_apps_v1_apps__get - List Apps
     *
     * List all available apps with search, category and organisation filters.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListAppsV1AppsGet.Responses.$200>
  }
  ['/v1/apps/{app_id}']: {
    /**
     * get_app_detail_v1_apps__app_id__get - Get App Detail
     *
     * Get details of a specific app (description, version, permissions, config schema).
     */
    'get'(
      parameters?: Parameters<Paths.GetAppDetailV1AppsAppIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetAppDetailV1AppsAppIdGet.Responses.$200>
  }
  ['/v1/apps/installed']: {
    /**
     * list_installed_apps_v1_apps_installed_get - List Installed Apps
     *
     * List apps that are installed for a given organisation or device.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListInstalledAppsV1AppsInstalledGet.Responses.$200>
  }
  ['/v1/apps/{app_id}/install']: {
    /**
     * install_app_v1_apps__app_id__install_post - Install App
     *
     * Install an app for an organisation and/or a set of devices with initial config.
     */
    'post'(
      parameters?: Parameters<Paths.InstallAppV1AppsAppIdInstallPost.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.InstallAppV1AppsAppIdInstallPost.Responses.$200>
    /**
     * uninstall_app_v1_apps__app_id__install_delete - Uninstall App
     *
     * Uninstall an app from an organisation or from specific devices.
     */
    'delete'(
      parameters?: Parameters<Paths.UninstallAppV1AppsAppIdInstallDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UninstallAppV1AppsAppIdInstallDelete.Responses.$200>
  }
  ['/v1/tags/content']: {
    /**
     * list_content_tags_v1_tags_content_get - List Content Tags
     *
     * List content tags visible to the current user, with optional search and pagination.
     *
     * Requires Bearer auth. Filters by the caller's organisation (or global tags if supported).
     * Accepts optional `q` (substring search on name), `page`, and `page_size` (capped at 100).
     */
    'get'(
      parameters?: Parameters<Paths.ListContentTagsV1TagsContentGet.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListContentTagsV1TagsContentGet.Responses.$200>
    /**
     * create_content_tag_v1_tags_content_post - Create Content Tag
     *
     * Create a content tag.
     *
     * Requires Bearer auth; organisation defaults to the caller. Accepts name (required),
     * optional description, and optional hex color (#RRGGBB). Validates color format and
     * enforces unique name within the same organisation (400 on conflict). Returns the created tag.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateContentTagV1TagsContentPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateContentTagV1TagsContentPost.Responses.$201>
  }
  ['/v1/tags/content/{tag_id}']: {
    /**
     * get_content_tag_detail_v1_tags_content__tag_id__get - Get Content Tag Detail
     *
     * Return full details for a content tag including type and usage counts.
     *
     * Auth: Bearer token. Scope: caller's organisation. Response includes tag type (content),
     * metadata, and aggregated usage counts across media/playlists/devices. Errors: 404 when the
     * tag is missing or belongs to another organisation.
     */
    'get'(
      parameters?: Parameters<Paths.GetContentTagDetailV1TagsContentTagIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetContentTagDetailV1TagsContentTagIdGet.Responses.$200>
    /**
     * update_content_tag_v1_tags_content__tag_id__put - Update Content Tag
     *
     * Update tag name/notes/color for a specific content tag.
     *
     * Auth: Bearer token. Scope: caller's organisation. Request body accepts any combination of
     * name, description, or color (hex). Returns the updated tag. Errors: 400 on validation/duplicate
     * name, 404 when the tag is missing or inaccessible.
     */
    'put'(
      parameters?: Parameters<Paths.UpdateContentTagV1TagsContentTagIdPut.PathParameters> | null,
      data?: Paths.UpdateContentTagV1TagsContentTagIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateContentTagV1TagsContentTagIdPut.Responses.$200>
    /**
     * delete_content_tag_v1_tags_content__tag_id__delete - Delete Content Tag
     *
     * Soft delete a content tag after validating it is safe to remove.
     *
     * Auth: Bearer token. Scope: caller's organisation. Prevents deletion when the tag is still
     * referenced by any media/playlists/devices. Errors: 400 when in use; 404 when missing.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteContentTagV1TagsContentTagIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteContentTagV1TagsContentTagIdDelete.Responses.$204>
  }
  ['/v1/tags/content/{tag_id}/usage']: {
    /**
     * get_content_tag_usage_v1_tags_content__tag_id__usage_get - Get Content Tag Usage
     *
     * Show where a content tag is used (media, playlists, devices).
     *
     * Auth: Bearer token. Scope: caller's organisation. Returns ids for media/playlists/devices
     * that reference the tag (empty lists when unused). Errors: 404 when tag not found.
     */
    'get'(
      parameters?: Parameters<Paths.GetContentTagUsageV1TagsContentTagIdUsageGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetContentTagUsageV1TagsContentTagIdUsageGet.Responses.$200>
  }
  ['/v1/tags/time']: {
    /**
     * list_time_tags_v1_tags_time_get - List Time Tags
     *
     * List non-deleted time tags with pagination and optional search on name.
     *
     * Auth: Bearer token. Returns items without windows plus pagination metadata.
     */
    'get'(
      parameters?: Parameters<Paths.ListTimeTagsV1TagsTimeGet.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListTimeTagsV1TagsTimeGet.Responses.$200>
    /**
     * create_time_tag_v1_tags_time_post - Create Time Tag
     *
     * Create a time tag with one or more windows (local time, no timezone).
     *
     * Inputs:
     * - `windows[].days_of_week`: list of days 0=Monday ... 6=Sunday (player local week-day).
     * - `windows[].start_time` / `end_time`: minute precision only (`HH:MM`, no seconds/millis).
     *
     * Auth: Bearer token. Validates unique name and ensures per-day windows do not overlap.
     * Errors: 400 on name conflict or window overlap.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateTimeTagV1TagsTimePost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateTimeTagV1TagsTimePost.Responses.$201>
  }
  ['/v1/tags/time/{tag_id}']: {
    /**
     * get_time_tag_detail_v1_tags_time__tag_id__get - Get Time Tag Detail
     *
     * Return full details for a time tag including its windows.
     *
     * Auth: Bearer token. 404 when missing or soft-deleted.
     */
    'get'(
      parameters?: Parameters<Paths.GetTimeTagDetailV1TagsTimeTagIdGet.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetTimeTagDetailV1TagsTimeTagIdGet.Responses.$200>
    /**
     * update_time_tag_v1_tags_time__tag_id__put - Update Time Tag
     *
     * Update a time tag; windows are fully replaced when provided.
     *
     * Inputs:
     * - `windows[].days_of_week`: list of days 0=Monday ... 6=Sunday (player local week-day).
     * - `windows[].start_time` / `end_time`: minute precision only (`HH:MM`, no seconds/millis).
     *
     * Auth: Bearer token. Partial updates for name/description/is_active. When `windows`
     * is supplied, existing windows are deleted and replaced (validated for overlap and minute precision).
     * Errors: 404 when tag missing; 400 on name conflict or overlap.
     */
    'put'(
      parameters?: Parameters<Paths.UpdateTimeTagV1TagsTimeTagIdPut.PathParameters> | null,
      data?: Paths.UpdateTimeTagV1TagsTimeTagIdPut.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateTimeTagV1TagsTimeTagIdPut.Responses.$200>
    /**
     * delete_time_tag_v1_tags_time__tag_id__delete - Delete Time Tag
     *
     * Soft delete a time tag (sets deleted_at). Windows remain for audit.
     *
     * Auth: Bearer token. 404 when missing or already deleted.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteTimeTagV1TagsTimeTagIdDelete.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteTimeTagV1TagsTimeTagIdDelete.Responses.$204>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

export type Body_upload_media_endpoint_v1_media__post = Components.Schemas.BodyUploadMediaEndpointV1MediaPost
export type CognitoBindRequest = Components.Schemas.CognitoBindRequest
export type ContentTagBrief = Components.Schemas.ContentTagBrief
export type FilterPresetCreateRequest = Components.Schemas.FilterPresetCreateRequest
export type FilterPresetListResponse = Components.Schemas.FilterPresetListResponse
export type FilterPresetResponse = Components.Schemas.FilterPresetResponse
export type FolderCreateRequest = Components.Schemas.FolderCreateRequest
export type FolderNode = Components.Schemas.FolderNode
export type FolderTreeResponse = Components.Schemas.FolderTreeResponse
export type FolderUpdateRequest = Components.Schemas.FolderUpdateRequest
export type HTTPValidationError = Components.Schemas.HTTPValidationError
export type LoginRequest = Components.Schemas.LoginRequest
export type LoginResponse = Components.Schemas.LoginResponse
export type MediaBrief = Components.Schemas.MediaBrief
export type MediaDetail = Components.Schemas.MediaDetail
export type MediaItem = Components.Schemas.MediaItem
export type MediaListResponse = Components.Schemas.MediaListResponse
export type MediaMoveRequest = Components.Schemas.MediaMoveRequest
export type MediaUpdateRequest = Components.Schemas.MediaUpdateRequest
export type MediaUploadResponse = Components.Schemas.MediaUploadResponse
export type OrganisationProfile = Components.Schemas.OrganisationProfile
export type PlaylistCreate = Components.Schemas.PlaylistCreate
export type PlaylistDetail = Components.Schemas.PlaylistDetail
export type PlaylistItemCreateInPlaylist = Components.Schemas.PlaylistItemCreateInPlaylist
export type PlaylistItemRead = Components.Schemas.PlaylistItemRead
export type PlaylistItemUpdate = Components.Schemas.PlaylistItemUpdate
export type PlaylistItemsReorderRequest = Components.Schemas.PlaylistItemsReorderRequest
export type PlaylistListItem = Components.Schemas.PlaylistListItem
export type PlaylistListResponse = Components.Schemas.PlaylistListResponse
export type PlaylistUpdate = Components.Schemas.PlaylistUpdate
export type TagCreateRequest = Components.Schemas.TagCreateRequest
export type TagDetailResponse = Components.Schemas.TagDetailResponse
export type TagListResponse = Components.Schemas.TagListResponse
export type TagResponse = Components.Schemas.TagResponse
export type TagSummary = Components.Schemas.TagSummary
export type TagUpdateRequest = Components.Schemas.TagUpdateRequest
export type TagUsageCounts = Components.Schemas.TagUsageCounts
export type TagUsageResponse = Components.Schemas.TagUsageResponse
export type TimeTagBrief = Components.Schemas.TimeTagBrief
export type TimeTagCreate = Components.Schemas.TimeTagCreate
export type TimeTagListResponse = Components.Schemas.TimeTagListResponse
export type TimeTagRead = Components.Schemas.TimeTagRead
export type TimeTagUpdate = Components.Schemas.TimeTagUpdate
export type TimeTagWindowCreate = Components.Schemas.TimeTagWindowCreate
export type TimeTagWindowRead = Components.Schemas.TimeTagWindowRead
export type UploadNotifyRequest = Components.Schemas.UploadNotifyRequest
export type UserProfile = Components.Schemas.UserProfile
export type UserSummary = Components.Schemas.UserSummary
export type ValidationError = Components.Schemas.ValidationError
