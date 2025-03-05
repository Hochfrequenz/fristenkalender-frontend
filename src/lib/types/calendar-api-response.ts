export interface CalendarApiEntry {
  date: string;
  description: string;
  label: string;
  ref_not_in_the_same_month?: number | null;
}
