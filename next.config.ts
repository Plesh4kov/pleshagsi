import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: false, // Отключаем поддержку папки "app"
  },
};

export default nextConfig;
