/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "3.bp.blogspot.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
