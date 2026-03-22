import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatThaiDate(dateStr: string, locale = 'th-TH') {
  return new Date(dateStr).toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatCurrency(amount: number) {
  return `${amount.toLocaleString('th-TH')} ฿`;
}

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `EG-${year}-${rand}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export const STUDIO_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: '10:00', close: '20:00' }, // Sunday — by appointment
  1: null,                                // Monday — closed
  2: { open: '10:00', close: '20:00' }, // Tuesday
  3: { open: '10:00', close: '20:00' }, // Wednesday
  4: { open: '10:00', close: '20:00' }, // Thursday
  5: { open: '10:00', close: '20:00' }, // Friday
  6: { open: '10:00', close: '20:00' }, // Saturday
};

export const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00',
];

export function isStudioOpen(date: Date): boolean {
  const day = date.getDay();
  return STUDIO_HOURS[day] !== null;
}
