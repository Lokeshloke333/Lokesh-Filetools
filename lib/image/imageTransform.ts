// Utilities for calculating dimensions and aspect ratios

export interface Dimensions {
  width: number;
  height: number;
}

export interface TransformState {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

/**
 * Calculates new dimensions while maintaining aspect ratio.
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): Dimensions {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio)
  };
}

/**
 * Calculates the bounding box of a rotated image.
 * This is crucial for resizing the canvas so the corners of a rotated image don't get clipped.
 */
export function getBoundingBoxAfterRotation(width: number, height: number, angleDegrees: number): Dimensions {
  const radians = (angleDegrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  return {
    width: Math.round(width * cos + height * sin),
    height: Math.round(width * sin + height * cos)
  };
}

/**
 * Calculates 2-way bound dimension.
 */
export function calculateBoundDimension(
  changedValue: number,
  changedAxis: 'width' | 'height',
  originalWidth: number,
  originalHeight: number
): number {
  const ratio = originalWidth / originalHeight;
  if (changedAxis === 'width') {
    return Math.round(changedValue / ratio);
  } else {
    return Math.round(changedValue * ratio);
  }
}
