/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/plugins', destination: '/#plugins', permanent: false }];
  },
};
export default nextConfig;
