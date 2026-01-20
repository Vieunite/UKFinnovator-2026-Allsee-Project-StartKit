'use client'

import { useGeneral } from '@/context/GeneralContext'
import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import React from 'react'
import { NavbarItem } from './navbar'

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{
  open: boolean
  close: () => void
}>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 h-screen w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-dashboard-sidebar-light shadow-sm ring-1 ring-zinc-950/5 dark:bg-dashboard-sidebar-dark dark:ring-white/10">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation" id="mobile-nav-close">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  )
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
  className,
  ...props
}: React.PropsWithChildren<{
  navbar?: React.ReactNode
  sidebar: React.ReactNode
  className?: string
}>) {
  const { showMobileSidebar, setShowMobileSidebar } = useGeneral()
  const pathname = usePathname()

  // Paths that should have min-h-0 applied
  // - If path ends with '/', it matches paths that start with it (e.g., '/playlists/' matches '/playlists/123')
  // - If path doesn't end with '/', it matches exact or paths that start with it + '/' (e.g., '/playlists' matches '/playlists' or '/playlists/123')
  const pathsWithMinHeight = ['/playlists/']

  // Check if current pathname matches any path in the array (exact or starts with)
  const shouldApplyMinHeight =
    pathname &&
    pathsWithMinHeight.some((path) => {
      if (pathname === path) return true // Exact match
      if (path.endsWith('/')) {
        return pathname.startsWith(path) // Paths ending with '/' match anything that starts with it
      }
      return pathname.startsWith(path + '/') // Paths without '/' match anything that starts with path + '/'
    })

  return (
    <div
      className={clsx(
        'relative isolate flex h-screen w-full',
        'max-lg:flex-col',
        'bg-dashboard-bg-light dark:bg-dashboard-bg-dark',
        className
      )}
      {...props}
    >
      <header className="flex w-[100vw] flex-shrink-0 items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem onClick={() => setShowMobileSidebar(true)} aria-label="Open navigation">
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0">{navbar}</div>
      </header>

      {/* Desktop Sidebar - Fixed 250px width */}
      <div className="fixed left-0 top-0 z-10 hidden h-screen w-[250px] flex-col bg-dashboard-sidebar-light shadow-lg lg:flex dark:bg-dashboard-sidebar-dark">
        {sidebar}
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={showMobileSidebar ?? false} close={() => setShowMobileSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Main Content Area */}
      <div className={clsx('flex min-w-0 flex-1 flex-col lg:ml-[250px]', shouldApplyMinHeight && 'min-h-0')}>
        {/* Main Content */}
        <main className="text-textLightMode dark:text-textDarkMode relative flex min-h-0 flex-1 flex-col overflow-auto bg-dashboard-bg-light p-4 pb-2 pt-2 lg:px-8 lg:pb-8 lg:pt-8 dark:bg-dashboard-bg-dark">
          {children}
        </main>
      </div>
    </div>
  )
}
