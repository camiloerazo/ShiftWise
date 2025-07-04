"use client";

import type { Worker } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';

interface WorkerHours {
  legalHours: number;
  sundayHours: number;
}

interface WorkerListItemProps {
  worker: Worker;
  hours: WorkerHours;
  isSelected: boolean;
  onSelectWorker: (workerId: string) => void;
  onDeleteWorker: (workerId: string) => void;
}

export default function WorkerListItem({ worker, hours, isSelected, onSelectWorker, onDeleteWorker }: WorkerListItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteWorker(worker.id);
  };

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
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-1">
          <Badge variant={isSelected ? "default" : "secondary"} className="flex items-center text-xs px-2 py-0.5">
            <Clock className="mr-1 h-3 w-3" />
            Legal: {hours.legalHours.toFixed(1)}h
          </Badge>
          {hours.sundayHours > 0 && (
            <Badge variant="outline" className="flex items-center text-xs px-2 py-0.5">
              Sunday: {hours.sundayHours.toFixed(1)}h
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8"
          aria-label={`Delete ${worker.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
