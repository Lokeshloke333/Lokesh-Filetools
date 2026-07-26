import { NextRequest, NextResponse } from "next/server";
import { convertPdfToWord } from "@/lib/pdf/pdf-to-word";

export const maxDuration = 60; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const outputFormat = formData.get("outputFormat") as "DOCX";
    
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert PDF to DOCX
    const docxBuffer = await convertPdfToWord(buffer, {
      outputFormat: outputFormat || "DOCX",
    });

    const outputFilename = file.name.replace(/\.[^/.]+$/, ".docx");

    return new NextResponse(docxBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("API error during PDF to Word conversion:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert PDF to Word." },
      { status: 500 }
    );
  }
}
