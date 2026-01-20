import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface QuickAccessItem {
  title: string
  icon: React.ElementType
  href: string
}

const quickAccessItems: QuickAccessItem[] = [
  {
    title: 'Proof of Play',
    icon: CheckBadgeIcon,
    href: '#',
  },
  {
    title: 'Reboot Screens',
    icon: Cog6ToothIcon,
    href: '#',
  },
  {
    title: 'User Logs',
    icon: DocumentTextIcon,
    href: '#',
  },
  {
    title: 'Evening Playlist',
    icon: PlayCircleIcon,
    href: '#',
  },
  {
    title: 'Afternoon Playlists',
    icon: PlayCircleIcon,
    href: '#',
  },
  {
    title: 'Touch Logs',
    icon: DocumentTextIcon,
    href: '#',
  },
]

const QuickAccess = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="dark:text-textDarkMode text-textLightMode flex flex-shrink-0 flex-col rounded-lg bg-white p-3 shadow-md lg:p-2 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2 font-medium">
        <h3 className="text-sm lg:text-base">Quick Access</h3>
        <button className="transition-bg rounded-md p-1 duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <EllipsisVerticalIcon className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
      </div>
      {loading ? (
        <div className="h-[250px]">
          <div className="flex h-1/2 flex-1 items-center justify-center">
            <div className="h-7 w-7 animate-spin self-end rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
          {quickAccessItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
              className="hover:bg-primary/10 flex items-center justify-center gap-2 rounded-lg border px-2 py-4 transition-all duration-200 hover:border-primary hover:text-primary sm:py-6 lg:py-8 dark:border-gray-700"
            >
              <item.icon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
              <span className="text-center text-xs font-light lg:text-sm">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickAccess
