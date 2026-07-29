import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";
import { imageConversions } from "@/lib/image/imageConversions";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { conversion: string } }): Promise<Metadata> {
  // In Next.js 15, params must be awaited if it's dynamic, but wait... 
  // Next 15 `params` is a Promise. Let's use `await params`.
  // Wait! The user's repo might be Next.js 15 where `params` is a promise, or maybe not. 
  // Let's check package.json to be sure if `params` needs awaiting. Or just use `await` just in case. 
  // In Next.js 15, route segment params are promises.
  const resolvedParams = await params;
  
  const conversionConfig = imageConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    return { title: "Not Found" };
  }

  const { title, description, keywords, slug } = conversionConfig;

  return {
    title: `${title} Online Free`,
    description,
    keywords,
    alternates: {
      canonical: `/tools/image/${slug}`,
    },
    openGraph: {
      title: `${title} Online Free | Fileinator`,
      description,
      url: `/tools/image/${slug}`,
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
  const conversionConfig = imageConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Image Tools", item: "/tools" },
    { name: "Convert Image", item: "/tools/image/convert" },
    { name: conversionConfig.title, item: `/tools/image/${conversionConfig.slug}` },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: conversionConfig.title,
    description: conversionConfig.description,
    url: `/tools/image/${conversionConfig.slug}`,
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
