// Cloudinary configuration - FRONTEND SAFE
// Note: API Secret is NOT included here for security

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlxnaefxk',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '982543269676827',
  // Secret key is intentionally NOT exposed to frontend
  // It will only be used in backend/server-side operations if needed
};

// Upload preset for unsigned uploads (configured in Cloudinary dashboard)
export const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'zeetech_products';

// Helper function to get Cloudinary image URL with transformations
export function getCloudinaryUrl(publicId: string, transformation?: string): string {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;

  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
}

// Common transformations
export const cloudinaryTransformations = {
  thumbnail: 'w_200,h_200,c_fill,q_auto,f_auto',
  productCard: 'w_400,h_400,c_fill,q_auto,f_auto',
  productDetail: 'w_800,h_800,c_fit,q_auto,f_auto',
  hero: 'w_1200,h_600,c_fill,q_auto,f_auto',
};
