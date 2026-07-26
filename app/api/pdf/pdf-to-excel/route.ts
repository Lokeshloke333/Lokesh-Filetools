import { NextRequest, NextResponse } from "next/server";
import { convertPdfToExcel, PdfExtractionError } from "@/lib/pdf/pdf-to-excel";

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

    const { excelBytes, worksheetCount, tablesDetected } = await convertPdfToExcel(buffer);

    return new NextResponse(excelBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="converted-spreadsheet.xlsx"',
        "X-Worksheet-Count": worksheetCount.toString(),
        "X-Tables-Detected": tablesDetected.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("PDF to Excel Error:", err);
    
    if (err instanceof PdfExtractionError) {
       return NextResponse.json(
         { error: err.message, code: err.code },
         { status: 422 } // Unprocessable entity
       );
    }

    return NextResponse.json(
      { error: "Failed to convert PDF to Excel." },
      { status: 500 }
    );
  }
}
