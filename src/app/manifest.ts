import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AkiCoches",
    short_name: "AkiCoches",
    description: "Encuentra coches de alquiler para tu viaje.",
    start_url: "/",
    display: "standalone",
    background_color: "#3B101B",
    theme_color: "#3B101B",
    lang: "es",
    scope: "/",
    categories: ["travel", "navigation"],
    icons: [
      {
        src: "/brand/v3/coches.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/v3/coches-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/v3/coches-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/v3/coches-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/v3/coches-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
