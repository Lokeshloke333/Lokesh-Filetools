import React, { useEffect, useState } from "react";
import { MediaMetadata, formatDuration, formatBitrate, formatSampleRate } from "@/lib/utils/media";
import { formatFileSize } from "@/lib/utils/image";
import { FileVideo, Film, Music, MonitorPlay, Timer, Settings2 } from "lucide-react";

interface MediaMetadataCardProps {
  file: File;
  metadata: MediaMetadata | null;
  thumbnailUrl?: string | null;
}

export function MediaMetadataCard({ file, metadata, thumbnailUrl }: MediaMetadataCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Thumbnail or Icon side */}
      <div className="w-full sm:w-48 h-48 bg-slate-50 border-r border-slate-100 flex items-center justify-center shrink-0 relative overflow-hidden p-4">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="w-20 h-20 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center">
            {file.type.startsWith("video/") ? (
              <FileVideo className="w-10 h-10 text-blue-500" />
            ) : (
              <Music className="w-10 h-10 text-emerald-500" />
            )}
          </div>
        )}
      </div>

      {/* Info side */}
      <div className="p-6 flex-1 min-w-0 flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 truncate mb-1" title={file.name}>
          {file.name}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700 uppercase tracking-wider text-xs">
            {file.type.split('/')[1] || file.name.split('.').pop() || 'UNKNOWN'}
          </span>
          <span>•</span>
          <span className="font-medium">{formatFileSize(file.size)}</span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
          {metadata?.duration !== undefined && (
            <div className="flex items-start gap-2">
              <Timer className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</p>
                <p className="text-sm font-medium text-slate-700">{formatDuration(metadata.duration)}</p>
              </div>
            </div>
          )}
          
          {metadata?.width !== undefined && metadata?.height !== undefined && (
            <div className="flex items-start gap-2">
              <MonitorPlay className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolution</p>
                <p className="text-sm font-medium text-slate-700">{metadata.width} × {metadata.height}</p>
              </div>
            </div>
          )}

          {(metadata?.videoCodec || file.type.startsWith("video/")) && (
            <div className="flex items-start gap-2">
              <Film className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video</p>
                <p className="text-sm font-medium text-slate-700 truncate">{metadata?.videoCodec || 'H.264/AAC'}</p>
              </div>
            </div>
          )}

          {metadata?.audioCodec && (
            <div className="flex items-start gap-2">
              <Settings2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audio</p>
                <p className="text-sm font-medium text-slate-700 truncate">{metadata.audioCodec}</p>
              </div>
            </div>
          )}
          
          {metadata?.bitrate && (
            <div className="flex items-start gap-2">
              <Settings2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bitrate</p>
                <p className="text-sm font-medium text-slate-700 truncate">{formatBitrate(metadata.bitrate)}</p>
              </div>
            </div>
          )}
          
          {metadata?.sampleRate && (
            <div className="flex items-start gap-2">
              <Settings2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sample Rate</p>
                <p className="text-sm font-medium text-slate-700 truncate">{formatSampleRate(metadata.sampleRate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
