export { MonthCalendar } from './MonthCalendar'
export type { MonthCalendarProps } from './MonthCalendar'

export { WeekCalendar } from './WeekCalendar'
export type { WeekCalendarProps } from './WeekCalendar'

// Backwards compatibility - alias MonthCalendar as Calendar
export { MonthCalendar as Calendar } from './MonthCalendar'
export type { MonthCalendarProps as CalendarProps } from './MonthCalendar'

// Shared exports
export type { CalendarEvent, CalendarLocale, BaseCalendarProps } from './shared/types'
export { en, fr } from './shared/locales'
