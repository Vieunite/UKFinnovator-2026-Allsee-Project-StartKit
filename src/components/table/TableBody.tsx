import React from 'react'

type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className = '', ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
))

TableBody.displayName = 'TableBody'

export default TableBody
