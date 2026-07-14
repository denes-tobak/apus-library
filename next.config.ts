import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snbpmwfbhiagsnoeoviv.supabase.co",
        pathname:
          "/storage/v1/object/public/book-covers/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);