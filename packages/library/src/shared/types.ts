import { CSSProperties } from 'react'

export type CalendarEvent = {
  date: Date
  title: string
  color: string
  strikethrough?: boolean
  style?: CSSProperties
}

export type BaseCalendarProps<T extends CalendarEvent = CalendarEvent> = {
  date: Date
  events: T[]
  onEventClick?: (event: T) => void
  onDayClick?: (date: Date) => void
  locale?: CalendarLocale
}

export type CalendarLocale = {
  locale: string
  daysShort: string[]
  monthsLong: string[]
  moreText: string
  formatTime: (date: Date) => string
}