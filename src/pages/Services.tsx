
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import ServiceCard, { Service } from '../components/ServiceCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Haircut',
    description: 'Classic haircut with scissors or clippers',
    price: 50,
    duration: 60,
    category: 'Hair',
    staffIds: ['1', '2'],
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Styling and grooming of facial hair',
    price: 25,
    duration: 30,
    category: 'Grooming',
    staffIds: ['2'],
  },
  {
    id: '3',
    name: 'Hair Coloring',
    description: 'Full hair coloring service with premium products',
    price: 120,
    duration: 120,
    category: 'Hair',
    staffIds: ['1'],
  },
  {
    id: '4',
    name: 'Manicure',
    description: 'Basic nail care for hands',
    price: 35,
    duration: 45,
    category: 'Nails',
    staffIds: ['3'],
  },
  {
    id: '5',
    name: 'Pedicure',
    description: 'Basic nail care for feet',
    price: 45,
    duration: 60,
    category: 'Nails',
    staffIds: ['3'],
  },
  {
    id: '6',
    name: 'Facial',
    description: 'Deep cleansing facial treatment',
    price: 75,
    duration: 60,
    category: 'Skin',
    staffIds: ['1', '3'],
  },
  {
    id: '7',
    name: 'Massage',
    description: 'Full body relaxation massage',
    price: 90,
    duration: 60,
    category: 'Body',
    staffIds: ['4'],
  },
  {
    id: '8',
    name: 'Waxing',
    description: 'Hair removal using wax',
    price: 40,
    duration: 30,
    category: 'Body',
    staffIds: ['3'],
  }
];

const MOCK_STAFF = [
  { id: '1', name: 'Lisa Johnson' },
  { id: '2', name: 'David Miller' },
  { id: '3', name: 'Emily Wilson' },
  { id: '4', name: 'Mark Thompson' },
];

const Services: React.FC = () => {
  const { isAuthenticated, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: '',
    staffIds: [],
  });
  
  // Filter services by category
  const filteredServices = services.filter(service => {
    // Filter by search query
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeTab === 'all' || service.category.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(services.map(service => service.category)));
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value,
    }));
  };
  
  // Handle staff selection
  const handleStaffSelection = (staffId: string) => {
    setFormData(prev => {
      const currentStaffIds = [...prev.staffIds];
      if (currentStaffIds.includes(staffId)) {
        return {
          ...prev,
          staffIds: currentStaffIds.filter(id => id !== staffId),
        };
      } else {
        return {
          ...prev,
          staffIds: [...currentStaffIds, staffId],
        };
      }
    });
  };
  
  // Open add service dialog
  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: '',
      staffIds: [],
    });
    setIsAddDialogOpen(true);
  };
  
  // Open edit service dialog
  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      staffIds: [...service.staffIds],
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete service dialog
  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };
  
  // Add new service
  const handleAddService = () => {
    const newService: Service = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
    };
    
    setServices(prev => [...prev, newService]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Service added',
      description: `${newService.name} has been added successfully.`,
    });
  };
  
  // Update service
  const handleUpdateService = () => {
    if (!selectedService) return;
    
    const updatedServices = services.map(service => 
      service.id === selectedService.id 
        ? { ...service, ...formData } 
        : service
    );
    
    setServices(updatedServices);
    setIsEditDialogOpen(false);
    toast({
      title: 'Service updated',
      description: `${formData.name} has been updated successfully.`,
    });
  };
  
  // Delete service
  const handleDeleteService = () => {
    if (!selectedService) return;
    
    const updatedServices = services.filter(service => service.id !== selectedService.id);
    setServices(updatedServices);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Service deleted',
      description: `${selectedService.name} has been deleted.`,
    });
  };
  
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  if (!isAdmin && !isStaff) {
    navigate('/appointments');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">
              Manage your salon's service offerings
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddDialog}
              className="btn-primary flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Service
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
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
              {categories.map((category) => (
                <TabsTrigger key={category} value={category.toLowerCase()}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              staffMembers={MOCK_STAFF}
              onEdit={isAdmin ? openEditDialog : undefined}
              onDelete={isAdmin ? openDeleteDialog : undefined}
              className="animate-fade-in"
            />
          ))}
          
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-foreground">No services found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add your first service to get started'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Service Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Haircut"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-1">
                  Price ($)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-1">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Hair, Nails, Skin"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Describe the service..."
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Assign Staff
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {MOCK_STAFF.map((staff) => (
                    <div key={staff.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`staff-${staff.id}`}
                        checked={formData.staffIds.includes(staff.id)}
                        onChange={() => handleStaffSelection(staff.id)}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`staff-${staff.id}`} className="text-sm text-foreground">
                        {staff.name}
                      </label>
                    </div>
                  ))}
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
              onClick={handleAddService}
              className="btn-primary"
              disabled={!formData.name || !formData.category || formData.price <= 0 || formData.duration <= 0}
            >
              Add Service
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-1">
                  Service Name
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
                <label htmlFor="edit-price" className="block text-sm font-medium text-foreground mb-1">
                  Price ($)
                </label>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-duration" className="block text-sm font-medium text-foreground mb-1">
                  Duration (minutes)
                </label>
                <input
                  id="edit-duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-category" className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <input
                  id="edit-category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Assign Staff
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {MOCK_STAFF.map((staff) => (
                    <div key={staff.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-staff-${staff.id}`}
                        checked={formData.staffIds.includes(staff.id)}
                        onChange={() => handleStaffSelection(staff.id)}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`edit-staff-${staff.id}`} className="text-sm text-foreground">
                        {staff.name}
                      </label>
                    </div>
                  ))}
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
              onClick={handleUpdateService}
              className="btn-primary"
              disabled={!formData.name || !formData.category || formData.price <= 0 || formData.duration <= 0}
            >
              Update Service
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Service Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">
              Are you sure you want to delete <span className="font-medium">{selectedService?.name}</span>?
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              This action cannot be undone. This will permanently delete the service and remove it from all related records.
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
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
