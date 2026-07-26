import { NextRequest, NextResponse } from "next/server";
import { convertExcelToPdf, ExcelToPdfOptions } from "@/lib/pdf/excel-to-pdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const optionsStr = formData.get("options") as string;

    if (!file || (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls"))) {
      return NextResponse.json(
        { error: "A valid Excel file (.xlsx or .xls) is required." },
        { status: 400 }
      );
    }

    let options: ExcelToPdfOptions = {
      pageSize: 'A4',
      orientation: 'auto',
      scaling: 'fit-width',
      margins: 'normal'
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

    const { pdfBytes, worksheetCount } = await convertExcelToPdf(file, options);

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted-excel.pdf"',
        "X-Worksheet-Count": worksheetCount.toString(),
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Excel to PDF Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to convert Excel to PDF." },
      { status: 500 }
    );
  }
}
