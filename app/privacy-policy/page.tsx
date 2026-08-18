import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Fileinator protects your privacy while processing your files securely. All processing happens in your browser without permanent storage.",
  keywords: [
    "privacy policy",
    "data security",
    "fileinator privacy",
    "secure file processing",
    "browser security"
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy — Fileinator",
    description: "Learn how Fileinator protects your privacy while processing your files securely. All processing happens in your browser without permanent storage.",
    url: "/privacy-policy",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Fileinator",
    description: "Learn how Fileinator protects your privacy while processing your files securely. All processing happens in your browser without permanent storage.",
    images: ["/og-image.png"],
  },
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "file-processing", title: "File Processing" },
  { id: "uploaded-file-privacy", title: "Uploaded File Privacy" },
  { id: "analytics-tracking", title: "Analytics & Tracking" },
  { id: "cookies", title: "Cookies" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "data-security", title: "Data Security" },
  { id: "data-retention", title: "Data Retention" },
  { id: "childrens-privacy", title: "Children's Privacy" },
  { id: "your-rights", title: "User Rights" },
  { id: "policy-updates", title: "Policy Updates" },
  { id: "contact", title: "Contact Information" },
];

export default function PrivacyPolicyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <LegalLayout
        title="Privacy Policy"
        description="We believe in protecting your personal information. Read our privacy policy to understand how we keep your data secure."
        icon={<ShieldCheck className="w-8 h-8" />}
        lastUpdated="July 2026"
        sections={sections}
      >
        <h2 id="introduction">Introduction</h2>
        <p>
          Welcome to Fileinator. We are committed to protecting your personal information and your right to privacy. 
          When you visit our website and use our services, you trust us with your data. We take this responsibility 
          seriously and have built our platform with privacy and security as fundamental priorities.
        </p>

        <h2 id="information-we-collect">Information We Collect</h2>
        <p>
          We collect minimal personal information. We may collect details that you voluntarily provide to us when you express 
          an interest in obtaining information about our products, or when you contact us for support. When you use our tools, 
          you may upload files for processing; however, we do not require account registration to access most core features.
        </p>

        <h2 id="file-processing">File Processing</h2>
        <p>
          Fileinator offers a variety of file manipulation tools. To fulfill your requests, uploaded files are processed 
          only to complete the specific operation you initiated (such as compressing, merging, or converting). 
          Whenever technically possible, we utilize browser-based (client-side) processing to ensure your files never leave your device.
        </p>

        <h2 id="uploaded-file-privacy">Uploaded File Privacy</h2>
        <p>
          Your files remain your property. For operations that require server-side processing, we enforce strict privacy standards:
        </p>
        <ul>
          <li><strong>No Permanent Storage:</strong> Files are not permanently stored on our servers.</li>
          <li><strong>Automatic Deletion:</strong> Uploaded files are automatically and permanently deleted immediately after processing or within the brief retention period required to deliver the output file to you.</li>
          <li><strong>No AI Training:</strong> We strictly do <strong>not</strong> use any user-uploaded files or their contents to train artificial intelligence or machine learning models.</li>
          <li><strong>Confidentiality:</strong> Passwords you enter to unlock or secure files (e.g., PDF passwords) are never logged, stored, or used for any purpose other than the immediate operation.</li>
        </ul>

        <h2 id="analytics-tracking">Analytics & Tracking</h2>
        <p>
          To understand user behavior and continuously improve our platform, we utilize industry-standard analytics tools. 
          Specifically, we use <strong>Google Analytics 4</strong>, <strong>Microsoft Clarity</strong>, and <strong>Vercel Analytics</strong>. 
          These tools collect aggregated, anonymized data regarding page views, geographic regions, browser types, and user interactions (such as clicks and scrolling). 
          This information is used strictly for website analytics and service enhancement.
        </p>

        <h2 id="cookies">Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to ensure core site functionality and to support the analytics services mentioned above. 
          For comprehensive details on the specific cookies we use, their purposes, and instructions on how you can manage or disable them, 
          please review our dedicated <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.
        </p>

        <h2 id="third-party">Third-Party Services</h2>
        <p>
          We do not sell, rent, or trade your personal data to third parties. We only share information with trusted third-party service 
          providers when necessary to operate our infrastructure (such as secure cloud hosting and analytics) or to comply with legal obligations. 
          All third-party providers are vetted for strict compliance with data privacy regulations.
        </p>

        <h2 id="data-security">Data Security</h2>
        <p>
          We implement robust technical and organizational security measures designed to protect your data from unauthorized access, 
          alteration, or disclosure. All data transmissions between your browser and our servers are secured using industry-standard 
          encryption protocols (HTTPS/TLS). While no internet transmission is entirely flawless, we strive to guarantee the utmost 
          integrity of your data.
        </p>

        <h2 id="data-retention">Data Retention</h2>
        <p>
          We retain personal information (such as contact inquiries) only for as long as is necessary for the purposes set out in 
          this Privacy Policy, unless a longer retention period is required or permitted by law. As reiterated, user-uploaded 
          files are transient and deleted rapidly after your session concludes.
        </p>

        <h2 id="childrens-privacy">Children's Privacy</h2>
        <p>
          Our services are not intended for or marketed to children under 18 years of age. We do not knowingly solicit or collect 
          data from minors. By using Fileinator, you represent that you are at least 18 years old or are accessing the platform 
          under the supervision of a parent or legal guardian.
        </p>

        <h2 id="your-rights">User Rights</h2>
        <p>
          Depending on your geographical location and applicable data protection laws (such as GDPR or CCPA), you possess the right to:
        </p>
        <ul>
          <li>Request access to the personal data we may hold about you.</li>
          <li>Request corrections to inaccurate or incomplete data.</li>
          <li>Request the deletion or erasure of your personal data.</li>
          <li>Opt-out of specific data processing or analytics tracking.</li>
        </ul>
        <p>
          To exercise any of these rights, please reach out using our contact information below.
        </p>

        <h2 id="policy-updates">Policy Updates</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our technology, operational practices, or regulatory requirements. 
          When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this policy frequently 
          to stay informed about how we protect your information.
        </p>

        <h2 id="contact">Contact Information</h2>
        <p>
          If you have questions, comments, or concerns about this Privacy Policy or our data practices, please contact our privacy team at 
          <a href="mailto:privacy@fileinator.example.com" className="text-blue-600 hover:underline ml-1">privacy@fileinator.example.com</a>.
        </p>
      </LegalLayout>
    </>
  );
}
