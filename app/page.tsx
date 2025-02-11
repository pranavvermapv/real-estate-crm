import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Real Estate CRM Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
            <CardDescription>Number of leads in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">250</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Properties</CardTitle>
            <CardDescription>Properties currently listed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">120</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Deals</CardTitle>
            <CardDescription>Deals in negotiation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">35</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Closed Deals</CardTitle>
            <CardDescription>Successfully closed deals this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">18</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

