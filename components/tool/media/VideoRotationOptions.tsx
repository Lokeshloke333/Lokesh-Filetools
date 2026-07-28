import React, { useState, useEffect } from "react";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VideoRotation = "0" | "90" | "-90" | "180" | "hflip" | "vflip";

interface VideoRotationOptionsProps {
  file: File;
  value: VideoRotation;
  onChange: (val: VideoRotation) => void;
}

export function VideoRotationOptions({ file, value, onChange }: VideoRotationOptionsProps) {
  const [mediaUrl, setMediaUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const getTransform = () => {
    switch (value) {
      case "90": return "rotate(90deg)";
      case "-90": return "rotate(-90deg)";
      case "180": return "rotate(180deg)";
      case "hflip": return "scaleX(-1)";
      case "vflip": return "scaleY(-1)";
      default: return "none";
    }
  };

  const getStyle = (): React.CSSProperties => {
    return {
       transform: getTransform(),
       transition: "transform 0.3s ease-in-out"
    };
  };

  const options = [
    { id: "0", label: "Original", icon: null },
    { id: "90", label: "90° Right", icon: <RotateCw className="w-5 h-5" /> },
    { id: "-90", label: "90° Left", icon: <RotateCcw className="w-5 h-5" /> },
    { id: "180", label: "180°", icon: <RotateCw className="w-5 h-5" /> },
    { id: "hflip", label: "Flip Horizontally", icon: <FlipHorizontal className="w-5 h-5" /> },
    { id: "vflip", label: "Flip Vertically", icon: <FlipVertical className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Rotation & Flip</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Preview */}
         <div className="relative bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
            {mediaUrl ? (
               <video 
                 src={mediaUrl} 
                 className="max-w-full max-h-[300px] object-contain shadow-md"
                 style={getStyle()}
                 controls
               />
            ) : (
               <div className="text-slate-500">Loading Preview...</div>
            )}
         </div>

         {/* Controls */}
         <div className="flex flex-col gap-3">
            {options.map((opt) => {
               const isSelected = value === opt.id;
               return (
                  <Button
                     key={opt.id}
                     variant={isSelected ? "default" : "outline"}
                     className={`flex justify-start gap-3 h-12 w-full ${isSelected ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : "text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                     onClick={() => onChange(opt.id as VideoRotation)}
                  >
                     {opt.icon && <div className={isSelected ? "text-white" : "text-slate-500"}>{opt.icon}</div>}
                     <span className="font-semibold">{opt.label}</span>
                  </Button>
               );
            })}
         </div>
      </div>
    </div>
  );
}
