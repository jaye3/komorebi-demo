"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data - in a real app, this would come from your backend
const patients = [
  {
    id: "P-1024",
    name: "Moon Knight",
    age: 34,
    gender: "Female",
    contact: "+65 98543788",
    lastVisit: "2025-01-05",
    status: "Active",
    condition: "Eczema",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "MK",
  },
  {
    id: "P-1025",
    name: "James Rodriguez",
    age: 45,
    gender: "Male",
    contact: "+65 83443522",
    lastVisit: "2023-10-12",
    status: "Active",
    condition: "alopecia",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "JR",
  },
  {
    id: "P-1026",
    name: "Sophia Chen",
    age: 28,
    gender: "Female",
    contact: "+65 98764745",
    lastVisit: "2023-10-10",
    status: "Active",
    condition: "Psoriasis",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "SC",
  },
  {
    id: "P-1027",
    name: "Michael Brown",
    age: 52,
    gender: "Male",
    contact: "+65 98576245",
    lastVisit: "2023-10-05",
    status: "Inactive",
    condition:"Vitiligo",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "MB",
  },
  {
    id: "P-1028",
    name: "Olivia Taylor",
    age: 19,
    gender: "Female",
    contact: "+65 98768435",
    lastVisit: "2023-10-03",
    status: "Active",
    condition: "Acne",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "OT",
  },
  {
    id: "P-1029",
    name: "William Johnson",
    age: 67,
    gender: "Male",
    contact: "+65 83945823",
    lastVisit: "2023-09-28",
    status: "Active",
    condition: "Skin Cancer",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "WJ",
  },
  {
    id: "P-1030",
    name: "Ava Martinez",
    age: 31,
    gender: "Female",
    contact: "+65 83597254",
    lastVisit: "2023-09-25",
    status: "Active",
    condition: "Dermatitis",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "AM",
  },
  {
    id: "P-1031",
    name: "Ethan Wilson",
    age: 42,
    gender: "Male",
    contact: "+65 95749256",
    lastVisit: "2023-09-20",
    status: "Inactive",
    condition: "Alopecia",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    initials: "EW",
  },
]

export default function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const itemsPerPage = 5

  // Filter patients based on search term and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Paginate results
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleViewPatient = (patientId) => {
    router.push(`/patients/${patientId}`)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search patients..."
            className="pl-8 border-gray-200 focus-visible:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] border-gray-200 focus:ring-green-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="hidden md:table-cell">Age/Gender</TableHead>
              <TableHead className="hidden lg:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback className="bg-green-100 text-green-700">{patient.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500 md:hidden">{patient.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{patient.id}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.age} / {patient.gender}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{patient.contact}</TableCell>
                  <TableCell className="hidden lg:table-cell">{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        patient.status === "Active"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : "border-gray-200 text-gray-700 bg-gray-50"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleViewPatient(patient.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No patients found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredPatients.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

