
import React, { useState } from 'react';
import { format, addDays, isToday, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock appointment data
export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: Date;
  startTime: string; // Format: "09:00"
  endTime: string; // Format: "10:00"
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

function getColorForService(serviceName: string): string {
  // Generate a consistent color based on the service name
  const hash = serviceName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const colors = [
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-green-100 border-green-300 text-green-800',
    'bg-yellow-100 border-yellow-300 text-yellow-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-indigo-100 border-indigo-300 text-indigo-800',
  ];
  
  return colors[hash % colors.length];
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  appointments,
  onAppointmentClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));

  const goToPreviousWeek = () => {
    setWeekStartDate(subWeeks(weekStartDate, 1));
  };

  const goToNextWeek = () => {
    setWeekStartDate(addWeeks(weekStartDate, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 1 }));
  };

  // Generate dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  // Get appointments for a specific day and time slot
  const getAppointmentsForSlot = (day: Date, timeSlot: string) => {
    return appointments.filter(
      appointment => 
        isSameDay(appointment.date, day) && 
        appointment.startTime === timeSlot
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {format(weekStartDate, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'MMM d')}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={goToToday}
            className="btn-outline text-xs px-2 py-1"
          >
            Today
          </button>
          <button 
            onClick={goToPreviousWeek}
            className="btn-outline p-1"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={goToNextWeek}
            className="btn-outline p-1"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 border-r text-center font-medium text-muted-foreground text-sm">
              Time
            </div>
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-2 text-center border-r last:border-r-0 ${
                  isToday(day) ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-medium text-foreground">{format(day, 'EEE')}</p>
                <p className={`text-sm ${isToday(day) ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Time slots and appointments */}
          <div>
            {TIME_SLOTS.map((timeSlot, slotIndex) => (
              <div 
                key={slotIndex} 
                className={`grid grid-cols-8 border-b last:border-b-0 ${
                  slotIndex % 2 === 0 ? 'bg-gray-50' : ''
                }`}
              >
                <div className="p-2 border-r text-center text-sm text-muted-foreground">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForSlot(day, timeSlot);
                  
                  return (
                    <div 
                      key={dayIndex}
                      className={`p-1 border-r last:border-r-0 min-h-[60px] ${
                        isToday(day) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
                          className={`p-1 mb-1 text-xs rounded border ${getColorForService(appointment.serviceName)} cursor-pointer transition-transform hover:scale-105`}
                        >
                          <div className="font-medium">{appointment.serviceName}</div>
                          <div>{appointment.customerName}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
