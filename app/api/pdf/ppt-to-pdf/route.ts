import { NextRequest, NextResponse } from "next/server";
import { convertPptToPdf, PptExtractionError, PptToPdfOptions } from "@/lib/pdf/ppt-to-pdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const optionsStr = formData.get("options") as string;

    if (!file || (!file.name.toLowerCase().endsWith(".ppt") && !file.name.toLowerCase().endsWith(".pptx"))) {
      return NextResponse.json(
        { error: "A valid PowerPoint file (.ppt or .pptx) is required." },
        { status: 400 }
      );
    }

    let options: PptToPdfOptions = {
      pageSize: 'A4',
      orientation: 'Landscape',
      slidesPerPage: '1',
      includeNotes: false
    };

    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid configuration data format." },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { pdfBytes, slideCount } = await convertPptToPdf(buffer, file.name, options);

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted-presentation.pdf"',
        "X-Slide-Count": slideCount.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("PPT to PDF Error:", err);
    
    if (err instanceof PptExtractionError) {
       return NextResponse.json(
         { error: err.message, code: err.code },
         { status: 422 } // Unprocessable entity
       );
    }

    return NextResponse.json(
      { error: "Failed to convert PPT to PDF." },
      { status: 500 }
    );
  }
}
