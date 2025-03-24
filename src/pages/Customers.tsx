
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CustomerCard, { Customer } from '../components/CustomerCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 123-4567',
    joinDate: new Date(2021, 5, 15),
    totalAppointments: 24,
    totalSpent: 1250,
    notes: 'Prefers afternoon appointments. Allergic to certain hair products.',
    preferences: ['Short hair', 'Natural colors'],
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '(555) 234-5678',
    joinDate: new Date(2022, 2, 10),
    totalAppointments: 8,
    totalSpent: 420,
    preferences: ['Beard trim', 'Classic styles'],
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '(555) 345-6789',
    joinDate: new Date(2022, 7, 22),
    totalAppointments: 15,
    totalSpent: 875,
    notes: 'Sensitive scalp. Very particular about styling.',
    preferences: ['Balayage', 'Long layers'],
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david@example.com',
    phone: '(555) 456-7890',
    joinDate: new Date(2023, 1, 5),
    totalAppointments: 4,
    totalSpent: 220,
    preferences: ['Quick service'],
  },
  {
    id: '5',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    phone: '(555) 567-8901',
    joinDate: new Date(2022, 4, 18),
    totalAppointments: 12,
    totalSpent: 650,
    notes: 'Usually comes with her daughter.',
    preferences: ['Natural nails', 'French manicure'],
  },
  {
    id: '6',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    phone: '(555) 678-9012',
    joinDate: new Date(2022, 9, 30),
    totalAppointments: 9,
    totalSpent: 495,
    preferences: ['Fades', 'Beard shaping'],
  },
];

const Customers: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'joinDate' | 'totalAppointments' | 'totalSpent'>>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    preferences: [],
  });
  
  // Filter customers by search query
  const filteredCustomers = customers.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
  });
  
  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle preferences input
  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const preferencesText = e.target.value;
    // Split by commas and filter out empty strings
    const preferencesArray = preferencesText
      .split(',')
      .map(pref => pref.trim())
      .filter(pref => pref !== '');
    
    setFormData(prev => ({
      ...prev,
      preferences: preferencesArray,
    }));
  };
  
  // Open add customer dialog
  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: '',
      preferences: [],
    });
    setIsAddDialogOpen(true);
  };
  
  // Open edit customer dialog
  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    const { id, joinDate, totalAppointments, totalSpent, ...restOfData } = customer;
    setFormData(restOfData);
    setIsEditDialogOpen(true);
  };
  
  // Open delete customer dialog
  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };
  
  // Open history dialog
  const openHistoryDialog = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsHistoryDialogOpen(true);
    }
  };
  
  // Add new customer
  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      joinDate: new Date(),
      totalAppointments: 0,
      totalSpent: 0,
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Customer added',
      description: `${newCustomer.name} has been added to your customer list.`,
    });
  };
  
  // Update customer
  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.map(customer => 
      customer.id === selectedCustomer.id 
        ? { 
            ...customer, 
            ...formData,
          } 
        : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditDialogOpen(false);
    toast({
      title: 'Customer updated',
      description: `${formData.name}'s information has been updated.`,
    });
  };
  
  // Delete customer
  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.filter(customer => customer.id !== selectedCustomer.id);
    setCustomers(updatedCustomers);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Customer removed',
      description: `${selectedCustomer.name} has been removed from your customer list.`,
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
  
  // Mock appointment history for the selected customer
  const mockAppointmentHistory = [
    {
      id: '1',
      date: new Date(2023, 8, 15),
      service: 'Haircut',
      staff: 'Lisa Johnson',
      price: 50,
      status: 'completed',
    },
    {
      id: '2',
      date: new Date(2023, 7, 1),
      service: 'Hair Coloring',
      staff: 'Lisa Johnson',
      price: 120,
      status: 'completed',
    },
    {
      id: '3',
      date: new Date(2023, 5, 12),
      service: 'Haircut',
      staff: 'David Miller',
      price: 50,
      status: 'completed',
    },
    {
      id: '4',
      date: new Date(2023, 3, 28),
      service: 'Beard Trim',
      staff: 'David Miller',
      price: 25,
      status: 'completed',
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">
              Manage your salon's customers
            </p>
          </div>
          <button
            onClick={openAddDialog}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Customer
          </button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onViewHistory={() => openHistoryDialog(customer.id)}
              className="animate-fade-in"
            />
          ))}
          
          {filteredCustomers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-foreground">No customers found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add your first customer to get started'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
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
                <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Any special requirements or information about the customer..."
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="preferences" className="block text-sm font-medium text-foreground mb-1">
                  Preferences (comma separated, optional)
                </label>
                <input
                  id="preferences"
                  name="preferences"
                  type="text"
                  value={formData.preferences ? formData.preferences.join(', ') : ''}
                  onChange={handlePreferencesChange}
                  className="form-input"
                  placeholder="e.g. Short hair, Natural colors"
                />
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
              onClick={handleAddCustomer}
              className="btn-primary"
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              Add Customer
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
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
                <label htmlFor="edit-notes" className="block text-sm font-medium text-foreground mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-preferences" className="block text-sm font-medium text-foreground mb-1">
                  Preferences (comma separated, optional)
                </label>
                <input
                  id="edit-preferences"
                  name="preferences"
                  type="text"
                  value={formData.preferences ? formData.preferences.join(', ') : ''}
                  onChange={handlePreferencesChange}
                  className="form-input"
                />
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
              onClick={handleUpdateCustomer}
              className="btn-primary"
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              Update Customer
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">
              Are you sure you want to remove <span className="font-medium">{selectedCustomer?.name}</span> from your customer list?
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              This action cannot be undone. It will remove the customer and all associated data.
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
              onClick={handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Customer History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}'s History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-medium text-foreground">Customer Details</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Client since {selectedCustomer?.joinDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Appointments:</span> {selectedCustomer?.totalAppointments}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Spent:</span> ${selectedCustomer?.totalSpent}
                </div>
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-foreground mb-2">Appointment History</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Staff
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockAppointmentHistory.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                        {appointment.date.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                        {appointment.service}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                        {appointment.staff}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">
                        ${appointment.price}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {selectedCustomer?.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">
                  {selectedCustomer.notes}
                </p>
              </div>
            )}
            
            {selectedCustomer?.preferences && selectedCustomer.preferences.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Preferences</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedCustomer.preferences.map((pref, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsHistoryDialogOpen(false)}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
