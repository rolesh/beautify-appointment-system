
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AppointmentCalendar, { Appointment } from '../components/AppointmentCalendar';
import AppointmentForm, { AppointmentFormData } from '../components/AppointmentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { Calendar, Clock, Search, Plus, CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import { Service } from '../components/ServiceCard';
import { StaffMember } from '../components/StaffCard';
import { Customer } from '../components/CustomerCard';
import { useToast } from '@/hooks/use-toast';

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Jane Smith',
    serviceId: '1',
    serviceName: 'Haircut',
    staffId: '1',
    staffName: 'Lisa Johnson',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    price: 50,
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Mike Johnson',
    serviceId: '2',
    serviceName: 'Beard Trim',
    staffId: '2',
    staffName: 'David Miller',
    date: new Date(),
    startTime: '14:00',
    endTime: '14:30',
    status: 'scheduled',
    price: 25,
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Sarah Williams',
    serviceId: '3',
    serviceName: 'Hair Coloring',
    staffId: '1',
    staffName: 'Lisa Johnson',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '11:00',
    endTime: '13:00',
    status: 'scheduled',
    price: 120,
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'David Lee',
    serviceId: '4',
    serviceName: 'Manicure',
    staffId: '3',
    staffName: 'Emily Wilson',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    startTime: '15:00',
    endTime: '15:45',
    status: 'completed',
    price: 35,
  },
  {
    id: '5',
    customerId: '5',
    customerName: 'Emma Thompson',
    serviceId: '5',
    serviceName: 'Pedicure',
    staffId: '3',
    staffName: 'Emily Wilson',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    startTime: '13:00',
    endTime: '14:00',
    status: 'completed',
    price: 45,
  },
  {
    id: '6',
    customerId: '1',
    customerName: 'Jane Smith',
    serviceId: '6',
    serviceName: 'Facial',
    staffId: '3',
    staffName: 'Emily Wilson',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    price: 75,
  },
];

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
  },
];

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

const Appointments: React.FC = () => {
  const { isAuthenticated, isAdmin, isStaff, isCustomer, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Filter appointments based on role
  const filteredAppointments = appointments.filter(appointment => {
    // For customers, only show their appointments
    if (isCustomer) {
      if (appointment.customerId !== user?.id) {
        return false;
      }
    }
    
    // For staff, show their appointments or all if admin
    if (isStaff && !isAdmin) {
      if (appointment.staffId !== user?.id) {
        return false;
      }
    }
    
    // Filter by status
    if (statusFilter === 'upcoming' && !isFuture(new Date(`${appointment.date.toDateString()} ${appointment.startTime}`))) {
      return false;
    }
    
    if (statusFilter === 'completed' && appointment.status !== 'completed') {
      return false;
    }
    
    if (statusFilter === 'cancelled' && appointment.status !== 'cancelled') {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.customerName.toLowerCase().includes(query) ||
        appointment.serviceName.toLowerCase().includes(query) ||
        appointment.staffName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle appointment click in calendar
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };
  
  // Handle appointment submission
  const handleAddAppointment = (formData: AppointmentFormData) => {
    // Find related data
    const customer = MOCK_CUSTOMERS.find(c => c.id === formData.customerId);
    const service = MOCK_SERVICES.find(s => s.id === formData.serviceId);
    const staff = MOCK_STAFF.find(s => s.id === formData.staffId);
    
    if (!customer || !service || !staff) {
      toast({
        title: 'Error',
        description: 'Could not find customer, service, or staff information.',
        variant: 'destructive',
      });
      return;
    }
    
    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const startDate = new Date(formData.date);
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);
    
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      customerId: customer.id,
      customerName: customer.name,
      serviceId: service.id,
      serviceName: service.name,
      staffId: staff.id,
      staffName: staff.name,
      date: formData.date,
      startTime: formData.time,
      endTime,
      status: 'scheduled',
      price: service.price,
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Appointment booked',
      description: `Appointment for ${customer.name} on ${format(formData.date, 'PPP')} at ${formData.time} has been booked.`,
    });
  };
  
  // Handle appointment status update
  const handleStatusUpdate = (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: newStatus } 
        : appointment
    );
    
    setAppointments(updatedAppointments);
    setIsViewDialogOpen(false);
    toast({
      title: 'Appointment updated',
      description: `Appointment has been marked as ${newStatus}.`,
    });
  };
  
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isCustomer ? 'My Appointments' : 'Appointments'}
            </h1>
            <p className="text-muted-foreground">
              {isCustomer 
                ? 'View and manage your appointments' 
                : 'View and manage salon appointments'}
            </p>
          </div>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {isCustomer ? 'Book Appointment' : 'Add Appointment'}
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto order-2 sm:order-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full sm:w-[300px]"
              />
            </div>
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Tabs 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-muted w-full sm:w-auto grid grid-cols-4 sm:flex">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-auto"
            >
              <TabsList className="bg-muted">
                <TabsTrigger value="calendar" className="px-3">
                  <CalendarDays size={16} />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {activeTab === 'calendar' && (
          <div className="animate-fade-in">
            <AppointmentCalendar 
              appointments={filteredAppointments} 
              onAppointmentClick={handleAppointmentClick}
            />
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
            {filteredAppointments.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Customer
                        </th>
                        {!isCustomer && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Staff
                          </th>
                        )}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleAppointmentClick(appointment)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{appointment.customerName}</div>
                          </td>
                          {!isCustomer && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">{appointment.staffName}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{appointment.serviceName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">
                              {format(appointment.date, 'MMM d, yyyy')} 
                              <span className="text-muted-foreground"> · </span>
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                            {isToday(appointment.date) && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Today
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            ${appointment.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAppointmentClick(appointment);
                              }}
                              className="text-primary hover:text-primary/80 mr-2"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No appointments found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : statusFilter !== 'all'
                    ? `No ${statusFilter} appointments`
                    : 'No appointments yet'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="btn-primary"
                  >
                    <Plus size={16} className="mr-1 inline-block" />
                    {isCustomer ? 'Book Appointment' : 'Add Appointment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isCustomer ? 'Book Appointment' : 'Add Appointment'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AppointmentForm
              services={MOCK_SERVICES}
              staffMembers={MOCK_STAFF}
              customers={MOCK_CUSTOMERS}
              onSubmit={handleAddAppointment}
              submitLabel={isCustomer ? 'Book Appointment' : 'Add Appointment'}
              customerId={isCustomer ? user?.id : undefined}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                  <p className="text-foreground">{selectedAppointment.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Staff</h3>
                  <p className="text-foreground">{selectedAppointment.staffName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Service</h3>
                  <p className="text-foreground">{selectedAppointment.serviceName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                  <p className="text-foreground">${selectedAppointment.price}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5 text-muted-foreground" />
                      <span>{format(selectedAppointment.date, 'PPPP')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1.5 text-muted-foreground" />
                      <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <div className="flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAppointment.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedAppointment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {(isAdmin || isStaff) && selectedAppointment.status === 'scheduled' && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Update Status</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'completed')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle size={16} className="mr-1.5" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle size={16} className="mr-1.5" />
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              )}
              
              {isCustomer && selectedAppointment.status === 'scheduled' && isFuture(new Date(`${selectedAppointment.date.toDateString()} ${selectedAppointment.startTime}`)) && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle size={16} className="mr-1.5" />
                    Cancel My Appointment
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can cancel appointments up to 24 hours before the scheduled time.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
