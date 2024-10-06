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
};

export default nextConfig;
