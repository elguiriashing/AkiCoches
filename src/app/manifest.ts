import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AkiCoches",
    short_name: "AkiCoches",
    description: "Encuentra coches de alquiler para tu viaje.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1227",
    theme_color: "#ff5148",
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
      {
        src: "/brand/conduzco-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
