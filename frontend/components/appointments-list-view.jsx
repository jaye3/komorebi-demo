"use client"

import { useState, useMemo } from "react"
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, User, Video, Phone, Trash2, RefreshCw, CalendarIcon, ArrowUpDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AppointmentsListView({ appointments, doctors, onAppointmentUpdate, onAppointmentDelete }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })
  const [rescheduleDialog, setRescheduleDialog] = useState({ open: false, appointment: null })
  const [rescheduleDate, setRescheduleDate] = useState(undefined)
  const [rescheduleTime, setRescheduleTime] = useState("")

  // Filter appointments based on search term, doctor, and status
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Doctor filter
      const matchesDoctor = selectedDoctor === "all" || appointment.doctorName === selectedDoctor

      // Status filter
      let matchesStatus = true
      if (selectedStatus === "upcoming") {
        const appointmentDate = parseISO(`${appointment.date}T${convertTo24Hour(appointment.time)}`)
        matchesStatus = isAfter(appointmentDate, new Date())
      } else if (selectedStatus === "today") {
        matchesStatus = isToday(parseISO(appointment.date))
      } else if (selectedStatus === "past") {
        const appointmentDate = parseISO(`${appointment.date}T${convertTo24Hour(appointment.time)}`)
        matchesStatus = isBefore(appointmentDate, new Date()) && !isToday(parseISO(appointment.date))
      }

      return matchesSearch && matchesDoctor && matchesStatus
    })
  }, [appointments, searchTerm, selectedDoctor, selectedStatus])

  // Sort appointments
  const sortedAppointments = useMemo(() => {
    const sortableAppointments = [...filteredAppointments]

    sortableAppointments.sort((a, b) => {
      let aValue, bValue

      if (sortConfig.key === "date") {
        // Sort by date and time
        const aDateTime = parseISO(`${a.date}T${convertTo24Hour(a.time)}`)
        const bDateTime = parseISO(`${b.date}T${convertTo24Hour(b.time)}`)
        return sortConfig.direction === "asc"
          ? aDateTime.getTime() - bDateTime.getTime()
          : bDateTime.getTime() - aDateTime.getTime()
      } else if (sortConfig.key === "patientName") {
        aValue = a.patientName
        bValue = b.patientName
      } else if (sortConfig.key === "doctorName") {
        aValue = a.doctorName
        bValue = b.doctorName
      } else if (sortConfig.key === "type") {
        aValue = a.type
        bValue = b.type
      } else if (sortConfig.key === "method") {
        aValue = a.method
        bValue = b.method
      }

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sortableAppointments
  }, [filteredAppointments, sortConfig])

  // Helper function to convert 12-hour time to 24-hour format for sorting
  function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")

    if (hours === "12") {
      hours = "00"
    }

    if (modifier === "PM") {
      hours = Number.parseInt(hours, 10) + 12
    }

    // Convert hours to string before using padStart
    return `${String(hours).padStart(2, "0")}:${minutes}:00`
  }

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
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

  // Handle appointment rescheduling
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

    // Show success toast
    toast({
      title: "Appointment rescheduled",
      description: `The appointment has been rescheduled to ${newDate} at ${rescheduleTime}.`,
    })
  }

  // Get status badge for appointment
  const getStatusBadge = (appointment) => {
    const appointmentDate = parseISO(`${appointment.date}T${convertTo24Hour(appointment.time)}`)

    if (isToday(parseISO(appointment.date))) {
      return <Badge className="bg-green-100 text-green-700">Today</Badge>
    } else if (isAfter(appointmentDate, new Date())) {
      return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-700">Past</Badge>
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search appointments..."
            className="pl-8 border-gray-200 focus-visible:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
  <SelectTrigger className="w-[180px] border-gray-200 focus:ring-green-500">
    <SelectValue placeholder="Filter by doctor" />
  </SelectTrigger>
  <SelectContent className="bg-white shadow-md z-50 border border-gray-200 rounded-md">
    <SelectItem value="all" className="flex items-center gap-2 pl-6">
      All Doctors
    </SelectItem>
    {doctors.map((doctor) => (
      <SelectItem key={doctor.id} value={doctor.name} className="flex items-center gap-2 pl-6">
        {doctor.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>



          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px] border-gray-200 focus:ring-green-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => requestSort("date")}>
                <div className="flex items-center">
                  Date & Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("patientName")}>
                <div className="flex items-center">
                  Patient
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort("doctorName")}>
                <div className="flex items-center">
                  Doctor
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort("type")}>
                <div className="flex items-center">
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort("method")}>
                <div className="flex items-center">
                  Method
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="font-medium">{format(parseISO(appointment.date), "MMM d, yyyy")}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="text-sm text-gray-500">{appointment.patientId}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{appointment.doctorName}</TableCell>
                  <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      {appointment.method === "Video" && <Video className="h-4 w-4 mr-1 text-blue-500" />}
                      {appointment.method === "Phone" && <Phone className="h-4 w-4 mr-1 text-yellow-500" />}
                      {appointment.method === "In-person" && <User className="h-4 w-4 mr-1 text-green-500" />}
                      <span>{appointment.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-200 hover:bg-green-50"
                        onClick={() => {
                          setRescheduleDialog({ open: true, appointment })
                          setRescheduleDate(parseISO(appointment.date))
                          setRescheduleTime(appointment.time)
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Reschedule</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteDialog({ open: true, appointment })}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Cancel</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No appointments found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                  <div className="text-sm">{format(parseISO(deleteDialog.appointment.date), "MMM d, yyyy")}</div>
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

      {/* Reschedule dialog */}
      <Dialog
        open={rescheduleDialog.open}
        onOpenChange={(open) => !open && setRescheduleDialog({ open, appointment: null })}
      >
        <DialogContent className="sm:max-w-[425px] pointer-events-auto">
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
                  <div className="text-sm">{format(parseISO(rescheduleDialog.appointment.date), "MMM d, yyyy")}</div>
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rescheduleDate ? format(rescheduleDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[60]">
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



