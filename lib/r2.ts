// ============================================================
// lib/r2.ts
// עבודה מול Cloudflare R2 (תואם S3). יוצרים URL חתום (presigned)
// כדי שהדפדפן יעלה את הקובץ ישירות ל-R2 — בלי מגבלת גודל של השרת.
// ============================================================

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function r2() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim()
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim()
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 env vars are missing')
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

const BUCKET = () => process.env.R2_BUCKET_NAME?.trim() || 'virtual-tours'

export function publicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() ?? ''
  return `${base}/${key}`
}

// URL חתום להעלאה ישירה (PUT) מהדפדפן
export async function presignUpload(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET(),
    Key: key,
    ContentType: contentType,
  })
  const uploadUrl = await getSignedUrl(r2(), cmd, { expiresIn: 600 })
  return { uploadUrl, url: publicUrl(key) }
}

export async function deleteObject(key: string) {
  await r2().send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: key }))
}
