import { CSSProperties, useState } from 'react'
import './styles.scss'
import { CalendarLocale, en } from './locales'

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const getEventsForDate = <T extends CalendarEvent>(events: T[], date: Date) => {
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )
}

const generateCalendarGrid = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const prevMonthDays = []

  if (firstDayOfMonth > 0) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1

      prevMonthDays.push({
        day,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
        date: new Date(prevMonthYear, prevMonth, day),
      })
    }
  }

  const currentMonthDays = []

  for (let day = 1; day <= daysInMonth; day++) {
    currentMonthDays.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    })
  }

  const nextMonthDays = []
  const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length
  const daysToAdd = 6 * 7 - totalDaysDisplayed

  if (daysToAdd > 0) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year

    for (let day = 1; day <= daysToAdd; day++) {
      nextMonthDays.push({
        day,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
        date: new Date(nextMonthYear, nextMonth, day),
      })
    }
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
}

const isToday = (date: Date) => isEqual(date, new Date())

const isEqual = (a: Date, b: Date) => {
  const acopy = new Date(a)
  const bcopy = new Date(b)

  acopy.setHours(0, 0, 0, 0)
  bcopy.setHours(0, 0, 0, 0)
  return bcopy.getTime() === acopy.getTime()
}

const isFutureDate = (date: Date) => {
  const today = new Date()
  const checkDate = new Date(date)

  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate > today
}

export type CalendarEvent = {
  date: Date
  title: string
  color: string
  strikethrough?: boolean
  style?: CSSProperties
}

export type CalendarProps<T extends CalendarEvent = CalendarEvent> = {
  date: Date
  events: T[]
  maxEventsPerDay?: number
  onEventClick?: (event: T) => void
  onMoreEventsClick?: (date: Date, events: T[]) => void
  header?: boolean
  daySelector?: boolean
  locale?: CalendarLocale
  ellipsis?: boolean
}

export const Calendar = <T extends CalendarEvent>({
  date = new Date(),
  events,
  maxEventsPerDay = 4,
  onEventClick,
  onMoreEventsClick,
  header,
  daySelector,
  locale = en,
  ellipsis,
}: CalendarProps<T>) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = date.getFullYear()
  const month = date.getMonth()

  return (
    <div className="cal-container">
      {header && (
        <div className="cal-header">
          <div className="cal-month-display">
            <h2>
              {locale.monthsLong[month]} {year}
            </h2>
          </div>
        </div>
      )}
      <div className="cal-weekday-header">
        {locale.daysShort.map((day, index) => (
          <div key={index} className="cal-weekday-cell">
            {day}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {generateCalendarGrid(year, month).map((dateObj, index) => {
          const dateEvents = getEventsForDate(events, dateObj.date)

          return (
            <div
              key={index}
              className={`cal-cell ${!dateObj.isCurrentMonth ? 'cal-other-month' : ''} 
                  ${isToday(dateObj.date) ? 'cal-today' : ''} 
                  ${daySelector && isEqual(dateObj.date, selectedDate) ? 'cal-selected' : ''}`}
              onClick={() => daySelector && setSelectedDate(dateObj.date)}
            >
              <div className="cal-date-number-container">
                <span
                  className={`cal-date-number ${isToday(dateObj.date) ? 'cal-today-number' : ''}`}
                >
                  {dateObj.day}
                </span>
              </div>
              <div className="cal-events-container">
                {dateEvents
                  .slice(
                    0,
                    dateEvents.length > maxEventsPerDay ? maxEventsPerDay - 1 : maxEventsPerDay,
                  )
                  .map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`
                      cal-event-item 
                      ${isFutureDate(event.date) ? 'cal-future-event' : ''} 
                      ${event.strikethrough ? 'cal-cancelled-event' : ''}
                    `}
                      style={event.style}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onEventClick) {
                          onEventClick(event)
                        }
                      }}
                      title={event.title}
                    >
                      <span
                        className="cal-event-dot"
                        style={{ backgroundColor: event.color }}
                      ></span>
                      <span className={`cal-event-title ${ellipsis ? 'cal-ellipsis' : ''}`}>
                        {event.title}
                      </span>
                    </div>
                  ))}
                {dateEvents.length > maxEventsPerDay && (
                  <div
                    className="cal-more-events"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onMoreEventsClick) {
                        onMoreEventsClick(dateObj.date, dateEvents)
                      }
                    }}
                  >
                    +{dateEvents.length - maxEventsPerDay + 1} {locale.moreText}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
