import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatEventDate(date: Date | string): string {
  return format(new Date(date), "EEEE, d MMMM yyyy", { locale: id });
}

export function formatEventTime(date: Date | string): string {
  return format(new Date(date), "HH:mm", { locale: id });
}
