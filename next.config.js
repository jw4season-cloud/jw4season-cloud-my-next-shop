/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }] },
  eslint: { ignoreDuringBuilds: false }
};
module.exports = nextConfig;
