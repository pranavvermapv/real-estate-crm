"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Lead {
  id: number;
  name: string;
  phone_number: string;
}

interface LeadDocument {
  id: number;
  lead_id: number;
  file_name: string;
  file_path: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [leadDocuments, setLeadDocuments] = useState<LeadDocument[]>([]);



  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/leads");
      setLeads(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch leads.", variant: "destructive" });
    }
  };

  const handleAddLead = async () => {
    if (!name || !phone_number) {
      return toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
    }
    try {
      const response = await axios.post("http://localhost:3001/api/leads", { name, phone_number });
      setLeads([...leads, response.data]);
      setName("");
      setPhoneNumber("");
      toast({ title: "Lead added successfully", description: `${name} has been added.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add lead.", variant: "destructive" });
    }
  };

  const handleEditClick = (lead: Lead) => {
    setEditLead(lead);
  };

  const handleSaveEdit = async () => {
    if (!editLead) return;
    try {
      await axios.put(`http://localhost:3001/api/leads/${editLead.id}`, editLead);
      setLeads(leads.map((lead) => (lead.id === editLead.id ? editLead : lead)));
      setEditLead(null);
      toast({ title: "Lead updated successfully", description: `Lead ${editLead.id} updated.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update lead.", variant: "destructive" });
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/leads/${id}`);
      setLeads(leads.filter((lead) => lead.id !== id));
      toast({ title: "Lead deleted successfully", description: `Lead ${id} removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete lead.", variant: "destructive" });
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadDocument = async (leadId: number) => {
    if (!selectedFile) {
      return toast({
        title: "Error",
        description: "Please select a file.",
        variant: "destructive",
      });
    }
  
    // Ensure the selected file is a PDF
    if (selectedFile.type !== "application/pdf") {
      return toast({
        title: "Error",
        description: "Only PDF files are allowed.",
        variant: "destructive",
      });
    }
  
    const formData = new FormData();
    formData.append("pdf", selectedFile); // Ensure backend expects "pdf"
  
    try {
      const response = await axios.post(`http://localhost:3001/api/leads/${leadId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const newDocument: LeadDocument = response.data; // Backend should return uploaded document details
  
      setLeadDocuments((prevDocuments) => [...prevDocuments, newDocument]);
  
      toast({
        title: "Success",
        description: "Document uploaded successfully!",
      });
  
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    }
  };
  

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leads Management</h1>
      <div className="mb-6 flex gap-4">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Phone Number" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Button onClick={handleAddLead}>Add Lead</Button>
      </div>
      <Input placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-6 max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.phone_number}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(lead)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editLead && editLead.id === lead.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Lead</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Label>Name</Label>
                          <Input value={editLead.name} onChange={(e) => setEditLead({ ...editLead, name: e.target.value })} />
                          <Label>Phone Number</Label>
                          <Input value={editLead.phone_number} onChange={(e) => setEditLead({ ...editLead, phone_number: e.target.value })} />
                        </div>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteLead(lead.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                  <input type="file" onChange={handleFileChange} className="hidden" id={`file-upload-${lead.id}`} />
                  <label htmlFor={`file-upload-${lead.id}`}>
                    <Button variant="outline" size="icon" onClick={() => handleUploadDocument(lead.id)}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
