export { default as en } from './en'
export { default as fr } from './fr'

export type CalendarLocale = {
  locale: string
  daysShort: string[]
  monthsLong: string[]
  moreText: string
  formatTime: (date: Date) => string
}
