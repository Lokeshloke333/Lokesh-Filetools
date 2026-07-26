import React from "react";
import { FileText, Trash2, Lock, CheckCircle2, ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";
import { PdfFileInfo } from "@/lib/pdf/types";
import { formatFileSize } from "@/lib/utils/image";
import { Button } from "@/components/ui/button";

interface PdfUnlockPreviewProps {
  fileInfo: PdfFileInfo;
  unlockState: string;
  onRemove: () => void;
}

export function PdfUnlockPreview({ fileInfo, unlockState, onRemove }: PdfUnlockPreviewProps) {
  let badgeColor = "text-slate-500";
  let badgeIcon = <Loader2 className="w-4 h-4 animate-spin" />;
  let badgeText = "Inspecting PDF...";
  let borderColor = "border-slate-200";

  switch (unlockState) {
    case "notProtected":
      badgeColor = "text-green-600";
      badgeIcon = <CheckCircle2 className="w-4 h-4" />;
      badgeText = "Not Protected";
      borderColor = "border-green-200";
      break;
    case "protected":
      badgeColor = "text-red-600";
      badgeIcon = <Lock className="w-4 h-4" />;
      badgeText = "Protected PDF";
      borderColor = "border-red-200";
      break;
    case "permissionOnly":
      badgeColor = "text-amber-600";
      badgeIcon = <Lock className="w-4 h-4" />;
      badgeText = "Permission Restricted";
      borderColor = "border-amber-200";
      break;
    case "corrupted":
      badgeColor = "text-red-600";
      badgeIcon = <AlertTriangle className="w-4 h-4" />;
      badgeText = "Corrupted File";
      borderColor = "border-red-200";
      break;
    case "unsupported":
      badgeColor = "text-orange-600";
      badgeIcon = <ShieldAlert className="w-4 h-4" />;
      badgeText = "Unsupported Encryption";
      borderColor = "border-orange-200";
      break;
    default:
      break;
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white border ${borderColor} rounded-2xl shadow-sm relative group hover:border-indigo-300 transition-colors`}>
      <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
        <FileText className="w-8 h-8 text-slate-500" />
      </div>

      <div className="flex-1 min-w-0 pr-12">
        <p className="text-base font-bold text-slate-800 truncate" title={fileInfo.file.name}>
          {fileInfo.file.name}
        </p>
        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
          <span>{formatFileSize(fileInfo.file.size)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span className={`${badgeColor} font-semibold flex items-center gap-2`}>
            {badgeIcon} {badgeText}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
