import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Image Color Picker Online - Extract HEX, RGB, CMYK from Images",
  description: "Free online color picker. Upload an image to extract exact colors in HEX, RGB, HSL, and CMYK formats. Automatically generate beautiful color palettes.",
  keywords: [
    "color picker",
    "image color picker",
    "extract color from image",
    "hex color picker",
    "color palette generator",
    "eyedropper tool online"
  ],
  alternates: {
    canonical: "/color-picker",
  },
  openGraph: {
    title: "Image Color Picker | Fileinator",
    description: "Extract exact colors from any image. Generate beautiful color palettes instantly.",
    url: "/color-picker",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function ColorPickerLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Utilities", item: "/tools" },
    { name: "Color Picker", item: "/color-picker" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Image Color Picker",
    description: "Extract exact colors from any image and automatically generate color palettes.",
    url: "/color-picker",
    featureList: [
      "Extract HEX, RGB, HSL, HSV, CMYK",
      "Native browser EyeDropper support",
      "Automatic Dominant Palette Generation",
      "Client-side processing (Privacy first)",
      "Downloadable palettes"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
