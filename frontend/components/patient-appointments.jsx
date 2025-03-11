"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Video, Phone, User } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const appointmentsData = {
  "P-1024": [
    {
      id: 1,
      date: "2023-10-15",
      time: "09:00 AM",
      doctor: "Dr. Sarah Reynolds",
      type: "Check-up",
      status: "Completed",
      method: "In-person",
      notes:
        "Patient reported occasional shortness of breath. Blood pressure slightly elevated at 135/85 mmHg. Lung function tests showed mild airway obstruction consistent with asthma diagnosis.",
    },
    {
      id: 2,
      date: "2023-09-01",
      time: "10:30 AM",
      doctor: "Dr. James Wilson",
      type: "Follow-up",
      status: "Completed",
      method: "Video",
      notes:
        "Patient reported good control of asthma symptoms. Blood pressure within normal range at 128/82 mmHg. Continued current medication regimen.",
    },
    {
      id: 3,
      date: "2023-07-18",
      time: "11:45 AM",
      doctor: "Dr. Sarah Reynolds",
      type: "Consultation",
      status: "Completed",
      method: "In-person",
      notes:
        "Patient experienced increased frequency of asthma attacks. Adjusted medication dosage and recommended daily peak flow monitoring.",
    },
    {
      id: 4,
      date: "2023-11-05",
      time: "01:15 PM",
      doctor: "Dr. Sarah Reynolds",
      type: "Check-up",
      status: "Scheduled",
      method: "In-person",
      notes: "Follow-up appointment to reassess blood pressure control and asthma symptoms.",
    },
  ],
  "P-1025": [
    {
      id: 1,
      date: "2023-10-12",
      time: "02:30 PM",
      doctor: "Dr. Michael Brown",
      type: "Follow-up",
      status: "Completed",
      method: "In-person",
      notes:
        "Reviewed blood glucose logs. A1C improved to 6.8%. Continued current medication regimen and dietary plan.",
    },
    {
      id: 2,
      date: "2023-11-10",
      time: "03:45 PM",
      doctor: "Dr. Michael Brown",
      type: "Check-up",
      status: "Scheduled",
      method: "Video",
      notes: "Quarterly diabetes management review.",
    },
  ],
}

export default function PatientAppointments({ patientId }) {
  const [expandedNotes, setExpandedNotes] = useState(null)

  const appointments = appointmentsData[patientId] || []

  const toggleNotes = (appointmentId) => {
    if (expandedNotes === appointmentId) {
      setExpandedNotes(null)
    } else {
      setExpandedNotes(appointmentId)
    }
  }

  return (
    <div>
      {appointments.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  {appointments.map((appointment) => (
    <React.Fragment key={appointment.id}>
      <TableRow key={appointment.id}>
        <TableCell>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-gray-400" />
            <span>{appointment.doctor}</span>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center">
            {appointment.method === "Video" && <Video className="h-4 w-4 mr-1 text-blue-500" />}
            {appointment.method === "Phone" && <Phone className="h-4 w-4 mr-1 text-yellow-500" />}
            {appointment.method === "In-person" && <User className="h-4 w-4 mr-1 text-green-500" />}
            <span>{appointment.method}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={
              appointment.status === "Completed"
                ? "border-gray-200 text-gray-700 bg-gray-50"
                : appointment.status === "In Progress"
                ? "border-blue-200 text-blue-700 bg-blue-50"
                : "border-green-200 text-green-700 bg-green-50"
            }
          >
            {appointment.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleNotes(appointment.id)}
            className="text-gray-500 hover:text-green-700"
          >
            <FileText className="h-4 w-4" />
            <span className="sr-only">View Notes</span>
          </Button>
        </TableCell>
      </TableRow>

      {/* ✅ FIX: Add a key to this TableRow */}
      {expandedNotes === appointment.id && (
        <TableRow key={`${appointment.id}-notes`}>
          <TableCell colSpan={6} className="bg-gray-50 p-4">
            <div className="text-sm text-gray-700">
              <h4 className="font-medium mb-1">Notes:</h4>
              <p>{appointment.notes}</p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  ))}
</TableBody>


          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No appointment history found for this patient.</div>
      )}
    </div>
  )
}

