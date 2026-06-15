import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // model-viewer is a web component — suppress the "unrecognized DOM element" warning
  reactStrictMode: true,
};

export default nextConfig;
