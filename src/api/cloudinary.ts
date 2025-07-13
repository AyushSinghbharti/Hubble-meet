// src/lib/cloudinary.ts
import { Platform } from 'react-native';

// If you loaded via env, replace these with your env variables:
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export async function uploadToCloudinary(
  uri: string
): Promise<string | null> {
  if (!uri) return null;

  // On iOS the uri may start with file://
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

  // Build form data
  const formData = new FormData();
  formData.append('file', {
    uri: uploadUri,
    type: 'image/jpeg',
    name: `upload.jpg`,
  } as any);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Cloudinary error:', data);
      return null;
    }
    // secure_url is the public URL
    return data.secure_url as string;
  } catch (err) {
    console.error('Upload to Cloudinary failed:', err);
    return null;
  }
}
