// app/dataset-stats/page.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ChevronRight, Image as ImageIcon, ArrowLeft, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

// Types
interface ClassStats {
  count: number;
  images: string[];
  percentage: number;
}

interface StoredData {
  results: Record<string, string>;
}

// Components
const EmptyState = ({ onBack }: { onBack: () => void }) => (
  <div className="container mx-auto p-4 max-w-4xl">
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <PieChart className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium">Nothing to see</p>
          <p className="text-sm text-muted-foreground">
            Go back to upload ur images!
          </p>
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Torna al labeling
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ClassCard = ({ 
  className, 
  stats,
  onClick
}: { 
  className: string;
  stats: ClassStats;
  onClick: () => void;
}) => (
  <Card 
    className="hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="font-medium text-lg">{className}</div>
      <ChevronRight size={20} />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ImageIcon size={20} className="text-muted-foreground" />
          <span>{stats.count} images</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {stats.percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.images.slice(0, 3).map((filename, idx) => {
          const imageUrl = sessionStorage.getItem(`image_${filename}`);
          return imageUrl && (
            <div 
              key={idx} 
              className="aspect-square relative rounded-md overflow-hidden"
            >
              <img
                src={imageUrl}
                alt={`${className} preview ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

// Main Component
export default function DatasetStatsPage() {
  const router = useRouter();
  
  const data = useMemo((): StoredData | null => {
    if (typeof window === 'undefined') return null;
    const storedResults = sessionStorage.getItem('labelingResults');
    return storedResults ? { results: JSON.parse(storedResults) } : null;
  }, []);

  const classStats = useMemo(() => {
    if (!data?.results) return {};

    const stats: Record<string, ClassStats> = {};
    const totalImages = Object.keys(data.results).length;
    
    Object.entries(data.results).forEach(([filename, label]) => {
      if (!stats[label]) {
        stats[label] = { count: 0, images: [], percentage: 0 };
      }
      stats[label].images.push(filename);
      stats[label].count++;
      stats[label].percentage = (stats[label].count / totalImages) * 100;
    });
    
    return stats;
  }, [data]);

  if (!data) {
    return <EmptyState onBack={() => router.push('/')} />;
  }

  const handleClassClick = (className: string) => {
    // Salva i dati della classe nel sessionStorage
    sessionStorage.setItem('selectedClass', className);
    sessionStorage.setItem('classStats', JSON.stringify(classStats[className]));
    router.push(`/dataset-stats/${encodeURIComponent(className)}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          onClick={() => router.push('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
         Go back to labelling
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Dataset Stats</h1>
          <p className="text-sm text-muted-foreground">
            {Object.keys(data.results).length} images in {Object.keys(classStats).length} classes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(classStats).map(([className, stats]) => (
          <ClassCard
            key={className}
            className={className}
            stats={stats}
            onClick={() => handleClassClick(className)}
          />
        ))}
      </div>
    </div>
  );
}