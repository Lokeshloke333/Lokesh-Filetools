import { NextRequest, NextResponse } from "next/server";
import { rotatePdf, RotateOptions } from "@/lib/pdf/rotate";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const degreesStr = formData.get("degrees") as string;
    const pageScope = formData.get("pageScope") as "all" | "selected";
    const pageSelection = formData.get("pageSelection") as string;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    const degrees = parseInt(degreesStr, 10);
    if (isNaN(degrees) || (degrees !== 90 && degrees !== 180 && degrees !== 270)) {
      return NextResponse.json(
        { error: "Invalid rotation angle. Must be 90, 180, or 270." },
        { status: 400 }
      );
    }

    const options: RotateOptions = {
      degrees,
      pageScope: pageScope || "all",
      pageSelection: pageSelection || "",
    };

    const rotatedBytes = await rotatePdf(file, options);

    return new NextResponse(rotatedBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated-document.pdf"',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF Rotate Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to rotate PDF file." },
      { status: 500 }
    );
  }
}
