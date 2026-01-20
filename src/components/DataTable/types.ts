export type DataTypes =
  | 'text'
  | 'status'
  | 'date'
  | 'number'
  | 'duration'
  | 'tags'
  | 'media_type'
  | 'thumbnail'
  | 'licence'
  | 'now_playing'
  | 'entity'
  | 'active_between'
  | 'tag_type'
  | 'tag_name'

export type ColumnOptions = {
  after?: string
  before?: string
  onClick?: (item: any) => void
}

export type Column = {
  field: string
  type: DataTypes
  visible: boolean
  hideHeader?: boolean
  disableFilter?: boolean
  filterOptions?: string[]
  options?: ColumnOptions
}

export type SortField = string
export type SortDirection = 'asc' | 'desc'

// Entity filter value structure - each value has its own type (id or name)
export type EntityFilterValue = {
  type: 'id' | 'name'
  value: string
}

export type FilterField = string | 'search'

export type FilterValue = string | string[] | EntityFilterValue[]

export interface FilterState {
  field: FilterField
  value: FilterValue
  type: DataTypes
  exact?: boolean
}

export interface SortState {
  field: SortField | null
  direction: SortDirection
}

export interface QuickFilters {
  id?: string
  title: string
  filters: FilterState[]
  sortState?: SortState
}
