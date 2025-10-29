
import React, { useRef } from 'react';
import { PlusIcon, UploadIcon } from './icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string | null;
  onRemove?: () => void;
  text?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, previewUrl, onRemove, text="Unggah"}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        <div className="relative w-full h-40 group">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-300" />
          {onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleButtonClick}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <UploadIcon className="w-8 h-8 mb-2" />
          <span>{text}</span>
        </button>
      )}
    </div>
  );
};

export const MultiImageUploader: React.FC<{
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles: number;
    minFiles: number;
}> = ({ files, onFilesChange, maxFiles, minFiles }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            onFilesChange([...files, ...newFiles].slice(0, maxFiles));
        }
    };

    const handleRemove = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {files.map((file, index) => (
                <div key={index} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-28 object-cover rounded-lg border"/>
                     <button
                        onClick={() => handleRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                        &times;
                    </button>
                </div>
            ))}
            {files.length < maxFiles && (
                <>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </>
            )}
        </div>
    )
}


export default ImageUploader;
