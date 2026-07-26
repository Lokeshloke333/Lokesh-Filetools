import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, ArrowLeftRight } from "lucide-react";

interface PdfDeleteOptionsProps {
  totalPages: number;
  selectedPages: Set<number>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
  disabled?: boolean;
}

export function PdfDeleteOptions({
  totalPages,
  selectedPages,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  disabled
}: PdfDeleteOptionsProps) {
  const selectedCount = selectedPages.size;
  const remainingCount = totalPages - selectedCount;

  return (
    <div className="space-y-6">
      
      {/* Selection Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-800">{remainingCount}</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pages to Keep</span>
        </div>
        <div className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${selectedCount > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-3xl font-black ${selectedCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>{selectedCount}</span>
          <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${selectedCount > 0 ? 'text-red-600/70' : 'text-slate-500'}`}>Pages to Delete</span>
        </div>
      </div>

      {/* Selection Actions */}
      <div className="space-y-3">
        <div className="text-sm font-bold text-slate-700">Quick Selection</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSelectAll}
            disabled={disabled || selectedCount === totalPages}
            className="w-full text-xs font-semibold h-10 border-slate-200 hover:bg-slate-50"
          >
            <CheckSquare className="w-4 h-4 mr-2 text-slate-400" />
            Select All
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDeselectAll}
            disabled={disabled || selectedCount === 0}
            className="w-full text-xs font-semibold h-10 border-slate-200 hover:bg-slate-50"
          >
            <Square className="w-4 h-4 mr-2 text-slate-400" />
            Clear All
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onInvertSelection}
            disabled={disabled}
            className="w-full text-xs font-semibold h-10 border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2 text-slate-400" />
            Invert
          </Button>
        </div>
      </div>

    </div>
  );
}
