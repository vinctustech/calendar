# @vinctus/calendar

## Installation

```bash
npm install @vinctus/calendar
```

## Usage

```jsx
import React from 'react'
import { MonthCalendar, WeekCalendar } from '@vinctus/calendar'
import '@vinctus/calendar/dist/index.css'

function App() {
  const [date, setDate] = useState(new Date())
  const events = [
    {
      date: new Date(2024, 11, 15, 14, 30),
      title: 'Team Meeting',
      color: '#1677ff',
    }
  ]

  return (
    <div>
      <MonthCalendar
        date={date}
        events={events}
        theme="light" // or "dark"
        allowPastInteraction={false} // Controls past date interaction
        onDayClick={(date) => console.log('Day clicked:', date)}
        onEventClick={(event) => console.log('Event clicked:', event)}
      />

      <WeekCalendar
        date={date}
        events={events}
        theme="light" // or "dark"
        allowPastInteraction={false} // Controls past date interaction
        onDayClick={(date) => console.log('Day header clicked:', date)}
        onEventClick={(event) => console.log('Event clicked:', event)}
        onSelectSlot={(slot) => console.log('Time slot selected:', slot)}
      />
    </div>
  )
}
```

## Styling

The library requires importing the CSS file separately:

```jsx
import '@vinctus/calendar/dist/index.css'
```

This approach gives you:
- Full control over when styles are loaded
- Ability to override styles with your own CSS
- Better performance and bundling optimization

### Custom Styling

To customize the calendar appearance, you can:

1. Import the CSS and override specific classes:
```css
/* Your custom CSS */
.cal-container {
  font-family: 'Your Custom Font';
}
```

2. Use CSS custom properties to customize theme colors:
```css
/* Override light theme variables */
.calendar-light {
  --calendar-bg-primary: #ffffff;
  --calendar-accent-primary: #your-brand-color;
  --calendar-text-primary: #333333;
}

/* Override dark theme variables */
.calendar-dark {
  --calendar-bg-primary: #1a1a1a;
  --calendar-accent-primary: #your-brand-color;
  --calendar-text-primary: #ffffff;
}
```

## Theme Support

The calendar supports both light and dark themes via the `theme` prop:

```jsx
import { MonthCalendar } from '@vinctus/calendar'

// Light theme (default)
<MonthCalendar theme="light" date={new Date()} events={[]} />

// Dark theme
<MonthCalendar theme="dark" date={new Date()} events={[]} />
```

### Available Theme Variables

The following CSS custom properties can be customized for each theme:

**Background Colors:**
- `--calendar-bg-primary` - Main calendar background
- `--calendar-bg-secondary` - Secondary backgrounds (inactive days)
- `--calendar-bg-today` - Today's date background
- `--calendar-bg-hover` - Hover state backgrounds

**Text Colors:**
- `--calendar-text-primary` - Main text color
- `--calendar-text-secondary` - Secondary text (day names, etc.)
- `--calendar-text-muted` - Muted text (past dates)
- `--calendar-text-event` - Event text color

**Accent & Borders:**
- `--calendar-accent-primary` - Primary accent color (today, selection)
- `--calendar-border-primary` - Main border color
- `--calendar-border-secondary` - Secondary border color

## Past Date Interaction

The calendar includes built-in handling for past dates with visual styling and optional interaction control:

### `allowPastInteraction` Prop

Controls whether users can interact with past dates:

```jsx
// Default behavior - past dates are visually styled but not clickable
<MonthCalendar allowPastInteraction={false} />

// Allow interaction with past dates while keeping visual styling
<MonthCalendar allowPastInteraction={true} />
```

**When `allowPastInteraction={false}` (default):**
- Past dates show muted appearance (reduced opacity, muted colors)
- Cursor shows "not-allowed" when hovering over past dates
- Click handlers (`onDayClick`, `onSelectSlot`) do not fire for past dates
- Past events remain fully clickable for viewing/editing

**When `allowPastInteraction={true}`:**
- Past dates show muted appearance (visual styling preserved)
- Cursor shows normal pointer when hovering over past dates
- All click handlers work normally for past dates
- Past events remain fully clickable

### CSS Classes for Past Dates

The library applies CSS classes that can be customized:

**MonthCalendar:**
- `.month-calendar-past` - Visual styling for past date cells
- `.month-calendar-past-non-interactive` - Cursor styling (applied when `allowPastInteraction={false}`)

**WeekCalendar:**
- `.week-calendar-day-header-past` - Visual styling for past day headers
- `.week-calendar-day-header-past-non-interactive` - Day header cursor styling
- `.week-calendar-time-cell-past` - Visual styling for past time slots
- `.week-calendar-time-cell-non-interactive` - Time slot cursor styling

### Customizing Past Date Styles

```css
/* Customize past date visual appearance */
.month-calendar-past {
  opacity: 0.4; /* Make past dates more subtle */
  background-color: #f5f5f5;
}

/* Override cursor behavior (not recommended) */
.month-calendar-past-non-interactive {
  cursor: default !important;
}

/* Style past events differently */
.month-calendar-past .month-calendar-event {
  opacity: 0.6;
  filter: grayscale(50%);
}
```

## Event Handling

### Event Callbacks

Both calendar components support several event callbacks:

```jsx
<MonthCalendar
  onDayClick={(date) => {
    console.log('Day clicked:', date)
  }}
  onEventClick={(event) => {
    console.log('Event clicked:', event)
  }}
  onMoreEventsClick={(date, events) => {
    console.log('More events clicked for:', date, events)
  }}
/>

<WeekCalendar
  onDayClick={(date) => {
    console.log('Day header clicked:', date)
  }}
  onEventClick={(event) => {
    console.log('Event clicked:', event)
  }}
  onSelectSlot={(slotInfo) => {
    console.log('Time slot selected:', slotInfo.start, slotInfo.end)
  }}
/>
```

### Event Data Structure

Events should follow this structure:

```jsx
const event = {
  date: new Date(), // Required: Date object
  title: 'Event Title', // Required: Display text
  color: '#1677ff', // Required: Color for the event dot
  strikethrough: false, // Optional: Show strikethrough styling
  style: { fontWeight: 'bold' } // Optional: Custom inline styles
}
```