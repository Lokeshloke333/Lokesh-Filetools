import { isEncrypted, decryptPDF } from "@pdfsmaller/pdf-decrypt";

export type UnlockState = 'idle' | 'inspecting' | 'notProtected' | 'protected' | 'permissionOnly' | 'corrupted' | 'unsupported' | 'unlocking' | 'success';

/**
 * Client-side utility to securely inspect a PDF file and determine its exact encryption state
 * without uploading it to a server.
 * 
 * @param file The PDF File object to inspect
 * @returns A promise resolving to the exact UnlockState of the file
 */
export async function inspectPdfSecurity(file: File): Promise<UnlockState> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    const info = await isEncrypted(bytes);
    
    if (!info.encrypted) {
      return 'notProtected';
    }
    
    if (info.algorithm !== 'AES-256' && info.algorithm !== 'RC4') {
      return 'unsupported';
    }

    try {
      await decryptPDF(bytes, "");
      // Decrypted with an empty string means it only has owner restrictions
      return 'permissionOnly';
    } catch (decryptErr) {
      // Empty string failed, which means a user password is required
      return 'protected';
    }
    
  } catch (err) {
    console.error('PDF Security Inspection failed:', err);
    return 'corrupted';
  }
}
