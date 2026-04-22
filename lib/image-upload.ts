'use client';

import { supabase } from '@/lib/supabase';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_BUCKET = 'site-images';

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getFileExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName) {
    return fromName;
  }

  const mimeExtension = file.type.split('/').pop()?.toLowerCase();
  return mimeExtension || 'jpg';
}

function getBucketName() {
  return process.env.NEXT_PUBLIC_SITE_IMAGES_BUCKET || DEFAULT_BUCKET;
}

export async function uploadSiteImage(file: File, folder: string) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image is too large. Please keep it under 5MB.');
  }

  const extension = getFileExtension(file);
  const safeFolder = sanitizeSegment(folder) || 'uploads';
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const path = `${safeFolder}/${fileName}`;
  const bucket = getBucketName();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Image upload failed.');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!publicUrl) {
    throw new Error('Could not get uploaded image URL.');
  }

  return publicUrl;
}
