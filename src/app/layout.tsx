import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Open_Sans, Poppins } from 'next/font/google'
import type React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { ApplicationLayout } from './application-layout'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s - CMS',
    default: 'CMS',
  },
  description: 'CMS System',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${openSans.variable} text-zinc-950 antialiased dark:bg-zinc-900 dark:text-textDarkMode lg:bg-zinc-100 dark:lg:bg-zinc-950`}
    >
      <head>
        {/* Blocking script to set theme before any rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
                  const theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
                  const root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <ApplicationLayout>{children}</ApplicationLayout>
      </body>
    </html>
  )
}
