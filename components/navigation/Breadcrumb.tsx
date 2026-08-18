"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Find the current tool based on the pathname
  const currentTool = TOOLS.find((tool) => tool.href === pathname);
  
  // Base breadcrumbs (Home -> Tools)
  const breadcrumbs = [
    { label: "Home", href: "/", icon: <Home className="w-4 h-4 mr-1" /> },
    { label: "Tools", href: "/alltools" },
  ];

  // If we are on a specific tool page, dynamically generate the rest
  if (currentTool) {
    // Determine the category link (e.g., Image Tools -> /tools?category=Image)
    breadcrumbs.push({
      label: `${currentTool.category} Tools`,
      href: `/tools?category=${encodeURIComponent(currentTool.category)}`
    });
    
    // Add the current tool (no href because it's the active page)
    breadcrumbs.push({
      label: currentTool.title,
      href: ""
    });
  } else if (pathname === "/alltools") {
    // If we are on the /tools page itself, just remove the href from the last item
    breadcrumbs[1].href = "";
  } else if (pathname === "/contact") {
    breadcrumbs[1] = { label: "Contact Us", href: "" };
  } else if (pathname === "/blog") {
    breadcrumbs[1] = { label: "Blog", href: "" };
  } else {
    // Fallback for other pages
  }

  return (
    <nav className="flex items-center text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-slate-300 flex-shrink-0" />}
              
              {!isLast && item.href ? (
                <Link href={item.href} className="flex items-center hover:text-blue-600 transition-colors truncate">
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center font-semibold text-slate-800 truncate" aria-current="page">
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

