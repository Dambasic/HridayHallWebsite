import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { getSupabaseClient } from '../db/database.js';

const currentDir = __dirname;

const uploadsDir =
  process.env.VERCEL || process.env.NOW_REGION
    ? path.join('/tmp', 'uploads')
    : path.resolve(currentDir, '../../uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch {
  // Ignore read-only filesystem errors at import time; Multer/tmp handles runtime
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, AVIF, and SVG images are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter,
});

export async function processImageUpload(file: Express.Multer.File): Promise<string> {
  const localUrl = `/uploads/${file.filename}`;
  const isCloud = Boolean(
    process.env.VERCEL ||
    process.env.NOW_REGION ||
    process.env.RENDER ||
    process.env.RENDER_EXTERNAL_URL
  );
  const bucketName = (process.env.SUPABASE_STORAGE_BUCKET || 'gallery-images').trim();
  const client = getSupabaseClient();

  if (!client) {
    if (isCloud) {
      throw new Error(
        'Supabase Storage is not configured on the backend. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET=gallery-images in Render Environment Variables.'
      );
    }
    return localUrl;
  }

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(`uploads/${file.filename}`, fileBuffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      if (isCloud) {
        throw new Error(`Supabase Storage upload failed (bucket "${bucketName}"): ${error.message}`);
      }
      console.warn('⚠️ Supabase Storage upload failed, falling back to local URL:', error.message);
      return localUrl;
    }

    if (data) {
      const { data: publicData } = client.storage.from(bucketName).getPublicUrl(data.path);
      if (publicData?.publicUrl) {
        return publicData.publicUrl;
      }
    }
  } catch (err: any) {
    if (isCloud) {
      throw err;
    }
    console.warn('⚠️ Supabase Storage upload failed, falling back to local URL:', err);
  }

  return localUrl;
}
