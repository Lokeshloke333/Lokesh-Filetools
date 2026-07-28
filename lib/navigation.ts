import { ImageIcon, FileText, Video, Headphones, Sparkles, Wrench } from "lucide-react";
import { TOOLS } from "./tools";

export type ToolItem = {
  label: string;
  href: string;
  comingSoon?: boolean;
};

export type Category = {
  title: string;
  icon: React.ElementType;
  items: ToolItem[];
  comingSoon?: boolean;
};

// Dynamically fetch tools from the registry for the menu
const imageTools = TOOLS.filter(t => t.category === "Image").map(t => ({
  label: t.title,
  href: t.href,
  comingSoon: t.status === "coming-soon"
}));

const pdfTools = TOOLS.filter(t => t.category === "PDF").map(t => ({
  label: t.title,
  href: t.href,
  comingSoon: t.status === "coming-soon"
}));

const videoTools = TOOLS.filter(t => t.category === "Video").map(t => ({
  label: t.title,
  href: t.href,
  comingSoon: t.status === "coming-soon"
}));

const audioTools = TOOLS.filter(t => t.category === "Audio").map(t => ({
  label: t.title,
  href: t.href,
  comingSoon: t.status === "coming-soon"
}));


const utilTools = TOOLS.filter(t => t.category === "Utilities").map(t => ({
  label: t.title,
  href: t.href,
  comingSoon: t.status === "coming-soon"
}));

export const navigationData: Category[] = [
  {
    title: "Image Tools",
    icon: ImageIcon,
    items: imageTools,
  },
  {
    title: "PDF Tools",
    icon: FileText,
    items: pdfTools,
  },
  {
    title: "Video Tools",
    icon: Video,
    items: videoTools,
  },
  {
    title: "Audio Tools",
    icon: Headphones,
    items: audioTools,
  }
];
