import React from 'react'

type THProps = React.ComponentPropsWithoutRef<'th'>

const TH = React.forwardRef<HTMLTableCellElement, THProps>(({ className = '', ...props }, ref) => (
  <th
    ref={ref}
    className={`whitespace-nowrap bg-gray-50 px-3 pb-3 pt-4 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-300 ${className}`}
    {...props}
  />
))

TH.displayName = 'TH'

export default TH
