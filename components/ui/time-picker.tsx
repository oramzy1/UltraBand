import React, { useState,  useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

export function TimePicker({ value, onChange, onClose }: TimePickerProps) {
  const [hour, setHour] = useState(() => {
    if (value) {
      const [h] = value.split(':');
      return parseInt(h) % 12 || 12;
    }
    return 7;
  });
  
  const [minute, setMinute] = useState(() => {
    if (value) {
      const [, m] = value.split(':');
      return parseInt(m);
    }
    return 0;
  });
  
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    if (value) {
      const [h] = value.split(':');
      return parseInt(h) >= 12 ? 'PM' : 'AM';
    }
    return 'AM';
  });
  
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [handAngle, setHandAngle] = useState(0); 

  useEffect(() => {
    // ✅ Initialize hand position on mount
    const value = mode === "hour" ? hour : minute;
    const maxValue = mode === "hour" ? 12 : 60;
    const angle = (value / maxValue) * 360 - 90;
    setHandAngle(angle);
  }, [mode]);

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // ✅ prevent default form behavior
    e.stopPropagation(); // ✅ avoid bubbling up to parent forms

    const clock = e.currentTarget;
    const rect = clock.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;
    
    if (mode === 'hour') {
      const selectedHour = Math.round(angle / 30) % 12 || 12;
      setHour(selectedHour);
      setHandAngle(angle);
      setMode('minute');
    } else {
      const selectedMinute = Math.round(angle / 6) % 60;
      setMinute(selectedMinute);
      setHandAngle(angle);
    }
  };

  const handleOk = (e: React.MouseEvent) => {
    e.preventDefault(); // ✅ prevent form submission
    const hour24 =
      period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
    const timeString = `${String(hour24).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    onChange(timeString);
    onClose();
  };

  const getClockHandStyle = () => ({
    transform: `rotate(${handAngle}deg)`,
    transition: "transform 0.4s ease", // ✅ smooth animation
  });


  const getClockNumbers = () => {
    if (mode === 'hour') {
      return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  };

  const getNumberPosition = (index: number, total: number) => {
    const baseRadius = typeof window !== "undefined" && window.innerWidth < 640 ? 65 : 85;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    return { x, y };
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 w-full max-w-sm sm:w-80 shadow-xl mx-auto">
      <div className="text-white/60 text-sm mb-4">Select time</div>
      
      {/* Time Display */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
        type='button'
          onClick={() => setMode('hour')}
          className={`text-3xl sm:text-5xl font-light px-4 py-2 rounded-lg transition-colors ${
            mode === 'hour' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-white/80'
          }`}
        >
          {String(hour).padStart(2, '0')}
        </button>
        
        <span className="text-3xl sm:text-5xl font-light text-white/80">:</span>
        
        <button
        type='button'
          onClick={() => setMode('minute')}
          className={`text-3xl sm:text-5xl font-light px-4 py-2 rounded-lg transition-colors ${
            mode === 'minute' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-700 text-white/80'
          }`}
        >
          {String(minute).padStart(2, '0')}
        </button>
        
        <div className="flex flex-col gap-1 ml-2">
          <button
          type='button'
            onClick={() => setPeriod('AM')}
            className={`text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-1.5 rounded transition-colors ${
              period === 'AM' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-white/60'
            }`}
          >
            AM
          </button>
          <button
          type='button'
            onClick={() => setPeriod('PM')}
            className={`text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-1.5 rounded transition-colors ${
              period === 'PM' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-white/60'
            }`}
          >
            PM
          </button>
        </div>
      </div>
      
      {/* Clock */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6">
        <div 
          className="absolute inset-0 bg-gray-700 rounded-full cursor-pointer"
          onClick={handleClockClick}
        >
          {/* Clock Numbers */}
          {getClockNumbers().map((num, index) => {
            const pos = getNumberPosition(index, mode === 'hour' ? 12 : 12);
            const isSelected = mode === 'hour' ? num === hour : num === minute;
            
            return (
              <div
                key={num}
                className={`absolute text-sm transition-colors ${
                  isSelected ? 'text-white font-semibold' : 'text-white/60'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                }}
              >
                {num}
              </div>
            );
          })}
          
          {/* Clock Hand */}
          <div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
                width: '2px',
                height: window.innerWidth < 640 ? '30%' : '35%',
                backgroundColor: '#a78bfa',
                ...getClockHandStyle(),
                marginLeft: '-1px',
                marginTop: window.innerWidth < 640 ? '-30%' : '-35%',
            }}
          />
          
          {/* Center Dot */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
          
          {/* End Dot */}
          {/* <div
            className="absolute left-1/2 top-1/2 w-10 h-10 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white font-semibold"
            style={{
              ...getClockHandStyle(),
              transformOrigin: 'center',
              marginLeft: '0',
              marginTop: '10px',
            }}
          >
            {mode === 'hour' ? hour : minute}
          </div> */}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button type='button' className="p-2 text-white/60 hover:bg-gray-700 rounded">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
        
        <div className="flex gap-2">
          <Button
          type='button'
            variant="ghost"
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 hover:bg-transparent"
          >
            Cancel
          </Button>
          <Button
          type='button'
            variant="ghost"
            onClick={handleOk}
            className="text-purple-400 hover:text-purple-300 hover:bg-transparent"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}