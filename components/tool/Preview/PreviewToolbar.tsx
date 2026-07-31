import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewToolbarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function PreviewToolbar({ currentPage, totalPages, onPageChange, disabled }: PreviewToolbarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl p-2 mt-4 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={disabled || currentPage <= 1}
        className="text-slate-600 hover:bg-slate-50"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm font-medium text-slate-600">
        Page {currentPage} / {totalPages}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={disabled || currentPage >= totalPages}
        className="text-slate-600 hover:bg-slate-50"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
