export interface Worker {
  id: string;
  name: string;
  color: string;
}

// Schedule: Day -> Time Slot -> Worker ID (or null if unassigned)
// Example: { "Mon": { "08:00": "worker1_id", "08:30": null }, "Tue": { ... } }
export type ScheduleData = Record<string, Record<string, string | null>>;

export interface Shift {
  day: string;
  timeSlot: string;
  workerId: string;
}
