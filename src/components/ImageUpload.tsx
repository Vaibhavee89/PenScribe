import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage } from '../lib/storage';
import LoadingSpinner from './ui/LoadingSpinner';

type ImageUploadProps = {
  onUploadComplete: (url: string) => void;
  className?: string;
};

const ImageUpload = ({ onUploadComplete, className = '' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'covers');
      if (imageUrl) {
        onUploadComplete(imageUrl);
      } else {
        setError('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors">
        {isUploading ? (
          <div className="flex items-center">
            <LoadingSpinner size="small" className="mr-2" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click or drag to upload image</span>
            <span className="text-xs text-gray-400 mt-1">Max size: 5MB</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;