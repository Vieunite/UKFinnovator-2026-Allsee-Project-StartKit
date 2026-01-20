'use client'

import React from 'react'

interface ResultsCountProps {
  filteredCount: number
  totalCount: number
  title: string
}

export const ResultsCount: React.FC<ResultsCountProps> = ({ filteredCount, totalCount, title }) => {
  return (
    <div className="font-sans text-sm text-gray-600 dark:text-gray-400">
      Showing {filteredCount} of {totalCount} <span className="font-sans font-medium">{title}</span>
    </div>
  )
}
