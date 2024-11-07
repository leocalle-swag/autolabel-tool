import React from 'react';
import { Upload, X } from 'lucide-react';

interface ImageGridProps {
  images: File[];
  onRemove: (index: number) => void;
  isProcessing?: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemove, isProcessing = false }) => {
  // Utilizziamo useState invece di useRef per gestire gli URL delle anteprime
  const [previewUrls, setPreviewUrls] = React.useState<{ [key: string]: string }>({});
  
  // Funzione per normalizzare il nome del file
  const getNormalizedFileName = (file: File) => {
    const cleanName = file.name.replace(/^.*[\\\/]/, '');
    return decodeURIComponent(cleanName);
  };

  // Effetto per gestire la creazione e la pulizia degli URL delle anteprime
  React.useEffect(() => {
    const newPreviewUrls: { [key: string]: string } = {};
    
    // Crea URL per le nuove images
    images.forEach(file => {
      const fileName = getNormalizedFileName(file);
      if (!previewUrls[fileName]) {
        newPreviewUrls[fileName] = URL.createObjectURL(file);
      }
    });
    
    // Mantieni gli URL esistenti per le images che sono ancora presenti
    Object.entries(previewUrls).forEach(([fileName, url]) => {
      if (images.some(file => getNormalizedFileName(file) === fileName)) {
        newPreviewUrls[fileName] = url;
      } else {
        // Revoca gli URL per le images rimosse
        URL.revokeObjectURL(url);
      }
    });
    
    setPreviewUrls(newPreviewUrls);
    
    // Cleanup quando il componente viene smontato
    return () => {
      Object.values(newPreviewUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [images]); // L'effetto viene eseguito quando cambia l'array delle images

  if (images.length === 0) {
    return (

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">click the add button to start!</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${isProcessing ? 'opacity-70' : ''}`}>
      {images.map((file, index) => {
        const fileName = getNormalizedFileName(file);
        const previewUrl = previewUrls[fileName];

        return (
          <div 
            key={`${fileName}-${index}`} 
            className={`relative group ${isProcessing ? 'pointer-events-none' : ''}`}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={fileName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              )}
            </div>
            {!isProcessing && (
              <button
                onClick={() => {
                  onRemove(index);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="delete image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="mt-1 px-1">
              <p className="text-sm text-gray-700 truncate" title={fileName}>
                {fileName}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;