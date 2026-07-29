import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  RotateCw, 
  RotateCcw,
  RefreshCw,
  ArrowLeftRight
} from "lucide-react";

interface PdfOrganizeToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
  onDeleteSelected: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function PdfOrganizeToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onDeleteSelected,
  onRotateLeft,
  onRotateRight,
  onReset,
  disabled
}: PdfOrganizeToolbarProps) {
  
  return (
    <div className="sticky top-16 lg:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 px-4 shadow-sm">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 !px-0">
        
        {/* Selection Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700">
            <span className={selectedCount > 0 ? "text-blue-600" : ""}>{selectedCount}</span>
            <span className="text-slate-400">/</span>
            <span>{totalCount}</span>
            <span className="text-slate-500 font-medium ml-1">Selected</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-3">
            <Button variant="ghost" size="sm" onClick={onSelectAll} disabled={disabled || selectedCount === totalCount} className="text-xs h-8">
              <CheckSquare className="w-4 h-4 mr-1.5" /> All
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeselectAll} disabled={disabled || selectedCount === 0} className="text-xs h-8">
              <Square className="w-4 h-4 mr-1.5" /> None
            </Button>
            <Button variant="ghost" size="sm" onClick={onInvertSelection} disabled={disabled || totalCount === 0} className="text-xs h-8">
              <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Invert
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRotateLeft}
            disabled={disabled || selectedCount === 0}
            className="text-xs font-semibold h-9"
          >
            <RotateCcw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Left</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={onRotateRight}
            disabled={disabled || selectedCount === 0}
            className="text-xs font-semibold h-9"
          >
            <RotateCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Right</span>
          </Button>

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={onDeleteSelected}
            disabled={disabled || selectedCount === 0}
            className="text-xs font-semibold h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={onReset}
            disabled={disabled}
            className="text-xs font-semibold h-9 text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

      </Container>
    </div>
  );
}
