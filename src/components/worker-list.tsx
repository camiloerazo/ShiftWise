"use client";

import type { Worker } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import WorkerListItem from './worker-list-item';
import { Users } from 'lucide-react';

interface WorkerHours {
  legalHours: number;
  sundayHours: number;
}

interface WorkerListProps {
  workers: Worker[];
  workerHours: Record<string, WorkerHours>;
  selectedWorkerId: string | null;
  onSelectWorker: (workerId: string) => void;
  onDeleteWorker: (workerId: string) => void;
}

export default function WorkerList({ workers, workerHours, selectedWorkerId, onSelectWorker, onDeleteWorker }: WorkerListProps) {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-xl">
          <Users className="mr-2 h-6 w-6 text-primary" />
          Workers & Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {workers.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No workers added yet. Add a worker to get started!</p>
        ) : (
          <ScrollArea className="h-[200px] sm:h-[250px] pr-3"> {/* Max height for scrollability */}
            <ul className="space-y-2">
              {workers.map((worker) => (
                <WorkerListItem
                  key={worker.id}
                  worker={worker}
                  hours={workerHours[worker.id] || { legalHours: 0, sundayHours: 0 }}
                  isSelected={selectedWorkerId === worker.id}
                  onSelectWorker={onSelectWorker}
                  onDeleteWorker={onDeleteWorker}
                />
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
