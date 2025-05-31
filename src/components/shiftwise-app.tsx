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
      sched[day][slot] = null;
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
    // Load from localStorage if available
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
        setSchedule(JSON.parse(storedSchedule));
      } catch (e) {
        console.error("Failed to parse schedule from localStorage", e);
        localStorage.removeItem('shiftwise-schedule');
      }
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

  const handleToggleShift = useCallback((day: DayOfWeek, timeSlot: string, workerIdToAssign: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      newSchedule[day] = { ...newSchedule[day] };
      
      const currentAssignment = newSchedule[day][timeSlot];
      
      if (currentAssignment === workerIdToAssign) {
        newSchedule[day][timeSlot] = null; // Unassign
      } else {
        newSchedule[day][timeSlot] = workerIdToAssign; // Assign or re-assign
      }
      return newSchedule;
    });
  }, []);

  const workerHours = useMemo(() => {
    const hours: Record<string, number> = {};
    workers.forEach(worker => hours[worker.id] = 0);

    DAYS_OF_WEEK.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const workerId = schedule[day]?.[slot];
        if (workerId && workers.find(w => w.id === workerId)) {
          hours[workerId] = (hours[workerId] || 0) + HALF_HOUR_INCREMENT;
        }
      });
    });
    return hours;
  }, [schedule, workers]);

  const handleSelectWorker = useCallback((workerId: string) => {
    setSelectedWorkerId(prevId => prevId === workerId ? null : workerId);
  }, []);
  
  if (!isClient) {
    // Render a loading state or null during SSR/SSG to avoid hydration mismatch
    // due to localStorage access in useEffect.
    // This could be a skeleton loader for a better UX.
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
