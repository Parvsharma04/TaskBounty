/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['d2evdzd5kkyi1f.cloudfront.net'], // Add your image domain here
  },
};

module.exports = nextConfig;
