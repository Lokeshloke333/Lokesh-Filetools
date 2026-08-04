import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema, getFaqSchema } from "@/lib/seo/schema";
import { imageConversions } from "@/lib/image/imageConversions";
import { audioConversions } from "@/lib/audio/audioConversions";
import { videoConversions } from "@/lib/video/videoConversions";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ conversion: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.conversion;
  
  const config = 
    imageConversions.find((c) => c.slug === slug) ||
    audioConversions.find((c) => c.slug === slug) ||
    videoConversions.find((c) => c.slug === slug);
  
  if (!config) {
    return { title: "Not Found" };
  }

  const { title, description, keywords } = config;

  return {
    title: title.includes("|") ? title : `${title} Online Free`,
    description,
    keywords,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: title.includes("|") ? title : `${title} Online Free | Fileinator`,
      description,
      url: `/${slug}`,
      siteName: "Fileinator",
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: title.includes("|") ? title : `${title} Online Free | Fileinator`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ConversionLayout({ children, params }: { children: React.ReactNode, params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.conversion;
  
  const imageConfig = imageConversions.find((c) => c.slug === slug);
  const audioConfig = audioConversions.find((c) => c.slug === slug);
  const videoConfig = videoConversions.find((c) => c.slug === slug);
  
  const config = imageConfig || audioConfig || videoConfig;
  
  if (!config) {
    notFound();
  }

  const categoryName = imageConfig ? "Image Tools" : audioConfig ? "Audio Tools" : "Video Tools";
  const parentConvertUrl = imageConfig ? "/convert-image" : audioConfig ? "/convert-audio" : "/convert-video";

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: categoryName, item: "/tools" },
    { name: "Convert", item: parentConvertUrl },
    { name: config.title, item: `/${config.slug}` },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: config.title,
    description: config.description,
    url: `/${config.slug}`,
    featureList: config.features || [
      `Convert ${config.from} to ${config.to}`,
      "Fast Conversion",
      "Browser Based Processing",
      "No Upload Storage",
      "Privacy First"
    ],
  });

  const schemas: any[] = [breadcrumbs, softwareApp];

  if (config.faqs && config.faqs.length > 0) {
    schemas.push(getFaqSchema(config.faqs));
  }

  return (
    <>
      <JsonLd data={schemas} />
      {children}
    </>
  );
}
