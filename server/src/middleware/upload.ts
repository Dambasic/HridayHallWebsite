import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { supabase } from '../db/database.js';

const currentDir = import.meta?.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd();

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

  // If Supabase is configured and storage bucket is set, upload to Supabase Storage
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'gallery-images';
  if (supabase) {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`uploads/${file.filename}`, fileBuffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('⚠️ Supabase Storage upload failed, falling back to local URL:', err);
    }
  }

  return localUrl;
}
