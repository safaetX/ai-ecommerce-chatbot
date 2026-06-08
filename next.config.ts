import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Prevent Turbopack from picking a parent folder (e.g. ~/package-lock.json)
  // as the workspace root, which breaks Tailwind v4 content scanning in dev.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
