import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { FileText } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms governing your use of Fileinator online utilities. Understand your rights and responsibilities when using our free file tools.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "legal notice",
    "fileinator terms",
    "user agreement"
  ],
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions — Fileinator",
    description: "Read the terms governing your use of Fileinator online utilities. Understand your rights and responsibilities when using our free file tools.",
    url: "/terms-and-conditions",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions — Fileinator",
    description: "Read the terms governing your use of Fileinator online utilities. Understand your rights and responsibilities when using our free file tools.",
    images: ["/og-image.png"],
  },
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "use-of-services", title: "Use of Services" },
  { id: "file-processing-storage", title: "File Processing & Storage" },
  { id: "permitted-usage", title: "Permitted Usage" },
  { id: "prohibited-activities", title: "Prohibited Activities" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "disclaimer", title: "Disclaimer" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "service-availability", title: "Service Availability" },
  { id: "changes-to-service", title: "Changes to Service" },
  { id: "termination", title: "Termination" },
  { id: "contact", title: "Contact Information" },
];

export default function TermsAndConditionsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Terms & Conditions", item: "/terms-and-conditions" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <LegalLayout
        title="Terms & Conditions"
        description="Please read these terms and conditions carefully before using our website and services."
        icon={<FileText className="w-8 h-8" />}
        lastUpdated="July 2026"
        sections={sections}
      >
        <h2 id="acceptance">Acceptance of Terms</h2>
        <p>
          By accessing and using Fileinator, you accept and agree to be bound by these Terms & Conditions. Additionally, when utilizing specific Fileinator services, you are subject to any applicable guidelines or rules associated with those services.
        </p>

        <h2 id="use-of-services">Use of Services</h2>
        <p>
          Fileinator offers a suite of browser-based utilities for editing, compressing, and converting various file formats. You acknowledge and agree that our services are provided on an "AS-IS" basis. We assume no responsibility for the timeliness, mis-delivery, deletion, or failure to store any user communications or personalization settings.
        </p>

        <h2 id="file-processing-storage">File Processing & Storage</h2>
        <p>
          Fileinator provides browser-based tools for converting, compressing, editing, and optimizing files. To perform these services, uploaded files may be temporarily processed on our servers or within your browser, depending on the tool being used.
        </p>
        <p>Unless explicitly stated for a specific feature:</p>
        <ul>
          <li>We do not permanently store your uploaded files.</li>
          <li>Files are processed only for the purpose of completing your requested operation.</li>
          <li>Uploaded files are automatically deleted after processing or within a short period required to complete the service.</li>
          <li>We do not access, review, or use the contents of your files except as necessary to perform the requested operation.</li>
          <li>We do not use uploaded files to train artificial intelligence or machine learning models.</li>
          <li>Users are responsible for maintaining backup copies of their files before uploading them.</li>
          <li>Once processing is complete and files have been removed from our systems, they cannot be recovered.</li>
        </ul>
        <p>
          <em>Note: File retention periods may change when future features (such as cloud storage, user accounts, or processing history) are introduced. Any such changes will be reflected in our Privacy Policy and Terms & Conditions.</em>
        </p>

        <h2 id="permitted-usage">Permitted Usage</h2>
        <p>
          You may use Fileinator for both personal and commercial purposes, provided your usage complies with all applicable laws. <strong>You must only upload files that you own or have explicit authorization to process.</strong> We do not claim any ownership or intellectual property rights over the files you upload.
        </p>

        <h2 id="prohibited-activities">Prohibited Activities</h2>
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Upload files containing malware, viruses, or any other malicious code.</li>
          <li>Process materials that infringe upon patents, trademarks, trade secrets, copyrights, or other proprietary rights.</li>
          <li>Attempt to bypass security mechanisms, digital rights management, or passwords on files you do not own.</li>
          <li>Interfere with, disrupt, or place an unreasonable burden on the Service, its servers, or affiliated networks.</li>
        </ul>

        <h2 id="intellectual-property">Intellectual Property</h2>
        <p>
          The Fileinator platform, including its original content, features, and functionality, remains the exclusive property of Fileinator and its licensors. Our services are protected by copyright, trademark, and other applicable intellectual property laws.
        </p>

        <h2 id="disclaimer">Disclaimer</h2>
        <p>
          Your use of our services is strictly at your own risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, whether express or implied. This includes, but is not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
        </p>

        <h2 id="limitation-of-liability">Limitation of Liability</h2>
        <p>
          In no event shall Fileinator, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages. This includes, without limitation, loss of profits, data, goodwill, or other intangible losses resulting from your access to, use of, or inability to access or use our services.
        </p>

        <h2 id="service-availability">Service Availability</h2>
        <p>
          We cannot guarantee that our services will always be available or uninterrupted. We reserve the right to suspend, withdraw, or restrict the availability of all or any part of our platform for operational, security, or business reasons without prior notice.
        </p>

        <h2 id="changes-to-service">Changes to Service</h2>
        <p>
          We reserve the right to modify, amend, or withdraw our services at our sole discretion and without prior notice. We shall not be held liable if, for any reason, all or any part of the platform becomes temporarily or permanently unavailable.
        </p>

        <h2 id="termination">Termination</h2>
        <p>
          We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including a breach of these Terms. Upon termination, your right to use the Service will cease immediately.
        </p>

        <h2 id="contact">Contact Information</h2>
        <p>
          If you have any questions or concerns regarding these Terms & Conditions, please contact us at legal@fileinator.example.com.
        </p>
      </LegalLayout>
    </>
  );
}
