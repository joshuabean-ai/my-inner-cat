import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Inner Cat",
    short_name: "Inner Cat",
    description: "Which cat lives in you? A watercolor personality quiz.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F4ED",
    theme_color: "#F8F4ED",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
