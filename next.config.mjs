/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.12"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yvity-2026.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
