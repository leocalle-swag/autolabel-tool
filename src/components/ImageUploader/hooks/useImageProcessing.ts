// hooks/useImageProcessing.ts
import { storage } from '@/lib/storage';
import { AutoLabelError } from '@/lib/types';
import { useState, useCallback } from 'react';

interface ProcessingResponse {
  results: {
    [key: string]: string | null;
  };
  progress: {
    processedImages: number;
    totalImages: number;
    isComplete: boolean;
  };
  nextBatchIndex: number;
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

interface ProcessingMetrics {
  totalImages: number;
  processedImages: number;
  failedImages: number;
  startTime: number;
  endTime?: number;
  results: Record<string, string | null>;
}




export const useImageProcessing = () => {
  const [processingMetrics, setProcessingMetrics] = useState<ProcessingMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<AutoLabelError | null>(null);

  const resetMetrics = () => {
    setProcessingMetrics(null);
  };

  const processImages = useCallback(async (
    images: File[],
    prompt: string,
  ) => {
    if (images.length === 0 || !prompt) return;

    setIsProcessing(true);
    const startTime = Date.now();
    const allResults: Record<string, string | null> = {};
    let processedCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 10;
  
    // Inizializziamo subito le metriche
    setProcessingMetrics({
      totalImages: images.length,
      processedImages: 0,
      failedImages: 0,
      startTime,
      results: {}
    });

    try {
      for (let batchStart = 0; batchStart < images.length; batchStart += BATCH_SIZE) {
        const formData = new FormData();
        const batchEnd = Math.min(batchStart + BATCH_SIZE, images.length);
        const currentBatch = images.slice(batchStart, batchEnd);
        
        currentBatch.forEach(image => {
          formData.append('images', image);
        });
        formData.append('prompt', prompt);
        formData.append('startIndex', batchStart.toString());
        formData.append('totalImages', images.length.toString()); 
        const apiKey = storage.getApiKey();
        if (!apiKey) {
          alert('API Key non configurata! Configura prima la tua API Key nelle impostazioni.');
          return;
        }
        formData.append('apiKey', apiKey);


        try {
          const response = await fetch('/api/auto-label', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          //await delay(500);
          const data: ProcessingResponse = await response.json();

          if (!data.success) {
            // Se c'è un errore di API key, interrompi tutto il processo
            if (data.error?.code === 'INVALID_API_KEY') {
              throw new Error(data.error.message);
            }
            console.error('Error in batch:',data.error?.code);
          }
          
          // Aggiorna i risultati accumulati con i nuovi risultati del batch
          Object.assign(allResults, data.results);
          
          processedCount = data.progress.processedImages;
          
          const newMetrics: ProcessingMetrics = {
            totalImages: images.length,
            processedImages: processedCount,
            failedImages: failedCount,
            startTime,
            endTime: Date.now(),
            results: { ...allResults }
          };

          // Aggiorna lo stato e usa il nuovo valore per il logging
          setProcessingMetrics(newMetrics);
          console.log('Current processing metrics:', newMetrics);

        } catch (error) {
          console.error('Batch processing error:', error);
          failedCount += currentBatch.length;
        }
      }
    } catch (err) {
      console.error('Processing failed:', err);
      setError({
        message: err instanceof Error ? err.message : 'Errore sconosciuto',
        code: 'PROCESSING_ERROR'
      });

      console.error('Processing failed:', error?.code,error?.message);

    } finally {
      setIsProcessing(false);
    }

    return {
      processedCount,
      failedCount,
      duration: Date.now() - startTime,
      results: allResults
    };
  }, []);

  return {
    processingMetrics,
    isProcessing,
    processImages,
    resetMetrics,
    error
  };
};