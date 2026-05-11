import React, { useMemo } from 'react'
import './styles.scss'
import { CalendarEvent, BaseCalendarProps, BusinessHours, DayHours } from '../shared/types'
import { isEqual, isToday, isPastDate } from '../shared/utils'
import { en } from '../shared/locales'

// Parse "HH:mm" (24h) into a { h, m } pair. Invalid input falls back to 0.
const parseHhMm = (s: string): { h: number; m: number } => {
  const [h, m] = s.split(':').map((n) => parseInt(n, 10))
  return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m }
}

// Compute the visible hour range [startHour, endHourExclusive) as the union
// of the open windows across the given weekdays. Returns null when every
// visible weekday is closed (caller renders no rows).
const computeWeekHourRange = (
  businessHours: BusinessHours,
  weekdays: number[],
): [number, number] | null => {
  let minStart = Infinity
  let maxEnd = -Infinity
  for (const dow of weekdays) {
    const hours = businessHours[dow]
    if (!hours) continue
    const { h: sh } = parseHhMm(hours.start)
    const { h: eh, m: em } = parseHhMm(hours.end)
    const endHourCeil = em > 0 ? eh + 1 : eh
    if (sh < minStart) minStart = sh
    if (endHourCeil > maxEnd) maxEnd = endHourCeil
  }
  if (!isFinite(minStart) || !isFinite(maxEnd) || maxEnd <= minStart) return null
  return [Math.max(0, minStart), Math.min(24, maxEnd)]
}

// True when the given hour (0-23) falls inside the day's open window.
// An undefined/null entry means the weekday is closed.
const isHourOpen = (hours: DayHours, hour: number): boolean => {
  if (!hours) return false
  const { h: sh } = parseHhMm(hours.start)
  const { h: eh, m: em } = parseHhMm(hours.end)
  const endHourExclusive = em > 0 ? eh + 1 : eh
  return hour >= sh && hour < endHourExclusive
}

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
  allowPastInteraction = false,
  businessHours,
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

  // Hour range: union of open windows across the visible week when
  // businessHours is provided, otherwise the full day.
  const hourRange = useMemo<[number, number]>(() => {
    if (!businessHours) return [0, 24]
    const visibleWeekdays = weekDays.map((d) => d.getDay())
    const computed = computeWeekHourRange(businessHours, visibleWeekdays)
    return computed ?? [0, 0] // all closed → render no rows
  }, [businessHours, weekDays])

  const [startHour, endHour] = hourRange
  const timeSlots = useMemo(
    () => Array.from({ length: Math.max(0, endHour - startHour) }, (_, i) => startHour + i),
    [startHour, endHour],
  )

  // Scroll to 9am when showing the full day; otherwise the first rendered row
  // already is the start of business hours.
  React.useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = businessHours ? 0 : 9 * 80
    }
  }, [date, businessHours])

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
          const isClosedDay = businessHours ? !businessHours[day.getDay()] : false

          const headerClasses = ['week-calendar-day-header']
          if (isPast) {
            headerClasses.push('week-calendar-day-header-past')
            if (!allowPastInteraction) headerClasses.push('week-calendar-day-header-past-non-interactive')
          }
          if (isClosedDay) headerClasses.push('week-calendar-day-header-closed')

          return (
            <div
              key={formatDate(day, 'YYYY-MM-DD')}
              className={headerClasses.join(' ')}
              onClick={() => {
                // Prevent interaction with closed day headers
                if (isClosedDay) {
                  return
                }
                // Prevent interaction with past day headers when allowPastInteraction is false
                if (isPast && !allowPastInteraction) {
                  return
                }
                onDayClick?.(day)
              }}
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
              const isPast = isPastDate(day) && !isToday(day)
              const isClosed = businessHours
                ? !isHourOpen(businessHours[day.getDay()] ?? null, hour)
                : false

              const cellClasses = ['week-calendar-time-cell']
              if (isPast) {
                cellClasses.push('week-calendar-time-cell-past')
                if (!allowPastInteraction) cellClasses.push('week-calendar-time-cell-non-interactive')
              }
              if (isClosed) cellClasses.push('week-calendar-time-cell-closed')

              return (
                <div
                  key={`${dayStr}-${hour}`}
                  className={cellClasses.join(' ')}
                  onClick={(e) => {
                    // Prevent interaction with closed slots
                    if (isClosed) {
                      return
                    }

                    // Prevent interaction with past time slots when allowPastInteraction is false
                    if (isPast && !allowPastInteraction) {
                      return
                    }

                    // Only trigger if clicking on empty space, not on an event
                    if (
                      onSelectSlot &&
                      (e.target === e.currentTarget ||
                        (e.target as HTMLElement).classList.contains('week-calendar-time-cell'))
                    ) {
                      // Create start and end dates for the time slot
                      const start = new Date(day)
                      start.setHours(hour, 0, 0, 0)

                      const end = new Date(day)
                      end.setHours(hour + 1, 0, 0, 0)

                      onSelectSlot({ start, end })
                    }
                  }}
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
                        title={event.title}
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
