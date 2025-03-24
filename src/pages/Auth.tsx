
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'customer') {
        navigate('/appointments');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user?.role]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              BeautySalon
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Streamlined salon management system
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-4 order-2 md:order-1">
            <div className="glass p-6 rounded-xl card-shadow animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-lg font-medium mb-2">Complete Salon Management</h2>
              <p className="text-muted-foreground text-sm">
                Manage appointments, staff, customers, and services all in one place.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl card-shadow animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-lg font-medium mb-2">Role-Based Access</h2>
              <p className="text-muted-foreground text-sm">
                Different views for admin, staff and customers with appropriate permissions.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl card-shadow animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h2 className="text-lg font-medium mb-2">Easy Appointment Booking</h2>
              <p className="text-muted-foreground text-sm">
                Streamlined booking process for both staff and customers.
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
