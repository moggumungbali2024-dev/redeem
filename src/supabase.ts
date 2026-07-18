import { createClient } from '@supabase/supabase-js';
import { Partner, Category, AppSettings, User, AppEvent, Faq, Activity, Redemption } from './types';

// Read credentials from Vite env
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file (either File object or base64 data url) to Supabase Storage bucket 'rnf_media'.
 * Falls back to returning base64/local URL if Supabase is not configured or fails.
 */
export async function uploadImage(fileOrDataUrl: File | string, path: string): Promise<string> {
  if (!supabase) {
    console.warn("Supabase not configured, using direct/base64 fallback");
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : await fileToDataUrl(fileOrDataUrl);
  }

  try {
    let fileBody: Blob | File;
    let contentType = 'image/jpeg';

    if (typeof fileOrDataUrl === 'string') {
      // It's a base64 Data URL
      const arr = fileOrDataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileBody = new Blob([u8arr], { type: mime });
      contentType = mime;
    } else {
      fileBody = fileOrDataUrl;
      contentType = fileOrDataUrl.type;
    }

    const fileExt = contentType.split('/')[1] || 'jpg';
    const fileName = `${path}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // Upload to 'rnf_media' bucket
    const { data, error } = await supabase.storage
      .from('rnf_media')
      .upload(fileName, fileBody, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType
      });

    if (error) {
      // Try to create the bucket dynamically if it doesn't exist (only works if user permissions allow)
      console.warn("Upload failed, trying to fallback", error);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : await fileToDataUrl(fileOrDataUrl);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('rnf_media')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error("Failed to upload image to Supabase", err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : await fileToDataUrl(fileOrDataUrl);
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
