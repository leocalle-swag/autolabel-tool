import { useState, useEffect } from 'react';
import { AutoLabelError } from '@/lib/types';

interface Label {
  [key: string]: string;
}

// Utility function to normalize file names
const getNormalizedFileName = (file: File | string) => {
  if (typeof file === 'string') {
    return file.replace(/^.*[\\\/]/, '');
  }
  const cleanName = file.name.replace(/^.*[\\\/]/, '');
  return decodeURIComponent(cleanName);
};

// Interface for normalized File object
interface NormalizedFile extends File {
  normalizedName: string;
}

export const useAutoLabel = () => {
  const [selectedImages, setSelectedImages] = useState<NormalizedFile[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [labels, setLabels] = useState<Label>({});
  const [error, setError] = useState<AutoLabelError | null>(null);

  // Normalizza il File object aggiungendo il nome normalizzato
  const normalizeFile = (file: File): NormalizedFile => {
    const normalizedFile = file as NormalizedFile;
    normalizedFile.normalizedName = getNormalizedFileName(file);
    return normalizedFile;
  };

  useEffect(() => {
    const savedPrompt = sessionStorage.getItem('autoLabel_prompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }

    const savedImages = sessionStorage.getItem('autoLabel_images');
    if (savedImages) {
      const imageUrls = JSON.parse(savedImages);
      Promise.all(
        imageUrls.map(async (url: string) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const filename = getNormalizedFileName(url);
          const file = new File([blob], filename, { type: blob.type });
          return normalizeFile(file);
        })
      ).then(files => {
        setSelectedImages(files);
      });
    }

    const savedLabels = sessionStorage.getItem('autoLabel_labels');
    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    }
  }, []);

  useEffect(() => {
    if (prompt) {
      sessionStorage.setItem('autoLabel_prompt', prompt);
    }
    
    if (selectedImages.length > 0) {
      const imageUrls = selectedImages.map(image => URL.createObjectURL(image));
      sessionStorage.setItem('autoLabel_images', JSON.stringify(imageUrls));
    }
    
    if (Object.keys(labels).length > 0) {
      sessionStorage.setItem('autoLabel_labels', JSON.stringify(labels));
    }
  }, [prompt, selectedImages, labels]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(normalizeFile);
      setSelectedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedImages([]);
    setPrompt('');
    setLabels({});
    setError(null);
    sessionStorage.removeItem('autoLabel_prompt');
    sessionStorage.removeItem('autoLabel_images');
    sessionStorage.removeItem('autoLabel_labels');
  };

  return {
    selectedImages,
    prompt,
    labels,
    error,
    handleImageSelect,
    removeImage,
    setPrompt,
    clearAll
  };
};