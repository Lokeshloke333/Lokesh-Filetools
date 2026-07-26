import { NextRequest, NextResponse } from "next/server";
import { deletePdfPages } from "@/lib/pdf/delete";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pagesToDeleteStr = formData.get("pagesToDelete") as string;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    const pagesToDelete = new Set<number>();
    if (pagesToDeleteStr) {
      const parts = pagesToDeleteStr.split(',');
      for (const part of parts) {
        const index = parseInt(part.trim(), 10);
        if (!isNaN(index) && index >= 0) {
          pagesToDelete.add(index);
        }
      }
    }

    if (pagesToDelete.size === 0) {
       return NextResponse.json(
        { error: "No pages selected for deletion." },
        { status: 400 }
      );
    }

    const deletedBytes = await deletePdfPages(file, pagesToDelete);

    return new NextResponse(deletedBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="deleted-document.pdf"',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF Delete Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to delete PDF pages." },
      { status: 500 }
    );
  }
}
