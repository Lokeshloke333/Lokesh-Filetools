import { ImageIcon, FileText, Video, Headphones, Wand2, Sparkles } from "lucide-react";
import { TOOLS } from "./tools";

export type ToolItem = {
  label: string;
  href: string;
  comingSoon?: boolean;
  icon?: React.ElementType;
  description?: string;
};

export type Category = {
  title: string;
  icon: React.ElementType;
  items: ToolItem[];
  conversionItems?: ToolItem[];
  comingSoon?: boolean;
};

// Helper to create tool item
const createToolItem = (t: typeof TOOLS[0]) => ({
  label: t.title,
  href: t.href,
  icon: t.icon,
  comingSoon: t.status === "coming-soon",
  description: t.description
});

// Image Tools
const imageTools = TOOLS.filter(t => t.category === "Image" && !t.isSubTool).map(createToolItem);
const imageConversions = TOOLS.filter(t => t.category === "Image" && t.isSubTool).map(createToolItem);

// AI Tools
const aiTools = TOOLS.filter(t => t.category === "AI").map(createToolItem);

// PDF Tools
// Automatically categorize "-to-" as conversions, except those marked as main tools.
const pdfTools = TOOLS.filter(t => t.category === "PDF" && !t.id.includes("-to-")).map(createToolItem);
const pdfConversions = TOOLS.filter(t => t.category === "PDF" && t.id.includes("-to-")).map(createToolItem);

// Video Tools
const videoTools = TOOLS.filter(t => t.category === "Video" && !t.isSubTool).map(createToolItem);
const videoConversions = TOOLS.filter(t => t.category === "Video" && t.isSubTool).map(createToolItem);

// Audio Tools
const audioTools = TOOLS.filter(t => t.category === "Audio" && !t.isSubTool).map(createToolItem);
const audioConversions = TOOLS.filter(t => t.category === "Audio" && t.isSubTool).map(createToolItem);

// Utilities Tools
const utilitiesTools = TOOLS.filter(t => t.category === "Utilities" && !t.isSubTool).map(createToolItem);
const utilitiesConversions = TOOLS.filter(t => t.category === "Utilities" && t.isSubTool).map(createToolItem);

export const navigationData: Category[] = [
  {
    title: "Image Tools",
    icon: ImageIcon,
    items: imageTools,
    conversionItems: imageConversions,
  },
  {
    title: "PDF Tools",
    icon: FileText,
    items: pdfTools,
    conversionItems: pdfConversions,
  },
  {
    title: "Video Tools",
    icon: Video,
    items: videoTools,
    conversionItems: videoConversions,
  },
  {
    title: "Audio Tools",
    icon: Headphones,
    items: audioTools,
    conversionItems: audioConversions,
  },
  {
    title: "AI Tools",
    icon: Sparkles,
    items: aiTools,
  },
  {
    title: "Utilities",
    icon: Wand2,
    items: utilitiesTools,
    conversionItems: utilitiesConversions,
  }
];
