export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];

const START_HOUR = 8; // 8 AM
const END_HOUR = 22; // 10 PM

const formatTimeRange = (hour: number, minute: number): { display: string; id: string } => {
  const displayHour = hour % 12 || 12; // Convert to 12-hour format
  const nextMinute = minute === 30 ? '00' : '30';
  const nextHour = minute === 30 ? (hour + 1) % 24 : hour;
  const nextDisplayHour = nextHour % 12 || 12;
  
  return {
    display: `${displayHour}:${String(minute).padStart(2, '0')}-${nextDisplayHour}:${nextMinute}`,
    id: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` // Use 24-hour format for unique ID
  };
};

export const generateTimeSlots = (): Array<{ display: string; id: string }> => {
  const slots: Array<{ display: string; id: string }> = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    slots.push(formatTimeRange(hour, 0));
    slots.push(formatTimeRange(hour, 30));
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

export const DEFAULT_WORKER_COLORS: string[] = [
  '#FFADAD', // Light Red
  '#FFD6A5', // Light Orange
  '#FDFFB6', // Light Yellow
  '#CAFFBF', // Light Green
  '#9BF6FF', // Light Cyan
  '#A0C4FF', // Light Blue
  '#BDB2FF', // Light Purple
  '#FFC6FF', // Light Pink
  '#FF6B6B', // Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Blue
  '#FED766', // Yellow
];

export const HALF_HOUR_INCREMENT = 0.5;
