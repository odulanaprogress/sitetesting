import React, { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { cloudinaryConfig, uploadPreset } from '../../lib/cloudinary';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string, publicId: string) => void;
  buttonText?: string;
  multiple?: boolean;
  folder?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function CloudinaryUploadWidget({
  onUpload,
  buttonText = 'Upload Image',
  multiple = false,
  folder = 'products'
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.cloudinary) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: cloudinaryConfig.cloudName,
            uploadPreset: uploadPreset,
            sources: ['local', 'url', 'camera'],
            multiple: multiple,
            folder: folder,
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            maxFileSize: 5000000, // 5MB
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            theme: 'minimal',
            styles: {
              palette: {
                window: '#FFFFFF',
                windowBorder: '#DC2626',
                tabIcon: '#DC2626',
                menuIcons: '#5A616A',
                textDark: '#000000',
                textLight: '#FFFFFF',
                link: '#DC2626',
                action: '#DC2626',
                inactiveTabIcon: '#9CA3AF',
                error: '#DC2626',
                inProgress: '#DC2626',
                complete: '#10B981',
                sourceBg: '#F3F4F6'
              }
            }
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              const imageUrl = result.info.secure_url;
              const publicId = result.info.public_id;
              onUpload(imageUrl, publicId);
            }
            if (error) {
              console.error('Cloudinary upload error:', error);
            }
          }
        );
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [multiple, folder, onUpload]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
    >
      <Upload size={18} />
      {buttonText}
    </button>
  );
}
