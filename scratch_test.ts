import { convertImagesToPdf } from "./lib/pdf/image-to-pdf";
import { readFileSync } from "fs";

async function run() {
  try {
    // We mock a File object
    const buffer = readFileSync("public/fileinator-logo.png");
    const file = new File([buffer], "logo.png", { type: "image/png" });

    const pdfBytes = await convertImagesToPdf([file], {
      pageSize: "A4",
      orientation: "portrait",
      margins: "none",
      imageFit: "fit"
    });
    console.log("Success! PDF generated, bytes length:", pdfBytes.length);
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
}

run();
