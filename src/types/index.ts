export interface Worker {
  id: string;
  name: string;
  color: string;
}

export type TimeSlot = {
  display: string;
  id: string;
};

// Schedule: Day -> Time Slot ID -> Array of Worker IDs (or null if unassigned)
// Example: { "Mon": { "08:00": ["worker1_id", "worker2_id"], "08:30": null }, "Tue": { ... } }
export type ScheduleData = Record<string, Record<string, string[] | null>>;

export interface Shift {
  day: string;
  timeSlot: string;
  workerId: string; // This might represent a single shift instance in a context where it makes sense.
                   // For the main schedule, we use string[] | null directly.
}
