import { useState } from 'react'
import './styles.scss'
import { CalendarEvent, BaseCalendarProps, CalendarLocale } from '../shared/types'
import {
  isToday,
  isEqual,
  isFutureDate,
  isPastDate,
  getEventsForDate,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '../shared/utils'
import { en } from '../shared/locales'

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

export type MonthCalendarProps<T extends CalendarEvent = CalendarEvent> = BaseCalendarProps<T> & {
  maxEventsPerDay?: number
  onMoreEventsClick?: (date: Date, events: T[]) => void
  header?: boolean
  daySelector?: boolean
  ellipsis?: boolean
}

export const MonthCalendar = <T extends CalendarEvent>({
  date = new Date(),
  events = [],
  maxEventsPerDay = 5,
  onEventClick,
  onDayClick,
  onMoreEventsClick,
  header,
  daySelector,
  locale = en,
  ellipsis,
  theme = 'light',
  allowPastInteraction = false,
}: MonthCalendarProps<T>) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = date.getFullYear()
  const month = date.getMonth()

  return (
    <div className={`month-calendar calendar-${theme}`}>
      {header && (
        <div className="month-calendar-header">
          <div className="month-calendar-month-display">
            <h2>
              {locale.monthsLong[month]} {year}
            </h2>
          </div>
        </div>
      )}
      <div className="month-calendar-weekday-header">
        {locale.daysShort.map((day, index) => (
          <div key={index} className="month-calendar-weekday-cell">
            {day}
          </div>
        ))}
      </div>
      <div className="month-calendar-grid">
        {generateCalendarGrid(year, month).map((dateObj, index) => {
          const dateEvents = getEventsForDate(events, dateObj.date)

          return (
            <div
              key={index}
              className={`month-calendar-cell ${!dateObj.isCurrentMonth ? 'month-calendar-other-month' : ''}
                  ${isToday(dateObj.date) ? 'month-calendar-today' : ''}
                  ${isPastDate(dateObj.date) && !isToday(dateObj.date) ? `month-calendar-past${!allowPastInteraction ? ' month-calendar-past-non-interactive' : ''}` : ''}
                  ${daySelector && isEqual(dateObj.date, selectedDate) ? 'month-calendar-selected' : ''}`}
              onClick={() => {
                // Prevent interaction with past dates when allowPastInteraction is false
                if (isPastDate(dateObj.date) && !isToday(dateObj.date) && !allowPastInteraction) {
                  return
                }

                if (daySelector) {
                  setSelectedDate(dateObj.date)
                }

                // Defer the callback to allow React to re-render first
                setTimeout(() => {
                  onDayClick?.(dateObj.date)
                }, 0)
              }}
            >
              <div className="month-calendar-date-number-container">
                <span
                  className={`month-calendar-date-number ${isToday(dateObj.date) ? 'month-calendar-today-number' : ''}`}
                >
                  {dateObj.day}
                </span>
              </div>
              <div className="month-calendar-events-container">
                {dateEvents
                  .slice(0, dateEvents.length > maxEventsPerDay ? maxEventsPerDay - 1 : maxEventsPerDay)
                  .map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`
                      month-calendar-event 
                      ${isFutureDate(event.date) ? 'month-calendar-future-event' : ''} 
                      ${event.strikethrough ? 'month-calendar-cancelled-event' : ''}
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
                      <span className="month-calendar-event-dot" style={{ backgroundColor: event.color }}></span>
                      <span className={`month-calendar-event-title ${ellipsis ? 'month-calendar-ellipsis' : ''}`}>
                        {event.title}
                      </span>
                    </div>
                  ))}
                {dateEvents.length > maxEventsPerDay && (
                  <div
                    className="month-calendar-more-events"
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
