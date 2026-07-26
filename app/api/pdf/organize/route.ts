import { NextRequest, NextResponse } from "next/server";
import { organizePdfPages, OrganizeOperation } from "@/lib/pdf/organize";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const operationsStr = formData.get("operations") as string;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    if (!operationsStr) {
      return NextResponse.json(
        { error: "Operations data is missing." },
        { status: 400 }
      );
    }

    let operations: OrganizeOperation[];
    try {
      operations = JSON.parse(operationsStr);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid operations data format." },
        { status: 400 }
      );
    }

    if (!Array.isArray(operations) || operations.length === 0) {
       return NextResponse.json(
        { error: "A PDF must contain at least one page." },
        { status: 400 }
      );
    }

    const newPdfBytes = await organizePdfPages(file, operations);

    return new NextResponse(newPdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="organized-document.pdf"',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF Organize Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to organize PDF pages." },
      { status: 500 }
    );
  }
}
