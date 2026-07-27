import { useState } from 'react';
import { Session } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  sessions: Session[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export default function CalendarView({ sessions, selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  
  // Get first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  // Get number of days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Get number of days in previous month for padding
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
    const todayStr = new Date().toISOString().split('T')[0];
    onSelectDate(todayStr);
  };

  const handleDateClick = (dateString: string, isCurrentMonth: boolean) => {
    onSelectDate(dateString);
    if (!isCurrentMonth) {
      const [y, m] = dateString.split('-');
      setCurrentDate(new Date(Number(y), Number(m) - 1, 1));
    }
  };

  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  
  // Generate calendar grid array
  const gridCells = [];
  
  // Add previous month's padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDay = prevMonthTotalDays - i;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthVal = month === 0 ? 11 : month - 1;
    gridCells.push({
      day: prevDay,
      isCurrentMonth: false,
      dateString: `${prevMonthYear}-${String(prevMonthVal + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`
    });
  }
  
  // Add current month's days
  for (let d = 1; d <= totalDays; d++) {
    gridCells.push({
      day: d,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }
  
  // Add next month's padding days to complete grid (multiples of 7)
  const totalCells = gridCells.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthVal = month === 11 ? 0 : month + 1;
    gridCells.push({
      day: n,
      isCurrentMonth: false,
      dateString: `${nextMonthYear}-${String(nextMonthVal + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`
    });
  }
  
  const todayString = new Date().toISOString().split('T')[0];
  
  return (
    <div id="calendar-container-card" className="bg-white rounded-[32px] p-6 border border-[#C9D6D0]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#2F3437] text-xl tracking-tight">
            {year} 年 {month + 1} 月
          </span>
          <button 
            id="btn-go-today"
            type="button"
            onClick={handleToday}
            className="text-[11px] px-3 py-1 bg-[#F6F5F2] text-[#7A7A7A] rounded-full font-bold hover:bg-[#7FA8A4]/10 hover:text-[#7FA8A4] transition-colors"
          >
            今天
          </button>
        </div>
        <div className="flex gap-1">
          <button 
            id="btn-prev-month"
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-[#F6F5F2] text-[#7A7A7A] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            id="btn-next-month"
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-[#F6F5F2] text-[#7A7A7A] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {daysOfWeek.map((day, idx) => (
          <span 
            key={idx} 
            className={`text-[11px] font-bold uppercase tracking-wider py-1 ${idx === 0 || idx === 6 ? 'text-[#D9A46A]/80' : 'text-[#7A7A7A]/70'}`}
          >
            {day}
          </span>
        ))}
      </div>
      
      {/* Grid cells */}
      <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center">
        {gridCells.map((cell, idx) => {
          const isSelected = selectedDate === cell.dateString;
          const isToday = todayString === cell.dateString;
          
          // Filter sessions on this day
          const daySessions = sessions.filter(s => s.date === cell.dateString);
          const hasSessions = daySessions.length > 0;
          
          // Check availability
          const hasSlots = daySessions.some(s => s.totalSlots - s.bookedSlots > 0);
          const allCompleted = daySessions.length > 0 && daySessions.every(s => s.status === 'completed');
          
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(cell.dateString, cell.isCurrentMonth)}
              className={`group relative w-full aspect-square flex flex-col items-center justify-center rounded-[18px] transition-all focus:outline-none
                ${!cell.isCurrentMonth ? 'text-[#7A7A7A]/40' : 'text-[#2F3437]'}
                ${isSelected 
                  ? 'bg-[#7FA8A4] text-white font-bold shadow-lg shadow-[#7FA8A4]/30 scale-[1.08] z-10' 
                  : isToday 
                    ? 'bg-[#7FA8A4]/10 text-[#7FA8A4] font-bold' 
                    : 'hover:bg-[#F6F5F2] font-medium'
                }
              `}
            >
              <span className="text-[15px] relative z-10 mt-1">{cell.day}</span>
              
              {/* Session indicators */}
              <div className="h-3 w-full flex items-center justify-center px-1">
                {hasSessions && (
                  <div className="flex justify-center gap-[3px] items-center">
                    {allCompleted ? (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/60' : 'bg-[#C9D6D0]'}`}></span>
                    ) : hasSlots ? (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#7FA8A4]'}`}></span>
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#D9A46A]'}`}></span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
