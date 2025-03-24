
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                BeautySalon
              </span>
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {user?.role !== 'customer' && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/dashboard'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/appointments"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/appointments'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link
                      to="/services"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/services'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      Services
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <Link
                          to="/staff"
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === '/staff'
                              ? 'text-white bg-primary'
                              : 'text-foreground hover:bg-accent'
                          }`}
                        >
                          Staff
                        </Link>
                        <Link
                          to="/customers"
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === '/customers'
                              ? 'text-white bg-primary'
                              : 'text-foreground hover:bg-accent'
                          }`}
                        >
                          Customers
                        </Link>
                        <Link
                          to="/payments"
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === '/payments'
                              ? 'text-white bg-primary'
                              : 'text-foreground hover:bg-accent'
                          }`}
                        >
                          Payments
                        </Link>
                      </>
                    )}
                  </>
                )}
                {user?.role === 'customer' && (
                  <>
                    <Link
                      to="/appointments"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/appointments'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      My Appointments
                    </Link>
                    <Link
                      to="/book"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/book'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              <div className="relative">
                <button
                  className="flex items-center space-x-2 rounded-full p-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span className="text-sm text-foreground">{user?.name}</span>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-foreground hover:bg-accent transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user?.role !== 'customer' && (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/dashboard'
                      ? 'text-white bg-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/appointments'
                      ? 'text-white bg-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Appointments
                </Link>
                <Link
                  to="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/services'
                      ? 'text-white bg-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/staff"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/staff'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Staff
                    </Link>
                    <Link
                      to="/customers"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/customers'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Customers
                    </Link>
                    <Link
                      to="/payments"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/payments'
                          ? 'text-white bg-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Payments
                    </Link>
                  </>
                )}
              </>
            )}
            {user?.role === 'customer' && (
              <>
                <Link
                  to="/appointments"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/appointments'
                      ? 'text-white bg-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Appointments
                </Link>
                <Link
                  to="/book"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/book'
                      ? 'text-white bg-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-foreground">{user?.name}</div>
                <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
