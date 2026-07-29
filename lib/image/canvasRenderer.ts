import { TransformState, getBoundingBoxAfterRotation } from "./imageTransform";

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement | ImageBitmap;
  transform?: TransformState;
  // Used to simulate formatting changes (like removing transparency for JPEG)
  simulateFormat?: "jpeg" | "jpg" | "png" | "webp" | "avif" | string;
  // If provided, draws the image at these specific dimensions (useful for resize preview)
  targetWidth?: number;
  targetHeight?: number;
  // CSS filter string for basic visual adjustments
  filter?: string;
}

export function renderToCanvas({
  canvas,
  image,
  transform,
  simulateFormat,
  targetWidth,
  targetHeight,
  filter
}: RenderOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const {
    scale = 1,
    rotation = 0,
    flipX = false,
    flipY = false
  } = transform || {};

  // 1. Calculate base dimensions (either target or intrinsic)
  const baseWidth = targetWidth ?? image.width;
  const baseHeight = targetHeight ?? image.height;

  // 2. Apply scale
  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  // 3. Calculate bounding box after rotation so canvas can fit the whole image
  const { width: boundingWidth, height: boundingHeight } = getBoundingBoxAfterRotation(
    scaledWidth,
    scaledHeight,
    rotation
  );

  // 4. Resize canvas exactly to the bounding box
  canvas.width = boundingWidth;
  canvas.height = boundingHeight;

  // 5. Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 6. Apply format simulation (e.g. white background for JPEGs to simulate lost transparency)
  const isJpeg = simulateFormat === "jpeg" || simulateFormat === "jpg";
  if (isJpeg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 7. Setup transform matrix
  ctx.save();
  
  // Move origin to center of canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Apply rotation
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Apply flips
  if (flipX || flipY) {
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  }

  // Apply CSS filters if any (e.g., simulating compression blur)
  if (filter) {
    ctx.filter = filter;
  }

  // 8. Draw image centered
  ctx.drawImage(
    image,
    -scaledWidth / 2,
    -scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );

  ctx.restore();
}
