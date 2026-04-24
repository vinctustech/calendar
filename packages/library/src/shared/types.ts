import { CSSProperties } from 'react'

export type CalendarEvent = {
  date: Date
  title: string
  color: string
  strikethrough?: boolean
  style?: CSSProperties
}

// Open window for a single day. null = closed that weekday.
// Times are "HH:mm" in 24-hour local time.
export type DayHours = { start: string; end: string } | null

// Length-7 array indexed by weekday (0 = Sunday … 6 = Saturday).
// When provided, WeekCalendar renders only hours inside the union of open
// windows for the visible week, and MonthCalendar marks closed weekdays
// as non-interactive.
export type BusinessHours = DayHours[]

export type BaseCalendarProps<T extends CalendarEvent = CalendarEvent> = {
  date: Date
  events: T[]
  onEventClick?: (event: T) => void
  onDayClick?: (date: Date) => void
  locale?: CalendarLocale
  theme?: 'light' | 'dark'
  allowPastInteraction?: boolean // Default: false - when true, past cells remain clickable while keeping visual styling
  businessHours?: BusinessHours
}

export type CalendarLocale = {
  locale: string
  daysShort: string[]
  monthsLong: string[]
  moreText: string
  formatTime: (date: Date) => string
}
