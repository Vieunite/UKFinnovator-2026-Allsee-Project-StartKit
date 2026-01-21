import { clearAuthData } from '@/api'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { useAuth } from '@/context/AuthContext'
import { ArrowRightEndOnRectangleIcon, ChevronDownIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const AccountMenuButton = () => {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      // Use AuthContext logout which handles API call and clearing user
      await logout()

      // Clear all auth data (cookies, localStorage, sessionStorage)
      clearAuthData()

      // Redirect to login page
      router.push('/login')
      router.refresh() // Refresh to update middleware/auth state
    } catch (error) {
      console.error('Sign out error:', error)
      // Even if API call fails, clear local data and redirect
      clearAuthData()
      router.push('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSettings = () => {
    // Add your settings navigation logic here
  }

  return (
    <Dropdown>
      <DropdownButton
        as="div"
        className="transition-bg flex cursor-pointer items-center rounded-lg px-1 py-2 duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <UserIcon className="h-5 w-5 stroke-[2]" />
        <ChevronDownIcon className="h-4 w-4 stroke-[2.5]" />
      </DropdownButton>

      <DropdownMenu className="w-48">
        <DropdownItem onClick={handleSettings}>
          <Cog6ToothIcon data-slot="icon" />
          <span>Settings</span>
        </DropdownItem>

        <DropdownItem onClick={handleSignOut} disabled={isSigningOut}>
          <ArrowRightEndOnRectangleIcon data-slot="icon" />
          <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default AccountMenuButton
