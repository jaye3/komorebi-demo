"use client";
import { Suspense } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import PatientsList from "@/components/patients-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Patients</h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-700">Patient Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PatientsSkeleton />}>
                <PatientsList />
              </Suspense>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function PatientsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        {Array(8)
          .fill()
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
      </div>
    </div>
  )
}

