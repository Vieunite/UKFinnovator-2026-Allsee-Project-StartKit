import { FolderIcon, HomeIcon, PlayIcon, Squares2X2Icon, TagIcon, TvIcon } from '@heroicons/react/24/outline'

export interface Route {
  name: string
  path: string
  parentName?: string
  icon?: any
  subRoutes?: Route[]
}

export const routes: Route[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: HomeIcon,
  },
  {
    name: 'Devices',
    path: '/devices',
    icon: TvIcon,
  },
  {
    name: 'Media',
    path: '/media',
    icon: FolderIcon,
  },
  {
    name: 'Playlists',
    path: '/playlists',
    icon: PlayIcon,
  },
  // {
  //   name: 'Layout',
  //   path: '/layout',
  //   icon: Square2StackIcon,
  // },
  {
    name: 'Tag Manager',
    path: '/tag-manager',
    icon: TagIcon,
  },
  {
    name: 'Apps',
    path: '/apps',
    icon: Squares2X2Icon,
  },
]
