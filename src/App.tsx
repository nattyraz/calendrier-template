import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar as CalendarIcon, User, School } from 'lucide-react'
import { generateSummary } from './mockApi'

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  profileId: number
}

interface Profile {
  id: number
  name: string
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isInSchool, setIsInSchool] = useState<boolean>(false)

  // Mock data for profiles and events
  useEffect(() => {
    setProfiles([
      { id: 1, name: 'Personal' },
      { id: 2, name: 'Work' },
      { id: 3, name: 'Family' },
    ])

    setEvents([
      { id: 1, title: 'Meeting with Team', start: new Date(2024, 2, 15, 10, 0), end: new Date(2024, 2, 15, 11, 0), profileId: 2 },
      { id: 2, title: 'Gym Session', start: new Date(2024, 2, 16, 18, 0), end: new Date(2024, 2, 16, 19, 30), profileId: 1 },
      { id: 3, title: 'Family Dinner', start: new Date(2024, 2, 17, 19, 0), end: new Date(2024, 2, 17, 21, 0), profileId: 3 },
      { id: 4, title: 'School', start: new Date(2024, 2, 18, 8, 0), end: new Date(2024, 2, 18, 15, 0), profileId: 3 },
    ])

    // Check if current time is within school hours (8 AM to 3 PM)
    const checkSchoolHours = () => {
      const now = new Date()
      const schoolStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0)
      const schoolEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0)
      setIsInSchool(now >= schoolStart && now < schoolEnd)
    }

    checkSchoolHours()
    const interval = setInterval(checkSchoolHours, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const filteredEvents = selectedProfile
    ? events.filter(event => event.profileId === selectedProfile)
    : events

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    const eventDescriptions = filteredEvents.map(event => 
      `${event.title} on ${moment(event.start).format('MMMM D, YYYY')} from ${moment(event.start).format('h:mm A')} to ${moment(event.end).format('h:mm A')}`
    ).join('. ')

    try {
      const generatedSummary = await generateSummary(eventDescriptions)
      setSummary(generatedSummary)
    } catch (error) {
      console.error('Error generating summary:', error)
      setSummary('Failed to generate summary. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <User className="mr-2" /> Profiles
        </h2>
        <ul>
          {profiles.map(profile => (
            <li
              key={profile.id}
              className={`cursor-pointer p-2 rounded ${selectedProfile === profile.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedProfile(profile.id)}
            >
              {profile.name}
            </li>
          ))}
        </ul>
        <button
          className={`mt-4 bg-green-500 text-white p-2 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleGenerateSummary}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p className="text-sm">{summary}</p>
        </div>
        <div className="mt-4 flex items-center">
          <School className={`mr-2 ${isInSchool ? 'text-green-500' : 'text-orange-500'}`} />
          <span>{isInSchool ? 'In School' : 'Not in School'}</span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <CalendarIcon className="mr-2" /> Calendar
        </h1>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 100px)' }}
        />
      </div>
    </div>
  )
}

export default App