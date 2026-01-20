import React from 'react'

type TDProps = React.ComponentPropsWithoutRef<'td'>

const TD = React.forwardRef<HTMLTableCellElement, TDProps>(({ className = '', ...props }, ref) => (
  <td ref={ref} className={`px-3 py-4 ${className}`} {...props} />
))

TD.displayName = 'TD'

export default TD
