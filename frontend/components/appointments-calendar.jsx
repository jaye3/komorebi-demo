"use client"

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  User,
  Video,
  Phone,
  Trash2,
  CalendarPlus2Icon as CalendarIcon2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"



export default function AppointmentsCalendar({ appointments = [], onAppointmentUpdate, onAppointmentDelete }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })

  // Add state for the day dialog
  const [dayDialog, setDayDialog] = useState({ open: false, date: null, day: null })
  const [rescheduleDialog, setRescheduleDialog] = useState({ open: false, appointment: null })
  const [rescheduleDate, setRescheduleDate] = useState(undefined)
  const [rescheduleTime, setRescheduleTime] = useState("")

  useEffect(() => {
    document.body.style.pointerEvents = "auto"; // Enable interaction
    return () => {
      document.body.style.pointerEvents = ""; // Reset when unmounting
    };
  }, []);

  // Get current year and month
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Get month name
  const monthName = currentDate.toLocaleString("default", { month: "long" })

  // Days of week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get all doctors from appointments
  const doctors = Array.from(new Set(appointments.map((appointment) => appointment.doctorName))).map((name, index) => ({
    id: index + 1,
    name,
  }))

  // Filter appointments by selected doctor
  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedDoctor === "all") return true
    return appointment.doctorName === selectedDoctor
  })

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (day) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return filteredAppointments.filter((appointment) => appointment.date === date)
  }

  // Handle appointment deletion
  const handleDeleteAppointment = () => {
    if (!deleteDialog.appointment) return

    // Call the parent component's delete handler
    onAppointmentDelete(deleteDialog.appointment.id)

    // Close dialog
    setDeleteDialog({ open: false, appointment: null })

    // Show success toast
    toast({
      title: "Appointment cancelled",
      description: "The appointment has been successfully cancelled.",
    })
  }

  // Add a function to handle day click
  const handleDayClick = (day) => {
    if (day === null) return

    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayAppointments = getAppointmentsForDay(day)

    if (dayAppointments.length > 0) {
      setDayDialog({ open: true, date, day })
    }
  }

  // Add a function to handle reschedule
  const handleReschedule = () => {
    if (!rescheduleDialog.appointment || !rescheduleDate || !rescheduleTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for rescheduling.",
        variant: "destructive",
      })
      return
    }

    // Format the new date
    const newDate = format(rescheduleDate, "yyyy-MM-dd")

    // Call the parent component's update handler
    onAppointmentUpdate(rescheduleDialog.appointment.id, {
      date: newDate,
      time: rescheduleTime,
    })

    // Close dialog
    setRescheduleDialog({ open: false, appointment: null })
    setRescheduleDate(undefined)
    setRescheduleTime("")

    // Close day dialog if open
    if (dayDialog.open) {
      setDayDialog({ open: false, date: null, day: null })
    }

    // Show success toast
    toast({
      title: "Appointment rescheduled",
      description: `The appointment has been rescheduled to ${newDate} at ${rescheduleTime}.`,
    })
  }

  // Generate calendar grid
  const calendarGrid = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.push(day)
  }

  // Get today's date for highlighting
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear
  const todayDate = today.getDate()

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>

          <h2 className="text-lg font-medium">
            {monthName} {currentYear}
          </h2>

          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>

          <Button variant="outline" size="sm" onClick={goToToday} className="ml-2">
            Today
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-[180px] border-gray-200 focus:ring-green-500">
              <SelectValue placeholder="Filter by doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        {/* Calendar header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 bg-white">
          {calendarGrid.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-b border-r ${
                day === null ? "bg-gray-50" : "cursor-pointer hover:bg-green-50"
              } ${isCurrentMonth && day === todayDate ? "bg-green-50" : ""}`}
              onClick={() => day !== null && handleDayClick(day)}
            >
              {day !== null && (
                <>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isCurrentMonth && day === todayDate ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </div>

                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {getAppointmentsForDay(day).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-1 rounded text-xs bg-white border border-green-100 hover:border-green-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-green-700">{appointment.time}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteDialog({ open: true, appointment })
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Cancel appointment</span>
                          </Button>
                        </div>
                        <div className="font-medium truncate">{appointment.patientName}</div>
                        <div className="flex items-center text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span className="truncate">{appointment.doctorName}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1 py-0 h-4 ${
                              appointment.method === "Video"
                                ? "border-blue-200 text-blue-700 bg-blue-50"
                                : appointment.method === "Phone"
                                  ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                  : "border-green-200 text-green-700 bg-green-50"
                            }`}
                          >
                            {appointment.method === "Video" && <Video className="h-2 w-2 mr-1" />}
                            {appointment.method === "Phone" && <Phone className="h-2 w-2 mr-1" />}
                            {appointment.method}
                          </Badge>
                          <span className="text-[10px] text-gray-500">{appointment.duration} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open, appointment: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteDialog.appointment && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Patient:</div>
                  <div className="text-sm">{deleteDialog.appointment.patientName}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Date:</div>
                  <div className="text-sm">{deleteDialog.appointment.date}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Time:</div>
                  <div className="text-sm">{deleteDialog.appointment.time}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Doctor:</div>
                  <div className="text-sm">{deleteDialog.appointment.doctorName}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Type:</div>
                  <div className="text-sm">{deleteDialog.appointment.type}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, appointment: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>
              Delete Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day appointments dialog */}
      <Dialog open={dayDialog.open} onOpenChange={(open) => !open && setDayDialog({ open, date: null, day: null })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointments for {dayDialog.date}</DialogTitle>
            <DialogDescription>View, reschedule, or cancel appointments for this day.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {dayDialog.date &&
                dayDialog.day &&
                getAppointmentsForDay(dayDialog.day).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 rounded border border-gray-100 hover:border-green-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-green-700">
                          {appointment.time} ({appointment.duration} min)
                        </div>
                        <div className="font-medium">
                          {appointment.patientName} ({appointment.patientId})
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <User className="h-3 w-3 mr-1" />
                          <span>{appointment.doctorName}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              appointment.method === "Video"
                                ? "border-blue-200 text-blue-700 bg-blue-50"
                                : appointment.method === "Phone"
                                  ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                  : "border-green-200 text-green-700 bg-green-50"
                            }`}
                          >
                            {appointment.method === "Video" && <Video className="h-3 w-3 mr-1" />}
                            {appointment.method === "Phone" && <Phone className="h-3 w-3 mr-1" />}
                            {appointment.method === "In-person" && <User className="h-3 w-3 mr-1" />}
                            {appointment.method}
                          </Badge>
                          <Badge className="ml-2 text-xs">{appointment.type}</Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-700 border-green-200 hover:bg-green-50"
                          onClick={() => {
                            setRescheduleDialog({ open: true, appointment })
                            // Initialize with current values
                            setRescheduleDate(new Date(appointment.date))
                            setRescheduleTime(appointment.time)
                          }}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setDeleteDialog({ open: true, appointment })
                            setDayDialog({ open: false, date: null, day: null })
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDayDialog({ open: false, date: null, day: null })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog
        open={rescheduleDialog.open}
        onOpenChange={(open) => !open && setRescheduleDialog({ open, appointment: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Select a new date and time for this appointment.</DialogDescription>
          </DialogHeader>

          {rescheduleDialog.appointment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Patient:</div>
                  <div className="text-sm">{rescheduleDialog.appointment.patientName}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Current Date:</div>
                  <div className="text-sm">{rescheduleDialog.appointment.date}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Current Time:</div>
                  <div className="text-sm">{rescheduleDialog.appointment.time}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">New Date:</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon2 className="mr-2 h-4 w-4" />
                        {rescheduleDate ? format(rescheduleDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={rescheduleDate} onSelect={setRescheduleDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">New Time:</div>
                  <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                    <SelectTrigger className="w-full border-gray-200 focus:ring-green-500">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                      <SelectItem value="08:30 AM">08:30 AM</SelectItem>
                      <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                      <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                      <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                      <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                      <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                      <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                      <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                      <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialog({ open: false, appointment: null })}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleReschedule}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

