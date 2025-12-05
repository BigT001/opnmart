'use client';

import { Upload, Trash2, Star } from 'lucide-react';

interface ProductImage {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onImageInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  images: ProductImage[];
  onRemoveImage: (id: string) => void;
  error?: string;
  isLoading?: boolean;
}

export default function ImageUpload({
  dragActive,
  onDrag,
  onDrop,
  onImageInput,
  images,
  onRemoveImage,
  error,
  isLoading,
}: ImageUploadProps) {
  return (
    <div>
      <div 
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20 scale-105' 
            : 'border-gray-300 dark:border-zinc-700 hover:border-green-400 hover:bg-green-50/30 dark:hover:bg-green-950/10'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageInput}
          className="hidden"
          id="image-upload"
          disabled={isLoading}
        />
        <label htmlFor="image-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition ${
              dragActive 
                ? 'bg-green-500' 
                : 'bg-gradient-to-br from-green-500 to-cyan-500'
            }`}>
              <Upload className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {dragActive ? 'Drop images here' : 'Drag images or click to upload'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Up to 5 images • PNG, JPG, GIF • Max 5MB each
              </p>
            </div>
          </div>
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📸 Product Images
            </h3>
            <span className="text-xs font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              First image = Main product image
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div key={img.id} className="relative group">
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-square">
                  <img
                    src={img.preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover transition group-hover:scale-110"
                  />
                  
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3 fill-white" />
                      Main
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition rounded-xl flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onRemoveImage(img.id)}
                      className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center font-medium">
                  Image {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
