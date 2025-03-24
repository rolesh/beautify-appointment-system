
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Scissors, CreditCard, Star } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="py-8">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              BeautySalon
            </div>
            <div>
              <Link 
                to="/auth" 
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <section className="py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Salon Management System
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Streamline your salon operations
              </h1>
              <p className="text-xl text-muted-foreground">
                A comprehensive solution for managing appointments, staff, services, and payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/auth" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
                <a 
                  href="#features" 
                  className="btn-outline"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="glass rounded-2xl overflow-hidden card-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Salon interior" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Modern Salon Management</h3>
                      <p className="text-white/80">Elevate your business with our intuitive platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold">Comprehensive Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Everything you need to run your salon efficiently in one elegant platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '200ms' }}>
              <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Appointment Management</h3>
              <p className="text-muted-foreground">
                Easily schedule, reschedule, and manage appointments with real-time availability checking.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '300ms' }}>
              <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mb-6">
                <Scissors size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Service Management</h3>
              <p className="text-muted-foreground">
                Create and customize services with detailed pricing, duration, and staff assignments.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '400ms' }}>
              <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Staff & Customer Management</h3>
              <p className="text-muted-foreground">
                Maintain detailed profiles for staff and customers with preferences and history.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '500ms' }}>
              <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mb-6">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Payment Processing</h3>
              <p className="text-muted-foreground">
                Track payments, process refunds, and generate reports for financial insights.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '600ms' }}>
              <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mb-6">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reviews & Ratings</h3>
              <p className="text-muted-foreground">
                Collect and showcase customer feedback to build trust and improve services.
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl card-shadow animate-fade-in hover-scale" style={{ animationDelay: '700ms' }}>
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 w-12 h-12 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
              <p className="text-muted-foreground">
                Gain insights into business performance with detailed analytics and customizable reports.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="glass-dark rounded-2xl p-8 md:p-12 text-center relative overflow-hidden card-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your salon?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of salon professionals who have streamlined their business operations with our platform.
              </p>
              <Link 
                to="/auth" 
                className="btn-primary px-8 py-3 text-base"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 mb-4 md:mb-0">
              BeautySalon
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 BeautySalon. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
