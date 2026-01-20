import React from 'react'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const PrimaryButton = ({ className, children, ...props }: React.PropsWithChildren<PrimaryButtonProps>) => {
  return (
    <button
      {...props}
      className={`rounded-md border border-primary bg-primary p-2 text-xs font-semibold leading-3 text-white transition-all duration-200 hover:brightness-110 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
