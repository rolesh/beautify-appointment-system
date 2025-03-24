
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Service } from './ServiceCard';
import { StaffMember } from './StaffCard';
import { Customer } from './CustomerCard';

interface AppointmentFormProps {
  services: Service[];
  staffMembers: StaffMember[];
  customers: Customer[];
  onSubmit: (formData: AppointmentFormData) => void;
  initialData?: Partial<AppointmentFormData>;
  submitLabel?: string;
  customerId?: string; // For when customer is creating their own appointment
}

export interface AppointmentFormData {
  customerId: string;
  serviceId: string;
  staffId: string;
  date: Date;
  time: string;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  services,
  staffMembers,
  customers,
  onSubmit,
  initialData = {},
  submitLabel = 'Book Appointment',
  customerId
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    customerId: customerId || initialData.customerId || '',
    serviceId: initialData.serviceId || '',
    staffId: initialData.staffId || '',
    date: initialData.date || new Date(),
    time: initialData.time || '',
  });
  
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update available staff based on selected service
  useEffect(() => {
    if (formData.serviceId) {
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (selectedService) {
        const filteredStaff = staffMembers.filter(staff => 
          selectedService.staffIds.includes(staff.id)
        );
        setAvailableStaff(filteredStaff);
        
        // If current selected staff is not available for this service, reset it
        if (formData.staffId && !selectedService.staffIds.includes(formData.staffId)) {
          setFormData(prev => ({ ...prev, staffId: '' }));
        }
      }
    } else {
      setAvailableStaff([]);
    }
  }, [formData.serviceId, services, staffMembers]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      
      // Clear date error
      if (errors.date) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.date;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a service';
    }
    
    if (!formData.staffId) {
      newErrors.staffId = 'Please select a staff member';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit form
    onSubmit(formData);
    
    // Reset form
    setIsSubmitting(false);
  };

  // Get selected service details
  const selectedService = services.find(s => s.id === formData.serviceId);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!customerId && (
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-foreground mb-1">
            Customer
          </label>
          <div className="relative">
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className={`form-input pl-8 ${errors.customerId ? 'border-red-500' : ''}`}
              disabled={!!customerId}
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <User size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.customerId && <p className="mt-1 text-xs text-red-500">{errors.customerId}</p>}
        </div>
      )}
      
      <div>
        <label htmlFor="serviceId" className="block text-sm font-medium text-foreground mb-1">
          Service
        </label>
        <div className="relative">
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            className={`form-input pl-8 ${errors.serviceId ? 'border-red-500' : ''}`}
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.duration} min)
              </option>
            ))}
          </select>
          <Scissors size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.serviceId && <p className="mt-1 text-xs text-red-500">{errors.serviceId}</p>}
      </div>
      
      <div>
        <label htmlFor="staffId" className="block text-sm font-medium text-foreground mb-1">
          Staff Member
        </label>
        <select
          id="staffId"
          name="staffId"
          value={formData.staffId}
          onChange={handleChange}
          className={`form-input ${errors.staffId ? 'border-red-500' : ''}`}
          disabled={availableStaff.length === 0}
        >
          <option value="">
            {availableStaff.length === 0 
              ? 'Please select a service first' 
              : 'Select a staff member'}
          </option>
          {availableStaff.map(staff => (
            <option key={staff.id} value={staff.id}>
              {staff.name}
            </option>
          ))}
        </select>
        {errors.staffId && <p className="mt-1 text-xs text-red-500">{errors.staffId}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`form-input justify-start text-left font-normal flex items-center ${
                  errors.date ? 'border-red-500' : ''
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                initialFocus
                disabled={date => 
                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                  date.getDay() === 0 // Disable Sundays
                }
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-foreground mb-1">
            Time
          </label>
          <div className="relative">
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`form-input pl-8 ${errors.time ? 'border-red-500' : ''}`}
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <Clock size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
        </div>
      </div>
      
      {selectedService && (
        <div className="mt-4 p-3 bg-secondary rounded-md">
          <h3 className="text-sm font-medium">Appointment Summary</h3>
          <div className="mt-2 text-sm">
            <p><span className="text-muted-foreground">Service:</span> {selectedService.name}</p>
            <p><span className="text-muted-foreground">Price:</span> ${selectedService.price}</p>
            <p><span className="text-muted-foreground">Duration:</span> {selectedService.duration} minutes</p>
            {formData.date && formData.time && (
              <p>
                <span className="text-muted-foreground">Date & Time:</span> 
                {format(formData.date, 'PPP')} at {formData.time}
              </p>
            )}
          </div>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full mt-6"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default AppointmentForm;
