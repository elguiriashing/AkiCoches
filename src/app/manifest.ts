import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AkiCoches",
    short_name: "AkiCoches",
    description: "Encuentra coches de alquiler para tu viaje.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FF3047",
    lang: "es",
    scope: "/",
    categories: ["travel", "navigation"],
    icons: [
      {
        src: "/brand/conduzco-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      { src: "/brand/conduzco-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/conduzco-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/conduzco-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/conduzco-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
