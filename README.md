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
  return (
    <div>
      <MonthCalendar 
        date={new Date()} 
        events={[]} 
        theme="light" // or "dark"
      />
      
      <WeekCalendar 
        date={new Date()} 
        events={[]} 
        theme="light" // or "dark"
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