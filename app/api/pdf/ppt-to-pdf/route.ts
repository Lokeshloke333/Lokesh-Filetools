import { NextRequest, NextResponse } from "next/server";
import { convertPptToPdfLocal, PptExtractionError } from "@/lib/office/pptToPdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || (!file.name.toLowerCase().endsWith(".ppt") && !file.name.toLowerCase().endsWith(".pptx"))) {
      return NextResponse.json(
        { error: "A valid PowerPoint file (.ppt or .pptx) is required." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { pdfBytes, slideCount } = await convertPptToPdfLocal(buffer, file.name);

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
         { status: 422 }
       );
    }

    return NextResponse.json(
      { error: "Failed to convert PPT to PDF." },
      { status: 500 }
    );
  }
}
