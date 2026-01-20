'use client'

import { ActiveBetween } from '@/data'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import OutlinedWhiteButton from './OutlinedWhiteButton'
import PrimaryButton from './PrimaryButton'

type ActiveBetweenModalProps = {
  open: boolean
  onClose: () => void
  name: string
  currentActiveBetween: ActiveBetween | null
  onSave: (activeBetween: ActiveBetween | null) => void
}

export const ActiveBetweenModal: React.FC<ActiveBetweenModalProps> = ({
  open,
  onClose,
  name,
  currentActiveBetween,
  onSave,
}) => {
  const [fromDate, setFromDate] = useState<string>('')
  const [fromTime, setFromTime] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [toTime, setToTime] = useState<string>('')

  // Initialize form with current values
  useEffect(() => {
    if (currentActiveBetween) {
      // Format dates for input (YYYY-MM-DD)
      const from = currentActiveBetween.from_date
      const to = currentActiveBetween.to_date
      setFromDate(
        from
          ? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`
          : ''
      )
      setToDate(
        to
          ? `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`
          : ''
      )
      // Format times for input (HH:mm)
      setFromTime(currentActiveBetween.from_time || '')
      setToTime(currentActiveBetween.to_time || '')
    } else {
      setFromDate('')
      setFromTime('')
      setToDate('')
      setToTime('')
    }
  }, [currentActiveBetween, open])

  const handleSave = () => {
    if (!fromDate && !toDate) {
      onSave(null)
    } else {
      const from = fromDate ? new Date(fromDate) : null
      const to = toDate ? new Date(toDate) : null
      // Store time separately (will be used when checking active period)
      // Dates are stored without time modification, time is stored separately
      onSave({
        from_date: from,
        from_time: fromTime || null,
        to_date: to,
        to_time: toTime || null,
      })
    }
    onClose()
  }

  const handleClear = () => {
    setFromDate('')
    setFromTime('')
    setToDate('')
    setToTime('')
    onSave(null)
    onClose()
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              className="border-b border-gray-200 px-4 py-3 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Manage Active Period</h3>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">{name}</h4>
                </div>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 p-4 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <p className="font-medium">How it works:</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  <li>
                    Set <strong>From Date</strong> only: Active from this date onwards (defaults to 00:00 if time not
                    set)
                  </li>
                  <li>
                    Set <strong>To Date</strong> only: Active until this date (defaults to 23:59 if time not set)
                  </li>
                  <li>Set both: Active between these dates and times</li>
                  <li>Time is optional - if not set, defaults to 00:00 for start and 23:59 for end</li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    From Date <span className="text-xs text-gray-500">(required if setting active period)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={fromDate}
                      max={toDate || undefined}
                      onChange={(e) => {
                        const value = e.target.value
                        setFromDate(value)
                        if (value && toDate && new Date(value) > new Date(toDate)) {
                          setToDate(value)
                        }
                      }}
                      className="dark:text-textDarkMode flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    />
                    {fromDate && (
                      <input
                        type="time"
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        className="dark:text-textDarkMode w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    To Date <span className="text-xs text-gray-500">(required if setting active period)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        const value = e.target.value
                        setToDate(value)
                        if (value && fromDate && new Date(value) < new Date(fromDate)) {
                          setFromDate(value)
                        }
                      }}
                      min={fromDate || undefined}
                      className="dark:text-textDarkMode flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    />
                    {toDate && (
                      <input
                        type="time"
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        className="dark:text-textDarkMode w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
              <OutlinedWhiteButton onClick={handleClear}>Clear</OutlinedWhiteButton>
              <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
