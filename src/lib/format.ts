import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatEventDate(date: Date | string): string {
  return format(new Date(date), "EEEE, d MMMM yyyy", { locale: id });
}

export function formatEventTime(date: Date | string): string {
  return format(new Date(date), "HH:mm", { locale: id });
}

/** For `<input type="datetime-local" />` from ISO string */
export function toDatetimeLocalInput(date: Date | string): string {
  const d = new Date(date);
  const offsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
}
