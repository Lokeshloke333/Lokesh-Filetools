import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools/pdf/ppt-to-pdf",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tools/pdf/pdf-to-ppt",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tools/pdf/excel-to-pdf",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tools/pdf/pdf-to-excel",
        destination: "/",
        permanent: false,
      },
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
