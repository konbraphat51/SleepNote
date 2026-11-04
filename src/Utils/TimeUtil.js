// SleepNote — pure date/time helpers for the 30-minute slot grid.

import { MinutesPerSlot } from '../Constants/DiaryConstants.js'

// Zero-pad a number to two digits.
function pad2(value) {
  return String(value).padStart(2, '0')
}

// Number of days in the given month (month is 0-based).
export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

// Stable "YYYY-MM" key for a month (month is 0-based).
export function formatMonthKey(year, monthIndex) {
  return `${year}-${pad2(monthIndex + 1)}`
}

// Parse a "YYYY-MM" key into { year, monthIndex }.
export function parseMonthKey(key) {
  const [year, month] = key.split('-').map(Number)
  return { year, monthIndex: month - 1 }
}

// Wall-clock "HH:MM" time for a slot index (0..47).
export function formatSlotTime(slotIndex) {
  const totalMinutes = slotIndex * MinutesPerSlot
  return `${pad2(Math.floor(totalMinutes / 60))}:${pad2(totalMinutes % 60)}`
}

// Day-of-week for a date (0 = Sunday).
export function getWeekday(year, monthIndex, day) {
  return new Date(year, monthIndex, day).getDay()
}
