import { Suspense } from "react"
import { notFound } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import PatientDetails from "@/components/patient-details"
import PatientAppointments from "@/components/patient-appointments"
import PatientSentimentAnalysis from "@/components/patient-sentiment-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Mock function to get patient data - in a real app, this would fetch from your backend
function getPatient(id) {
  // This is just mock data for demonstration
  const patients = {
    "P-1024": {
      id: "P-1024",
      name: "Moon Knight",
      age: 34,
      gender: "Female",
      contact: "+65 98543788",
      email: "moonknight@gmail.com",
      address: "Ang Mo Kio Avenue 5, Singapore 525534",
      bloodType: "O+",
      allergies: ["Seafood"],
      conditions: ["Eczema"],
      lastVisit: "2025-01-05",
      nextAppointment: "2025-03-15; 9:00 AM",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      initials: "MK",
    },
    "P-1025": {
      id: "P-1025",
      name: "James Rodriguez",
      age: 45,
      gender: "Male",
      contact: "+1 (555) 234-5678",
      email: "james.rodriguez@example.com",
      address: "456 Oak Ave, Somewhere, NY 10001",
      bloodType: "A-",
      allergies: ["Sulfa drugs"],
      conditions: ["Diabetes", "High cholesterol"],
      lastVisit: "2023-10-12",
      nextAppointment: "2025-01-05;10.30 AM",
      status: "Active",
      avatar: "/placeholder.svg?height=120&width=120",
      initials: "JR",
    },
  }

  return patients[id] || null
}

export default function PatientPage({ params }) {
  const patient = getPatient(params.id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Patient Details</h1>

          <div className="mb-6">
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <PatientDetails patient={patient} />
            </Suspense>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                AI Summary
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="sentiment"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                Sentiment Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-700">AI-Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                    <div className="prose max-w-none">
                      <p className="text-gray-700">
                        <strong>Patient Overview:</strong> Moon Knight is a 34-year-old female with a history of
                        eczema. She has been a patient at Derma Care since 2022 and attends regular appointments for skin management.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Recent Medical History:</strong>: During her last visit on January 5, 2025, Moon reported a flare-up of itchy, red patches on her elbows and knees, consistent with eczema, worsesned by dry weather. 
                        Skin examination revealed moderate eczematous lesions with some scaling.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Current Medications:</strong>
                      </p>
                      <ul className="list-disc pl-5 text-gray-700">
                        <li>Hydrocortisone 1% cream twice daily for eczema flare-ups</li>
                        <li>Moisturizing emollient (e.g., CeraVe) applied daily for skin barrier support</li>
                      </ul>

                      <p className="text-gray-700 mt-4">
                        <strong>Treatment Plan:</strong>Continue current medications. Advised to apply emollient generously after showers to lock in moisture and reduce eczema triggers. 
                        Recommended avoiding known irritants (e.g., wool clothing). Follow-up scheduled for March 15, 2025, to monitor skin improvement.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Notes from Telegram Check-ins:</strong>Moon has been using the telegram bot to report eczema severity.
                         Over the past month, she noted fewer flare-ups after increasing emollient use, with itchiness reduced by 50%. 
                         She reports applying hydrocortisone cream only 2-3 times per week during this period.
                      </p>
                    </div>
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-700">Appointment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                    <PatientAppointments patientId={patient.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-700">
                    Behavioral & Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                    <PatientSentimentAnalysis patientId={patient.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

