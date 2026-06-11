/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a static './out' folder during build
  basePath: '/dundunpildun', // Replace with your exact repository name
  images: {
    unoptimized: true, // Disables the default image optimization server
  },
};

export default nextConfig;
