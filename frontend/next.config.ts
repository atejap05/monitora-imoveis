import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Diretório deste projeto (onde está package.json), evitando inferência errada com vários lockfiles no disco. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
