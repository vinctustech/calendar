# @vinctus/calendar

A React calendar library with both month and week views, featuring event management, internationalization, and customizable styling.

## Installation

```bash
npm install @vinctus/calendar
```

## Quick Start

```jsx
import React from 'react'
import { MonthCalendar, WeekCalendar } from '@vinctus/calendar'
import '@vinctus/calendar/dist/index.css'

function App() {
  const events = [
    {
      date: new Date(2025, 2, 15, 10, 30),
      title: 'Team Meeting',
      color: '#1890ff'
    }
  ]

  return (
    <div>
      {/* Month View */}
      <MonthCalendar 
        date={new Date()} 
        events={events}
        header={true}
        onDayClick={(date) => console.log('Day clicked:', date)}
        onEventClick={(event) => console.log('Event clicked:', event)}
      />

      {/* Week View */}
      <WeekCalendar 
        date={new Date()} 
        events={events}
        onDayClick={(date) => console.log('Day clicked:', date)}
        onEventClick={(event) => console.log('Event clicked:', event)}
      />
    </div>
  )
}
```

## API Reference

### MonthCalendar

A month grid calendar component with full month view.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | `new Date()` | The current date to display the calendar for |
| `events` | `CalendarEvent[]` | `[]` | Array of events to display |
| `maxEventsPerDay` | `number` | `5` | Maximum events to show per day before showing "more" |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Callback when an event is clicked |
| `onDayClick` | `(date: Date) => void` | - | Callback when a day is clicked |
| `onMoreEventsClick` | `(date: Date, events: CalendarEvent[]) => void` | - | Callback when "more events" is clicked |
| `header` | `boolean` | `false` | Show month/year header |
| `daySelector` | `boolean` | `false` | Enable day selection highlighting |
| `locale` | `CalendarLocale` | `en` | Locale configuration for internationalization |
| `ellipsis` | `boolean` | `false` | Truncate event titles with ellipsis |

#### Example

```jsx
<MonthCalendar
  date={new Date()}
  events={events}
  header={true}
  daySelector={true}
  ellipsis={true}
  maxEventsPerDay={3}
  locale={en}
  onDayClick={(date) => setSelectedDate(date)}
  onEventClick={(event) => handleEventClick(event)}
  onMoreEventsClick={(date, events) => showMoreEventsModal(date, events)}
/>
```

### WeekCalendar

A weekly timeline calendar component with hourly time slots.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | `new Date()` | The current date to display the week for |
| `events` | `CalendarEvent[]` | `[]` | Array of events to display |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Callback when an event is clicked |
| `onDayClick` | `(date: Date) => void` | - | Callback when a day header is clicked |
| `locale` | `CalendarLocale` | `en` | Locale configuration for internationalization |

#### Example

```jsx
<WeekCalendar
  date={new Date()}
  events={events}
  locale={fr}
  onDayClick={(date) => setSelectedDate(date)}
  onEventClick={(event) => handleEventClick(event)}
/>
```

### Types

#### CalendarEvent

```typescript
interface CalendarEvent {
  date: Date              // Event date and time
  title: string           // Event title/description
  color: string          // Event color (hex, rgb, etc.)
  strikethrough?: boolean // Show event as cancelled/completed
  style?: CSSProperties  // Additional custom styles
}
```

#### CalendarLocale

```typescript
interface CalendarLocale {
  locale: string                    // Locale identifier (e.g., 'en', 'fr')
  daysShort: string[]              // Short day names ['Sun', 'Mon', ...]
  monthsLong: string[]             // Full month names ['January', 'February', ...]
  moreText: string                 // Text for "more events" link
  formatTime: (date: Date) => string // Time formatting function
}
```

### Built-in Locales

```jsx
import { en, fr } from '@vinctus/calendar'

// English (default)
const englishCalendar = <MonthCalendar locale={en} />

// French
const frenchCalendar = <MonthCalendar locale={fr} />
```

## Styling

The library requires importing the CSS file separately:

```jsx
import '@vinctus/calendar/dist/index.css'
```

### Key CSS Classes

#### MonthCalendar Classes
- `.month-calendar` - Main calendar container
- `.month-calendar-header` - Month/year header
- `.month-calendar-weekday-header` - Day names row
- `.month-calendar-cell` - Individual day cell
- `.month-calendar-event` - Individual event
- `.month-calendar-today` - Today's date styling
- `.month-calendar-selected` - Selected date styling

#### WeekCalendar Classes
- `.week-calendar` - Main week calendar container
- `.week-calendar-header` - Week header with day names
- `.week-calendar-day-header` - Individual day header
- `.week-calendar-time-row` - Time slot row
- `.week-calendar-event` - Individual event
- `.week-calendar-day-number-today` - Today's date styling

### Custom Styling

Override styles by targeting the CSS classes:

```css
/* Customize month calendar */
.month-calendar {
  font-family: 'Your Custom Font', sans-serif;
  border-radius: 8px;
}

.month-calendar-event {
  border-radius: 6px;
  font-weight: 500;
}

/* Customize week calendar */
.week-calendar-event {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## Advanced Usage

### Custom Event Handling

```jsx
const handleEventClick = (event) => {
  // Open event details modal
  setSelectedEvent(event)
  setShowModal(true)
}

const handleDayClick = (date) => {
  // Navigate to create event for that date
  navigate(`/create-event?date=${date.toISOString()}`)
}

const handleMoreEvents = (date, events) => {
  // Show all events for the day
  setDayEvents(events)
  setShowEventsModal(true)
}
```

### Custom Locale

```jsx
const customLocale = {
  locale: 'custom',
  daysShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  monthsLong: ['Enero', 'Febrero', 'Marzo', '...'],
  moreText: 'más',
  formatTime: (date) => date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
```

### Event Styling

```jsx
const events = [
  {
    date: new Date(),
    title: 'Important Meeting',
    color: '#ff4d4f',
    style: { 
      fontWeight: 'bold',
      fontSize: '13px' 
    }
  },
  {
    date: new Date(),
    title: 'Completed Task',
    color: '#52c41a',
    strikethrough: true
  }
]
```

## Features

- ✅ **Dual Views**: Month grid and week timeline
- ✅ **Event Management**: Click handlers, custom styling, strikethrough
- ✅ **Internationalization**: Built-in locales with custom locale support
- ✅ **Responsive Design**: Mobile-friendly layouts
- ✅ **Accessibility**: Keyboard navigation and screen reader support
- ✅ **TypeScript**: Full type definitions included
- ✅ **Customizable**: Override styles and behavior
- ✅ **Zero Dependencies**: No external runtime dependencies

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions
- Android Chrome: Latest 2 versions