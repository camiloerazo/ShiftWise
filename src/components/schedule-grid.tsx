
"use client";

import type { ScheduleData, Worker } from '@/types';
import { DAYS_OF_WEEK, TIME_SLOTS, DayOfWeek } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScheduleGridProps {
  schedule: ScheduleData;
  workers: Worker[];
  selectedWorkerId: string | null;
  onToggleShift: (day: DayOfWeek, timeSlot: string, workerId: string) => void;
}

export default function ScheduleGrid({ schedule, workers, selectedWorkerId, onToggleShift }: ScheduleGridProps) {
  const handleCellClick = (day: DayOfWeek, timeSlot: string) => {
    if (selectedWorkerId) {
      onToggleShift(day, timeSlot, selectedWorkerId);
    } else {
      console.warn("No worker selected to assign shift.");
    }
  };

  return (
    <Card className="shadow-lg rounded-lg flex-grow min-h-0 flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-xl">
          <CalendarDays className="mr-2 h-6 w-6 text-primary" />
          Weekly Schedule
        </CardTitle>
        {!selectedWorkerId && workers.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Please select a worker from the list to assign/unassign shifts.
          </div>
        )}
         {workers.length === 0 && (
          <div className="mt-2 p-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-md text-sm flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Add a worker first to start building the schedule.
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow min-h-0 flex flex-col p-0 sm:p-2 md:p-4">
        <ScrollArea className="flex-grow whitespace-nowrap rounded-md border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border border-collapse">
              <thead className="bg-secondary sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-secondary-foreground tracking-wider w-20 sticky left-0 bg-secondary z-20 border-r">Time</th>
                  {DAYS_OF_WEEK.map(day => (
                    <th key={day} className="px-3 py-3 text-center text-xs font-medium text-secondary-foreground tracking-wider min-w-[70px] sm:min-w-[80px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {TIME_SLOTS.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground font-medium sticky left-0 bg-card z-10 border-r">
                      {timeSlot}
                    </td>
                    {DAYS_OF_WEEK.map(day => {
                      const currentWorkerIds: string[] | null = schedule[day]?.[timeSlot] || null;
                      const isSelectedWorkerInSlot = selectedWorkerId && Array.isArray(currentWorkerIds) && currentWorkerIds.includes(selectedWorkerId);
                      
                      const assignedWorkerNames = Array.isArray(currentWorkerIds) && currentWorkerIds.length > 0
                        ? currentWorkerIds.map(id => workers.find(w => w.id === id)?.name).filter(Boolean).join(', ')
                        : 'No one';

                      const actionVerb = isSelectedWorkerInSlot ? 'unassign' : 'assign';
                      const selectedWorkerName = selectedWorkerId ? workers.find(w => w.id === selectedWorkerId)?.name : '';
                      const ariaLabel = `Shift for ${day} at ${timeSlot}. Assigned to: ${assignedWorkerNames}. ${selectedWorkerId ? `Click to ${actionVerb} ${selectedWorkerName}.` : 'Select a worker to modify assignments.'}`;

                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          className={cn(
                            "text-center h-10 min-w-[70px] sm:min-w-[80px] transition-all duration-150 ease-in-out border-l border-r p-0", // p-0 to allow inner divs to fill
                            selectedWorkerId ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed",
                            isSelectedWorkerInSlot && "ring-2 ring-offset-1 ring-foreground"
                          )}
                          onClick={() => handleCellClick(day, timeSlot)}
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCellClick(day, timeSlot)}
                          role="button"
                          tabIndex={selectedWorkerId ? 0 : -1}
                          aria-label={ariaLabel}
                        >
                          {Array.isArray(currentWorkerIds) && currentWorkerIds.length > 0 ? (
                            <div className="flex h-full w-full">
                              {currentWorkerIds.map(workerId => {
                                const worker = workers.find(w => w.id === workerId);
                                return (
                                  <div
                                    key={workerId}
                                    className="flex-grow h-full"
                                    style={{ backgroundColor: worker ? worker.color : 'transparent' }}
                                    aria-hidden="true" 
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <div className="h-full w-full bg-card" /> // Explicit background for empty cells
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
