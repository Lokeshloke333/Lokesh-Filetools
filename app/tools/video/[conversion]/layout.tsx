import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";
import { videoConversions } from "@/lib/video/videoConversions";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ conversion: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  const conversionConfig = videoConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    return { title: "Not Found" };
  }

  const { title, description, keywords, slug } = conversionConfig;

  return {
    title: `${title} Online Free`,
    description,
    keywords,
    alternates: {
      canonical: `/tools/video/${slug}`,
    },
    openGraph: {
      title: `${title} Online Free | Fileinator`,
      description,
      url: `/tools/video/${slug}`,
      siteName: "Fileinator",
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} Online Free | Fileinator`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ConversionLayout({ children, params }: { children: React.ReactNode, params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const conversionConfig = videoConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Video Tools", item: "/tools" },
    { name: "Convert Video", item: "/tools/video/convert-video" },
    { name: conversionConfig.title, item: `/tools/video/${conversionConfig.slug}` },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: conversionConfig.title,
    description: conversionConfig.description,
    url: `/tools/video/${conversionConfig.slug}`,
    featureList: [
      `Convert ${conversionConfig.from} to ${conversionConfig.to}`,
      "Fast Conversion",
      "Browser Based Processing",
      "No Upload Storage",
      "Privacy First"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
