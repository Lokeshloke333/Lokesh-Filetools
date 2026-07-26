import { NextRequest, NextResponse } from "next/server";
import { convertPdfToPpt, PdfToPptError } from "@/lib/pdf/pdf-to-ppt";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { pptxBytes, slideCount } = await convertPdfToPpt(buffer);

    return new NextResponse(pptxBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="converted-presentation.pptx"',
        "X-Slide-Count": slideCount.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("PDF to PPT Error:", err);
    
    if (err instanceof PdfToPptError) {
       return NextResponse.json(
         { error: err.message, code: err.code },
         { status: 422 } // Unprocessable entity
       );
    }

    return NextResponse.json(
      { error: "Failed to convert PDF to PPT." },
      { status: 500 }
    );
  }
}
