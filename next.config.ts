import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [],
  },
  experimental: {},
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
