import { NextRequest, NextResponse } from "next/server";
import { protectPdf } from "@/lib/pdf/protect";
import { PdfProtectOptions } from "@/lib/pdf/protect.validation";

export const maxDuration = 60; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided." },
        { status: 400 }
      );
    }
    
    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF." },
        { status: 400 }
      );
    }

    // Extract options
    const options: PdfProtectOptions = {
      password,
      algorithm: (formData.get("algorithm") as 'AES-256' | 'RC4') || 'AES-256',
      allowPrinting: formData.get("allowPrinting") === 'true',
      allowCopying: formData.get("allowCopying") === 'true',
      allowModifying: formData.get("allowModifying") === 'true',
      allowAnnotating: formData.get("allowAnnotating") === 'true',
      allowFillingForms: formData.get("allowFillingForms") === 'true',
      allowExtraction: formData.get("allowExtraction") === 'true',
      allowAssembly: formData.get("allowAssembly") === 'true',
      allowHighQualityPrint: formData.get("allowHighQualityPrint") === 'true',
    };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Encrypt PDF
    const encryptedBuffer = await protectPdf(buffer, options);

    const outputFilename = file.name.replace(/\.pdf$/i, "_protected.pdf");

    return new NextResponse(encryptedBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
        "Content-Length": encryptedBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("API error during PDF protection:", error);
    
    // Check if it's already encrypted
    if (error.message?.includes("encrypted") || error.name === "EncryptedPDFError") {
      return NextResponse.json(
        { error: "This file is already password-protected." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to protect PDF." },
      { status: 500 }
    );
  }
}
