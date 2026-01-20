import React from 'react'

type TableProps = React.ComponentPropsWithoutRef<'table'>

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className = '', ...props }, ref) => (
  <table ref={ref} className={`w-full border-collapse text-xs ${className}`} {...props} />
))

Table.displayName = 'Table'

export default Table
