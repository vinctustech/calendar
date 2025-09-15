import React, { useMemo } from 'react'
import './styles.scss'
import { CalendarEvent, BaseCalendarProps } from '../shared/types'
import { isEqual, isToday, isPastDate } from '../shared/utils'
import { en } from '../shared/locales'

// Simple date utility functions to replace dayjs
const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const formatDate = (date: Date, format: string): string => {
  const day = date.getDate()
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]

  if (format === 'YYYY-MM-DD') {
    return date.toISOString().split('T')[0]
  }
  if (format === 'ddd') {
    return dayName
  }
  if (format === 'D') {
    return day.toString()
  }
  return date.toISOString()
}

export interface WeekCalendarProps<T extends CalendarEvent = CalendarEvent> extends BaseCalendarProps<T> {
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
}

export const WeekCalendar = <T extends CalendarEvent>({
  date,
  events,
  locale = en,
  onEventClick,
  onDayClick,
  onSelectSlot,
  theme = 'light',
}: WeekCalendarProps<T>) => {
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)

  // Adjust header padding to account for scrollbar
  React.useEffect(() => {
    const adjustScrollbar = () => {
      if (bodyRef.current && headerRef.current) {
        const bodyElement = bodyRef.current
        const headerElement = headerRef.current
        const scrollbarWidth = bodyElement.offsetWidth - bodyElement.clientWidth
        headerElement.style.paddingRight = `${scrollbarWidth}px`
      }
    }

    adjustScrollbar()
    window.addEventListener('resize', adjustScrollbar)
    return () => window.removeEventListener('resize', adjustScrollbar)
  }, [])

  // Scroll to 9am on mount
  React.useEffect(() => {
    if (bodyRef.current) {
      // 9am is the 4th time slot (6am=0, 7am=1, 8am=2, 9am=3)
      // Each time slot is 80px tall
      bodyRef.current.scrollTop = 3 * 80
    }
  }, [date]) // Re-scroll when date changes

  const weekStart = getWeekStart(date)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Group events by day
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, T[]> = {}
    events.forEach((event) => {
      const eventDate = formatDate(event.date, 'YYYY-MM-DD')
      if (!grouped[eventDate]) {
        grouped[eventDate] = []
      }
      grouped[eventDate].push(event)
    })
    return grouped
  }, [events])

  // Time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6) // 6-22 (6 AM to 10 PM)

  const formatHour = (hour: number) => {
    return locale.formatTime
      ? locale.formatTime(new Date(2000, 0, 1, hour, 0))
      : `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
  }

  const getEventsForDayAndHour = (dayStr: string, hour: number) => {
    const dayEvents = eventsByDay[dayStr] || []
    return dayEvents.filter((event) => {
      const eventHour = event.date.getHours()
      return eventHour === hour
    })
  }

  return (
    <div className={`week-calendar calendar-${theme}`}>
      {/* Header with days */}
      <div className="week-calendar-header" ref={headerRef}>
        <div className="week-calendar-time-column"></div>
        {weekDays.map((day) => {
          const isPast = isPastDate(day)
          const isTodayDate = isToday(day)

          return (
            <div
              key={formatDate(day, 'YYYY-MM-DD')}
              className={`week-calendar-day-header ${isPast ? 'week-calendar-day-header-past' : ''}`}
              onClick={() => onDayClick?.(day)}
            >
              <div className={`week-calendar-day-name ${isPast ? 'week-calendar-day-name-past' : ''}`}>
                {formatDate(day, 'ddd')}
              </div>
              <div
                className={`week-calendar-day-number ${isTodayDate ? 'week-calendar-day-number-today' : ''} ${isPast ? 'week-calendar-day-number-past' : ''}`}
              >
                {formatDate(day, 'D')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="week-calendar-body" ref={bodyRef}>
        {timeSlots.map((hour) => (
          <div key={hour} className="week-calendar-time-row">
            <div className="week-calendar-time-label">{formatHour(hour)}</div>
            {weekDays.map((day) => {
              const dayStr = formatDate(day, 'YYYY-MM-DD')
              const hourEvents = getEventsForDayAndHour(dayStr, hour)

              return (
                <div
                  key={`${dayStr}-${hour}`}
                  className="week-calendar-time-cell"
                  onClick={(e) => {
                    // Only trigger if clicking on empty space, not on an event
                    if (onSelectSlot && (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('week-calendar-time-cell'))) {
                      // Create start and end dates for the time slot
                      const start = new Date(day)
                      start.setHours(hour, 0, 0, 0)

                      const end = new Date(day)
                      end.setHours(hour + 1, 0, 0, 0)

                      onSelectSlot({ start, end })
                    }
                  }}
                  style={{ cursor: onSelectSlot ? 'pointer' : 'default' }}
                >
                  {hourEvents.map((event, idx) => {
                    const eventClasses = ['week-calendar-event']
                    if (event.strikethrough) {
                      eventClasses.push('week-calendar-event-cancelled')
                    }

                    return (
                      <div
                        key={idx}
                        className={eventClasses.join(' ')}
                        style={event.style}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                      >
                        <div
                          className="week-calendar-event-dot"
                          style={{ backgroundColor: event.color || '#bfbfbf' }}
                        />
                        <div className="week-calendar-event-title">{event.title}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
