export interface PdfProtectOptions {
  password?: string;
  algorithm?: 'AES-256' | 'RC4';
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
  allowAnnotating?: boolean;
  allowFillingForms?: boolean;
  allowExtraction?: boolean;
  allowAssembly?: boolean;
  allowHighQualityPrint?: boolean;
}

export function validateProtectPdfFile(file: File): { valid: boolean; error?: string } {
  // Check extension and type
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  
  if (!isPdf) {
    return { valid: false, error: "Only PDF files are supported." };
  }

  // File size limit: 100MB
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "File exceeds the 100MB size limit." };
  }

  return { valid: true };
}
