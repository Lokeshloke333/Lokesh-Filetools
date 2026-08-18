/**
 * Efficient client-side flood fill algorithm for Magic Erase.
 * Sets the matched contiguous region's alpha to 0.
 */

export function magicErase(
  imageData: ImageData,
  startX: number,
  startY: number,
  tolerance: number
): ImageData {
  const { width, height, data } = imageData;
  
  // Validate start coordinates
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return imageData;
  }

  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];
  const startA = data[startIdx + 3];

  // If clicked on an already fully transparent pixel, do nothing
  if (startA === 0) {
    return imageData;
  }

  // Visited array to prevent infinite loops (1 byte per pixel)
  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;

  // Queue for BFS. 
  // We use a pre-allocated array or a growing array. Since JS arrays can push/shift,
  // but shift() is O(N). It's much faster to use an index pointer.
  // We store x and y interleaved to avoid object creation.
  const queue = new Int32Array(width * height * 2);
  let head = 0;
  let tail = 0;

  queue[tail++] = startX;
  queue[tail++] = startY;

  // Helper to check color match
  const matches = (x: number, y: number): boolean => {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // If alpha is already 0, it's not a match (prevents bleeding into transparent space)
    if (a === 0) return false;

    const diffR = Math.abs(r - startR);
    const diffG = Math.abs(g - startG);
    const diffB = Math.abs(b - startB);
    const diffA = Math.abs(a - startA);

    // Max channel difference
    const maxDiff = Math.max(diffR, diffG, diffB, diffA);
    return maxDiff <= tolerance;
  };

  // We'll track which indices to clear so we can batch them or do it inline
  // Doing it inline is fine
  data[startIdx + 3] = 0;
  data[startIdx] = 0;
  data[startIdx + 1] = 0;
  data[startIdx + 2] = 0;

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  while (head < tail) {
    const cx = queue[head++];
    const cy = queue[head++];

    for (let i = 0; i < 4; i++) {
      const nx = cx + dx[i];
      const ny = cy + dy[i];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (visited[vIdx] === 0) {
          visited[vIdx] = 1;
          
          if (matches(nx, ny)) {
            const pxIdx = vIdx * 4;
            data[pxIdx] = 0;
            data[pxIdx + 1] = 0;
            data[pxIdx + 2] = 0;
            data[pxIdx + 3] = 0;

            queue[tail++] = nx;
            queue[tail++] = ny;
          }
        }
      }
    }
  }

  return imageData;
}
