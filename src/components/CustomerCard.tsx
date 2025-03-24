
import React from 'react';
import { Calendar, DollarSign, Info, Mail, Phone, Plus, Trash2 } from 'lucide-react';

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
  advanceBalance?: number; // New field for advance money
}

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onViewHistory?: (customer: Customer) => void;
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
    <div className={`glass rounded-xl p-6 transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-foreground">{customer.name}</h3>
        <div className="flex space-x-2">
          {onViewHistory && (
            <button
              onClick={() => onViewHistory(customer)}
              className="p-1 rounded-full hover:bg-accent transition-colors"
              aria-label="View history"
            >
              <Calendar size={18} className="text-muted-foreground" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(customer)}
              className="p-1 rounded-full hover:bg-accent transition-colors"
              aria-label="Edit customer"
            >
              <Info size={18} className="text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(customer)}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
              aria-label="Delete customer"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-sm">
          <Mail size={14} className="mr-2 text-muted-foreground" />
          <span className="text-foreground">{customer.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone size={14} className="mr-2 text-muted-foreground" />
          <span className="text-foreground">{customer.phone}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total Appointments</p>
          <p className="font-medium">{customer.totalAppointments}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="font-medium">${customer.totalSpent}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Advance Balance</p>
          <p className="font-medium">${customer.advanceBalance || 0}</p>
        </div>
      </div>
      
      {(customer.preferences && customer.preferences.length > 0) && (
        <div className="mt-4 pt-2">
          <p className="text-xs text-muted-foreground mb-2">Preferences</p>
          <div className="flex flex-wrap gap-1">
            {customer.preferences.map((pref, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCard;
