import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const nextConfig: NextConfig = {
  // Analytics go through /ingest on this domain so tracker blockers don't drop them.
  async rewrites() {
    if (!posthogHost) return [];
    const assets = posthogHost.replace(
      ".i.posthog.com",
      "-assets.i.posthog.com",
    );
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${assets}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${assets}/array/:path*`,
      },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true,
  // lib/content.ts lists this folder at render time, so pages regenerated on the server need it bundled.
  outputFileTracingIncludes: { "/**": ["./public/videos/tiktok/**"] },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/media/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
