import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    // Inject a unique build timestamp to be used as NextAuth secret for invalidating sessions per deployment
    BUILD_TIME_SECRET: Date.now().toString(),
  },
};

export default nextConfig;
