import React from 'react';
import { CalendarTodayRounded } from '@mui/icons-material';

const CurrentDate = ({ showIcon = true, className = "", size = "default" }) => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",  
    });

    const formattedDay = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const getSizeClasses = () => {
      switch (size) {
        case 'small':
          return 'text-sm';
        case 'large':
          return 'text-xl lg:text-2xl';
        default:
          return 'text-base lg:text-lg';
      }
    };
  
    return (
      <div className={`flex items-center space-x-2 ${getSizeClasses()} ${className}`}>
        {showIcon && (
          <CalendarTodayRounded className="text-current opacity-80" />
        )}
        <div>
          <p className="font-medium">{formattedDay}</p>
          <p className="opacity-90">{formattedDate}</p>
        </div>
      </div>
    );
};

export default CurrentDate;