'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, isBefore, addMonths,
  subMonths, getDay, startOfWeek, endOfWeek,
} from 'date-fns';
import { th, enUS, zhCN } from 'date-fns/locale';

interface BookingCalendarProps {
  locale: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  disabledDays?: number[]; // 0=Sun, 1=Mon, ...
}

export default function BookingCalendar({
  locale,
  selectedDate,
  onSelectDate,
  disabledDays = [],
}: BookingCalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date());

  const dateLocale = locale === 'th' ? th : locale === 'zh' ? zhCN : enUS;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd   = endOfMonth(viewMonth);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd     = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayNames =
    locale === 'th'
      ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
      : locale === 'zh'
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDisabled = (day: Date) => {
    const isPast = isBefore(day, today) && !isToday(day);
    const dayOfWeek = getDay(day);
    const isClosedDay = disabledDays.includes(dayOfWeek);
    return isPast || isClosedDay;
  };

  const isSelected = (day: Date) =>
    selectedDate === format(day, 'yyyy-MM-dd');

  const handleSelect = (day: Date) => {
    if (isDisabled(day)) return;
    onSelectDate(format(day, 'yyyy-MM-dd'));
  };

  const monthTitle = format(viewMonth, 'MMMM yyyy', { locale: dateLocale });

  return (
    <div className="bg-brand-dark-2 rounded-xl p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={isBefore(startOfMonth(subMonths(viewMonth, 1)), startOfMonth(today))}
          className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-dark-3
                     flex items-center justify-center text-brand-gray-light
                     hover:text-white hover:border-brand-red transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <p className="text-white font-bold text-sm capitalize">{monthTitle}</p>

        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-dark-3
                     flex items-center justify-center text-brand-gray-light
                     hover:text-white hover:border-brand-red transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((name, i) => (
          <div
            key={name}
            className={cn(
              'text-center text-[11px] font-bold py-1',
              disabledDays.includes(i) ? 'text-brand-gray/40' : 'text-brand-gray'
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const today_   = isToday(day);
          const inMonth  = isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={cn(
                'aspect-square rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center',
                !inMonth && 'opacity-0 pointer-events-none',
                disabled && inMonth && 'text-brand-gray/30 cursor-not-allowed line-through',
                !disabled && inMonth && !selected && 'text-brand-gray-light hover:bg-brand-red/20 hover:text-white',
                today_ && !selected && !disabled && 'border border-brand-red/50 text-brand-red',
                selected && 'bg-brand-red text-white shadow-red-glow font-bold',
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-brand-dark-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-brand-red rounded" />
          <span className="text-brand-gray text-[11px]">{locale === 'th' ? 'เลือกแล้ว' : 'Selected'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-brand-red/50 rounded" />
          <span className="text-brand-gray text-[11px]">{locale === 'th' ? 'วันนี้' : 'Today'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-brand-dark-3 rounded opacity-30" />
          <span className="text-brand-gray text-[11px]">{locale === 'th' ? 'ปิดทำการ' : 'Closed'}</span>
        </div>
      </div>

      {selectedDate && (
        <p className="text-brand-gold text-sm font-bold text-center mt-3">
          📅 {locale === 'th' ? 'วันที่เลือก: ' : 'Selected: '}
          {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: dateLocale })}
        </p>
      )}
    </div>
  );
}
