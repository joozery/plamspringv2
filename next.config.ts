import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ansio packages ship raw .tsx source, needs transpiling.
  transpilePackages: ["@ansio/next-schema", "@ansio/ssr-schema"],

  images: {
    remotePatterns: [
      // Cloudflare R2 public CDN
      {
        protocol: "https",
        hostname: "pub-8ebc60b60d064b778b90395754b8ff54.r2.dev",
      },
      // YouTube thumbnails (used in VideoSection and FeaturedVideoSection)
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  async headers() {
    const csp = [
      // Scripts — Google Translate requires unsafe-inline + unsafe-eval; dotlottie WASM needs wasm-unsafe-eval; GTM/GA loaders
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.tiktok.com https://www.instagram.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://api.ansio.dev",
      // Styles
      "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images — allow data URIs, blob, and any https
      "img-src 'self' data: blob: https: http:",
      // Frames — Google Translate attribution iframe
      "frame-src 'self' https://translate.google.com https://translate.googleapis.com https://www.tiktok.com https://www.instagram.com https://www.youtube.com https://www.google.com https://maps.google.com",
      // XHR / fetch — includes CDNs used by @lottiefiles/dotlottie-react for WASM + animation files; GA4 beacon endpoints
      "connect-src 'self' https://translate.googleapis.com https://translate-pa.googleapis.com https://pub-8ebc60b60d064b778b90395754b8ff54.r2.dev https://cdn.jsdelivr.net https://unpkg.com https://lottie.host https://www.tiktok.com https://www.instagram.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://api.ansio.dev",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
