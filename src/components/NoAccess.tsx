import { ArrowLeftIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import OutlinedWhiteButton from './OutlinedWhiteButton'

const NoAccess = () => {
  const router = useRouter()

  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <ShieldExclamationIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="dark:text-textDarkMode mb-3 text-2xl font-bold text-gray-900">Access Denied</h1>

        <p className="mb-8 text-gray-600 dark:text-gray-300">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is
          an error.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <OutlinedWhiteButton
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-lg !text-sm !font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </OutlinedWhiteButton>

          <button
            onClick={() => router.push('/')}
            className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Need help? Contact your system administrator or check your user permissions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoAccess
