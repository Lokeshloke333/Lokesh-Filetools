import { encryptPDF } from "@pdfsmaller/pdf-encrypt";
import { PdfProtectOptions } from "./protect.validation";

export async function protectPdf(
  fileBuffer: Buffer,
  options: PdfProtectOptions
): Promise<Buffer> {
  if (!options.password) {
    throw new Error("Password is required to protect the PDF.");
  }

  // Convert Node Buffer to Uint8Array for @pdfsmaller/pdf-encrypt
  const pdfBytes = new Uint8Array(fileBuffer);

  const encryptedBytes = await encryptPDF(pdfBytes, options.password, {
    ownerPassword: options.password, // Standard practice: owner pass = user pass if not strictly managed
    algorithm: options.algorithm || 'AES-256',
    allowPrinting: options.allowPrinting,
    allowModifying: options.allowModifying,
    allowCopying: options.allowCopying,
    allowAnnotating: options.allowAnnotating,
    allowFillingForms: options.allowFillingForms,
    allowExtraction: options.allowExtraction,
    allowAssembly: options.allowAssembly,
    allowHighQualityPrint: options.allowHighQualityPrint,
  });

  // Convert Uint8Array back to Node Buffer
  return Buffer.from(encryptedBytes);
}
