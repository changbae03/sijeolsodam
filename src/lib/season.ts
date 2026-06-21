import { monthsData } from '@/data/months';

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentMonthData() {
  return monthsData.find((m) => m.month === getCurrentMonth());
}
