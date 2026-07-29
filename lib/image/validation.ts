import { FILE_LIMITS } from "../config";

export function validateImage(file: File, maxSizeMB: number = FILE_LIMITS.IMAGE_MAX_SIZE_MB): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file format. Please upload JPG/JPEG, PNG, WebP, GIF, or AVIF." };
  }

  return { valid: true };
}
