
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import AppointmentCalendar, { Appointment } from '../components/AppointmentCalendar';
import ServiceCard, { Service } from '../components/ServiceCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, Scissors, DollarSign } from 'lucide-react';

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
];

const Dashboard: React.FC = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Mock data for dashboard
  const todayAppointments = MOCK_APPOINTMENTS.filter(
    app => app.date.toDateString() === new Date().toDateString()
  ).length;
  
  const monthlyRevenue = MOCK_APPOINTMENTS.reduce((sum, app) => sum + app.price, 0);
  
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  
  // Only admins and staff can access the dashboard
  if (!isAdmin && !isStaff) {
    navigate('/appointments');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-6">
          <section className="animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at your salon today
            </p>
          </section>
          
          {/* Stats grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StatsCard
              title="Today's Appointments"
              value={todayAppointments}
              icon={<Calendar size={20} />}
              change={{ value: '10%', isPositive: true }}
              tooltipContent="Number of appointments scheduled for today"
            />
            <StatsCard
              title="Total Customers"
              value={128}
              icon={<Users size={20} />}
              change={{ value: '5%', isPositive: true }}
              tooltipContent="Total number of customers in your database"
            />
            <StatsCard
              title="Active Services"
              value={MOCK_SERVICES.length}
              icon={<Scissors size={20} />}
              tooltipContent="Number of services offered by your salon"
            />
            <StatsCard
              title="Monthly Revenue"
              value={`$${monthlyRevenue}`}
              icon={<DollarSign size={20} />}
              change={{ value: '12%', isPositive: true }}
              tooltipContent="Total revenue generated this month"
            />
          </section>
          
          {/* Appointments calendar */}
          <section className="mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-foreground">Appointments Calendar</h2>
              <button 
                onClick={() => navigate('/appointments')}
                className="btn-outline text-xs"
              >
                View All
              </button>
            </div>
            <AppointmentCalendar 
              appointments={MOCK_APPOINTMENTS} 
              onAppointmentClick={handleAppointmentClick}
            />
          </section>
          
          {/* Popular services */}
          <section className="mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-foreground">Popular Services</h2>
              <button 
                onClick={() => navigate('/services')}
                className="btn-outline text-xs"
              >
                Manage Services
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_SERVICES.slice(0, 4).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  compact
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      {/* Appointment detail dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p>{selectedAppointment.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
                  <p>{selectedAppointment.serviceName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Staff</h3>
                  <p>{selectedAppointment.staffName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  <p>${selectedAppointment.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p>{selectedAppointment.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                  <p>{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button className="btn-outline">Edit</button>
                <button className="btn-primary">Check In</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
