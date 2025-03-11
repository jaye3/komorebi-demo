"use client";
import { Suspense } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import AppointmentsList from "@/components/appointments-list"
import PatientDemographics from "@/components/patient-demographics"
import DoctorAvailability from "@/components/doctor-availability"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700">1,248</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700">24</p>
                <p className="text-xs text-green-600 mt-1">4 remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Available Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700">8</p>
                <p className="text-xs text-green-600 mt-1">of 12 total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-700">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<AppointmentsSkeleton />}>
                  <AppointmentsList />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-700">Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DemographicsSkeleton />}>
                  <PatientDemographics />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">Available Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DoctorsSkeleton />}>
                <DoctorAvailability />
              </Suspense>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill()
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
    </div>
  )
}

function DemographicsSkeleton() {
  return (
    <div className="h-[300px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

function DoctorsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill()
        .map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
    </div>
  )
}

