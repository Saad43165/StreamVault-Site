/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/watch',
        headers: [
          {
            // COOP: prevents the iframe's new-tab from getting a reference back to
            // your page, which breaks the ad popup flow and causes browsers to
            // refuse opening it in many cases.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            // COEP: ensures cross-origin iframes can't leak data or trigger
            // navigation on the parent. Required for COOP to fully work.
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            // Referrer: don't send your URL to ad networks inside the iframe
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            // Permissions Policy: disable every browser feature ads abuse
            key: 'Permissions-Policy',
            value: [
              'accelerometer=()',
              'camera=()',
              'geolocation=()',
              'gyroscope=()',
              'magnetometer=()',
              'microphone=()',
              'payment=()',
              'usb=()',
              'interest-cohort=()',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;