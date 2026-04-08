import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Reduce file-watcher CPU by ignoring 27K static content files
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules|public\/content/,
    };
    return config;
  },

  // Compress responses
  compress: true,

  // Caching headers for static assets
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2|woff|ttf|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // _next/static caching handled automatically by Vercel
    ];
  },

  // Optimize packages for tree-shaking
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "motion/react",
      "@base-ui/react",
    ],
  },
};

export default nextConfig;
