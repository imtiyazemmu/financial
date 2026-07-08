import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ✅ Dev Origin (CORS Warning Fix) */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  /* ✅ Images (Flask Backend से Images लोड करने के लिए) */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000', // Flask का default port
        pathname: '/static/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/static/uploads/**',
      },
      // ⭐ Production (Vercel) पर डालने के बाद अपना डोमेन यहाँ डालें:
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/static/uploads/**',
      // },
    ],
  },
};

export default nextConfig;