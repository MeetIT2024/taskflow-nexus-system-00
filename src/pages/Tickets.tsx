
import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Ticket, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FilterIcon, PlusCircle, AlertCircle, Clock, RotateCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Mock data for tickets
const mockTickets: Ticket[] = [
  {
    id: '1',
    machineId: '1',
    issueDescription: 'Display showing error code E-501',
    dateReported: '2023-06-10',
    reportedById: '5', // Dealer Employee
    assignedToId: '3', // Company Employee
    status: 'resolved',
    urgency: 'medium',
    resolutionNotes: 'Replaced display module and recalibrated',
  },
  {
    id: '2',
    machineId: '2',
    issueDescription: 'Machine not powering on after installation',
    dateReported: '2023-07-05',
    reportedById: '5', // Dealer Employee
    assignedToId: '3', // Company Employee
    status: 'in-progress',
    urgency: 'high',
  },
  {
    id: '3',
    machineId: '4',
    issueDescription: 'Overheating during extended operation',
    dateReported: '2023-04-12',
    reportedById: '4', // Dealer Admin
    assignedToId: '3', // Company Employee
    status: 'open',
    urgency: 'critical',
  },
];

// Mock machine data for dropdown
const mockMachines = [
  { id: '1', model: 'CLX-5000 Standard', serialNumber: 'CLX5000-12345-AB' },
  { id: '2', model: 'RVX-300 Advanced', serialNumber: 'RVX300-67890-CD' },
  { id: '4', model: 'RVX-200 Compact', serialNumber: 'RVX200-13579-GH' },
];

const Tickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    dateReported: new Date().toISOString().split('T')[0],
    reportedById: user?.id,
    status: 'open',
    urgency: 'medium',
  });
  
  // Check if user can create tickets
  const canCreateTickets = 
    user?.role === UserRole.DEALER_ADMIN || 
    user?.role === UserRole.DEALER_EMPLOYEE;
  
  // Check if user can close tickets
  const canCloseTickets =
    user?.role === UserRole.APPLICATION_ADMIN ||
    user?.role === UserRole.COMPANY_ADMIN ||
    user?.role === UserRole.COMPANY_EMPLOYEE;
  
  // Filter tickets based on search term and status
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    
    // Company users see all tickets
    if (user?.role === UserRole.APPLICATION_ADMIN || 
        user?.role === UserRole.COMPANY_ADMIN || 
        user?.role === UserRole.COMPANY_EMPLOYEE) {
      return matchesSearch && matchesStatus;
    }
    
    // Dealer users only see their own tickets
    if (user?.role === UserRole.DEALER_ADMIN || 
        user?.role === UserRole.DEALER_EMPLOYEE) {
      return matchesSearch && 
        matchesStatus && 
        ticket.reportedById === user.id;
    }
    
    return matchesSearch && matchesStatus;
  });
  
  // Ticket urgency badge styling
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Low</Badge>;
      case 'medium':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">High</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Ticket status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Open</span>
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
            <RotateCw className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Resolved</span>
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Closed</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleTicketChange = (field: string, value: string) => {
    setNewTicket(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCreateTicket = () => {
    if (!newTicket.machineId || !newTicket.issueDescription || !newTicket.urgency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Ticket has been created successfully",
    });
    
    setIsCreateTicketDialogOpen(false);
    setNewTicket({
      dateReported: new Date().toISOString().split('T')[0],
      reportedById: user?.id,
      status: 'open',
      urgency: 'medium',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Service Tickets</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => setIsCreateTicketDialogOpen(true)}
              disabled={!canCreateTickets}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Ticket</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ticket Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Filter:</span>
                <div className="flex gap-2">
                  <Button 
                    variant={statusFilter === null ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                  >
                    All
                  </Button>
                  <Button 
                    variant={statusFilter === 'open' ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('open')}
                  >
                    Open
                  </Button>
                  <Button 
                    variant={statusFilter === 'in-progress' ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={statusFilter === 'resolved' ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('resolved')}
                  >
                    Resolved
                  </Button>
                  <Button 
                    variant={statusFilter === 'closed' ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('closed')}
                  >
                    Closed
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tickets Table */}
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Issue</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Machine</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date Reported</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Urgency</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No tickets found
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map(ticket => {
                        // Find machine details
                        const machine = mockMachines.find(m => m.id === ticket.machineId);
                        
                        return (
                          <tr 
                            key={ticket.id} 
                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                          >
                            <td className="p-4">
                              <p className="line-clamp-2">{ticket.issueDescription}</p>
                            </td>
                            <td className="p-4">
                              <p>{machine?.model || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{machine?.serialNumber}</p>
                            </td>
                            <td className="p-4">{ticket.dateReported}</td>
                            <td className="p-4">{getUrgencyBadge(ticket.urgency)}</td>
                            <td className="p-4">{getStatusBadge(ticket.status)}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                {canCloseTickets && ticket.status !== 'closed' && (
                                  <Button size="sm">
                                    {ticket.status === 'resolved' ? 'Close' : 'Resolve'}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Create Ticket Dialog */}
        <Dialog open={isCreateTicketDialogOpen} onOpenChange={setIsCreateTicketDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Service Ticket</DialogTitle>
              <DialogDescription>
                Submit a service or warranty ticket for a machine.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="machineId">Machine *</Label>
                <Select
                  onValueChange={(value) => handleTicketChange('machineId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMachines.map(machine => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.model} ({machine.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDescription">Issue Description *</Label>
                <Textarea
                  id="issueDescription"
                  value={newTicket.issueDescription || ''}
                  onChange={(e) => handleTicketChange('issueDescription', e.target.value)}
                  placeholder="Describe the issue in detail"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select
                  value={newTicket.urgency}
                  onValueChange={(value) => handleTicketChange('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTicketDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Submit Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;
