import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <div className="bg-primary/20 absolute -right-4 -top-4 size-24 animate-pulse rounded-full blur-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="dark:text-textDarkMode text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="hover:bg-primaryHighlight group relative mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all"
        >
          <span>Return Home</span>
          <svg
            className="size-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
