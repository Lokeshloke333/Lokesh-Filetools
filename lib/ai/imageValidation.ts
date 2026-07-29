export function validateImageForAI(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided." };
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Unsupported format: ${file.type}. Please use JPG/JPEG, PNG, or WebP.` 
    };
  }

  const maxSizeMB = 20;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { 
      valid: false, 
      error: `File is too large. Maximum size is ${maxSizeMB}MB.` 
    };
  }

  return { valid: true };
}
