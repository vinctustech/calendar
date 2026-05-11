import { MonthCalendar, WeekCalendar, CalendarEvent, BusinessHours, en } from '@vinctus/calendar'
import { Button, Card, Space, Tabs, Switch } from 'antd'
import { useState } from 'react'
import './demo-themes.css'

// Sample hours: weekdays 9-17, Saturday 10-14, Sunday closed.
const sampleBusinessHours: BusinessHours = [
  null, // Sunday
  { start: '09:00', end: '17:00' }, // Monday
  { start: '09:00', end: '17:00' }, // Tuesday
  { start: '09:00', end: '17:00' }, // Wednesday
  { start: '09:00', end: '17:00' }, // Thursday
  { start: '09:00', end: '17:00' }, // Friday
  { start: '10:00', end: '14:00' }, // Saturday
]

function App() {
  const [date, setDate] = useState(new Date())
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [allowPastInteraction, setAllowPastInteraction] = useState(false)
  const [enforceBusinessHours, setEnforceBusinessHours] = useState(false)
  const businessHours = enforceBusinessHours ? sampleBusinessHours : undefined

  const goToPrevious = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() - 7) // Go back a week for both views
      return newDate
    })
  }

  const goToNext = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 7) // Go forward a week for both views
      return newDate
    })
  }

  const items = [
    {
      key: 'month',
      label: 'Month View',
      children: (
        <div style={{ height: 'calc(100vh - 200px)' }}>
          <MonthCalendar
            date={date}
            events={sampleEvents}
            header={true}
            locale={en}
            ellipsis={true}
            daySelector
            theme={theme}
            allowPastInteraction={allowPastInteraction}
            businessHours={businessHours}
            onDayClick={(date) => alert(`Month view day clicked: ${date}`)}
            onEventClick={(event) => alert(`Event: ${event.title}`)}
          />
        </div>
      ),
    },
    {
      key: 'week',
      label: 'Week View',
      children: (
        <div style={{ height: 'calc(100vh - 200px)' }}>
          <WeekCalendar
            date={date}
            events={sampleEvents}
            locale={en}
            theme={theme}
            allowPastInteraction={allowPastInteraction}
            businessHours={businessHours}
            onDayClick={(date) => alert(`Week view day header clicked: ${date}`)}
            onEventClick={(event) => alert(`Event: ${event.title}`)}
            onSelectSlot={(slotInfo) =>
              alert(
                `Week view time slot clicked: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}`,
              )
            }
          />
        </div>
      ),
    },
  ]

  return (
    <div className={`demo-app demo-${theme}`}>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={goToPrevious}>
            Previous Week
          </Button>
          <Button type="primary" onClick={goToNext}>
            Next Week
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            <span>Business Hours:</span>
            <Switch
              checked={enforceBusinessHours}
              onChange={setEnforceBusinessHours}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
            <span>Past Interaction:</span>
            <Switch
              checked={allowPastInteraction}
              onChange={setAllowPastInteraction}
              checkedChildren="Allow"
              unCheckedChildren="Block"
            />
            <span>Theme:</span>
            <Switch
              checked={theme === 'dark'}
              onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </Space>
        </Space>

        <Tabs items={items} />
      </Card>
    </div>
  )
}

const sampleEvents: CalendarEvent[] = [
  // Past events (for demonstrating past date styling)
  {
    date: new Date(2025, 8, 20, 9, 30),
    title: '9:30am\u2002Past Event\u2002Meeting\u2002Conference Room',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 8, 22, 14, 0),
    title: '2:00pm\u2002Past Event\u2002Review\u2002Office',
    color: '#60be23',
    strikethrough: false,
  },
  {
    date: new Date(2025, 8, 23, 10, 30),
    title: '10:30am\u2002Past Event\u2002Workshop\u2002Training Room',
    color: '#e25263',
    strikethrough: false,
  },
  // Future events
  {
    date: new Date(2025, 1, 28, 9, 30),
    title: '9:30am\u2002Jane Smith\u2002Shuttle Drop-off\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
    style: { fontWeight: 'bold' },
  },
  {
    date: new Date(2025, 3, 1, 9, 30),
    title: '9:30am\u2002Jane Smith\u2002Shuttle Drop-off\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
    style: { fontWeight: 'bold' },
  },
  {
    date: new Date(2025, 2, 3, 9, 30),
    title: '9:30am\u2002John Smith\u2002Shuttle Drop-off\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
    style: { fontWeight: 'bold' },
  },
  {
    date: new Date(2025, 2, 3, 10, 45),
    title: '10:45am\u2002Emily Johnson\u2002Shuttle Pickup\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
    style: { color: 'gray' },
  },
  {
    date: new Date(2025, 2, 3, 13, 15),
    title: '1:15pm\u2002Michael Brown\u2002Part Delivery\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 3, 15, 0),
    title: '3pm\u2002Sarah Davis\u2002Part Pickup\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 5, 8, 15),
    title: '8:15am\u2002Robert Wilson\u2002Valet Pickup\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 8, 11, 30),
    title: '11:30am\u2002Jessica Taylor\u2002Valet Drop-off\u2002Alpha Store',
    color: '#e25263',
    strikethrough: true,
  },
  {
    date: new Date(2025, 2, 10, 14, 45),
    title: '2:45pm\u2002David Martinez\u2002Task\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 10, 16, 30),
    title: '4:30pm\u2002Jennifer Anderson\u2002Shuttle Pickup\u2002Alpha Store',
    color: '#e25263',
    strikethrough: true,
  },
  {
    date: new Date(2025, 2, 10, 11, 30),
    title: '11:30am\u2002Jessica Taylor\u2002Valet Drop-off\u2002Alpha Store',
    color: '#e25263',
    strikethrough: true,
  },
  {
    date: new Date(2025, 2, 15, 9, 0),
    title: '9am\u2002Thomas Robinson\u2002Part Delivery\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 17, 13, 0),
    title: '1pm\u2002Lisa White\u2002Shuttle Drop-off\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 20, 10, 15),
    title: '10:15am\u2002James Clark\u2002Valet Pickup\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 22, 15, 45),
    title: '3:45pm\u2002Patricia Lewis\u2002Task\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 25, 11, 0),
    title: '11am\u2002Christopher Lee\u2002Part Pickup\u2002Alpha Store',
    color: '#bfbfbf',
    strikethrough: false,
  },
  {
    date: new Date(2025, 2, 27, 14, 30),
    title: '2:30pm\u2002Elizabeth Walker\u2002Valet Drop-off\u2002Alpha Store',
    color: '#e25263',
    strikethrough: true,
  },
  {
    date: new Date(2025, 2, 29, 9, 45),
    title: '9:45am\u2002Daniel Hall\u2002Shuttle Pickup\u2002Alpha Store',
    color: '#60be23',
    strikethrough: false,
  },
]

export default App
