import { routes } from '@/app/routes'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface RenderNavigationProps {
  menuOpen: Record<string, boolean>
  setMenuOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

const RenderNavigation = ({ menuOpen, setMenuOpen }: RenderNavigationProps) => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-2">
      {routes.map((route) => {
        const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0
        const isActive =
          menuOpen[route.path] ||
          (hasSubRoutes ? pathname.startsWith(route.path) && menuOpen[route.path] !== false : pathname === route.path)
        const isParentActive = pathname === route.path

        if (hasSubRoutes) {
          return (
            <div
              key={route.path}
              className={`${isActive ? 'bg-[#F5F6FA] dark:bg-[#2A2E35]' : 'dark:text-textDarkMode text-textLightMode'}`}
            >
              <button
                className={`flex w-full items-center justify-between gap-2 px-5 py-2 hover:bg-[#F5F6FA] dark:hover:bg-[#2A2E35] ${isActive ? 'text-primary' : 'dark:text-textDarkMode text-textLightMode'}`}
                onClick={() => setMenuOpen({ ...menuOpen, [route.path]: !isActive })}
              >
                <span className="flex items-center gap-3">
                  {route.icon && <route.icon className="h-5 w-5 stroke-[2]" />}
                  <span className="text-start text-base">{route.name}</span>
                </span>
                <span>
                  {isActive ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <button
                  onClick={() => router.push(route.path)}
                  className={`flex items-center gap-3 px-5 py-2 hover:bg-[#E8EBF0] dark:hover:bg-[#1F2329] ${isParentActive ? 'bg-[#E8EBF0] text-primary dark:bg-[#1F2329]' : 'dark:text-textDarkMode text-textLightMode'}`}
                >
                  {route.icon && <route.icon className="h-5 w-5 stroke-[2]" />}
                  <span className="text-start text-base">{route.parentName || route.name}</span>
                </button>
                {route.subRoutes?.map((subRoute) => {
                  const isSubRouteActive = pathname === subRoute.path

                  return (
                    <button
                      key={subRoute.path}
                      onClick={() => router.push(subRoute.path)}
                      className={`flex items-center gap-3 px-5 py-2 hover:bg-[#E8EBF0] dark:hover:bg-[#1F2329] ${isSubRouteActive ? 'bg-[#E8EBF0] text-primary dark:bg-[#1F2329]' : 'dark:text-textDarkMode text-textLightMode'}`}
                    >
                      {subRoute.icon && <subRoute.icon className="h-5 w-5 stroke-[2]" />}
                      <span className="text-start text-base">{subRoute.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }
        return (
          <button
            key={route.path}
            onClick={() => router.push(route.path)}
            className={`flex items-center gap-3 px-5 py-2 hover:bg-[#F5F6FA] dark:hover:bg-[#2A2E35] ${isActive ? 'bg-[#F5F6FA] text-primary dark:bg-[#2A2E35]' : 'dark:text-textDarkMode text-textLightMode'}`}
          >
            {route.icon && <route.icon className="h-5 w-5 stroke-[2]" />}
            <span className="text-start text-base">{route.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RenderNavigation
