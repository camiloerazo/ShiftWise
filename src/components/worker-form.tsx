"use client";

import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { DEFAULT_WORKER_COLORS } from '@/lib/constants';

interface WorkerFormProps {
  onAddWorker: (name: string, color: string) => void;
  existingWorkerCount: number;
}

export default function WorkerForm({ onAddWorker, existingWorkerCount }: WorkerFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_WORKER_COLORS[existingWorkerCount % DEFAULT_WORKER_COLORS.length] || '#FFFFFF');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      // Basic validation, consider using react-hook-form for more complex scenarios
      alert('Worker name cannot be empty.');
      return;
    }
    onAddWorker(name, color);
    setName('');
    // Set next default color
    setColor(DEFAULT_WORKER_COLORS[(existingWorkerCount + 1) % DEFAULT_WORKER_COLORS.length] || '#FFFFFF');
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-xl">
          <UserPlus className="mr-2 h-6 w-6 text-primary" />
          Add New Worker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="workerName" className="text-sm font-medium">Worker Name</Label>
            <Input
              id="workerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="workerColor" className="text-sm font-medium">Worker Color</Label>
            <div className="flex items-center mt-1">
              <Input
                id="workerColor"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 p-1"
              />
              <span className="ml-2 text-sm text-muted-foreground">(Click to change)</span>
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="mr-2 h-4 w-4" /> Add Worker
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
