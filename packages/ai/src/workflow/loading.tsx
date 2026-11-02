import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"

export default function Loading() {
  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <Skeleton className="h-10 w-full mb-6" />

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageBackground>
  )
}
