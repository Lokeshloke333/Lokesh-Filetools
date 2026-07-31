import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { withTempDir } from "@/lib/utils/tempFiles";

const execFileAsync = promisify(execFile);

/**
 * Finds the LibreOffice executable on the local Windows machine.
 * Returns the path or throws an error if not found.
 */
async function getLibreOfficePath(): Promise<string> {
  if (process.env.LIBREOFFICE_PATH) {
    try {
      await fs.access(process.env.LIBREOFFICE_PATH);
      return process.env.LIBREOFFICE_PATH;
    } catch {
      console.warn(`LIBREOFFICE_PATH is set to ${process.env.LIBREOFFICE_PATH} but the file does not exist. Falling back to default locations.`);
    }
  }

  const commonPaths = [
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
  ];

  for (const loPath of commonPaths) {
    try {
      await fs.access(loPath);
      return loPath;
    } catch {
      // Ignore and try next
    }
  }

  throw new Error(
    "LibreOffice is not installed or could not be found. Please install LibreOffice or set the LIBREOFFICE_PATH environment variable."
  );
}

/**
 * Uses local LibreOffice Headless to convert an Office file buffer to a PDF buffer.
 * Supports PPT, PPTX, DOC, DOCX, XLS, XLSX, etc.
 * 
 * @param inputBuffer The binary buffer of the uploaded file.
 * @param originalFilename The original filename (used to preserve extension for LibreOffice).
 * @returns The converted PDF as a Buffer.
 */
export async function convertOfficeToPdfLocal(
  inputBuffer: Buffer,
  originalFilename: string
): Promise<Buffer> {
  const sofficePath = await getLibreOfficePath();

  return withTempDir(async (tempDir) => {
    // Sanitize filename to avoid weird characters breaking the command line
    const ext = path.extname(originalFilename) || ".tmp";
    const inputFilename = `input${ext}`;
    const inputFilePath = path.join(tempDir, inputFilename);

    // Write the buffer to the temp directory
    await fs.writeFile(inputFilePath, inputBuffer);

    // Run LibreOffice headless
    // Format: soffice --headless --convert-to pdf --outdir <tempDir> <inputFilePath>
    try {
      const startTime = Date.now();
      console.log(`[LibreOffice] Starting conversion of ${originalFilename}...`);

      const { stdout, stderr } = await execFileAsync(
        sofficePath,
        [
          "--headless",
          "--convert-to",
          "pdf",
          "--outdir",
          tempDir,
          inputFilePath,
        ],
        { timeout: 55000 } // 55 second hard timeout
      );

      const duration = Date.now() - startTime;
      console.log(`[LibreOffice] Conversion finished in ${duration}ms.`);
      
      if (stderr) {
         console.warn(`[LibreOffice] stderr: ${stderr}`);
      }
      
    } catch (error: any) {
      if (error.killed) {
        throw new Error("LibreOffice conversion timed out. The file might be too complex.");
      }
      console.error("[LibreOffice] Execution failed:", error);
      throw new Error(`LibreOffice conversion failed: ${error.message}`);
    }

    // LibreOffice generates the PDF with the same base name as the input
    const outputFilename = `input.pdf`;
    const outputFilePath = path.join(tempDir, outputFilename);

    try {
      const pdfBuffer = await fs.readFile(outputFilePath);
      console.log(`[LibreOffice] Read PDF output (${pdfBuffer.length} bytes).`);
      return pdfBuffer;
    } catch (error) {
      console.error("[LibreOffice] Could not find the generated PDF:", error);
      throw new Error("LibreOffice finished executing, but the output PDF was not generated.");
    }
  });
}
