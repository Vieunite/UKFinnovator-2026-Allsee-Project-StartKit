import clsx from 'clsx'
import { Link } from './link'

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="text"
      {...props}
      className={clsx(className, 'text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400')}
    />
  )
}

export function TextLink({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        'dark:text-textDarkMode text-zinc-950 underline decoration-zinc-950/50 data-[hover]:decoration-zinc-950 dark:decoration-white/50 dark:data-[hover]:decoration-white'
      )}
    />
  )
}

export function Strong({ className, ...props }: React.ComponentPropsWithoutRef<'strong'>) {
  return <strong {...props} className={clsx(className, 'dark:text-textDarkMode font-medium text-zinc-950')} />
}

export function Code({ className, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        'dark:text-textDarkMode rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5'
      )}
    />
  )
}

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
} & React.ComponentPropsWithoutRef<'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

export function Heading({ className, as: Element = 'h2', dark = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'text-pretty text-4xl font-medium tracking-tighter text-gray-950 data-[dark]:text-white sm:text-6xl'
      )}
    />
  )
}

export function Subheading({ className, as: Element = 'h2', dark = false, ...props }: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'font-mono text-xs/5 font-semibold uppercase tracking-widest text-gray-500 data-[dark]:text-gray-400'
      )}
    />
  )
}

export function Lead({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return <p className={clsx(className, 'text-2xl font-medium text-gray-500')} {...props} />
}
