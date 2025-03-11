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
      name: "Emma Wilson",
      age: 34,
      gender: "Female",
      contact: "+1 (555) 123-4567",
      email: "emma.wilson@example.com",
      address: "123 Main St, Anytown, CA 94321",
      bloodType: "O+",
      allergies: ["Penicillin", "Peanuts"],
      conditions: ["Hypertension", "Asthma"],
      lastVisit: "2023-10-15",
      nextAppointment: "2023-11-05",
      status: "Active",
      avatar: "/placeholder.svg?height=120&width=120",
      initials: "EW",
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
      nextAppointment: "2023-11-10",
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
                        <strong>Patient Overview:</strong> Emma Wilson is a 34-year-old female with a history of
                        hypertension and asthma. She has been a patient at Komorebi Health since 2020 and maintains
                        regular follow-up appointments.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Recent Medical History:</strong> During her last visit on October 15, 2023, Emma
                        reported occasional shortness of breath, particularly during physical activity. Her blood
                        pressure was slightly elevated at 135/85 mmHg. Lung function tests showed mild airway
                        obstruction consistent with her asthma diagnosis.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Current Medications:</strong>
                      </p>
                      <ul className="list-disc pl-5 text-gray-700">
                        <li>Lisinopril 10mg daily for hypertension</li>
                        <li>Albuterol inhaler as needed for asthma symptoms</li>
                        <li>Fluticasone inhaler twice daily for asthma maintenance</li>
                      </ul>

                      <p className="text-gray-700 mt-4">
                        <strong>Treatment Plan:</strong> Continue current medication regimen. Recommended increased
                        physical activity with proper warm-up to improve cardiovascular health and asthma management.
                        Scheduled follow-up appointment for November 5, 2023, to reassess blood pressure control and
                        asthma symptoms.
                      </p>

                      <p className="text-gray-700 mt-4">
                        <strong>Notes from WhatsApp Check-ins:</strong> Patient has been consistently logging her blood
                        pressure readings through the WhatsApp bot. Readings have shown improvement over the past month,
                        with an average of 128/82 mmHg. She reports using her rescue inhaler approximately 2-3 times per
                        week, which is consistent with previous patterns.
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

