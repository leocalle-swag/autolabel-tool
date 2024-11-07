// components/ImageUploader/UploadHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Loader2, Download } from 'lucide-react';

interface UploadHeaderProps {
  imageCount: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  onDownload: () => void;
  hasLabels: boolean | undefined;
  isProcessing: boolean;
  isDisabled: boolean;
}

const UploadHeader: React.FC<UploadHeaderProps> = ({
  imageCount,
  onUpload,
  onProcess,
  onDownload,
  hasLabels,
  isProcessing,
  isDisabled,
}) => (
<div className="flex flex-wrap gap-4 items-center justify-between w-full">
<div className="flex items-center gap-4">
<Input
        type="file"
        multiple
        accept="image/*"
        onChange={onUpload}
        className="hidden"
        id="image-upload"
      />
      <label 
        htmlFor="image-upload" 
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
      >
        <ImagePlus className="h-4 w-4" />
        <p className='sm: hidden md:block'> Add images</p>
      </label>
      <span className="text-sm text-gray-500">
        {imageCount} total images
      </span>
  </div>
  <div className="flex gap-2 items-center">
      {hasLabels && (
        <Button 
          onClick={onDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
         download labels
        </Button>
      )}
      <Button 
        onClick={onProcess}
        disabled={isDisabled}
        className="flex items-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Elaborazione...
          </>
        ) : (
          'classify images'
        )}
      </Button>

  </div>

</div>
);

export default UploadHeader;