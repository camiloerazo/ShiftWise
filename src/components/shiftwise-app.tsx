
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Worker, ScheduleData } from '@/types';
import { DAYS_OF_WEEK, TIME_SLOTS, HALF_HOUR_INCREMENT, DayOfWeek, DEFAULT_WORKER_COLORS } from '@/lib/constants';
import WorkerForm from './worker-form';
import WorkerList from './worker-list';
import ScheduleGrid from './schedule-grid';
import { useToast } from "@/hooks/use-toast";

const initialSchedule = (): ScheduleData => {
  const sched: ScheduleData = {};
  DAYS_OF_WEEK.forEach(day => {
    sched[day] = {};
    TIME_SLOTS.forEach(slot => {
      sched[day][slot] = null; // Initialize with null for no assignments
    });
  });
  return sched;
};

export default function ShiftWiseApp() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [schedule, setSchedule] = useState<ScheduleData>(initialSchedule());
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedWorkers = localStorage.getItem('shiftwise-workers');
    const storedSchedule = localStorage.getItem('shiftwise-schedule');

    if (storedWorkers) {
      try {
        setWorkers(JSON.parse(storedWorkers));
      } catch (e) {
        console.error("Failed to parse workers from localStorage", e);
        localStorage.removeItem('shiftwise-workers');
      }
    }

    if (storedSchedule) {
      try {
        let parsedSchedule = JSON.parse(storedSchedule);
        // Migration logic for old schedule format (string) to new format (string[])
        for (const day of DAYS_OF_WEEK) {
          if (parsedSchedule[day]) {
            for (const slot of TIME_SLOTS) {
              const assignment = parsedSchedule[day][slot];
              if (typeof assignment === 'string') {
                parsedSchedule[day][slot] = [assignment]; // Convert to array
              } else if (assignment === undefined || (Array.isArray(assignment) && assignment.length === 0) ) {
                 // Ensure null for empty or undefined rather than empty array for consistency
                parsedSchedule[day][slot] = null;
              }
            }
          } else {
            // If a day is missing from stored data, initialize it
            parsedSchedule[day] = {};
            TIME_SLOTS.forEach(slot => parsedSchedule[day][slot] = null);
          }
        }
        setSchedule(parsedSchedule);
      } catch (e) {
        console.error("Failed to parse or migrate schedule from localStorage", e);
        localStorage.removeItem('shiftwise-schedule');
        setSchedule(initialSchedule()); // Fallback to initial if parsing/migration fails
      }
    } else {
      setSchedule(initialSchedule()); // No stored schedule, use initial
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('shiftwise-workers', JSON.stringify(workers));
    }
  }, [workers, isClient]);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('shiftwise-schedule', JSON.stringify(schedule));
    }
  }, [schedule, isClient]);


  const handleAddWorker = useCallback((name: string, color: string) => {
    const newWorker: Worker = { id: crypto.randomUUID(), name, color };
    setWorkers(prev => [...prev, newWorker]);
    if (!selectedWorkerId && workers.length === 0) {
      setSelectedWorkerId(newWorker.id);
    }
    toast({ title: "Worker Added", description: `${name} has been added.`});
  }, [selectedWorkerId, workers.length, toast]);

  const handleToggleShift = useCallback((day: DayOfWeek, timeSlot: string, workerIdToToggle: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      newSchedule[day] = { ...newSchedule[day] }; // Ensure day object is copied

      const currentAssignments: string[] | null = newSchedule[day][timeSlot];

      if (currentAssignments === null) {
        // Slot is empty, assign the new worker
        newSchedule[day][timeSlot] = [workerIdToToggle];
      } else {
        // Slot has existing assignments (it's an array)
        const workerIndex = currentAssignments.indexOf(workerIdToToggle);
        if (workerIndex > -1) {
          // Worker is already assigned, unassign them
          const updatedAssignments = currentAssignments.filter(id => id !== workerIdToToggle);
          newSchedule[day][timeSlot] = updatedAssignments.length > 0 ? updatedAssignments : null;
        } else {
          // Worker is not assigned, add them
          newSchedule[day][timeSlot] = [...currentAssignments, workerIdToToggle];
        }
      }
      return newSchedule;
    });
  }, []);

  const workerHours = useMemo(() => {
    const hours: Record<string, number> = {};
    workers.forEach(worker => hours[worker.id] = 0);

    DAYS_OF_WEEK.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const assignedWorkerIds = schedule[day]?.[slot]; // This is now string[] | null
        if (Array.isArray(assignedWorkerIds)) {
          assignedWorkerIds.forEach(workerId => {
            if (workers.find(w => w.id === workerId)) { // Ensure worker still exists
              hours[workerId] = (hours[workerId] || 0) + HALF_HOUR_INCREMENT;
            }
          });
        }
      });
    });
    return hours;
  }, [schedule, workers]);

  const handleSelectWorker = useCallback((workerId: string) => {
    setSelectedWorkerId(prevId => prevId === workerId ? null : workerId);
  }, []);
  
  if (!isClient) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-pulse text-xl font-semibold text-primary">Loading ShiftWise...</div>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 min-h-screen flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <WorkerForm onAddWorker={handleAddWorker} existingWorkerCount={workers.length} />
          <WorkerList
            workers={workers}
            workerHours={workerHours}
            selectedWorkerId={selectedWorkerId}
            onSelectWorker={handleSelectWorker}
          />
        </div>
        <div className="lg:col-span-2 min-h-[400px] lg:min-h-0 flex flex-col">
           <ScheduleGrid
            schedule={schedule}
            workers={workers}
            selectedWorkerId={selectedWorkerId}
            onToggleShift={handleToggleShift}
          />
        </div>
      </div>
    </div>
  );
}
