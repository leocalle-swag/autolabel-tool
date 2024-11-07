// components/ImageUploader/ProcessingStatus.tsx
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProcessingMetrics {
  totalImages: number;
  processedImages: number;
  failedImages: number;
  startTime: number;
  endTime?: number;
  results: Record<string, string | null>;
}

interface ProcessingStatusProps {
  metrics: ProcessingMetrics;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ metrics }) => {
  const progress = (metrics.processedImages / metrics.totalImages) * 100;
  const duration = metrics.endTime 
    ? ((metrics.endTime - metrics.startTime) / 1000).toFixed(1) 
    : ((Date.now() - metrics.startTime) / 1000).toFixed(1);

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
      <Progress value={progress} className="w-full" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>Progresso: {metrics.processedImages}/{metrics.totalImages} images</p>
          <p>Errori: {metrics.failedImages}</p>
          <p>Tempo: {duration}s</p>
        </div>
        <div>
          <p>Completamento: {progress.toFixed(1)}%</p>
          <p>Rimanenti: {metrics.totalImages - metrics.processedImages}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;