"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarDays, List } from "lucide-react"
import AppointmentsCalendar from "@/components/appointments-calendar"
import AppointmentsListView from "@/components/appointments-list-view"

// Mock data - in a real app, this would come from your backend
const initialAppointments = [
  {
    id: 1,
    patientName: "Moon Knight",
    patientId: "P-1024",
    doctorName: "Dr. Lady Gaga",
    date: "2025-03-15",
    time: "09:00 AM",
    duration: 30,
    type: "Check-up",
    method: "In-person",
    status: "Confirmed",
  },
  {
    id: 2,
    patientName: "James Rodriguez",
    patientId: "P-1025",
    doctorName: "Dr. Lady Gaga",
    date: "2025-03-15",
    time: "10:30 AM",
    duration: 45,
    type: "Follow-up",
    method: "Video",
    status: "Confirmed",
  },
  {
    id: 3,
    patientName: "Sophia Chen",
    patientId: "P-1026",
    doctorName: "Dr. Lady Gaga",
    date: "2025-03-15",
    time: "11:45 AM",
    duration: 30,
    type: "Consultation",
    method: "In-person",
    status: "Confirmed",
  },
  {
    id: 4,
    patientName: "Michael Brown",
    patientId: "P-1027",
    doctorName: "Dr. Lady Gaga",
    date: "2025-03-15",
    time: "01:15 PM",
    duration: 30,
    type: "Check-up",
    method: "Phone",
    status: "Confirmed",
  },
  {
    id: 5,
    patientName: "Olivia Taylor",
    patientId: "P-1028",
    doctorName: "Dr. Lady Gaga",
    date: "2025-03-15",
    time: "02:30 PM",
    duration: 45,
    type: "Follow-up",
    method: "Video",
    status: "Confirmed",
  },
  {
    id: 6,
    patientName: "William Johnson",
    patientId: "P-1029",
    doctorName: "Dr. David Kim",
    date: "2025-03-18",
    time: "09:15 AM",
    duration: 30,
    type: "Check-up",
    method: "In-person",
    status: "Confirmed",
  },
  {
    id: 7,
    patientName: "Ava Martinez",
    patientId: "P-1030",
    doctorName: "Dr. Lisa Johnson",
    date: "2025-03-19",
    time: "11:00 AM",
    duration: 60,
    type: "Initial Consultation",
    method: "In-person",
    status: "Confirmed",
  },
  {
    id: 8,
    patientName: "Ethan Wilson",
    patientId: "P-1031",
    doctorName: "Dr. Robert Garcia",
    date: "2025-03-20",
    time: "03:45 PM",
    duration: 30,
    type: "Follow-up",
    method: "Phone",
    status: "Confirmed",
  },
  {
    id: 9,
    patientName: "Emma Wilson",
    patientId: "P-1024",
    doctorName: "Dr. Sarah Reynolds",
    date: "2025-03-21",
    time: "10:00 AM",
    duration: 30,
    type: "Check-up",
    method: "In-person",
    status: "Confirmed",
  },
  {
    id: 10,
    patientName: "James Rodriguez",
    patientId: "P-1025",
    doctorName: "Dr. Michael Brown",
    date: "2025-03-22",
    time: "01:30 PM",
    duration: 45,
    type: "Follow-up",
    method: "Video",
    status: "Confirmed",
  },
]

// Mock doctors data
const doctors = [
  { id: 1, name: "Dr. Lady Gaga" },
  { id: 2, name: "Dr. Ariana Grande" },
  { id: 3, name: "Dr. Beyonce Knowles" },
  { id: 4, name: "Dr. Michael Brown" },
  { id: 5, name: "Dr. Lisa Johnson" },
  { id: 6, name: "Dr. Robert Garcia" },
  { id: 7, name: "Dr. David Kim" },
]

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [activeView, setActiveView] = useState("calendar")

  // Handle appointment update
  const handleAppointmentUpdate = (id, updatedData) => {
    setAppointments(
      appointments.map((appointment) => {
        if (appointment.id === id) {
          return { ...appointment, ...updatedData }
        }
        return appointment
      }),
    )
  }

  // Handle appointment deletion
  const handleAppointmentDelete = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  return (
    <div>
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calendar" className="mt-0">
          <AppointmentsCalendar
            appointments={appointments}
            onAppointmentUpdate={handleAppointmentUpdate}
            onAppointmentDelete={handleAppointmentDelete}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <AppointmentsListView
            appointments={appointments}
            doctors={doctors}
            onAppointmentUpdate={handleAppointmentUpdate}
            onAppointmentDelete={handleAppointmentDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

