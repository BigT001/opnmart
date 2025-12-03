import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface UploadResponse {
  event?: string;
  info?: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
}

interface UseCloudinaryUploadResult {
  isLoading: boolean;
  error: string | null;
  uploadImage: (onSuccess: (url: string) => void) => void;
}

/**
 * Hook for handling Cloudinary image uploads
 * @param onUpload - Callback when upload completes
 * @returns Upload state and handler
 */
export function useCloudinaryUpload(): UseCloudinaryUploadResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = (onSuccess: (url: string) => void) => {
    // This would be used with CldUploadWidget
    // Example usage in component:
    /*
    <CldUploadWidget
      uploadPreset="your_preset"
      onSuccess={(result: UploadResponse) => {
        if (result.info && 'secure_url' in result.info) {
          onSuccess(result.info.secure_url);
        }
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>Upload Image</button>
      )}
    </CldUploadWidget>
    */
  };

  return { isLoading, error, uploadImage };
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'high' | 'low';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'pad';
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return '';
  }

  const params = new URLSearchParams();
  
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.quality) params.append('q', options.quality);
  if (options?.format) params.append('f', options.format);
  if (options?.crop) params.append('c', options.crop);

  const queryString = params.toString();
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${queryString}/${publicId}`;
  
  return url;
}
