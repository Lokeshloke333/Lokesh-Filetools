// Utilities for estimating file sizes and formats for real-time previews

/**
 * Heuristics for estimating output size based on dimensions, format, and quality.
 * This provides a fast client-side estimate without doing an actual heavy encoding.
 */
export function estimateOutputSize(
  originalSize: number,
  originalWidth: number,
  originalHeight: number,
  newWidth: number,
  newHeight: number,
  format: string,
  quality: number = 80
): number {
  if (!originalWidth || !originalHeight || !originalSize) return originalSize;

  // Calculate pixel count ratio
  const originalPixels = originalWidth * originalHeight;
  const newPixels = newWidth * newHeight;
  const pixelRatio = newPixels / originalPixels;

  // Base size based strictly on pixel ratio (assuming linear scaling, though often compression is non-linear)
  let estimatedSize = originalSize * pixelRatio;

  // Adjust for quality (0-100)
  // Assuming original was around quality 90. 
  // Drop in quality usually leads to exponential drop in size.
  const qualityFactor = Math.pow(quality / 90, 1.5);
  estimatedSize = estimatedSize * qualityFactor;

  // Adjust for format differences
  const targetFormat = format.toLowerCase();
  
  if (targetFormat === "png") {
    // PNG is lossless and generally larger
    estimatedSize *= 1.5;
  } else if (targetFormat === "webp" || targetFormat === "avif") {
    // WebP/AVIF are highly compressed
    estimatedSize *= 0.6;
  } else if (targetFormat === "jpeg" || targetFormat === "jpg") {
    // Standard baseline
    estimatedSize *= 0.9;
  }

  return Math.max(1024, Math.floor(estimatedSize)); // At least 1KB
}

export function getEstimatedQualityString(quality: number): string {
  if (quality >= 95) return "Excellent (Lossless or near-lossless)";
  if (quality >= 80) return "High (Virtually indistinguishable)";
  if (quality >= 60) return "Medium (Good for web)";
  if (quality >= 40) return "Low (Noticeable artifacts)";
  return "Very Low (Heavy artifacts)";
}
