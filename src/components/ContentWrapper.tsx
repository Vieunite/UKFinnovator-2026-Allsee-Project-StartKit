import React from 'react'

const ContentWrapper = ({
  className = '',
  noMaxWidth = false,
  contain = false,
  children,
}: React.PropsWithChildren<{ className?: string; noMaxWidth?: boolean; contain?: boolean }>) => {
  return (
    <div className={`px-6 lg:px-10 ${className} `}>
      <div className={`${noMaxWidth ? '' : 'mx-auto max-w-6xl'} ${contain ? '!max-w-4xl' : ''} h-full`}>{children}</div>
    </div>
  )
}

export default ContentWrapper
