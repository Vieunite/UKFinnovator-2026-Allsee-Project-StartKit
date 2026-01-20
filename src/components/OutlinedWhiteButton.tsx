import React from 'react'

interface OutlinedWhiteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  className?: string
}

const OutlinedWhiteButton = ({
  onClick,
  className,
  children,
  ...props
}: React.PropsWithChildren<OutlinedWhiteButtonProps>) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`${className} transition-bg text-textLightMode dark:text-textDarkMode rounded-md border bg-white p-2 text-xs font-semibold leading-3 duration-100 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700`}
    >
      {children}
    </button>
  )
}

export default OutlinedWhiteButton
