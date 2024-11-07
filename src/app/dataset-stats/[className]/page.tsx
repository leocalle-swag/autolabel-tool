'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

interface ClassStats {
  count: number;
  images: string[];
  percentage: number;
}

interface ImageLabel {
  filename: string;
  currentClass: string;
  originalClass: string;
}

interface PageProps {
  params: {
    className: string;
  };
}

function ClassDetailContent({ className, stats: initialStats }: { className: string; stats: ClassStats }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [imageLabels, setImageLabels] = useState<ImageLabel[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Carica tutte le classi disponibili dal dataset originale
    const results = JSON.parse(sessionStorage.getItem('labelingResults') || '{}');
    const uniqueClasses = Array.from(new Set(Object.values(results)));
    setAvailableClasses(uniqueClasses as string[]);

    // Inizializza le etichette delle images
    const labels: ImageLabel[] = initialStats.images.map(filename => ({
      filename,
      currentClass: className,
      originalClass: className
    }));
    setImageLabels(labels);
  }, [className, initialStats]);

  const handleClassChange = (filename: string, newClass: string) => {
    setImageLabels(prev => prev.map(label => 
      label.filename === filename 
        ? { ...label, currentClass: newClass }
        : label
    ));
    setHasUnsavedChanges(true);
  };

  const saveChanges = () => {
    // Aggiorna i risultati nel sessionStorage
    const results = JSON.parse(sessionStorage.getItem('labelingResults') || '{}');
    imageLabels.forEach(label => {
      if (label.currentClass !== label.originalClass) {
        results[label.filename] = label.currentClass;
      }
    });
    sessionStorage.setItem('labelingResults', JSON.stringify(results));
    
    // Aggiorna lo stato delle etichette per riflettere che le modifiche sono ora le originali
    setImageLabels(prev => prev.map(label => ({
      ...label,
      originalClass: label.currentClass // Aggiorna la classe originale con quella corrente
    })));
    
    // Resetta il flag delle modifiche non salvate
    setHasUnsavedChanges(false);
    
    toast({
      title: "Modifiche salvate",
      description: "Le modifiche alle etichette sono state salvate con successo.",
    });
    
    router.push('/dataset-stats');
  };

  const downloadUpdatedLabels = () => {
    const results = JSON.parse(sessionStorage.getItem('labelingResults') || '{}');
    const content = Object.entries(results)
      .map(([filename, label]) => `${filename}: ${label}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_labels.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (confirm('Ci sono modifiche non salvate. Vuoi continuare?')) {
                    router.push('/dataset-stats');
                  }
                } else {
                  router.push('/dataset-stats');
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Torna alle statistiche
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{className}</h1>
              <p className="text-sm text-muted-foreground">
                {initialStats.count} images • {initialStats.percentage.toFixed(1)}% del dataset
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button 
                onClick={saveChanges}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Salva Modifiche
              </Button>
            )}
            <Button
              onClick={downloadUpdatedLabels}
              variant="outline"
            >
              download updated labels
            </Button>
          </div>
        </div>

        {selectedImage && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {selectedImage}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  Chiudi
                </Button>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={sessionStorage.getItem(`image_${selectedImage}`) || ''}
                  alt={selectedImage}
                  className="object-contain w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imageLabels.map((label) => {
            const imageUrl = sessionStorage.getItem(`image_${label.filename}`);
            return imageUrl && (
              <Card 
                key={label.filename}
                className="hover:shadow-lg transition-shadow"
              >
                <div 
                  className="aspect-square relative rounded-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(label.filename)}
                >
                  <img
                    src={imageUrl}
                    alt={label.filename}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm truncate max-w-[90%] px-2">
                      {label.filename}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <ClassSelector
                      currentClass={label.currentClass}
                      availableClasses={availableClasses}
                      onClassChange={handleClassChange}
                      filename={label.filename}
                    />
                
                  {label.currentClass !== label.originalClass && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Modificato da: {label.originalClass}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ClassDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const className = decodeURIComponent(params.className);

  useEffect(() => {
    const loadStats = () => {
      const stats = sessionStorage.getItem('classStats');
      if (stats) {
        setClassStats(JSON.parse(stats));
      } else {
        router.push('/dataset-stats');
      }
      setIsLoading(false);
    };

    loadStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!classStats) {
    return null;
  }

  return <ClassDetailContent className={className} stats={classStats} />;
}


interface ClassSelectorProps {
  /** La classe attualmente selezionata */
  currentClass: string;
  /** Array delle classi disponibili per la selezione */
  availableClasses: string[];
  /** Callback chiamata quando viene selezionata una nuova classe 
   * @param filename - Il nome del file da classificare
   * @param newClass - La nuova classe selezionata
   */
  onClassChange: (filename: string, newClass: string) => void;
  /** Il nome del file che sta venendo classificato */
  filename: string;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ 
  currentClass, 
  availableClasses, 
  onClassChange,
  filename 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {availableClasses.map((cls) => (
        <Button
          key={cls}
          onClick={() => onClassChange(filename, cls)}
          variant={currentClass === cls ? "default" : "outline"}
          className={`
            ${currentClass === cls 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'hover:bg-primary/10'
            }
            transition-colors
          `}
        >
          {cls}
        </Button>
      ))}
    </div>
  );
};


/**
 * 
 *   <Select
                    value={label.currentClass}
                    onValueChange={(value) => handleClassChange(label.filename, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
 */