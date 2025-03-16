"use client"

import React from "react";
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Video, Phone, User } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const appointmentsData = {
  "P-1024": [ // Moon Knight's Patient ID
    {
      id: 1,
      date: "2024-03-10",
      time: "09:30 AM",
      doctor: "Dr. Lady Gaga",
      type: "Initial Consultation",
      status: "Completed",
      method: "In-person",
      notes:
        "Patient diagnosed with moderate-to-severe eczema, experiencing frequent flare-ups. Prescribed a topical corticosteroid and recommended a fragrance-free skincare routine. Advised to track flare-up triggers, including stress and diet.",
    },
    {
      id: 2,
      date: "2024-04-15",
      time: "02:00 PM",
      doctor: "Dr. Lady Gaga",
      type: "Follow-up",
      status: "Completed",
      method: "Video",
      notes:
        "Patient reported reduced itching but persistent dryness. Increased moisturizer application frequency recommended. Introduced non-steroidal cream for maintenance. Discussed impact of stress on flare-ups and suggested mindfulness techniques.",
    },
    {
      id: 3,
      date: "2024-06-05",
      time: "11:00 AM",
      doctor: "Dr. Lady Gaga",
      type: "Treatment Adjustment",
      status: "Completed",
      method: "In-person",
      notes:
        "Eczema flare-ups worsening due to warmer weather. Switched to a stronger topical steroid for short-term use. Recommended using a humidifier at night and avoiding wool fabrics.",
    },
    {
      id: 4,
      date: "2024-08-12",
      time: "10:30 AM",
      doctor: "Dr. Lady Gaga",
      type: "Allergy Testing",
      status: "Completed",
      method: "In-person",
      notes:
        "Testing for potential allergens (dust mites, pet dander, and specific skincare ingredients) to identify possible eczema triggers. Results showed sensitivity to dust mites and synthetic fragrances.",
    },
    {
      id: 5,
      date: "2025-01-05",
      time: "01:00 PM",
      doctor: "Dr. Ariana Grande",
      type: "Final Review & Long-Term Plan",
      status: "Completed",
      method: "In-person",
      notes:
        "Final follow-up to assess eczema management progress. Reviewing effectiveness of current treatment plan and discussing long-term skin maintenance strategies. Considering phototherapy if flare-ups persist.",
    },
    {
      id: 6,
      date: "2025-03-15",
      time: "09:00 AM",
      doctor: "Dr. Lady Gaga",
      type: "Routine Skin Check",
      status: "Completed",
      method: "In-person",
      notes:
        "Routine follow-up to monitor eczema condition. Evaluating whether maintenance treatments are effective or if adjustments are needed. Discussing any new symptoms or concerns.",
    },
  ],
  "P-1025": [
    {
      id: 1,
      date: "2024-02-28",
      time: "03:00 PM",
      doctor: "Dr. Michael Brown",
      type: "Acne Treatment Consultation",
      status: "Completed",
      method: "In-person",
      notes:
        "Patient presenting with persistent acne. Recommended a combination of benzoyl peroxide and retinoid treatment. Advised on dietary factors and non-comedogenic skincare.",
    },
    {
      id: 2,
      date: "2024-05-10",
      time: "01:15 PM",
      doctor: "Dr. Michael Brown",
      type: "Follow-up",
      status: "Scheduled",
      method: "Video",
      notes:
        "Assessing response to acne treatment. Evaluating potential need for oral medication if no significant improvement.",
    },
  ],
};



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
    <React.Fragment key={`appointment-${appointment.id}`}>
      <TableRow key={`row-${appointment.id}`}>
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

      {/* ✅ Ensure unique key for Notes Row */}
      {expandedNotes === appointment.id && (
        <TableRow key={`notes-${appointment.id}`}>
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

