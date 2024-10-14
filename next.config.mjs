/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/users",
        permanent: true,
      },
    ];
  },
  staticPageGenerationTimeout: 10000,
};

export default nextConfig;
