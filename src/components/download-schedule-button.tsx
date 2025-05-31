"use client";

import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { ScheduleData, Worker } from '@/types';
import { DAYS_OF_WEEK, TIME_SLOTS } from '@/lib/constants';

interface DownloadScheduleButtonProps {
  schedule: ScheduleData;
  workers: Worker[];
  scheduleRef: React.RefObject<HTMLDivElement>;
}

export default function DownloadScheduleButton({ schedule, workers, scheduleRef }: DownloadScheduleButtonProps) {
  const handleDownload = useCallback(async () => {
    if (!scheduleRef.current) return;

    try {
      // Create a temporary container for the schedule
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      // Clone the schedule grid
      const scheduleClone = scheduleRef.current.cloneNode(true) as HTMLElement;
      
      // Remove any interactive elements and adjust styles for the image
      const buttons = scheduleClone.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      
      // Add some padding and background
      scheduleClone.style.padding = '20px';
      scheduleClone.style.backgroundColor = 'white';
      scheduleClone.style.width = 'fit-content';
      scheduleClone.style.minWidth = '800px';
      
      container.appendChild(scheduleClone);

      // Capture the schedule as an image
      const canvas = await html2canvas(scheduleClone, {
        backgroundColor: 'white',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Convert to PNG and download
      const link = document.createElement('a');
      link.download = `shiftwise-schedule-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('Failed to download schedule:', error);
    }
  }, [scheduleRef]);

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="w-full sm:w-auto"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Schedule
    </Button>
  );
} 