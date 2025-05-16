
import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

const MachineInstallation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    machineModel: '',
    serialNumber: '',
    installationDate: new Date().toISOString().split('T')[0],
    installedBy: user?.name || '',
    location: '',
    notes: '',
  });

  // Check if user has permission to fill this form
  const canFillForm = user?.role === UserRole.COMPANY_EMPLOYEE || user?.role === UserRole.DEALER_EMPLOYEE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.machineModel || !formData.serialNumber || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    // Simulating API call with timeout
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Machine installation recorded successfully",
      });
      setIsSubmitting(false);
      navigate('/machines');
    }, 1000);
  };
  
  // Machine model options - in a real app this would come from an API
  const machineModels = [
    "CLX-5000 Standard",
    "CLX-6000 Pro",
    "CLX-7500 Enterprise",
    "RVX-200 Compact",
    "RVX-300 Advanced",
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Machine Installation Form</CardTitle>
            <CardDescription>
              Record a new machine installation for client sites
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Machine Model */}
              <div className="space-y-2">
                <Label htmlFor="machineModel">Machine Model *</Label>
                <Select 
                  value={formData.machineModel}
                  onValueChange={(value) => handleSelectChange('machineModel', value)}
                  disabled={!canFillForm || isSubmitting}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select machine model" />
                  </SelectTrigger>
                  <SelectContent>
                    {machineModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="e.g. CLX5000-12345-AB"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  disabled={!canFillForm || isSubmitting}
                  required
                />
              </div>

              {/* Installation Date */}
              <div className="space-y-2">
                <Label htmlFor="installationDate">Installation Date *</Label>
                <Input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={handleChange}
                  disabled={!canFillForm || isSubmitting}
                  required
                />
              </div>

              {/* Installed By */}
              <div className="space-y-2">
                <Label htmlFor="installedBy">Installed By *</Label>
                <Input
                  id="installedBy"
                  name="installedBy"
                  value={formData.installedBy}
                  onChange={handleChange}
                  disabled={true} // Automatically filled with current user
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Client Site Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. 123 Main St, Suite 200, New York, NY 10001"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!canFillForm || isSubmitting}
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Installation Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter any additional notes about the installation..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!canFillForm || isSubmitting}
                  rows={4}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canFillForm || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Installation'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MachineInstallation;
