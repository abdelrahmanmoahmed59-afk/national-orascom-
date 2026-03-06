/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/products", destination: "/projects", permanent: true },
      { source: "/products/:path*", destination: "/projects", permanent: true },
    ]
  },
 
}

export default nextConfig
