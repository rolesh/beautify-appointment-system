
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  staffIds: string[];
}

interface ServiceCardProps {
  service: Service;
  staffMembers?: Array<{ id: string; name: string }>;
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
  className?: string;
  compact?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  staffMembers = [],
  onEdit,
  onDelete,
  className = '',
  compact = false,
}) => {
  // Get staff names who can perform this service
  const assignedStaff = staffMembers
    .filter(staff => service.staffIds.includes(staff.id))
    .map(staff => staff.name);

  if (compact) {
    return (
      <div className={`glass rounded-lg p-4 transition-all duration-300 hover:shadow-md ${className}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-foreground">{service.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {service.duration} min • ${service.price}
            </p>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(service)}
                  className="p-1 rounded-full hover:bg-accent transition-colors"
                >
                  <Pencil size={16} className="text-muted-foreground" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(service.id)}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-xl p-6 card-shadow transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex justify-between">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {service.category}
          </span>
          <h3 className="mt-2 text-lg font-medium text-foreground">{service.name}</h3>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(service)}
                className="p-1 rounded-full hover:bg-accent transition-colors"
              >
                <Pencil size={18} className="text-muted-foreground" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(service.id)}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-medium text-lg">${service.price}</div>
        <div className="text-sm text-muted-foreground">{service.duration} minutes</div>
      </div>
      {assignedStaff.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Available Staff</h4>
          <div className="flex flex-wrap gap-1">
            {assignedStaff.map((name, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
