import { NextRequest, NextResponse } from "next/server";
import { processCompress } from "@/lib/image/compress";
import { CompressSettings } from "@/lib/image/types";
import { validateImage } from "@/lib/image/validation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validation
    const validation = validateImage(file, 50);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const originalSize = file.size;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract settings
    const settings: CompressSettings = {
      quality: parseInt((formData.get("quality") as string) || "80", 10),
      format: (formData.get("format") as string) || "webp",
      stripMetadata: (formData.get("stripMetadata") as string) === "true",
      progressive: (formData.get("progressive") as string) === "true",
    };

    // Process image
    const result = await processCompress({
      buffer,
      mimeType: file.type,
      originalName: file.name || "image",
      settings,
    });

    const compressedSize = result.buffer.length;
    let savedPercentage = 0;
    if (originalSize > 0) {
      savedPercentage = Math.max(0, ((originalSize - compressedSize) / originalSize) * 100);
    }

    const headers: Record<string, string> = {
      "Content-Type": `image/${result.outputFormat}`,
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "x-original-size": originalSize.toString(),
      "x-processed-size": compressedSize.toString(),
      "x-saved-percentage": savedPercentage.toFixed(1),
      "x-filename": result.filename,
      "x-width": result.width.toString(),
      "x-height": result.height.toString(),
    };

    if (result.message) {
      headers["x-compression-message"] = encodeURIComponent(result.message);
    }

    // Return response
    return new NextResponse(new Uint8Array(result.buffer) as any, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Compression error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
