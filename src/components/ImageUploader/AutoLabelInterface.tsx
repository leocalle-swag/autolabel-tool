'use client'
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageGrid from './ImageGrid';
import PromptInput from './PromptInput';
import UploadHeader from './UploadHeader';
import { ErrorAlert } from './ErrorAlert';
import { ProcessingStatus } from './ProcessingStatus';
import { useAutoLabel } from './hooks/useAutoLabel';
import { useImageProcessing } from './hooks/useImageProcessing';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ResetButton } from './ResetButton';
import { Settings2 } from 'lucide-react';
import Link from 'next/link';


export const AutoLabelInterface: React.FC = () => {
  const router = useRouter();
  const {
    selectedImages,
    prompt,
    handleImageSelect,
    removeImage,
    setPrompt,
    clearAll
  } = useAutoLabel();

  const {
    processImages,
    processingMetrics,
    isProcessing,
    error,
    resetMetrics
  } = useImageProcessing();

  useEffect(() => {
    const savedMetrics = sessionStorage.getItem('autoLabel_processingMetrics');
    if (savedMetrics) {
      processImages(selectedImages, prompt);
    }
  }, []);

  const handleProcess = async () => {
    try {
      if (!prompt) {
        throw new Error('Inserisci un prompt per continuare');
      }
      if (selectedImages.length === 0) {
        throw new Error('Seleziona almeno un\'immagine');
      }

      const result = processImages(selectedImages, prompt);
      if (result) {
        sessionStorage.setItem('autoLabel_processingMetrics', JSON.stringify(result));
      }
    } catch (err) {
      console.error('Processing error:', err);
    }
  };

  const handleReset = () => {
    // Pulisci il sessionStorage
    sessionStorage.clear();
    
    // Resetta tutti gli stati
    clearAll();
    resetMetrics();
    
    // Revoca tutti gli URL delle images
    selectedImages.forEach(image => {
      if ((image as any).previewUrl) {
        URL.revokeObjectURL((image as any).previewUrl);
      }
    });

    toast({
      title: "Dataset resettato",
      description: "Tutti i dati sono stati eliminati con successo.",
    });
  };

  const handleDownload = () => {
    if (!processingMetrics?.results) return;
    
    const content = Object.entries(processingMetrics.results)
      .map(([filename, label]) => {
        const labelText = typeof label === 'string' ? label : JSON.stringify(label);
        return `${filename}: ${labelText}`;
      })
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'labels.txt';
    a.click();
  };

  const handleNavigateToStats = () => {
    if (processingMetrics?.results) {
      sessionStorage.setItem('labelingResults', JSON.stringify(processingMetrics.results));
      selectedImages.forEach(image => {
        const imageUrl = URL.createObjectURL(image);
        sessionStorage.setItem(`image_${image.name}`, imageUrl);
      });
    }
    router.push('/dataset-stats');
  };

  const showResults = processingMetrics?.results && 
    Object.keys(processingMetrics.results).length > 0 && 
    !isProcessing;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col h-screen max-h-[800px]">
            {/* Header Section con Reset Button */}
            <div className="space-y-4 flex-shrink-0">
            <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                <UploadHeader
                  imageCount={selectedImages.length}
                  onUpload={handleImageSelect}
                  onProcess={handleProcess}
                  isProcessing={isProcessing}
                  onDownload={handleDownload}
                  hasLabels={showResults}
                  isDisabled={!selectedImages.length || !prompt || isProcessing}
                />

              </div>

              <ErrorAlert error={error} />
              <Link href="/profile"  className="mt-4 flex text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className='items-center flex border-solid border-2 border-gray-300 rounded-md	'> 
                <Settings2/> add api_key first! 
            </div>
            </Link> 
              <PromptInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
              />

              {processingMetrics && (
                <ProcessingStatus metrics={processingMetrics} />
              )}
            </div>

            {/* Scrollable Image Grid */}
            <ScrollArea className="flex-grow mt-4 h-[400px]">
              <ImageGrid
                images={selectedImages}
                onRemove={removeImage}
                isProcessing={isProcessing}
              />
            </ScrollArea>


            {/* Results Section */}
            {showResults && (
              <div className="flex gap-4 mt-4 flex-shrink-0">
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                   download labels
                </Button>
                <Button 
                  onClick={handleNavigateToStats}
                  className="w-full flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  analyze dataset
                </Button>
              </div>
            )}
          </div>
          

          <ResetButton handleReset={handleReset} isProcessing={isProcessing} ></ResetButton>
        
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoLabelInterface;