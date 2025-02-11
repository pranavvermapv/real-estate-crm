"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Property {
  id: number
  type: "Residential" | "Commercial" | "Land"
  size: string
  location: string
  budget: string
  availability: "Available" | "Sold" | "Under Contract"
}

const API_URL = "http://localhost:3001/api/properties";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [type, setType] = useState<Property["type"]>("Residential")
  const [size, setSize] = useState("")
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [availability, setAvailability] = useState<Property["availability"]>("Available")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load properties", variant: "destructive" })
    }
  }

  const handleAddProperty = async () => {
    if (!size || !location || !budget) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" })
      return
    }
    
    const newProperty = { type, size, location, budget, availability }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty),
      })
      const data = await response.json()
      setProperties([...properties, data])
      setSize("")
      setLocation("")
      setBudget("")
      setAvailability("Available")
      toast({ title: "Success", description: "Property added successfully." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add property.", variant: "destructive" })
    }
  }

  const handleDeleteProperty = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      setProperties(properties.filter((property) => property.id !== id))
      toast({ title: "Deleted", description: "Property removed successfully." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete property.", variant: "destructive" })
    }
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.availability.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Properties Management</h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        <Select onValueChange={(value) => setType(value as Property["type"]) }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <Button onClick={handleAddProperty}>Add Property</Button>
      </div>
      <Input
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.size}</TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>{property.budget}</TableCell>
              <TableCell>{property.availability}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" onClick={() => handleDeleteProperty(property.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

