"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Reynolds",
    specialty: "Cardiologist",
    status: "Available",
    location: "Main Clinic",
    nextAvailable: "Now",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "SR",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    status: "Available",
    location: "East Wing",
    nextAvailable: "2:30 PM",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "JW",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrician",
    status: "Available",
    location: "Children's Ward",
    nextAvailable: "3:15 PM",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "EC",
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    specialty: "Dermatologist",
    status: "Available",
    location: "West Wing",
    nextAvailable: "4:00 PM",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "MB",
  },
  {
    id: 5,
    name: "Dr. Lisa Johnson",
    specialty: "Psychiatrist",
    status: "Busy",
    location: "Mental Health Dept.",
    nextAvailable: "Tomorrow, 9:00 AM",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "LJ",
  },
  {
    id: 6,
    name: "Dr. Robert Garcia",
    specialty: "Orthopedic Surgeon",
    status: "In Surgery",
    location: "Surgery Wing",
    nextAvailable: "Tomorrow, 11:30 AM",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "RG",
  },
  {
    id: 7,
    name: "Dr. Olivia Martinez",
    specialty: "Endocrinologist",
    status: "On Leave",
    location: "Main Clinic",
    nextAvailable: "Next Week",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "OM",
  },
  {
    id: 8,
    name: "Dr. David Kim",
    specialty: "General Practitioner",
    status: "Available",
    location: "Main Clinic",
    nextAvailable: "Now",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "DK",
  },
]

export default function DoctorAvailability() {
  // Filter only available doctors
  const availableDoctors = doctors.filter((doctor) => doctor.status === "Available")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {availableDoctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-green-100 transition-colors"
        >
          <div className="p-4 text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="bg-green-100 text-green-700 text-xl">{doctor.initials}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">{doctor.name}</h3>
            <p className="text-gray-500 text-sm">{doctor.specialty}</p>

            <div className="mt-3 flex justify-center">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{doctor.status}</Badge>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {doctor.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Next available: {doctor.nextAvailable}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Book
              </Button>
              <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                Profile
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

