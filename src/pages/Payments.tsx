
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, DollarSign, CreditCard, CalendarDays, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatsCard from '../components/StatsCard';
import { format, subDays } from 'date-fns';

// Mock data
interface Payment {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  date: Date;
  method: 'cash' | 'card' | 'online';
  status: 'completed' | 'refunded' | 'failed';
  reference?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    appointmentId: '1',
    customerId: '1',
    customerName: 'Jane Smith',
    serviceId: '1',
    serviceName: 'Haircut',
    amount: 50,
    date: new Date(),
    method: 'card',
    status: 'completed',
    reference: 'ch_1234567890',
  },
  {
    id: '2',
    appointmentId: '2',
    customerId: '2',
    customerName: 'Mike Johnson',
    serviceId: '2',
    serviceName: 'Beard Trim',
    amount: 25,
    date: new Date(),
    method: 'cash',
    status: 'completed',
  },
  {
    id: '3',
    appointmentId: '3',
    customerId: '3',
    customerName: 'Sarah Williams',
    serviceId: '3',
    serviceName: 'Hair Coloring',
    amount: 120,
    date: subDays(new Date(), 1),
    method: 'online',
    status: 'completed',
    reference: 'pay_2345678901',
  },
  {
    id: '4',
    appointmentId: '4',
    customerId: '4',
    customerName: 'David Lee',
    serviceId: '4',
    serviceName: 'Manicure',
    amount: 35,
    date: subDays(new Date(), 2),
    method: 'card',
    status: 'completed',
    reference: 'ch_3456789012',
  },
  {
    id: '5',
    appointmentId: '5',
    customerId: '5',
    customerName: 'Emma Thompson',
    serviceId: '5',
    serviceName: 'Pedicure',
    amount: 45,
    date: subDays(new Date(), 3),
    method: 'card',
    status: 'refunded',
    reference: 'ch_4567890123',
  },
  {
    id: '6',
    appointmentId: '6',
    customerId: '1',
    customerName: 'Jane Smith',
    serviceId: '6',
    serviceName: 'Facial',
    amount: 75,
    date: subDays(new Date(), 5),
    method: 'online',
    status: 'failed',
    reference: 'pay_5678901234',
  },
];

const Payments: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'card' | 'online'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    serviceName: '',
    amount: 0,
    method: 'cash' as 'cash' | 'card' | 'online',
    reference: '',
  });
  
  // Filter payments
  const filteredPayments = payments.filter(payment => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !payment.customerName.toLowerCase().includes(query) &&
        !payment.serviceName.toLowerCase().includes(query) &&
        !payment.reference?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Filter by period
    if (periodFilter === 'today' && !isToday(payment.date)) {
      return false;
    }
    if (periodFilter === 'week' && !isThisWeek(payment.date)) {
      return false;
    }
    if (periodFilter === 'month' && !isThisMonth(payment.date)) {
      return false;
    }
    
    // Filter by payment method
    if (methodFilter !== 'all' && payment.method !== methodFilter) {
      return false;
    }
    
    return true;
  });
  
  // Helper functions for date filtering
  function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
  
  function isThisWeek(date: Date): boolean {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    return date >= startOfWeek && date < endOfWeek;
  }
  
  function isThisMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  
  // Calculate totals
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const todayRevenue = filteredPayments
    .filter(p => p.status === 'completed' && isToday(p.date))
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const cashPayments = filteredPayments
    .filter(p => p.method === 'cash' && p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const cardPayments = filteredPayments
    .filter(p => p.method === 'card' && p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };
  
  // Open payment details dialog
  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };
  
  // Add new payment
  const handleAddPayment = () => {
    const newPayment: Payment = {
      id: Math.random().toString(36).substring(2, 9),
      appointmentId: Math.random().toString(36).substring(2, 9), // Normally would be linked to a real appointment
      customerId: Math.random().toString(36).substring(2, 9), // Normally would be a real customer ID
      customerName: formData.customerName,
      serviceId: Math.random().toString(36).substring(2, 9), // Normally would be a real service ID
      serviceName: formData.serviceName,
      amount: formData.amount,
      date: new Date(),
      method: formData.method,
      status: 'completed',
      reference: formData.reference || undefined,
    };
    
    setPayments(prev => [newPayment, ...prev]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Payment added',
      description: `Payment of $${formData.amount} from ${formData.customerName} has been recorded.`,
    });
  };
  
  // Handle payment status update
  const handleStatusUpdate = (paymentId: string, newStatus: 'completed' | 'refunded') => {
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: newStatus } 
        : payment
    );
    
    setPayments(updatedPayments);
    setIsViewDialogOpen(false);
    
    toast({
      title: newStatus === 'refunded' ? 'Payment refunded' : 'Payment processed',
      description: `Payment has been marked as ${newStatus}.`,
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
            <h1 className="text-2xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground">
              Manage and track your salon payments
            </p>
          </div>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Record Payment
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue}`}
            icon={<DollarSign size={20} />}
            change={{ value: '12%', isPositive: true }}
          />
          <StatsCard
            title="Today's Revenue"
            value={`$${todayRevenue}`}
            icon={<CalendarDays size={20} />}
          />
          <StatsCard
            title="Cash Payments"
            value={`$${cashPayments}`}
            icon={<DollarSign size={20} />}
          />
          <StatsCard
            title="Card Payments"
            value={`$${cardPayments}`}
            icon={<CreditCard size={20} />}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by customer, service or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full sm:w-[300px]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <Tabs 
              value={periodFilter} 
              onValueChange={(value) => setPeriodFilter(value as any)}
              className="space-y-2"
            >
              <TabsList className="bg-muted">
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs 
              value={methodFilter} 
              onValueChange={(value) => setMethodFilter(value as any)}
              className="space-y-2"
            >
              <TabsList className="bg-muted">
                <TabsTrigger value="all">All Methods</TabsTrigger>
                <TabsTrigger value="cash">Cash</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
          {filteredPayments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handlePaymentClick(payment)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">{format(payment.date, 'PPP')}</div>
                          <div className="text-xs text-muted-foreground">{format(payment.date, 'p')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{payment.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">{payment.serviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">${payment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground capitalize">{payment.method}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'refunded'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePaymentClick(payment);
                            }}
                            className="text-primary hover:text-primary/80"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 flex justify-between items-center bg-card">
                <span className="text-sm text-muted-foreground">
                  {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}
                </span>
                <button className="btn-outline text-xs flex items-center">
                  <Download size={14} className="mr-1.5" />
                  Export
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No payments found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery 
                  ? 'Try a different search term' 
                  : methodFilter !== 'all' || periodFilter !== 'all'
                  ? 'Try changing your filters'
                  : 'No payments have been recorded yet'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="btn-primary"
                >
                  <Plus size={16} className="mr-1 inline-block" />
                  Record Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Payment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPayment();
            }}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="customerName" className="block text-sm font-medium text-foreground mb-1">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="serviceName" className="block text-sm font-medium text-foreground mb-1">
                  Service Name
                </label>
                <input
                  id="serviceName"
                  name="serviceName"
                  type="text"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Haircut"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
                  Amount ($)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-foreground mb-1">
                  Payment Method
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="reference" className="block text-sm font-medium text-foreground mb-1">
                  Reference Number (optional)
                </label>
                <input
                  id="reference"
                  name="reference"
                  type="text"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Transaction ID, Receipt Number"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!formData.customerName || !formData.serviceName || formData.amount <= 0}
              >
                Record Payment
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Payment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                  <p className="text-foreground">{selectedPayment.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Service</h3>
                  <p className="text-foreground">{selectedPayment.serviceName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                  <p className="text-foreground font-medium">${selectedPayment.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Method</h3>
                  <p className="text-foreground capitalize">{selectedPayment.method}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p className="text-foreground">{format(selectedPayment.date, 'PPP')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Time</h3>
                  <p className="text-foreground">{format(selectedPayment.date, 'p')}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <div className="flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPayment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : selectedPayment.status === 'refunded'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </span>
                  </div>
                </div>
                {selectedPayment.reference && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Reference Number</h3>
                    <p className="text-foreground font-mono text-sm">{selectedPayment.reference}</p>
                  </div>
                )}
              </div>
              
              {selectedPayment.status === 'completed' && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Actions</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedPayment.id, 'refunded')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Process Refund
                    </button>
                    <button
                      className="btn-outline"
                    >
                      <Download size={16} className="mr-1.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              )}
              
              {selectedPayment.status === 'refunded' && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Actions</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedPayment.id, 'completed')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Mark as Completed
                    </button>
                    <button
                      className="btn-outline"
                    >
                      <Download size={16} className="mr-1.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
