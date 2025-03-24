
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StaffCard, { StaffMember } from '../components/StaffCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Service } from '../components/ServiceCard';

// Mock data
const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'Lisa Johnson',
    email: 'lisa@example.com',
    phone: '(555) 123-4567',
    position: 'Senior Stylist',
    bio: 'Lisa is an experienced stylist with over 10 years in the industry, specializing in color and cuts.',
    serviceIds: ['1', '3', '6'],
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    rating: 4.8,
    appointmentsCompleted: 256,
  },
  {
    id: '2',
    name: 'David Miller',
    email: 'david@example.com',
    phone: '(555) 234-5678',
    position: 'Barber',
    bio: 'David specializes in men\'s styling, beard trims, and classic cuts with modern techniques.',
    serviceIds: ['1', '2'],
    schedule: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    rating: 4.6,
    appointmentsCompleted: 188,
  },
  {
    id: '3',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    phone: '(555) 345-6789',
    position: 'Nail Technician',
    bio: 'Emily is a certified nail technician with expertise in manicures, pedicures, and nail art.',
    serviceIds: ['4', '5', '6', '8'],
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: false,
    },
    rating: 4.9,
    appointmentsCompleted: 312,
  },
  {
    id: '4',
    name: 'Mark Thompson',
    email: 'mark@example.com',
    phone: '(555) 456-7890',
    position: 'Massage Therapist',
    bio: 'Mark is a licensed massage therapist specializing in therapeutic and relaxation massages.',
    serviceIds: ['7'],
    schedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: false,
    },
    rating: 4.7,
    appointmentsCompleted: 143,
  },
];

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Haircut', description: '', price: 50, duration: 60, category: 'Hair', staffIds: [] },
  { id: '2', name: 'Beard Trim', description: '', price: 25, duration: 30, category: 'Grooming', staffIds: [] },
  { id: '3', name: 'Hair Coloring', description: '', price: 120, duration: 120, category: 'Hair', staffIds: [] },
  { id: '4', name: 'Manicure', description: '', price: 35, duration: 45, category: 'Nails', staffIds: [] },
  { id: '5', name: 'Pedicure', description: '', price: 45, duration: 60, category: 'Nails', staffIds: [] },
  { id: '6', name: 'Facial', description: '', price: 75, duration: 60, category: 'Skin', staffIds: [] },
  { id: '7', name: 'Massage', description: '', price: 90, duration: 60, category: 'Body', staffIds: [] },
  { id: '8', name: 'Waxing', description: '', price: 40, duration: 30, category: 'Body', staffIds: [] },
];

const Staff: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<StaffMember, 'id' | 'rating' | 'appointmentsCompleted'>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    bio: '',
    serviceIds: [],
    schedule: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    imageUrl: '',
  });
  
  // Filter staff by position
  const filteredStaff = staff.filter(member => {
    // Filter by search query
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by position/role
    const matchesPosition = 
      activeTab === 'all' || 
      member.position.toLowerCase().includes(activeTab.toLowerCase());
    
    return matchesSearch && matchesPosition;
  });
  
  // Get unique positions for tabs
  const positions = Array.from(
    new Set(
      staff.map(member => {
        const position = member.position.split(' ')[0]; // Get first word of position
        return position.toLowerCase();
      })
    )
  );
  
  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle schedule selection
  const handleScheduleChange = (day: keyof StaffMember['schedule']) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: !prev.schedule[day],
      },
    }));
  };
  
  // Handle service selection
  const handleServiceSelection = (serviceId: string) => {
    setFormData(prev => {
      const currentServiceIds = [...prev.serviceIds];
      if (currentServiceIds.includes(serviceId)) {
        return {
          ...prev,
          serviceIds: currentServiceIds.filter(id => id !== serviceId),
        };
      } else {
        return {
          ...prev,
          serviceIds: [...currentServiceIds, serviceId],
        };
      }
    });
  };
  
  // Open add staff dialog
  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      bio: '',
      serviceIds: [],
      schedule: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      imageUrl: '',
    });
    setIsAddDialogOpen(true);
  };
  
  // Open edit staff dialog
  const openEditDialog = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    const { rating, appointmentsCompleted, id, ...restOfData } = staffMember;
    setFormData(restOfData);
    setIsEditDialogOpen(true);
  };
  
  // Open delete staff dialog
  const openDeleteDialog = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsDeleteDialogOpen(true);
  };
  
  // Open schedule dialog
  const openScheduleDialog = (staffId: string) => {
    const staffMember = staff.find(member => member.id === staffId);
    if (staffMember) {
      setSelectedStaff(staffMember);
      setFormData(prev => ({
        ...prev,
        schedule: { ...staffMember.schedule },
      }));
      setIsScheduleDialogOpen(true);
    }
  };
  
  // Add new staff member
  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      rating: 0,
      appointmentsCompleted: 0,
    };
    
    setStaff(prev => [...prev, newStaff]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Staff member added',
      description: `${newStaff.name} has been added to your team.`,
    });
  };
  
  // Update staff member
  const handleUpdateStaff = () => {
    if (!selectedStaff) return;
    
    const updatedStaff = staff.map(member => 
      member.id === selectedStaff.id 
        ? { 
            ...member, 
            ...formData,
          } 
        : member
    );
    
    setStaff(updatedStaff);
    setIsEditDialogOpen(false);
    toast({
      title: 'Staff member updated',
      description: `${formData.name}'s information has been updated.`,
    });
  };
  
  // Delete staff member
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    
    const updatedStaff = staff.filter(member => member.id !== selectedStaff.id);
    setStaff(updatedStaff);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Staff member removed',
      description: `${selectedStaff.name} has been removed from your team.`,
    });
  };
  
  // Update staff schedule
  const handleUpdateSchedule = () => {
    if (!selectedStaff) return;
    
    const updatedStaff = staff.map(member => 
      member.id === selectedStaff.id 
        ? { 
            ...member, 
            schedule: formData.schedule,
          } 
        : member
    );
    
    setStaff(updatedStaff);
    setIsScheduleDialogOpen(false);
    toast({
      title: 'Schedule updated',
      description: `${selectedStaff.name}'s schedule has been updated.`,
    });
  };
  
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground">
              View and manage your salon staff
            </p>
          </div>
          <button
            onClick={openAddDialog}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Staff
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full sm:w-[300px]"
              />
            </div>
          </div>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-2"
          >
            <TabsList className="bg-muted">
              <TabsTrigger value="all">All</TabsTrigger>
              {positions.map((position) => (
                <TabsTrigger key={position} value={position}>
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((staffMember) => (
            <StaffCard
              key={staffMember.id}
              staff={staffMember}
              services={MOCK_SERVICES}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onViewSchedule={openScheduleDialog}
              className="animate-fade-in"
            />
          ))}
          
          {filteredStaff.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-foreground">No staff members found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add your first staff member to get started'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-6 -mr-6">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. john@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. (555) 123-4567"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="position" className="block text-sm font-medium text-foreground mb-1">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Stylist, Barber, Nail Technician"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Short biography and specialties..."
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-1">
                    Profile Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. https://example.com/image.jpg"
                  />
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Work Schedule</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(formData.schedule).map(([day, isWorking]) => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={isWorking}
                          onChange={() => handleScheduleChange(day as keyof StaffMember['schedule'])}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`day-${day}`} className="text-sm text-foreground capitalize">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_SERVICES.map((service) => (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={formData.serviceIds.includes(service.id)}
                          onChange={() => handleServiceSelection(service.id)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`service-${service.id}`} className="text-sm text-foreground">
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStaff}
              className="btn-primary"
              disabled={!formData.name || !formData.email || !formData.phone || !formData.position}
            >
              Add Staff Member
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-6 -mr-6">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    id="edit-phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="edit-position" className="block text-sm font-medium text-foreground mb-1">
                    Position
                  </label>
                  <input
                    id="edit-position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="edit-bio" className="block text-sm font-medium text-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-foreground mb-1">
                    Profile Image URL (optional)
                  </label>
                  <input
                    id="edit-imageUrl"
                    name="imageUrl"
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Work Schedule</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(formData.schedule).map(([day, isWorking]) => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-day-${day}`}
                          checked={isWorking}
                          onChange={() => handleScheduleChange(day as keyof StaffMember['schedule'])}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`edit-day-${day}`} className="text-sm text-foreground capitalize">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_SERVICES.map((service) => (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-service-${service.id}`}
                          checked={formData.serviceIds.includes(service.id)}
                          onChange={() => handleServiceSelection(service.id)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`edit-service-${service.id}`} className="text-sm text-foreground">
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStaff}
              className="btn-primary"
              disabled={!formData.name || !formData.email || !formData.phone || !formData.position}
            >
              Update Staff Member
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {selectedStaff?.name}'s Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set the days when this staff member is available to work.
              </p>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(formData.schedule).map(([day, isWorking]) => (
                  <div 
                    key={day} 
                    onClick={() => handleScheduleChange(day as keyof StaffMember['schedule'])}
                    className={`cursor-pointer p-3 rounded-md text-center transition-colors ${
                      isWorking 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <div className="text-xs uppercase font-medium">{day.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-xs text-muted-foreground">Working</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                  <span className="text-xs text-muted-foreground">Off</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsScheduleDialogOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSchedule}
              className="btn-primary"
            >
              Save Schedule
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Staff Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Staff Member</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">
              Are you sure you want to remove <span className="font-medium">{selectedStaff?.name}</span> from your staff?
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              This action cannot be undone. It will remove the staff member and unassign them from all services and appointments.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStaff}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
