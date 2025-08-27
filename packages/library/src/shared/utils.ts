import { CalendarEvent } from './types'

export const isToday = (date: Date) => isEqual(date, new Date())

export const isEqual = (a: Date, b: Date) => {
  const acopy = new Date(a)
  const bcopy = new Date(b)

  acopy.setHours(0, 0, 0, 0)
  bcopy.setHours(0, 0, 0, 0)
  return bcopy.getTime() === acopy.getTime()
}

export const isFutureDate = (date: Date) => {
  const today = new Date()
  const checkDate = new Date(date)

  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate > today
}

export const isPastDate = (date: Date) => {
  const today = new Date()
  const checkDate = new Date(date)

  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

export const getEventsForDate = <T extends CalendarEvent>(events: T[], date: Date) => {
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )
}

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}
