/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@guiding-light/learning-engine",
    "@guiding-light/types",
    "@guiding-light/validation",
  ],
  async redirects() {
    return [
      { source: "/sign-in", destination: "/", permanent: false },
      { source: "/auth/:path*", destination: "/", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/my-journey", destination: "/journeys", permanent: false },
      { source: "/saved", destination: "/", permanent: false },
      { source: "/settings", destination: "/", permanent: false },
      { source: "/ask", destination: "/", permanent: false },
      { source: "/guides/new-muslim", destination: "/", permanent: false },
      { source: "/questions/:path*", destination: "/", permanent: false },
      { source: "/compare/:path*", destination: "/", permanent: false },
      { source: "/prophets/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
