import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

const AutoLabelInterface = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [labels, setLabels] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleAutoLabel = async () => {
    setIsProcessing(true);
    // Simulazione processo di labeling
    const newLabels = {};
    for (const image of selectedImages) {
      newLabels[image.name] = 'Label predetta per ' + image.name;
    }
    setLabels(newLabels);
    setIsProcessing(false);
  };

  const downloadResults = () => {
    const content = Object.entries(labels)
      .map(([filename, label]) => `${filename}: ${label}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'labels.txt';
    a.click();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Seleziona immagini o trascina qui</p>
              </label>
            </div>
            
            <div className="mt-4">
              <p className="mb-2">Immagini selezionate: {selectedImages.length}</p>
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Textarea
              placeholder="Inserisci il prompt per l'auto-labeling..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-4"
            />

            <div className="flex gap-4">
              <Button 
                onClick={handleAutoLabel}
                disabled={!selectedImages.length || !prompt || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Elaborazione...' : 'Auto-Label'}
              </Button>
              
              {Object.keys(labels).length > 0 && (
                <Button 
                  onClick={downloadResults}
                  className="w-full"
                  variant="outline"
                >
                  Scarica Risultati
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoLabelInterface;