import { decryptPDF, isEncrypted } from "@pdfsmaller/pdf-decrypt";

/**
 * Attempts to unlock a PDF file with the provided password.
 * Returns the decrypted PDF as a Uint8Array.
 * Throws if the password is incorrect or file is invalid.
 */
export async function unlockPdf(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  try {
    const info = await isEncrypted(bytes);
    if (!info.encrypted) {
      return bytes;
    }

    const decryptedBytes = await decryptPDF(bytes, password || "");
    return decryptedBytes;
  } catch (err: unknown) {
    const error = err as Error;
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('password') || msg.includes('incorrect') || msg.includes('decrypt')) {
      throw new Error('INCORRECT_PASSWORD');
    }
    throw error;
  }
}
