
import React from 'react';
import { Calendar, Phone, Mail, User, Pencil, Trash2 } from 'lucide-react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  totalAppointments: number;
  totalSpent: number;
  notes?: string;
  preferences?: string[];
}

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onViewHistory?: (customerId: string) => void;
  className?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
  onDelete,
  onViewHistory,
  className = '',
}) => {
  return (
    <div className={`glass rounded-xl overflow-hidden card-shadow transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{customer.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span>Client since {new Date(customer.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {onViewHistory && (
              <button
                onClick={() => onViewHistory(customer.id)}
                className="btn-outline text-xs px-2 py-1"
              >
                History
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(customer)}
                className="p-1 rounded-full hover:bg-accent transition-colors"
              >
                <Pencil size={18} className="text-muted-foreground" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(customer.id)}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Contact Information</h4>
            <div className="space-y-1">
              <p className="text-xs flex items-center">
                <Mail size={12} className="mr-1" />
                {customer.email}
              </p>
              <p className="text-xs flex items-center">
                <Phone size={12} className="mr-1" />
                {customer.phone}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Activity</h4>
            <div className="space-y-1">
              <p className="text-xs">
                <span className="font-medium">{customer.totalAppointments}</span> appointments
              </p>
              <p className="text-xs">
                <span className="font-medium">${customer.totalSpent}</span> total spent
              </p>
            </div>
          </div>
        </div>
        
        {customer.preferences && customer.preferences.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Preferences</h4>
            <div className="flex flex-wrap gap-1">
              {customer.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {customer.notes && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
            <p className="text-xs text-muted-foreground p-2 bg-secondary rounded-md">
              {customer.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
