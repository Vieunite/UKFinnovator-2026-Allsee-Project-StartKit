'use client'

import OrganisationDropdown from '@/components/Dashboard/OrganisationDropdown'
import { DataTableProvider } from '@/components/DataTable/DataTableContext'
import Header from '@/components/Header'
import { Sidebar, SidebarBody, SidebarFooter } from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import ThemeToggler from '@/components/theme/ThemeToggler'
import { UploadProgressSidebar } from '@/components/UploadProgressSidebar'
import { AlertProvider } from '@/context/AlertContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ConfirmProvider } from '@/context/ConfirmContext'
import { GeneralProvider } from '@/context/GeneralContext'
import { HeaderProvider } from '@/context/HeaderContext'
import { OrganisationLogo, OrganisationProvider, useOrganisation } from '@/context/OrganisationContext'
import { authPages } from '@/data'
import { QueryProvider } from '@/providers/QueryProvider'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ApplicationContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading } = useOrganisation()
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({})

  const isAuthPage = authPages.includes(pathname)

  // Redirect to login if not authenticated and not on auth page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isAuthPage, isLoading, pathname, router])

  // Show full-screen loader while loading organisation
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent text-textLightMode dark:text-textDarkMode"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <SidebarLayout
          sidebar={
            <Sidebar className="flex h-full flex-col">
              <OrganisationLogo />
              <SidebarBody className="flex-1 overflow-y-auto lg:!px-8">
                <div className="mb-6">
                  <OrganisationDropdown />
                </div>
              </SidebarBody>
              <SidebarFooter className="flex flex-shrink-0 flex-col !p-0">
                <UploadProgressSidebar />
                <div className="p-4">
                  <ThemeToggler />
                </div>
                <button
                  className="flex w-full items-center justify-center gap-2 bg-primary p-4 text-white transition-all duration-200 hover:brightness-110"
                  onClick={() => router.push('/support')}
                >
                  <QuestionMarkCircleIcon className="h-6 w-6 stroke-[2]" />
                  <p>Support</p>
                </button>
              </SidebarFooter>
            </Sidebar>
          }
        >
          <Header />
          {children}
        </SidebarLayout>
      )}
    </>
  )
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <GeneralProvider>
          <OrganisationProvider>
            <DataTableProvider>
              <HeaderProvider>
                <ConfirmProvider>
                  <AlertProvider>
                    <ApplicationContent>{children}</ApplicationContent>
                  </AlertProvider>
                </ConfirmProvider>
              </HeaderProvider>
            </DataTableProvider>
          </OrganisationProvider>
        </GeneralProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
