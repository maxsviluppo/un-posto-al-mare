import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function Calendar({ selectedDate, onDateChange, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: it })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative aspect-square flex items-center justify-center text-sm font-bold cursor-pointer rounded-2xl transition-all m-1",
              !isSameMonth(day, monthStart) ? "text-gray-200" : 
              isSameDay(day, selectedDate) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : 
              isToday(day) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
            )}
            onClick={() => onDateChange(cloneDay)}
          >
            <span>{formattedDate}</span>
            {isToday(day) && !isSameDay(day, selectedDate) && (
              <div className="absolute bottom-2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className={cn("bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
