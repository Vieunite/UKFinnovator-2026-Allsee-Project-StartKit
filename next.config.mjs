/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // reactStrictMode: false,
  //   images: {
  //     remotePatterns: [`
  //       {
  //         protocol: 'https',
  //         hostname: 'api.vieunite.com',
  //         port: '',
  //         pathname: '/**',
  //       },
  //     ],
  //   },
}

export default nextConfig
