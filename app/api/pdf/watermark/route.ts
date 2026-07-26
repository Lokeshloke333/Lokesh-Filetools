import { NextRequest, NextResponse } from "next/server";
import { watermarkPdf, WatermarkConfig } from "@/lib/pdf/watermark";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const configStr = formData.get("config") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    if (!configStr) {
      return NextResponse.json(
        { error: "Watermark configuration is missing." },
        { status: 400 }
      );
    }

    let config: WatermarkConfig;
    try {
      config = JSON.parse(configStr);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid configuration data format." },
        { status: 400 }
      );
    }

    if (config.type === 'text' && (!config.text || !config.text.trim())) {
       return NextResponse.json(
        { error: "Text watermark requires text input." },
        { status: 400 }
      );
    }

    let imageBuffer: Buffer | undefined;
    let mimeType: string | undefined;

    if (config.type === 'image') {
      if (!imageFile) {
        return NextResponse.json(
          { error: "Image watermark requires an image file." },
          { status: 400 }
        );
      }
      const arrayBuffer = await imageFile.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
      mimeType = imageFile.type;
    }

    const { pdfBytes, pagesAffected } = await watermarkPdf(file, config, imageBuffer, mimeType);

    const response = new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="watermarked-document.pdf"',
        "X-Pages-Affected": pagesAffected.toString(),
      },
    });

    return response;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF Watermark Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to add watermark to PDF." },
      { status: 500 }
    );
  }
}
