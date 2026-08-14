import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/tools/ai/background-remover', destination: '/remove-background', permanent: true },
      { source: '/tools/image/jpg-to-png', destination: '/jpg-to-png', permanent: true },
      { source: '/tools/image/png-to-jpg', destination: '/png-to-jpg', permanent: true },
      { source: '/tools/image/webp-to-png', destination: '/webp-to-png', permanent: true },
      { source: '/tools/image/png-to-webp', destination: '/png-to-webp', permanent: true },
      { source: '/tools/image/jpg-to-webp', destination: '/jpg-to-webp', permanent: true },
      { source: '/tools/image/webp-to-jpg', destination: '/webp-to-jpg', permanent: true },
      { source: '/tools/image/avif-to-jpg', destination: '/avif-to-jpg', permanent: true },
      { source: '/tools/image/jpg-to-avif', destination: '/jpg-to-avif', permanent: true },
      { source: '/tools/image/bmp-to-png', destination: '/bmp-to-png', permanent: true },
      { source: '/tools/image/gif-to-png', destination: '/gif-to-png', permanent: true },
      { source: '/tools/image/compress', destination: '/compress-image', permanent: true },
      { source: '/tools/image/resize', destination: '/resize-image', permanent: true },
      { source: '/tools/image/crop', destination: '/crop-image', permanent: true },
      { source: '/tools/image/rotate', destination: '/rotate-image', permanent: true },
      { source: '/tools/image/convert', destination: '/convert-image', permanent: true },
      { source: '/tools/pdf/compress', destination: '/compress-pdf', permanent: true },
      { source: '/tools/pdf/merge', destination: '/merge-pdf', permanent: true },
      { source: '/tools/pdf/split', destination: '/split-pdf', permanent: true },
      { source: '/tools/pdf/unlock', destination: '/unlock-pdf', permanent: true },
      { source: '/tools/pdf/protect-pdf', destination: '/protect-pdf', permanent: true },
      { source: '/tools/pdf/rotate-pdf', destination: '/rotate-pdf', permanent: true },
      { source: '/tools/pdf/delete-pages', destination: '/delete-pages', permanent: true },
      { source: '/tools/pdf/organize-pdf', destination: '/organize-pdf', permanent: true },
      { source: '/tools/pdf/watermark-pdf', destination: '/watermark-pdf', permanent: true },
      { source: '/tools/pdf/image-to-pdf', destination: '/image-to-pdf', permanent: true },
      { source: '/tools/pdf/pdf-to-image', destination: '/pdf-to-image', permanent: true },
      { source: '/tools/pdf/word-to-pdf', destination: '/word-to-pdf', permanent: true },
      { source: '/tools/pdf/pdf-to-word', destination: '/pdf-to-word', permanent: true },
      { source: '/tools/pdf/excel-to-pdf', destination: '/excel-to-pdf', permanent: true },
      { source: '/tools/pdf/pdf-to-excel', destination: '/pdf-to-excel', permanent: true },
      { source: '/tools/pdf/ppt-to-pdf', destination: '/ppt-to-pdf', permanent: true },
      { source: '/tools/pdf/pdf-to-ppt', destination: '/pdf-to-ppt', permanent: true },
      { source: '/tools/video/compress-video', destination: '/compress-video', permanent: true },
      { source: '/tools/video/convert-video', destination: '/convert-video', permanent: true },
      { source: '/tools/video/trim-video', destination: '/trim-video', permanent: true },
      { source: '/tools/video/merge-video', destination: '/merge-video', permanent: true },
      { source: '/tools/video/rotate-video', destination: '/rotate-video', permanent: true },
      { source: '/tools/video/video-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/mp4-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/mov-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/webm-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/avi-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/mkv-to-gif', destination: '/video-to-gif', permanent: true },
      { source: '/tools/video/mp4-to-mp3', destination: '/mp4-to-mp3', permanent: true },
      { source: '/tools/video/webm-to-mp4', destination: '/webm-to-mp4', permanent: true },
      { source: '/tools/video/mov-to-mp4', destination: '/mov-to-mp4', permanent: true },
      { source: '/tools/audio/compress-audio', destination: '/compress-audio', permanent: true },
      { source: '/tools/audio/convert-audio', destination: '/convert-audio', permanent: true },
      { source: '/tools/audio/trim-audio', destination: '/trim-audio', permanent: true },
      { source: '/tools/audio/merge-audio', destination: '/merge-audio', permanent: true },
      { source: '/tools/audio/extract-audio', destination: '/extract-audio', permanent: true },
      { source: '/tools/audio/mp3-to-wav', destination: '/mp3-to-wav', permanent: true },
      { source: '/tools/audio/wav-to-mp3', destination: '/wav-to-mp3', permanent: true },
      { source: '/tools/audio/flac-to-mp3', destination: '/flac-to-mp3', permanent: true },
      { source: '/tools/audio/ogg-to-mp3', destination: '/ogg-to-mp3', permanent: true },
      { source: '/tools/ai/upscaler', destination: '/image-upscaler', permanent: true },
      { source: '/tools/ai/object-remover', destination: '/object-remover', permanent: true },
      { source: '/tools/ai/enhancer', destination: '/ai-image-enhancer', permanent: true },
      { source: '/tools/utilities/qr', destination: '/qr-generator', permanent: true },
      { source: '/tools/utilities/barcode', destination: '/barcode-generator', permanent: true },
      { source: '/tools/utilities/color-picker', destination: '/color-picker', permanent: true },
      { source: '/tools/utilities/json', destination: '/code-formatter', permanent: true },
      { source: '/json-formatter', destination: '/code-formatter?tab=json', permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      fs: { browser: "./empty.js" },
      path: { browser: "./empty.js" },
      process: { browser: "./empty.js" },
    },
  },
};

export default nextConfig;
