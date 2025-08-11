import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@4420courts/shared", "@4420courts/database"],
  env: {
    NEXT_PUBLIC_APP_NAME: "4420 Courts Dealer Portal",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },
};

export default nextConfig;