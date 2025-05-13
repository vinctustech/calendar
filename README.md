# @vinctus/calendar

## Installation

```bash
npm install @vinctus/calendar
```

## Usage

```jsx
import React from 'react'
import { Calendar } from '@vinctus/calendar'
import '@vinctus/calendar/dist/index.css'

function App() {
  return (
    <Calendar 
      date={new Date()} 
      events={[]} 
    />
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

2. Use CSS custom properties (if you add them):
```css
:root {
  --calendar-primary-color: #your-color;
}
```