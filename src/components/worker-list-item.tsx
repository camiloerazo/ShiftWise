"use client";

import type { Worker } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface WorkerListItemProps {
  worker: Worker;
  hours: number;
  isSelected: boolean;
  onSelectWorker: (workerId: string) => void;
}

export default function WorkerListItem({ worker, hours, isSelected, onSelectWorker }: WorkerListItemProps) {
  return (
    <li
      key={worker.id}
      onClick={() => onSelectWorker(worker.id)}
      className={cn(
        "flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out",
        isSelected ? 'bg-accent text-accent-foreground shadow-md' : 'hover:bg-secondary/80',
        "border border-border"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectWorker(worker.id)}
      aria-pressed={isSelected}
    >
      <div className="flex items-center">
        <span
          className="h-6 w-6 rounded-full mr-3 border border-border shadow-sm"
          style={{ backgroundColor: worker.color }}
          aria-label={`${worker.name}'s color swatch`}
        ></span>
        <span className="font-medium">{worker.name}</span>
      </div>
      <Badge variant={isSelected ? "default" : "secondary"} className="flex items-center text-sm px-2 py-1">
        <Clock className="mr-1 h-3 w-3" />
        {hours.toFixed(1)} hrs
      </Badge>
    </li>
  );
}
