import { CalendarLocale } from './index.ts'

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthsLong = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const moreText = 'more'
const formatTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // removes leading zeros automatically
    minute: '2-digit',
    hour12: true,
  }

  const formatted = date.toLocaleTimeString('en-US', options)

  return formatted.replace(' ', '').toLowerCase().replace(':00', '')
}

const en: CalendarLocale = {
  locale: 'en',
  daysShort,
  monthsLong,
  moreText,
  formatTime,
}

export default en
