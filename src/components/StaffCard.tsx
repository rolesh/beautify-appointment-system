
import React from 'react';
import { Pencil, Trash2, Calendar, Star } from 'lucide-react';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  bio: string;
  serviceIds: string[]; // Services they can perform
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rating: number; // Average rating out of 5
  appointmentsCompleted: number;
  imageUrl?: string;
}

interface StaffCardProps {
  staff: StaffMember;
  services?: Array<{ id: string; name: string }>;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (staff: StaffMember) => void; // Changed from (staffId: string)
  onViewSchedule?: (staff: StaffMember) => void; // Changed from (staffId: string)
  className?: string;
}

const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  services = [],
  onEdit,
  onDelete,
  onViewSchedule,
  className = '',
}) => {
  // Get service names this staff member can perform
  const assignedServices = services
    .filter(service => staff.serviceIds.includes(service.id))
    .map(service => service.name);

  // Get working days
  const workingDays = Object.entries(staff.schedule)
    .filter(([_, isWorking]) => isWorking)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1, 3));

  return (
    <div className={`glass rounded-xl overflow-hidden card-shadow transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
              {staff.imageUrl ? (
                <img 
                  src={staff.imageUrl} 
                  alt={staff.name} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                staff.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{staff.name}</h3>
              <p className="text-sm text-muted-foreground">{staff.position}</p>
              <div className="mt-1 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(staff.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({staff.rating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
          {(onEdit || onDelete || onViewSchedule) && (
            <div className="flex space-x-2">
              {onViewSchedule && (
                <button
                  onClick={() => onViewSchedule(staff)}
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                  title="View Schedule"
                >
                  <Calendar size={18} className="text-muted-foreground" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(staff)}
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                  title="Edit Staff"
                >
                  <Pencil size={18} className="text-muted-foreground" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(staff)}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                  title="Delete Staff"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{staff.bio}</p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Contact</h4>
            <p className="text-xs text-foreground">{staff.email}</p>
            <p className="text-xs text-foreground">{staff.phone}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Working Days</h4>
            <div className="flex flex-wrap gap-1">
              {workingDays.map((day) => (
                <span
                  key={day}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {assignedServices.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Services</h4>
            <div className="flex flex-wrap gap-1">
              {assignedServices.map((name, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          {staff.appointmentsCompleted} appointments completed
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
