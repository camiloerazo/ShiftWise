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
      container.style.backgroundColor = 'white';
      container.style.padding = '20px';
      container.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(container);

      // Create worker legend
      const legendDiv = document.createElement('div');
      legendDiv.style.marginBottom = '20px';
      legendDiv.style.padding = '15px';
      legendDiv.style.border = '2px solid #e5e7eb';
      legendDiv.style.borderRadius = '8px';
      legendDiv.style.backgroundColor = '#f9fafb';
      
      const legendTitle = document.createElement('h3');
      legendTitle.textContent = 'Workers Legend';
      legendTitle.style.margin = '0 0 10px 0';
      legendTitle.style.fontSize = '18px';
      legendTitle.style.fontWeight = 'bold';
      legendTitle.style.color = '#374151';
      legendDiv.appendChild(legendTitle);

      const legendGrid = document.createElement('div');
      legendGrid.style.display = 'grid';
      legendGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
      legendGrid.style.gap = '10px';

      workers.forEach(worker => {
        const workerItem = document.createElement('div');
        workerItem.style.display = 'flex';
        workerItem.style.alignItems = 'center';
        workerItem.style.padding = '8px';
        workerItem.style.backgroundColor = 'white';
        workerItem.style.borderRadius = '6px';
        workerItem.style.border = '1px solid #d1d5db';

        const colorSwatch = document.createElement('div');
        colorSwatch.style.width = '20px';
        colorSwatch.style.height = '20px';
        colorSwatch.style.borderRadius = '50%';
        colorSwatch.style.backgroundColor = worker.color;
        colorSwatch.style.marginRight = '10px';
        colorSwatch.style.border = '1px solid #9ca3af';

        const workerName = document.createElement('span');
        workerName.textContent = worker.name;
        workerName.style.fontWeight = '500';
        workerName.style.color = '#374151';

        workerItem.appendChild(colorSwatch);
        workerItem.appendChild(workerName);
        legendGrid.appendChild(workerItem);
      });

      legendDiv.appendChild(legendGrid);
      container.appendChild(legendDiv);

      // Clone the schedule grid
      const scheduleClone = scheduleRef.current.cloneNode(true) as HTMLElement;
      
      // Remove any interactive elements and adjust styles for the image
      const buttons = scheduleClone.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      
      // Remove any hover effects or interactive styles
      const interactiveElements = scheduleClone.querySelectorAll('[role="button"], [tabindex]');
      interactiveElements.forEach(element => {
        element.removeAttribute('role');
        element.removeAttribute('tabindex');
        element.removeAttribute('aria-label');
        element.removeAttribute('aria-pressed');
      });
      
      // Ensure the schedule has proper styling for download
      scheduleClone.style.width = 'fit-content';
      scheduleClone.style.minWidth = '800px';
      scheduleClone.style.margin = '0';
      
      container.appendChild(scheduleClone);

      // Capture the entire container as an image
      const canvas = await html2canvas(container, {
        backgroundColor: 'white',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        width: container.offsetWidth,
        height: container.offsetHeight,
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
  }, [scheduleRef, workers]);

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