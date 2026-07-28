import React, { useState, useEffect } from "react";
import { GripVertical, X, FileVideo, Music } from "lucide-react";
import { MultiMediaFileInfo } from "@/hooks/useMultiMediaProcessor";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

interface MultiMediaListProps {
  files: MultiMediaFileInfo[];
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  mediaType?: "video" | "audio";
}

export function MultiMediaList({ files, onRemove, onReorder, mediaType = "video" }: MultiMediaListProps) {
  const [metadataMap, setMetadataMap] = useState<Record<string, MediaMetadata>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Generate metadata for each file
    files.forEach(async (f) => {
       if (!metadataMap[f.id]) {
          const meta = await getBasicMediaMetadata(f.file);
          setMetadataMap(prev => ({ ...prev, [f.id]: meta }));
       }
    });
  }, [files]); // intentional lack of metadataMap in dependency to avoid infinite loops, we just want to run when files change

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // For a better visual, we could set a drag image, but default is fine
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-700 flex justify-between items-center">
         <span>Selected {mediaType === "video" ? "Videos" : "Audio"} ({files.length})</span>
         <span className="text-xs font-normal text-slate-500">Drag to reorder</span>
      </div>
      
      <div className="divide-y divide-slate-100">
        {files.map((fileInfo, index) => {
           const meta = metadataMap[fileInfo.id];
           const isDragging = draggedIndex === index;

           return (
             <div 
                key={fileInfo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-3 flex items-center gap-4 transition-colors ${isDragging ? "bg-blue-50 opacity-50" : "hover:bg-slate-50 bg-white"}`}
             >
                <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500">
                   <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-16 h-12 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                   {mediaType === "video" ? (
                      meta?.thumbnail ? (
                         <img src={meta.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                         <FileVideo className="w-6 h-6 text-slate-600" />
                      )
                   ) : (
                      <Music className="w-6 h-6 text-slate-600" />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-800 truncate">{fileInfo.file.name}</p>
                   <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                      <span>{formatSize(fileInfo.file.size)}</span>
                      {meta?.duration && (
                         <>
                           <span>•</span>
                           <span>{formatTime(meta.duration)}</span>
                         </>
                      )}
                      {meta?.resolution && (
                         <>
                           <span>•</span>
                           <span>{meta.resolution}</span>
                         </>
                      )}
                   </div>
                </div>

                <button 
                  onClick={() => onRemove(fileInfo.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remove file"
                >
                   <X className="w-5 h-5" />
                </button>
             </div>
           );
        })}
      </div>
    </div>
  );
}
