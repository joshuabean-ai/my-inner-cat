/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the vendored card fonts are bundled with the image-generating routes
  // when deployed (file tracing can't infer fs.readFileSync paths on its own).
  outputFileTracingIncludes: {
    "/api/card/[archetype]/[cat]": ["./assets/fonts/**"],
    "/result/[archetype]/[cat]/opengraph-image": ["./assets/fonts/**"],
  },
};

module.exports = nextConfig;
