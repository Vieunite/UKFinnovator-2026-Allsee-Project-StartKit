'use client'

import { useHeader } from '@/context/HeaderContext'
import { formatTitleString } from '@/utility/utility'
import { usePathname } from 'next/navigation'
import AccountMenuButton from './Dashboard/AccountMenuButton'

const Header = () => {
  const pathname = usePathname()
  const { customHeader } = useHeader()

  return (
    <div className="mb-6 flex flex-wrap-reverse items-end justify-between gap-4 text-textLightMode dark:text-textDarkMode lg:mb-10 lg:gap-6">
      {customHeader ? (
        <div className="flex-1">{customHeader}</div>
      ) : (
        <h1 className="text-xl font-medium lg:self-center">
          {pathname === '/' ? 'Devices' : formatTitleString(pathname.split('/').pop() ?? '').replaceAll('-', ' ')}
        </h1>
      )}
      <div className="relative flex items-center">
        <div className="flex items-center gap-1">
          <button
            title="Push Changes"
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-all duration-200 hover:brightness-110 disabled:opacity-50"
          >
            Push Changes
          </button>
        </div>
        <div className="mx-2.5 h-8 w-[1px] bg-black dark:bg-white" />
        <AccountMenuButton />
      </div>
    </div>
  )
}

export default Header
