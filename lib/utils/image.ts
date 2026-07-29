export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function calculateSavings(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  const saved = originalSize - compressedSize;
  const percentage = (saved / originalSize) * 100;
  return Math.max(0, parseFloat(percentage.toFixed(1)));
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function validateImage(file: File, maxSizeMB: number = 50): { valid: boolean; error?: string } {
  // Check size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }

  // Check type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file format. Please upload JPG/JPEG, PNG, WebP, GIF, or AVIF." };
  }

  return { valid: true };
}
