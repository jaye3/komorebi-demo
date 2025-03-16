import { Suspense } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import AppointmentsView from "@/components/appointments-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Appointments</h1>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-green-700">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<AppointmentsSkeleton />}>
                <AppointmentsView />
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
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-7 gap-2">
        {Array(7)
          .fill()
          .map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-10 w-full" />
          ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array(35)
          .fill()
          .map((_, i) => (
            <Skeleton key={`day-${i}`} className="h-32 w-full" />
          ))}
      </div>
    </div>
  )
}


