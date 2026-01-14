/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: new URL("../..", import.meta.url).pathname,
    outputFileTracingIncludes: {
      "/**": ["../../data/**/*"]
    }
  }
};
export default nextConfig;
