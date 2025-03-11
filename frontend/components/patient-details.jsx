"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react"

export default function PatientDetails({ patient }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-green-100 text-green-700 text-2xl">{patient.initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-green-800">{patient.name}</h2>
                <p className="text-green-600">{patient.id}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{patient.status}</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-white">
                  {patient.gender}, {patient.age} years
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-white">
                  Blood Type: {patient.bloodType}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                {patient.contact}
              </li>
              <li className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-green-600" />
                {patient.email}
              </li>
              <li className="flex items-start text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                <span>{patient.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Medical Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Conditions</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.conditions.map((condition) => (
                    <Badge key={condition} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies.map((allergy) => (
                    <Badge key={allergy} variant="outline" className="border-red-200 text-red-700 bg-red-50">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Appointments</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Last Visit</p>
                  <p>{patient.lastVisit}</p>
                </div>
              </li>
              <li className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Next Appointment</p>
                  <p>{patient.nextAppointment}</p>
                </div>
              </li>
            </ul>

            <div className="mt-4 flex space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Schedule
              </Button>
              <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

