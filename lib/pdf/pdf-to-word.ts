import { Document, Packer, Paragraph, TextRun } from "docx";
import { PdfToWordOptions } from "./pdf-to-word.validation";

export async function convertPdfToWord(
  fileBuffer: Buffer,
  options: PdfToWordOptions = {}
): Promise<Buffer> {
  const PDFParser = require("pdf2json");

  // 1. Extract text from PDF using pdf2json (Pure Node, no DOMMatrix/Canvas)
  const extractedText = await new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = Extract text only
    
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    
    pdfParser.parseBuffer(fileBuffer);
  });

  // 2. Parse text into paragraphs
  // PDF-parse often outputs text with arbitrary line breaks. 
  // A double newline usually represents a new paragraph.
  const rawParagraphs = extractedText.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);

  // Fallback if no double newlines exist but text has single newlines
  const paragraphs = rawParagraphs.length < 5 && extractedText.length > 500 
    ? extractedText.split('\n').map((p: string) => p.trim()).filter(Boolean)
    : rawParagraphs;

  // 3. Build DOCX document
  const docxParagraphs = paragraphs.map((text: string) => {
    // Basic heuristic: short paragraphs in ALL CAPS might be headings
    const isHeading = text.length < 80 && text === text.toUpperCase() && text.length > 3;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: isHeading,
          size: isHeading ? 28 : 22, // 28 half-points = 14pt, 22 half-points = 11pt
        }),
      ],
      spacing: {
        after: 200, // 200 twips = 10pt
      },
    });
  });

  if (docxParagraphs.length === 0) {
    docxParagraphs.push(
      new Paragraph({
        children: [
          new TextRun("No text could be extracted from this PDF."),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docxParagraphs,
      },
    ],
  });

  // 4. Generate the DOCX buffer
  const b64 = await Packer.toBase64String(doc);
  const buffer = Buffer.from(b64, "base64");
  
  return buffer;
}
