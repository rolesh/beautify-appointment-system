
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  tooltipContent?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  tooltipContent,
  className = '',
}) => {
  return (
    <div className={`rounded-xl glass p-6 card-shadow hover-scale ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {tooltipContent && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1 text-muted-foreground cursor-help"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {change && (
              <span
                className={`ml-2 text-xs font-medium ${
                  change.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change.isPositive ? '↗' : '↘'} {change.value}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-full bg-primary bg-opacity-10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
