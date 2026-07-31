import { PdfCompressionLevel } from './types';

/**
 * Client-side QPDF WASM compressor.
 * Lazy loads the WASM module, writes to the Emscripten virtual file system,
 * executes standard QPDF structural compression flags, and returns the optimized array buffer.
 */
export async function compressPdfQpdf(
  file: File,
  level: PdfCompressionLevel,
  onProgress?: (msg: string) => void
): Promise<{ bytes: Uint8Array; originalSize: number; optimized: boolean }> {
  
  onProgress?.('Initializing QPDF Engine...');
  // Lazy load the WASM module wrapper
  const createModule = (await import('@neslinesli93/qpdf-wasm')).default;
  
  // Initialize the module, fetching the static WASM file
  const qpdf = await createModule({
    locateFile: () => '/wasm/qpdf.wasm',
  });

  onProgress?.('Loading PDF into memory...');
  const arrayBuffer = await file.arrayBuffer();
  const inputBytes = new Uint8Array(arrayBuffer);
  
  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';

  try {
    // Write input file to virtual FS
      (qpdf.FS as any).writeFile(inputPath, inputBytes);
    
    // Choose arguments based on level
    // QPDF doesn't downsample images, but we can set stream compression aggressiveness
    const args = ['--linearize', '--object-streams=generate'];
    
    if (level === 'high' || level === 'medium') {
      args.push('--stream-data=compress');
      // In qpdf, --compression-level requires zlib/flate, which is automatic if --stream-data=compress is set
    }
    
    args.push(inputPath, outputPath);

    onProgress?.('Optimizing PDF structure...');
    // Execute QPDF synchronously in the WASM memory
    const exitCode = qpdf.callMain(args);

    if (exitCode !== 0) {
      throw new Error(`QPDF exited with code ${exitCode}`);
    }

    onProgress?.('Finalizing optimized file...');
    // Read the output from virtual FS
    const outputBytes = (qpdf.FS as any).readFile(outputPath);
    
    const originalSize = file.size;
    const newSize = outputBytes.length;
    
    // If savings are less than 1%, QPDF couldn't do much (e.g. it's already optimized or mostly images)
    const optimized = newSize < originalSize * 0.99;

    return {
      bytes: optimized ? outputBytes : inputBytes,
      originalSize,
      optimized,
    };
  } finally {
    // Crucial: Release memory to prevent memory leaks in the browser
    try {
      const fs = qpdf.FS as any;
      if (fs.analyzePath(inputPath).exists) fs.unlink(inputPath);
      if (fs.analyzePath(outputPath).exists) fs.unlink(outputPath);
    } catch (e) {
      console.warn("Failed to cleanup QPDF virtual FS", e);
    }
  }
}
