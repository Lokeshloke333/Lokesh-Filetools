import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, ToolDefinition } from "@/lib/tools";

export interface UseGlobalSearchOptions {
  initialValue?: string;
  variant?: "navbar" | "hero" | "filterBar" | "mobile";
  onSearchChange?: (query: string) => void;
  onClose?: () => void;
}

export function useGlobalSearch({
  initialValue = "",
  variant = "navbar",
  onSearchChange,
  onClose,
}: UseGlobalSearchOptions = {}) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();

  // Sync initialValue changes (e.g. from URL or chips)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Filter tools based on query
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];

    const lowerQuery = query.toLowerCase();

    return TOOLS.filter((tool) => {
      const matchTitle = tool.title.toLowerCase().includes(lowerQuery);
      const matchDesc = tool.description.toLowerCase().includes(lowerQuery);
      const matchCat = tool.category.toLowerCase().includes(lowerQuery);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(lowerQuery));

      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [query]);

  // Control dropdown visibility
  useEffect(() => {
    if (variant === "filterBar") {
      setIsOpen(false);
      return;
    }
    if (query.trim().length < 2) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
    setActiveIndex(-1);
  }, [query, variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setIsOpen(false);
      if (onClose) onClose();
      router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If dropdown is disabled or not open
    if (!isOpen || variant === "filterBar") {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchSubmit();
      } else if ((e.key === "ArrowDown") && query.trim().length >= 2 && variant !== "filterBar") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        // Navigate to the selected suggestion
        const selected = searchResults[activeIndex];
        if (selected.status === "active") {
          setIsOpen(false);
          if (onClose) onClose();
          router.push(selected.href);
        }
      } else if (searchResults.length === 1) {
        // Exactly one match, navigate directly
        const selected = searchResults[0];
        if (selected.status === "active") {
          setIsOpen(false);
          if (onClose) onClose();
          router.push(selected.href);
        }
      } else {
        // No suggestion selected, just submit the search
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleItemClick = (e: React.MouseEvent, tool: ToolDefinition) => {
    if (tool.status === "coming-soon") {
      e.preventDefault();
      return;
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    searchResults,
    handleChange,
    handleSearchSubmit,
    handleKeyDown,
    handleItemClick,
  };
}
