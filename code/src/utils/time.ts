import type { Weekday } from "../types";

export const weekdays: Array<{ id: Weekday; label: string; zh: string }> = [
  { id: "mon", label: "Mon", zh: "周一" },
  { id: "tue", label: "Tue", zh: "周二" },
  { id: "wed", label: "Wed", zh: "周三" },
  { id: "thu", label: "Thu", zh: "周四" },
  { id: "fri", label: "Fri", zh: "周五" },
];

export const timelineStartHour = 8;
export const timelineEndHour = 18;
export const hourHeight = 72;

export function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCoursePosition(startTime: string, endTime: string) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const dayStart = timelineStartHour * 60;
  const top = ((startMinutes - dayStart) / 60) * hourHeight;
  const height = Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 58);
  return { top, height };
}

export function getTodayId(): Weekday | "sun" | "sat" {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()] as Weekday | "sun" | "sat";
}

export function isActiveNow(startTime: string, endTime: string, weekday: Weekday) {
  if (weekday !== getTodayId()) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= timeToMinutes(startTime) && currentMinutes <= timeToMinutes(endTime);
}
