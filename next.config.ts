import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // nenhuma imagem remota: todo o catálogo vive em /public
  },
  async redirects() {
    return [
      // A seção de eventos foi descontinuada — evita links quebrados
      { source: "/eventos", destination: "/produtos", permanent: true },
      { source: "/eventos/:path*", destination: "/produtos", permanent: true },
    ];
  },
};

export default nextConfig;
