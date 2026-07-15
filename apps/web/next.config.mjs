/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@guiding-light/learning-engine",
    "@guiding-light/types",
    "@guiding-light/validation"
  ]
};

export default nextConfig;
