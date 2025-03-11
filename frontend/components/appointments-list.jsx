"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Video, Phone } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const appointments = [
  {
    id: 1,
    patientName: "Emma Wilson",
    patientId: "P-1024",
    time: "09:00 AM",
    type: "Check-up",
    status: "Completed",
    method: "In-person",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EW",
  },
  {
    id: 2,
    patientName: "James Rodriguez",
    patientId: "P-1025",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Completed",
    method: "Video",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JR",
  },
  {
    id: 3,
    patientName: "Sophia Chen",
    patientId: "P-1026",
    time: "11:45 AM",
    type: "Consultation",
    status: "In Progress",
    method: "In-person",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SC",
  },
  {
    id: 4,
    patientName: "Michael Brown",
    patientId: "P-1027",
    time: "01:15 PM",
    type: "Check-up",
    status: "Upcoming",
    method: "Phone",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
  },
  {
    id: 5,
    patientName: "Olivia Taylor",
    patientId: "P-1028",
    time: "02:30 PM",
    type: "Follow-up",
    status: "Upcoming",
    method: "Video",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "OT",
  },
]

export default function AppointmentsList() {
  const [filter, setFilter] = useState("all")

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    if (filter === "upcoming") return appointment.status === "Upcoming"
    if (filter === "completed") return appointment.status === "Completed"
    return true
  })

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          All
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
          className={filter === "upcoming" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Completed
        </Button>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-green-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={appointment.avatar} alt={appointment.patientName} />
                <AvatarFallback className="bg-green-100 text-green-700">{appointment.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{appointment.patientName}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">{appointment.patientId}</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full",
                  appointment.method === "Video" && "border-blue-200 text-blue-700 bg-blue-50",
                  appointment.method === "Phone" && "border-yellow-200 text-yellow-700 bg-yellow-50",
                  appointment.method === "In-person" && "border-green-200 text-green-700 bg-green-50",
                )}
              >
                {appointment.method === "Video" && <Video className="h-3 w-3 mr-1" />}
                {appointment.method === "Phone" && <Phone className="h-3 w-3 mr-1" />}
                {appointment.method}
              </Badge>

              <Badge
                className={cn(
                  "rounded-full",
                  appointment.status === "Completed" && "bg-gray-100 text-gray-700",
                  appointment.status === "In Progress" && "bg-blue-100 text-blue-700",
                  appointment.status === "Upcoming" && "bg-green-100 text-green-700",
                )}
              >
                {appointment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

